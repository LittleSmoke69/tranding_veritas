import {
  ROBOT_PROFILES,
  evaluateStrategy,
  roundDivHalfEven,
  type RobotProfileCode,
} from '@veritas/shared';
import { sumCash } from '../demo-account.js';
import { buildCandles, deterministicPriceE8, getInstrument } from '../market/service.js';
import { assertUuid, pgQuery } from '../pg.js';
import { sqlText } from '../sql.js';
import { settleDue } from '../trades.js';

type RobotInstanceRow = {
  id: string;
  account_id: string;
  profile_code: RobotProfileCode;
  status: string;
  allocation_cents: string;
  target_bps: number;
  initial_cash_cents: string;
  pnl_cents: string;
  wins: number;
  losses: number;
  symbols: string[];
  started_at: string;
  stop_at: string;
  stopped_at: string | null;
  stop_reason: string | null;
  last_decision: 'enter' | 'skip' | null;
  last_skip_reason: string | null;
  last_confidence: number | null;
  last_signal_at: string | null;
  signal_count: number;
  position_count: number;
};

export async function getRobotInstances(accountId?: string): Promise<RobotInstanceRow[]> {
  return pgQuery<RobotInstanceRow>(`
    SELECT r.id,r.account_id,r.profile_code,r.status,r.allocation_cents::text,r.target_bps,
      initial_cash_cents::text,pnl_cents::text,wins,losses,symbols,
      started_at::text,stop_at::text,stopped_at::text,stop_reason,
      last_signal.decision AS last_decision,
      last_signal.skip_reason AS last_skip_reason,
      last_signal.confidence AS last_confidence,
      last_signal.created_at::text AS last_signal_at,
      COALESCE(signal_stats.signal_count,0)::int AS signal_count,
      COALESCE(position_stats.position_count,0)::int AS position_count
    FROM veritas.robot_instances r
    LEFT JOIN LATERAL (
      SELECT decision,skip_reason,confidence,created_at
      FROM veritas.robot_signals s
      WHERE s.instance_id=r.id
      ORDER BY created_at DESC LIMIT 1
    ) last_signal ON TRUE
    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS signal_count
      FROM veritas.robot_signals s
      WHERE s.instance_id=r.id
    ) signal_stats ON TRUE
    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS position_count
      FROM veritas.binary_positions p
      WHERE p.robot_instance_id=r.id
    ) position_stats ON TRUE
    ${accountId ? `WHERE r.account_id='${assertUuid(accountId)}'::uuid` : ''}
    ORDER BY r.started_at DESC LIMIT 200
  `);
}

async function stopIfLimited(instance: RobotInstanceRow): Promise<boolean> {
  const profile = ROBOT_PROFILES[instance.profile_code];
  const allocation = BigInt(instance.allocation_cents);
  const pnl = BigInt(instance.pnl_cents);
  const target = roundDivHalfEven(allocation * BigInt(instance.target_bps), 10_000n);
  const stopLoss = roundDivHalfEven(allocation * BigInt(profile.stopLossBps), 10_000n);
  let status: string | null = null;
  let reason: string | null = null;
  if (pnl >= target) {
    status = 'target_reached';
    reason = 'Meta de lucro atingida';
  } else if (pnl <= -stopLoss) {
    status = 'stop_loss';
    reason = 'Limite de perda atingido';
  } else if (Date.now() >= new Date(instance.stop_at).getTime()) {
    status = 'time_limit';
    reason = 'Prazo máximo atingido';
  }
  if (!status) return false;
  await pgQuery(`
    UPDATE veritas.robot_instances SET status=${sqlText(status)},stop_reason=${sqlText(reason!)},
      stopped_at=NOW() WHERE id='${assertUuid(instance.id)}'::uuid AND status='active'
  `);
  return true;
}

