import { pgQuery } from '../pg.js';
import { sqlText } from '../sql.js';

export type MarketInstrument = {
  symbol: string;
  name: string;
  asset_class: string;
  quote_currency: string;
  base_price_e8: string;
  volatility_bps: number;
  payout_pct: number;
  category: string;
};

export type MarketCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

const instrumentCache = new Map<string, { value: MarketInstrument; expiresAt: number }>();

function hashSymbol(symbol: string): number {
  let hash = 2166136261;
  for (const char of symbol) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export async function getInstrument(symbol: string): Promise<MarketInstrument> {
  const cached = instrumentCache.get(symbol);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const rows = await pgQuery<MarketInstrument>(`
    SELECT symbol,name,asset_class,quote_currency,base_price_e8::text,volatility_bps,
      payout_pct,category
    FROM veritas.instruments
    WHERE symbol=${sqlText(symbol)} AND is_active
    LIMIT 1
  `);
  if (!rows[0]) throw new Error('Ativo indisponível.');
  instrumentCache.set(symbol, { value: rows[0], expiresAt: Date.now() + 60_000 });
  return rows[0];
}

/** Preço demo global e reproduzível por símbolo + segundo. */
export function deterministicPriceE8(instrument: MarketInstrument, epochSec: number): bigint {
  const base = BigInt(instrument.base_price_e8);
  const seed = hashSymbol(instrument.symbol);
  const phase = (seed % 10_000) / 997;
  const slow = Math.sin(epochSec / 211 + phase);
  const medium = Math.sin(epochSec / 47 + phase * 1.7);
  const fast = Math.sin(epochSec / 11 + phase * 2.3);
  const noise = (slow * 0.5 + medium * 0.32 + fast * 0.18) * instrument.volatility_bps;
  const delta = BigInt(Math.round(Number(base) * noise / 10_000));
  return base + delta;
}

export function priceNumber(priceE8: bigint): number {
  return Number(priceE8) / 100_000_000;
}

export function buildCandles(
  instrument: MarketInstrument,
  intervalSec: 15 | 60 | 300,
  count: number,
  nowSec = Math.floor(Date.now() / 1000),
): MarketCandle[] {
  const current = Math.floor(nowSec / intervalSec) * intervalSec;
  const candles: MarketCandle[] = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const time = current - index * intervalSec;
    const open = deterministicPriceE8(instrument, time);
    const close = deterministicPriceE8(instrument, Math.min(nowSec, time + intervalSec - 1));
    const middle = deterministicPriceE8(instrument, time + Math.floor(intervalSec / 2));
    const wick = BigInt(Math.max(1, Math.round(Number(open) * instrument.volatility_bps / 50_000)));
    candles.push({
      time,
      open: priceNumber(open),
      high: priceNumber([open, close, middle].reduce((a, b) => a > b ? a : b) + wick),
      low: priceNumber([open, close, middle].reduce((a, b) => a < b ? a : b) - wick),
      close: priceNumber(close),
    });
  }
  return candles;
}

export async function persistCandles(
  symbol: string,
  intervalSec: number,
  candles: MarketCandle[],
) {
  if (!candles.length) return;
  const values = candles.map((c) => `(
    ${sqlText(symbol)},${intervalSec},to_timestamp(${c.time}),
    ${BigInt(Math.round(c.open * 100_000_000))},
    ${BigInt(Math.round(c.high * 100_000_000))},
    ${BigInt(Math.round(c.low * 100_000_000))},
    ${BigInt(Math.round(c.close * 100_000_000))}
  )`).join(',');
  await pgQuery(`
    INSERT INTO veritas.market_candles
      (symbol,interval_sec,bar_time,open_e8,high_e8,low_e8,close_e8)
    VALUES ${values}
    ON CONFLICT (symbol,interval_sec,bar_time) DO UPDATE SET
      high_e8=EXCLUDED.high_e8,low_e8=EXCLUDED.low_e8,close_e8=EXCLUDED.close_e8
  `);
}
