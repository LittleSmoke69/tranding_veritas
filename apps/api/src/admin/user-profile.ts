import bcrypt from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAdmin } from '../authz.js';
import { assertUuid, pgQuery } from '../pg.js';
import { sqlText } from '../sql.js';
import { auditAdmin } from './audit.js';

const profileBody = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  username: z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9._-]+$/),
  phone: z.string().trim().min(10).max(30),
  password: z.string().max(120).optional(),
  reason: z.string().trim().min(3).max(240),
});

export async function registerAdminUserProfileRoutes(app: FastifyInstance) {
  app.patch('/api/admin/users/:id/profile', async (req, reply) => {
    const actor = await requireAdmin(req, reply);
    if (!actor) return;
    const userId = assertUuid((req.params as { id: string }).id);
    const parsed = profileBody.safeParse(req.body);
    const phone = parsed.success ? parsed.data.phone.replace(/\D/g, '') : '';
    if (!parsed.success || phone.length < 10 || phone.length > 15
      || (parsed.data.password && parsed.data.password.length < 8)) {
      return reply.code(400).send({
        success: false,
        error: 'Revise nome, e-mail, telefone, usuário, senha e justificativa.',
      });
    }

    const before = await pgQuery<Record<string, unknown>>(`
      SELECT id,email,username,full_name,telefone
      FROM public.profiles
      WHERE id='${userId}'::uuid
    `);
    if (!before.length) {
      return reply.code(404).send({ success: false, error: 'Usuário não encontrado.' });
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const normalizedUsername = parsed.data.username.toLowerCase();
    const passwordSet = parsed.data.password
      ? `,password_hash=${sqlText(await bcrypt.hash(parsed.data.password, 10))}`
      : '';

    try {
      const after = await pgQuery<Record<string, unknown>>(`
        UPDATE public.profiles
        SET
          full_name=${sqlText(parsed.data.full_name)},
          email=${sqlText(normalizedEmail)},
          username=${sqlText(normalizedUsername)},
          telefone=${sqlText(phone)}
          ${passwordSet}
        WHERE id='${userId}'::uuid
        RETURNING id,email,username,full_name,telefone,status,login_target,veritas_access_enabled
      `);
      await auditAdmin({
        actorId: actor.id,
        action: 'user.profile.update',
        targetType: 'user',
        targetId: userId,
        reason: parsed.data.reason,
        before: before[0],
        after: {
          ...after[0],
          password_changed: Boolean(parsed.data.password),
        },
      });
      return { success: true, data: after[0] };
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (/duplicate|unique/i.test(message)) {
        return reply.code(409).send({
          success: false,
          error: 'Este e-mail ou nome de usuário já está em uso.',
        });
      }
      throw error;
    }
  });
}
