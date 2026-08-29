import { randomUUID } from 'node:crypto';
import { formatBrl } from '@veritas/shared';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { readUserId } from '../auth.js';
import { ensureDemoAccount } from '../demo-account.js';
import { assertUuid, pgQuery } from '../pg.js';

const balanceBody = z.object({
  amount: z.coerce.number().finite().min(0).max(100_000_000),
});

export async function registerAccountRoutes(app: FastifyInstance) {
  app.put('/api/account/balance', async (req, reply) => {
    const userId = readUserId(req);
    if (!userId) {
      return reply.code(401).send({ success: false, error: 'Entre novamente para continuar.' });
    }

    const parsed = balanceBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        success: false,
        error: 'Informe um saldo válido entre R$ 0,00 e R$ 100.000.000,00.',
      });
    }

    await ensureDemoAccount(userId);
    const targetCents = Math.round(parsed.data.amount * 100);
    const rows = await pgQuery<{ balance: string }>(`
      SELECT veritas.set_demo_balance(
        '${assertUuid(userId)}'::uuid,
        ${targetCents},
        '${randomUUID()}'
      )::text AS balance
    `);
    const cash = BigInt(rows[0]?.balance ?? targetCents);

    return {
      success: true,
      data: {
        cash_cents: cash.toString(),
        cash_display: formatBrl(cash),
      },
    };
  });
}
