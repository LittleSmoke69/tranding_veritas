import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAdmin } from '../authz.js';
import { pgQuery } from '../pg.js';
import { sqlText, sqlTextArray } from '../sql.js';
import { auditAdmin } from './audit.js';

const assetClasses = ['crypto', 'equity', 'forex', 'commodity', 'index', 'otc'] as const;

const instrumentBody = z.object({
  symbol: z.string().min(2).max(32).regex(/^[A-Z0-9_/-]+$/),
  name: z.string().min(2).max(100),
  asset_class: z.enum(assetClasses),
  quote_currency: z.string().length(3).default('USD'),
  base_price: z.number().positive(),
  volatility_bps: z.number().int().min(1).max(1000),
  payout_pct: z.number().int().min(1).max(100),
  category: z.enum(['blitz', 'binary', 'digital', 'margin']).default('binary'),
  products_enabled: z.array(z.enum(['binary', 'blitz', 'digital', 'margin'])).min(1),
});

type InstrumentRow = {
  symbol: string;
  name: string;
  asset_class: string;
  quote_currency: string;
  base_price_e8: string;
  volatility_bps: number;
  payout_pct: number;
  category: string;
  products_enabled: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function mapInstrument(row: InstrumentRow) {
  return { ...row, base_price: Number(row.base_price_e8) / 100_000_000 };
}

export async function registerAdminInstrumentRoutes(app: FastifyInstance) {
  app.get('/api/admin/instruments', async (req, reply) => {
    if (!(await requireAdmin(req, reply))) return;
    const rows = await pgQuery<InstrumentRow>(`
      SELECT symbol,name,asset_class,quote_currency,base_price_e8::text,volatility_bps,
        payout_pct,category,products_enabled,is_active,created_at::text,updated_at::text
      FROM veritas.instruments ORDER BY is_active DESC,name
    `);
    return { success: true, data: rows.map(mapInstrument) };
  });

  app.post('/api/admin/instruments', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const parsed = instrumentBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, error: 'Revise os dados do ativo.' });
    }
    const v = parsed.data;
    const price = BigInt(Math.round(v.base_price * 100_000_000));
    const rows = await pgQuery<InstrumentRow>(`
      INSERT INTO veritas.instruments
        (symbol,name,asset_class,quote_currency,qty_decimals,tick_size,products_enabled,
         is_active,base_price_e8,volatility_bps,payout_pct,category,updated_at)
      VALUES
        (${sqlText(v.symbol)},${sqlText(v.name)},${sqlText(v.asset_class)},
         ${sqlText(v.quote_currency.toUpperCase())},8,1,${sqlTextArray(v.products_enabled)},
         TRUE,${price},${v.volatility_bps},${v.payout_pct},${sqlText(v.category)},NOW())
      RETURNING symbol,name,asset_class,quote_currency,base_price_e8::text,volatility_bps,
        payout_pct,category,products_enabled,is_active,created_at::text,updated_at::text
    `);
    if (!rows[0]) throw new Error('Ativo não foi criado.');
    await auditAdmin({
      actorId: actor.id, action: 'instrument.create', targetType: 'instrument',
      targetId: v.symbol, after: rows[0],
    });
    return reply.code(201).send({ success: true, data: mapInstrument(rows[0]) });
  });

  app.put('/api/admin/instruments/:symbol', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const symbol = String((req.params as { symbol: string }).symbol).toUpperCase();
    const parsed = instrumentBody.omit({ symbol: true }).safeParse(req.body);
    if (!parsed.success || !/^[A-Z0-9_/-]+$/.test(symbol)) {
      return reply.code(400).send({ success: false, error: 'Revise os dados do ativo.' });
    }
    const before = await pgQuery<Record<string, unknown>>(
      `SELECT * FROM veritas.instruments WHERE symbol=${sqlText(symbol)}`,
    );
    const v = parsed.data;
    const price = BigInt(Math.round(v.base_price * 100_000_000));
    const rows = await pgQuery<InstrumentRow>(`
      UPDATE veritas.instruments SET
        name=${sqlText(v.name)},asset_class=${sqlText(v.asset_class)},
        quote_currency=${sqlText(v.quote_currency.toUpperCase())},
        products_enabled=${sqlTextArray(v.products_enabled)},base_price_e8=${price},
        volatility_bps=${v.volatility_bps},payout_pct=${v.payout_pct},
        category=${sqlText(v.category)},updated_at=NOW()
      WHERE symbol=${sqlText(symbol)}
      RETURNING symbol,name,asset_class,quote_currency,base_price_e8::text,volatility_bps,
        payout_pct,category,products_enabled,is_active,created_at::text,updated_at::text
    `);
    if (!rows.length) return reply.code(404).send({ success: false, error: 'Ativo não encontrado.' });
    await auditAdmin({
      actorId: actor.id, action: 'instrument.update', targetType: 'instrument',
      targetId: symbol, before: before[0], after: rows[0],
    });
    return { success: true, data: mapInstrument(rows[0]!) };
  });

  app.delete('/api/admin/instruments/:symbol', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const symbol = String((req.params as { symbol: string }).symbol).toUpperCase();
    if (!/^[A-Z0-9_/-]+$/.test(symbol)) {
      return reply.code(400).send({ success: false, error: 'Ativo inválido.' });
    }
    const rows = await pgQuery<InstrumentRow>(`
      UPDATE veritas.instruments SET is_active=FALSE,updated_at=NOW()
      WHERE symbol=${sqlText(symbol)} RETURNING *
    `);
    if (!rows.length) return reply.code(404).send({ success: false, error: 'Ativo não encontrado.' });
    await auditAdmin({
      actorId: actor.id, action: 'instrument.disable', targetType: 'instrument',
      targetId: symbol, reason: 'Desativação lógica pelo painel', after: { is_active: false },
    });
    return { success: true, data: { symbol, is_active: false } };
  });
}
