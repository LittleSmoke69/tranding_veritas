import type { FastifyReply, FastifyRequest } from 'fastify';
import { db } from './db.js';
import { readUserId } from './auth.js';
import { AuthMessages } from './errors.js';

export type AdminActor = {
  id: string;
  status: 'admin' | 'super_admin';
};

export async function requireAdmin(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<AdminActor | null> {
  const userId = readUserId(req);
  if (!userId) {
    reply.code(401).send({ success: false, error: AuthMessages.session });
    return null;
  }

  const { data, error } = await db()
    .from('profiles')
    .select('id, status')
    .eq('id', userId)
    .maybeSingle();
  const status = String(data?.status ?? '').toLowerCase();
  if (error || !data || (status !== 'admin' && status !== 'super_admin')) {
    reply.code(403).send({
      success: false,
      error: 'Você não possui permissão para acessar esta área.',
    });
    return null;
  }
  return { id: data.id as string, status };
}
