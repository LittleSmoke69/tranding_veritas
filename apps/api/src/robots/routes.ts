import type { FastifyInstance } from 'fastify';
import { ROBOT_PROFILES, formatBrl } from '@veritas/shared';
import { z } from 'zod';
import { readUserId } from '../auth.js';
import { requireAdmin } from '../authz.js';
import { ensureDemoAccount, sumCash } from '../demo-account.js';
import { env } from '../env.js';
import { AuthMessages } from '../errors.js';
import { assertUuid, pgQuery } from '../pg.js';
import { sqlText, sqlTextArray } from '../sql.js';
import { auditAdmin } from '../admin/audit.js';
import { getRobotInstances, processRobotTick } from './service.js';

const startBody = z.object({
  profile_code: z.enum(['conservative', 'moderate', 'aggressive']),
  allocation_cents: z.union([z.string(), z.number()]),
  target_bps: z.number().int().min(1).max(5000),
  duration_hours: z.number().int().min(1).max(72).default(12),
  symbols: z.array(z.string().regex(/^[A-Z0-9_/-]+$/)).min(1).max(10),
});

function present(instance: Awaited<ReturnType<typeof getRobotInstances>>[number]) {
  const allocation = BigInt(instance.allocation_cents);
  const pnl = BigInt(instance.pnl_cents);
  const target = allocation * BigInt(instance.target_bps) / 10_000n;
  return {
    ...instance,
    allocation_display: formatBrl(allocation),
    pnl_display: formatBrl(pnl),
    target_cents: target.toString(),
    target_display: formatBrl(target),
    progress_pct: target > 0n ? Math.min(100, Number(pnl * 10_000n / target) / 100) : 0,
    win_rate: instance.wins + instance.losses
      ? Math.round(instance.wins / (instance.wins + instance.losses) * 1000) / 10
      : 0,
  };
}

