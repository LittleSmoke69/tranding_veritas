import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import { formatBrl } from '@veritas/shared';
import { z } from 'zod';
import { requireAdmin } from '../authz.js';
import { ensureDemoAccount } from '../demo-account.js';
import { friendlyAuthError } from '../errors.js';
import { assertUuid, pgQuery } from '../pg.js';
import { sqlText } from '../sql.js';
import { auditAdmin } from './audit.js';

type UserRow = {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  telefone: string | null;
  status: string | null;
  login_target: string;
  created_at: string;
  account_id: string | null;
  cash_cents: string;
  veritas_access_enabled: boolean;
  outcome_policy_enabled: boolean | null;
  target_win_rate_bps: number | null;
  profit_alert_cents: string | null;
  wins: number;
  losses: number;
  today_wins: number;
  today_losses: number;
  net_profit_cents: string;
};

const createBody = z.object({
  email: z.string().email(),
  full_name: z.string().min(2).max(120),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(120),
  status: z.enum(['user', 'admin', 'super_admin']).default('user'),
  login_target: z.enum(['crm', 'trading', 'both']).default('trading'),
});

const accessBody = z.object({
  login_target: z.enum(['crm', 'trading', 'both']).optional(),
  status: z.enum(['user', 'admin', 'super_admin']).optional(),
  veritas_access_enabled: z.boolean().optional(),
  reason: z.string().min(3).max(240),
});

const balanceBody = z.object({
  amount_cents: z.union([z.string(), z.number()]),
  reason: z.string().min(3).max(240),
  event_key: z.string().min(8).max(100).optional(),
});

const outcomePolicyBody = z.object({
  enabled: z.boolean(),
  target_win_rate_pct: z.number().min(0).max(100),
  profit_alert_cents: z.union([z.string(), z.number()]).nullable(),
  reason: z.string().min(3).max(240),
});

function mapUser(row: UserRow) {
  const cash = BigInt(row.cash_cents || '0');
  const netProfit = BigInt(row.net_profit_cents || '0');
  const profitAlert = row.profit_alert_cents == null ? null : BigInt(row.profit_alert_cents);
  const total = row.wins + row.losses;
  const todayTotal = row.today_wins + row.today_losses;
  return {
    ...row,
    cash_cents: cash.toString(),
    cash_display: formatBrl(cash),
    net_profit_cents: netProfit.toString(),
    net_profit_display: formatBrl(netProfit),
    outcome_policy_enabled: row.outcome_policy_enabled ?? false,
    target_win_rate_bps: row.target_win_rate_bps ?? 5000,
    target_win_rate_pct: (row.target_win_rate_bps ?? 5000) / 100,
    actual_win_rate_pct: total ? Math.round(row.wins / total * 1000) / 10 : 0,
    today_win_rate_pct: todayTotal ? Math.round(row.today_wins / todayTotal * 1000) / 10 : 0,
    profit_alert_cents: profitAlert?.toString() ?? null,
    profit_alert_display: profitAlert == null ? null : formatBrl(profitAlert),
    profit_alert_reached: profitAlert != null && netProfit >= profitAlert,
  };
}

