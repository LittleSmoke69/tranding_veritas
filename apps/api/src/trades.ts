import { formatBrl, roundDivHalfEven } from '@veritas/shared';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import { readUserId } from './auth.js';
import { ensureDemoAccount, sumCash } from './demo-account.js';
import { AuthMessages, friendlyAuthError } from './errors.js';
import { assertUuid, pgQuery } from './pg.js';
import { deterministicPriceE8, getInstrument } from './market/service.js';

const PRICE_E8 = 100_000_000n;

type PositionRow = {
  id: string;
  account_id: string;
  symbol: string;
  side: 'up' | 'down';
  stake_cents: string;
  profit_pct: number;
  entry_price_e8: string;
  exit_price_e8: string | null;
  expires_at: string;
  status: 'open' | 'won' | 'lost';
  client_order_id: string;
  created_at: string;
  settled_at: string | null;
  source?: 'manual' | 'robot';
  robot_instance_id?: string | null;
  is_assisted?: boolean;
  assistance_reason?: string | null;
};

function e8ToPrice(e8: bigint): number {
  return Number(e8) / Number(PRICE_E8);
}

function mapPosition(row: PositionRow) {
  const stake = BigInt(row.stake_cents);
  const profit = roundDivHalfEven(stake * BigInt(row.profit_pct), 100n);
  return {
    id: row.id,
    symbol: row.symbol,
    side: row.side,
    stake_cents: row.stake_cents,
    stake_display: formatBrl(stake),
    profit_pct: row.profit_pct,
    profit_cents: profit.toString(),
    profit_display: formatBrl(profit),
    entry_price: e8ToPrice(BigInt(row.entry_price_e8)),
    exit_price: row.exit_price_e8 != null ? e8ToPrice(BigInt(row.exit_price_e8)) : null,
    expires_at: row.expires_at,
    status: row.status,
    client_order_id: row.client_order_id,
    created_at: row.created_at,
    settled_at: row.settled_at,
    source: row.source ?? 'manual',
    robot_instance_id: row.robot_instance_id ?? null,
    is_assisted: row.is_assisted ?? false,
    assistance_reason: row.assistance_reason ?? null,
  };
}

async function settlePosition(row: PositionRow): Promise<PositionRow> {
  if (row.status !== 'open') return row;
  const instrument = await getInstrument(row.symbol);
  const expirySec = Math.floor(new Date(row.expires_at).getTime() / 1000);
  const exit = deterministicPriceE8(instrument, expirySec);
  await pgQuery(`
    SELECT veritas.settle_binary_position('${assertUuid(row.id)}'::uuid,${exit})
  `);
  const updated = await pgQuery<PositionRow>(`
    SELECT id,account_id,symbol,side,stake_cents::text,profit_pct,
      entry_price_e8::text,exit_price_e8::text,expires_at::text,status,
      client_order_id,created_at::text,settled_at::text,source,robot_instance_id,is_assisted,assistance_reason
    FROM veritas.binary_positions WHERE id='${assertUuid(row.id)}'::uuid
  `);
  return updated[0] ?? row;
}

export async function settleDue(accountId: string): Promise<PositionRow[]> {
  const due = await pgQuery<PositionRow>(`
    SELECT
      id, account_id, symbol, side, stake_cents::text, profit_pct,
      entry_price_e8::text, exit_price_e8::text, expires_at::text,
      status, client_order_id, created_at::text, settled_at::text, source, robot_instance_id, is_assisted, assistance_reason
    FROM veritas.binary_positions
    WHERE account_id = '${assertUuid(accountId)}'::uuid
      AND status = 'open'
      AND expires_at <= NOW()
    ORDER BY expires_at ASC
  `);
  const out: PositionRow[] = [];
  for (const row of due) {
    out.push(await settlePosition(row));
  }
  return out;
}

const openBody = z.object({
  symbol: z.string().min(1).max(64),
  side: z.enum(['up', 'down']),
  stake_cents: z.union([z.string(), z.number()]),
  profit_pct: z.number().int().min(1).max(100),
  expiration_sec: z.number().int().min(5).max(3600),
  entry_price: z.number().positive().optional(),
  client_order_id: z.string().min(8).max(80),
});