async function processInstance(instance: RobotInstanceRow) {
  await settleDue(instance.account_id);
  const refreshed = (await getRobotInstances(instance.account_id)).find((item) => item.id === instance.id);
  if (!refreshed || refreshed.status !== 'active' || await stopIfLimited(refreshed)) return;
  const profile = ROBOT_PROFILES[refreshed.profile_code];
  const trades = refreshed.wins + refreshed.losses;
  if (trades >= profile.maxTradesDay) return;
  const symbol = refreshed.symbols[trades % refreshed.symbols.length];
  if (!symbol) return;
  const instrument = await getInstrument(symbol);
  const candles = buildCandles(instrument, profile.intervalSec, 40);
  const barTime = candles.at(-1)?.time;
  if (!barTime) return;
  const existing = await pgQuery<{ exists: boolean }>(`
    SELECT EXISTS(
      SELECT 1 FROM veritas.robot_signals
      WHERE instance_id='${assertUuid(refreshed.id)}'::uuid
        AND symbol=${sqlText(symbol)} AND bar_time=to_timestamp(${barTime})
    ) AS exists
  `);
  if (existing[0]?.exists) return;
  const lastTrade = await pgQuery<{ created_at: string }>(`
    SELECT created_at::text FROM veritas.binary_positions
    WHERE robot_instance_id='${assertUuid(refreshed.id)}'::uuid
    ORDER BY created_at DESC LIMIT 1
  `);
  const cooling = lastTrade[0] &&
    Date.now() - new Date(lastTrade[0].created_at).getTime() < profile.cooldownSec * 1000;
  const decision = cooling
    ? {
        decision: 'skip' as const, side: null, confidence: 0, reason: 'Período de espera ativo',
        indicators: { ema9: 0, ema21: 0, rsi14: 50, atr14: 0 },
      }
    : evaluateStrategy(candles, profile);
  const signals = await pgQuery<{ id: string }>(`
    INSERT INTO veritas.robot_signals
      (instance_id,symbol,bar_time,side,confidence,indicators,decision,skip_reason)
    VALUES (
      '${assertUuid(refreshed.id)}'::uuid,${sqlText(symbol)},to_timestamp(${barTime}),
      ${decision.side ? sqlText(decision.side) : 'NULL'},${decision.confidence},
      ${sqlText(JSON.stringify(decision.indicators))}::jsonb,${sqlText(decision.decision)},
      ${decision.decision === 'skip' ? sqlText(decision.reason) : 'NULL'}
    )
    ON CONFLICT (instance_id,symbol,bar_time) DO NOTHING
    RETURNING id
  `);
  if (!signals.length || decision.decision !== 'enter' || !decision.side) return;
  const side = decision.side;
  const cash = await sumCash(refreshed.account_id);
  const allocation = BigInt(refreshed.allocation_cents);
  const stake = roundDivHalfEven(allocation * BigInt(profile.stakeBps), 10_000n);
  if (cash < stake || stake <= 0n) return;
  const now = Math.floor(Date.now() / 1000);
  const price = deterministicPriceE8(instrument, now);
  const clientId = `robot_${refreshed.id}_${barTime}`;
  await pgQuery(`
    SELECT veritas.open_binary_position(
      '${assertUuid(refreshed.account_id)}'::uuid,${sqlText(symbol)},${sqlText(side)},
      ${stake},${instrument.payout_pct},${profile.expirationSec},${price},${sqlText(clientId)},
      'robot','${assertUuid(refreshed.id)}'::uuid
    )
  `);
}

export async function processRobotTick() {
  let allInstances: RobotInstanceRow[];
  try {
    allInstances = await getRobotInstances();
  } catch (error) {
    console.warn('robot_instances_retry', {
      message: error instanceof Error ? error.message : String(error),
    });
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    allInstances = await getRobotInstances();
  }
  const active = allInstances.filter((item) => item.status === 'active');
  for (const instance of active) {
    try {
      await processInstance(instance);
    } catch (error) {
      console.error('robot_tick_failed', { robotId: instance.id, error });
    }
  }
  return { processed: active.length };
}
