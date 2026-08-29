import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { readUserId } from '../auth.js';
import { AuthMessages } from '../errors.js';
import { pgQuery } from '../pg.js';
import { sqlText } from '../sql.js';
import {
  buildCandles,
  deterministicPriceE8,
  getInstrument,
  persistCandles,
  priceNumber,
} from './service.js';

const marketQuery = z.object({
  interval: z.coerce.number().refine((v) => v === 15 || v === 60 || v === 300).default(15),
  count: z.coerce.number().int().min(20).max(240).default(90),
});

export async function registerMarketRoutes(app: FastifyInstance) {
  app.get('/market/instruments', async (req, reply) => {
    if (!readUserId(req)) return reply.code(401).send({ success: false, error: AuthMessages.session });
    const rows = await pgQuery<Record<string, unknown>>(`
      SELECT symbol,name,asset_class,quote_currency,base_price_e8::text,volatility_bps,
        payout_pct,category,products_enabled
      FROM veritas.instruments WHERE is_active ORDER BY name
    `);
    return {
      success: true,
      data: rows.map((row) => ({
        ...row,
        base_price: Number(row.base_price_e8) / 100_000_000,
      })),
    };
  });

  app.get('/market/:symbol/ticker', async (req, reply) => {
    if (!readUserId(req)) return reply.code(401).send({ success: false, error: AuthMessages.session });
    const symbol = String((req.params as { symbol: string }).symbol).toUpperCase();
    const instrument = await getInstrument(symbol);
    const time = Math.floor(Date.now() / 1000);
    return {
      success: true,
      data: { symbol, time, price: priceNumber(deterministicPriceE8(instrument, time)) },
    };
  });

  app.get('/market/:symbol/candles', async (req, reply) => {
    if (!readUserId(req)) return reply.code(401).send({ success: false, error: AuthMessages.session });
    const parsed = marketQuery.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, error: 'Intervalo de gráfico inválido.' });
    }
    const symbol = String((req.params as { symbol: string }).symbol).toUpperCase();
    if (!/^[A-Z0-9_/-]+$/.test(symbol)) {
      return reply.code(400).send({ success: false, error: 'Ativo inválido.' });
    }
    const instrument = await getInstrument(symbol);
    const interval = parsed.data.interval as 15 | 60 | 300;
    const candles = buildCandles(instrument, interval, parsed.data.count);
    await persistCandles(symbol, interval, candles.slice(-10));
    return {
      success: true,
      data: {
        instrument: { ...instrument, base_price: priceNumber(BigInt(instrument.base_price_e8)) },
        interval,
        candles,
      },
    };
  });

  app.get('/market/:symbol/exists', async (req, reply) => {
    if (!readUserId(req)) return reply.code(401).send({ success: false, error: AuthMessages.session });
    const symbol = String((req.params as { symbol: string }).symbol).toUpperCase();
    const rows = await pgQuery<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM veritas.instruments WHERE symbol=${sqlText(symbol)} AND is_active) AS exists`,
    );
    return { success: true, data: rows[0] };
  });
}