export async function registerAdminUserRoutes(app: FastifyInstance) {
  app.get('/api/admin/users', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const query = z.object({ q: z.string().max(100).optional() }).safeParse(req.query);
    const q = query.success ? query.data.q?.trim() : '';
    const filter = q
      ? `AND (p.email ILIKE ${sqlText(`%${q}%`)} OR p.username ILIKE ${sqlText(`%${q}%`)}
           OR p.full_name ILIKE ${sqlText(`%${q}%`)} OR p.telefone ILIKE ${sqlText(`%${q}%`)})`
      : '';
    const rows = await pgQuery<UserRow>(`
      SELECT p.id, p.email, p.username, p.full_name, p.telefone, p.status,p.veritas_access_enabled,
        COALESCE(p.login_target,'both') AS login_target, p.created_at::text,
        a.id AS account_id,
        COALESCE(balance.cash_cents,0)::text AS cash_cents,
        policy.enabled AS outcome_policy_enabled,
        policy.target_win_rate_bps,
        policy.profit_alert_cents::text,
        COALESCE(stats.wins,0)::int AS wins,
        COALESCE(stats.losses,0)::int AS losses,
        COALESCE(stats.today_wins,0)::int AS today_wins,
        COALESCE(stats.today_losses,0)::int AS today_losses,
        COALESCE(stats.net_profit_cents,0)::text AS net_profit_cents
      FROM public.profiles p
      LEFT JOIN veritas.accounts a ON a.user_id=p.id AND a.mode='demo'
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(amount),0) AS cash_cents
        FROM veritas.ledger_entries
        WHERE account_id=a.id AND bucket='cash' AND asset='BRL'
      ) balance ON TRUE
      LEFT JOIN veritas.account_outcome_policies policy ON policy.account_id=a.id
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) FILTER (WHERE status='won') AS wins,
          COUNT(*) FILTER (WHERE status='lost') AS losses,
          COUNT(*) FILTER (
            WHERE status='won'
              AND (settled_at AT TIME ZONE 'America/Sao_Paulo')::date =
                (NOW() AT TIME ZONE 'America/Sao_Paulo')::date
          ) AS today_wins,
          COUNT(*) FILTER (
            WHERE status='lost'
              AND (settled_at AT TIME ZONE 'America/Sao_Paulo')::date =
                (NOW() AT TIME ZONE 'America/Sao_Paulo')::date
          ) AS today_losses,
          COALESCE(SUM(
            CASE
              WHEN status='won' THEN ROUND((stake_cents::numeric*profit_pct)/100)::bigint
              WHEN status='lost' THEN -stake_cents
              ELSE 0
            END
          ),0) AS net_profit_cents
        FROM veritas.binary_positions
        WHERE account_id=a.id AND status <> 'open'
      ) stats ON TRUE
      WHERE 1=1 ${filter}
      ORDER BY p.created_at DESC
      LIMIT 200
    `);
    return { success: true, data: rows.map(mapUser) };
  });

  app.post('/api/admin/users', async (req, reply) => {
    try {
      const actor = await requireAdmin(req, reply);
      if (!actor) return;
      const parsed = createBody.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ success: false, error: 'Revise os dados do novo usuário.' });
      }
      const email = parsed.data.email.trim().toLowerCase();
      const desired = (parsed.data.username || email.split('@')[0] || 'usuario')
        .toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 42);
      const username = `${desired}_${randomUUID().slice(0, 6)}`;
      const hash = await bcrypt.hash(parsed.data.password, 10);
      const inserted = await pgQuery<{ id: string }>(`
        INSERT INTO public.profiles
          (user_id,email,username,full_name,password_hash,status,login_target,created_at)
        VALUES
          (gen_random_uuid(),${sqlText(email)},${sqlText(username)},
           ${sqlText(parsed.data.full_name)},${sqlText(hash)},${sqlText(parsed.data.status)},
           ${sqlText(parsed.data.login_target)},NOW())
        RETURNING id
      `);
      const id = inserted[0]?.id;
      if (!id) throw new Error('Usuário não foi criado.');
      const account = await ensureDemoAccount(id);
      await auditAdmin({
        actorId: actor.id, action: 'user.create', targetType: 'user', targetId: id,
        after: { email, username, status: parsed.data.status, login_target: parsed.data.login_target },
      });
      return reply.code(201).send({
        success: true,
        data: { id, email, username, account_id: account.account.id },
      });
    } catch (err) {
      req.log.error(err);
      const msg = err instanceof Error && /duplicate|unique/i.test(err.message)
        ? 'E-mail ou usuário já cadastrado.'
        : friendlyAuthError(err);
      return reply.code(400).send({ success: false, error: msg });
    }
  });

  app.patch('/api/admin/users/:id/access', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const id = assertUuid((req.params as { id: string }).id);
    const parsed = accessBody.safeParse(req.body);
    if (!parsed.success || (!parsed.data.login_target && !parsed.data.status
      && parsed.data.veritas_access_enabled === undefined)) {
      return reply.code(400).send({ success: false, error: 'Informe o acesso que será alterado.' });
    }
    const before = await pgQuery<Record<string, unknown>>(
      `SELECT status,login_target,veritas_access_enabled FROM public.profiles WHERE id='${id}'::uuid`,
    );
    const sets = [
      parsed.data.login_target ? `login_target=${sqlText(parsed.data.login_target)}` : '',
      parsed.data.status ? `status=${sqlText(parsed.data.status)}` : '',
      parsed.data.veritas_access_enabled !== undefined
        ? `veritas_access_enabled=${parsed.data.veritas_access_enabled}` : '',
    ].filter(Boolean);
    const after = await pgQuery<Record<string, unknown>>(`
      UPDATE public.profiles SET ${sets.join(',')} WHERE id='${id}'::uuid
      RETURNING id,email,status,login_target,veritas_access_enabled
    `);
    if (!after.length) return reply.code(404).send({ success: false, error: 'Usuário não encontrado.' });
    await auditAdmin({
      actorId: actor.id, action: 'user.access.update', targetType: 'user', targetId: id,
      reason: parsed.data.reason, before: before[0], after: after[0],
    });
    return { success: true, data: after[0] };
  });

  app.post('/api/admin/users/:id/balance', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const userId = assertUuid((req.params as { id: string }).id);
    const parsed = balanceBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, error: 'Informe valor e motivo do ajuste.' });
    }
    const amount = BigInt(String(parsed.data.amount_cents));
    const account = await ensureDemoAccount(userId);
    const key = parsed.data.event_key || `${Date.now()}_${randomUUID().slice(0, 8)}`;
    const rows = await pgQuery<{ admin_adjust_balance: string }>(`
      SELECT veritas.admin_adjust_balance(
        '${actor.id}'::uuid,'${account.account.id}'::uuid,${amount},${sqlText(parsed.data.reason)},${sqlText(key)}
      )::text AS admin_adjust_balance
    `);
    const cash = BigInt(rows[0]?.admin_adjust_balance ?? '0');
    return { success: true, data: { cash_cents: cash.toString(), cash_display: formatBrl(cash) } };
  });

  app.put('/api/admin/users/:id/outcome-policy', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const userId = assertUuid((req.params as { id: string }).id);
    const parsed = outcomePolicyBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, error: 'Revise a taxa, o alerta e o motivo.' });
    }
    const alert = parsed.data.profit_alert_cents == null
      ? null
      : BigInt(String(parsed.data.profit_alert_cents));
    if (alert != null && alert <= 0n) {
      return reply.code(400).send({ success: false, error: 'O alerta de lucro deve ser maior que zero.' });
    }
    const targetBps = Math.round(parsed.data.target_win_rate_pct * 100);
    const account = await ensureDemoAccount(userId);
    const before = await pgQuery<Record<string, unknown>>(`
      SELECT enabled,target_win_rate_bps,profit_alert_cents::text
      FROM veritas.account_outcome_policies
      WHERE account_id='${account.account.id}'::uuid
    `);
    const after = await pgQuery<Record<string, unknown>>(`
      INSERT INTO veritas.account_outcome_policies
        (account_id,enabled,target_win_rate_bps,profit_alert_cents,updated_by)
      VALUES (
        '${account.account.id}'::uuid,
        ${parsed.data.enabled},
        ${targetBps},
        ${alert == null ? 'NULL' : alert.toString()},
        '${actor.id}'::uuid
      )
      ON CONFLICT (account_id) DO UPDATE SET
        enabled=EXCLUDED.enabled,
        target_win_rate_bps=EXCLUDED.target_win_rate_bps,
        profit_alert_cents=EXCLUDED.profit_alert_cents,
        updated_by=EXCLUDED.updated_by,
        updated_at=NOW()
      RETURNING enabled,target_win_rate_bps,profit_alert_cents::text,updated_at::text
    `);
    await auditAdmin({
      actorId: actor.id,
      action: 'user.outcome_policy.update',
      targetType: 'user',
      targetId: userId,
      reason: parsed.data.reason,
      before: before[0],
      after: after[0],
    });
    return { success: true, data: after[0] };
  });
}