export async function registerRobotRoutes(app: FastifyInstance) {
  app.get('/robots/profiles', async (req, reply) => {
    if (!readUserId(req)) return reply.code(401).send({ success: false, error: AuthMessages.session });
    return { success: true, data: Object.values(ROBOT_PROFILES) };
  });

  app.get('/robots', async (req, reply) => {
    const userId = readUserId(req);
    if (!userId) return reply.code(401).send({ success: false, error: AuthMessages.session });
    const account = await ensureDemoAccount(userId);
    const rows = await getRobotInstances(account.account.id);
    return { success: true, data: rows.map(present) };
  });

  app.post('/robots/start', async (req, reply) => {
    const userId = readUserId(req);
    if (!userId) return reply.code(401).send({ success: false, error: AuthMessages.session });
    const parsed = startBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, error: 'Revise a configuração do robô.' });
    }
    const account = await ensureDemoAccount(userId);
    const cash = await sumCash(account.account.id);
    const allocation = BigInt(String(parsed.data.allocation_cents));
    const profile = ROBOT_PROFILES[parsed.data.profile_code];
    if (allocation <= 0n || allocation > cash) {
      return reply.code(400).send({ success: false, error: 'Capital alocado inválido ou acima do saldo.' });
    }
    if (parsed.data.target_bps < profile.targetMinBps || parsed.data.target_bps > profile.targetMaxBps) {
      return reply.code(400).send({ success: false, error: 'Meta fora da faixa permitida para este perfil.' });
    }
    const settings = await pgQuery<{
      enabled: boolean; allowed_profiles: string[]; max_allocation_cents: string; max_target_bps: number;
    }>(`
      SELECT enabled,allowed_profiles,max_allocation_cents::text,max_target_bps
      FROM veritas.robot_user_settings WHERE account_id='${account.account.id}'::uuid
    `);
    const rules = settings[0];
    if (rules && (!rules.enabled || !rules.allowed_profiles.includes(parsed.data.profile_code)
      || allocation > BigInt(rules.max_allocation_cents) || parsed.data.target_bps > rules.max_target_bps)) {
      return reply.code(403).send({ success: false, error: 'A configuração excede os limites definidos pelo administrador.' });
    }
    const rows = await pgQuery<Record<string, unknown>>(`
      INSERT INTO veritas.robot_instances
        (account_id,profile_code,allocation_cents,target_bps,initial_cash_cents,
         symbols,stop_at,created_by)
      VALUES (
        '${account.account.id}'::uuid,${sqlText(parsed.data.profile_code)},${allocation},
        ${parsed.data.target_bps},${cash},${sqlTextArray(parsed.data.symbols)},
        NOW()+make_interval(hours=>${parsed.data.duration_hours}),'${userId}'::uuid
      )
      RETURNING id
    `);
    return reply.code(201).send({ success: true, data: rows[0] });
  });

  app.post('/robots/:id/stop', async (req, reply) => {
    const userId = readUserId(req);
    if (!userId) return reply.code(401).send({ success: false, error: AuthMessages.session });
    const id = assertUuid((req.params as { id: string }).id);
    const rows = await pgQuery<Record<string, unknown>>(`
      UPDATE veritas.robot_instances AS instance
      SET status='stopped',stopped_at=NOW(),
        stop_reason='Interrompido pelo usuário'
      FROM veritas.accounts AS account
      WHERE instance.id='${id}'::uuid
        AND instance.account_id=account.id
        AND account.user_id='${assertUuid(userId)}'::uuid
        AND instance.status='active'
      RETURNING instance.id,instance.status
    `);
    if (!rows.length) return reply.code(404).send({ success: false, error: 'Robô ativo não encontrado.' });
    return { success: true, data: rows[0] };
  });

  app.get('/api/admin/robots', async (req, reply) => {
    if (!(await requireAdmin(req, reply))) return;
    const rows = await pgQuery<Record<string, unknown>>(`
      SELECT r.*,p.email,p.full_name FROM veritas.robot_instances r
      JOIN veritas.accounts a ON a.id=r.account_id
      JOIN public.profiles p ON p.id=a.user_id
      ORDER BY r.started_at DESC LIMIT 200
    `);
    return { success: true, data: rows };
  });

  app.post('/api/admin/robots/:id/stop', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const id = assertUuid((req.params as { id: string }).id);
    const rows = await pgQuery<Record<string, unknown>>(`
      UPDATE veritas.robot_instances SET status='disabled',stopped_at=NOW(),
        stop_reason='Interrompido pelo administrador'
      WHERE id='${id}'::uuid AND status='active' RETURNING id,status,account_id
    `);
    if (!rows.length) return reply.code(404).send({ success: false, error: 'Robô ativo não encontrado.' });
    await auditAdmin({
      actorId: actor.id, action: 'robot.admin.stop', targetType: 'robot',
      targetId: id, reason: 'Kill switch administrativo', after: rows[0],
    });
    return { success: true, data: rows[0] };
  });

  app.put('/api/admin/robots/settings/:userId', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const userId = assertUuid((req.params as { userId: string }).userId);
    const body = z.object({
      enabled: z.boolean(),
      allowed_profiles: z.array(z.enum(['conservative', 'moderate', 'aggressive'])).min(1),
      max_allocation_cents: z.union([z.string(), z.number()]),
      max_target_bps: z.number().int().min(1).max(5000),
      reason: z.string().min(3).max(240),
    }).safeParse(req.body);
    if (!body.success) return reply.code(400).send({ success: false, error: 'Configuração inválida.' });
    const account = await ensureDemoAccount(userId);
    const maxAllocation = BigInt(String(body.data.max_allocation_cents));
    await pgQuery(`
      INSERT INTO veritas.robot_user_settings
        (account_id,enabled,allowed_profiles,max_allocation_cents,max_target_bps,updated_by,updated_at)
      VALUES (
        '${account.account.id}'::uuid,${body.data.enabled},${sqlTextArray(body.data.allowed_profiles)},
        ${maxAllocation},${body.data.max_target_bps},'${actor.id}'::uuid,NOW()
      )
      ON CONFLICT (account_id) DO UPDATE SET
        enabled=EXCLUDED.enabled,allowed_profiles=EXCLUDED.allowed_profiles,
        max_allocation_cents=EXCLUDED.max_allocation_cents,max_target_bps=EXCLUDED.max_target_bps,
        updated_by=EXCLUDED.updated_by,updated_at=NOW()
    `);
    await auditAdmin({
      actorId: actor.id, action: 'robot.settings.update', targetType: 'user',
      targetId: userId, reason: body.data.reason, after: body.data,
    });
    return { success: true, data: { updated: true } };
  });

  app.post('/internal/robots/tick', async (req, reply) => {
    if (req.headers.authorization !== `Bearer ${env.workerSecret}`) {
      return reply.code(401).send({ success: false, error: 'Não autorizado.' });
    }
    return { success: true, data: await processRobotTick() };
  });
}