export async function registerTradeRoutes(app: FastifyInstance) {
  app.post('/trades/binary', async (req, reply) => {
    try {
      const userId = readUserId(req);
      if (!userId) return reply.code(401).send({ success: false, error: AuthMessages.session });

      const parsed = openBody.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ success: false, error: 'Dados da ordem inválidos.' });
      }

      const stake = BigInt(
        typeof parsed.data.stake_cents === 'number'
          ? Math.trunc(parsed.data.stake_cents)
          : parsed.data.stake_cents.trim(),
      );
      if (stake <= 0n) {
        return reply.code(400).send({ success: false, error: 'Valor de investimento inválido.' });
      }

      const demo = await ensureDemoAccount(userId);
      await settleDue(demo.account.id);
      const cash = await sumCash(demo.account.id);
      if (cash < stake) {
        return reply.code(400).send({
          success: false,
          error: 'Saldo insuficiente para este investimento.',
        });
      }

      const clientOrderId = parsed.data.client_order_id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
      const symbol = parsed.data.symbol.replace(/[^a-zA-Z0-9_/-]/g, '').slice(0, 64);
      const side = parsed.data.side;
      const expSec = parsed.data.expiration_sec;
      const instrument = await getInstrument(symbol);
      const entryE8 = deterministicPriceE8(instrument, Math.floor(Date.now() / 1000));
      const requestedPayout = Math.min(parsed.data.profit_pct, instrument.payout_pct);
      const opened = await pgQuery<{ open_binary_position: string }>(`
        SELECT veritas.open_binary_position(
          '${assertUuid(demo.account.id)}'::uuid,'${symbol}','${side}',${stake},
          ${requestedPayout},${expSec},${entryE8},'${clientOrderId}','manual',NULL
        )::text AS open_binary_position
      `);
      const positionId = opened[0]?.open_binary_position;
      const existing = positionId ? await pgQuery<PositionRow>(`
        SELECT id,account_id,symbol,side,stake_cents::text,profit_pct,
          entry_price_e8::text,exit_price_e8::text,expires_at::text,status,
          client_order_id,created_at::text,settled_at::text,source,robot_instance_id,is_assisted,assistance_reason
        FROM veritas.binary_positions WHERE id='${assertUuid(positionId)}'::uuid
      `) : [];
      const position = existing[0];
      if (!position) throw new Error('Falha ao abrir posição.');

      const cashAfter = await sumCash(demo.account.id);
      return {
        success: true,
        data: {
          position: mapPosition(position),
          cash_cents: cashAfter.toString(),
          cash_display: formatBrl(cashAfter),
        },
      };
    } catch (err) {
      req.log.error(err);
      const msg = err instanceof Error ? err.message : '';
      if (/saldo|investimento|ordem|preço/i.test(msg)) {
        return reply.code(400).send({ success: false, error: msg });
      }
      return reply.code(500).send({ success: false, error: friendlyAuthError(err) });
    }
  });

  app.get('/trades/binary', async (req, reply) => {
    try {
      const userId = readUserId(req);
      if (!userId) return reply.code(401).send({ success: false, error: AuthMessages.session });

      const demo = await ensureDemoAccount(userId);
      const settled = await settleDue(demo.account.id);
      const cash = await sumCash(demo.account.id);

      const rows = await pgQuery<PositionRow>(`
        SELECT
          id, account_id, symbol, side, stake_cents::text, profit_pct,
          entry_price_e8::text, exit_price_e8::text, expires_at::text,
          status, client_order_id, created_at::text, settled_at::text, source, robot_instance_id, is_assisted, assistance_reason
        FROM veritas.binary_positions
        WHERE account_id = '${assertUuid(demo.account.id)}'::uuid
        ORDER BY created_at DESC
        LIMIT 200
      `);

      return {
        success: true,
        data: {
          positions: rows.map(mapPosition),
          settled: settled.map(mapPosition),
          cash_cents: cash.toString(),
          cash_display: formatBrl(cash),
        },
      };
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({ success: false, error: friendlyAuthError(err) });
    }
  });
}
