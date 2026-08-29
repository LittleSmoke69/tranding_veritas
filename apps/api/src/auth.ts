import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { formatBrl } from '@veritas/shared';
import { db } from './db.js';
import { ensureDemoAccount, sumCash } from './demo-account.js';
import { env } from './env.js';
import { createSessionToken, verifySessionToken } from './session.js';

type ProfileRow = {
  id: string;
  email: string;
  username: string | null;
  password_hash: string | null;
  status: string | null;
  login_target: string | null;
  full_name: string | null;
};

const LOGIN_SELECT =
  'id, email, username, password_hash, status, login_target, full_name';

async function findProfile(identifier: string): Promise<ProfileRow | null> {
  const byUsername = identifier.startsWith('@') || !identifier.includes('@');
  const normalized = identifier.replace(/^@+/, '');

  if (byUsername) {
    const { data, error } = await db()
      .from('profiles')
      .select(LOGIN_SELECT)
      .ilike('username', normalized)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) return data as ProfileRow;
    return null;
  }

  const { data, error } = await db()
    .from('profiles')
    .select(LOGIN_SELECT)
    .eq('email', identifier)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data as ProfileRow;

  const local = identifier.split('@')[0] || '';
  if (local) {
    const { data: byUser, error: userErr } = await db()
      .from('profiles')
      .select(LOGIN_SELECT)
      .ilike('username', local)
      .maybeSingle();
    if (userErr) throw new Error(userErr.message);
    if (byUser) return byUser as ProfileRow;
  }
  return null;
}

function setSessionCookie(reply: FastifyReply, userId: string) {
  const token = createSessionToken(userId);
  reply.setCookie(env.cookieName, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: env.sessionTtlSec,
  });
}

function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(env.cookieName, { path: '/' });
}

export function readUserId(req: FastifyRequest): string | null {
  const raw = req.cookies?.[env.cookieName];
  return verifySessionToken(raw);
}

const loginBody = z.object({
  email: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(1),
});

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (req, reply) => {
    const parsed = loginBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ success: false, error: 'Dados inválidos.' });
    }

    const rawId =
      (parsed.data.username && parsed.data.username.trim()) ||
      (parsed.data.email && parsed.data.email.trim()) ||
      '';
    const identifier = rawId.trim().toLowerCase();
    const password = parsed.data.password.trim();
    if (!identifier || !password) {
      return reply.code(400).send({ success: false, error: 'Usuário/e-mail e senha obrigatórios.' });
    }

    const profile = await findProfile(identifier);
    if (!profile?.password_hash) {
      return reply.code(401).send({ success: false, error: 'Credenciais inválidas.' });
    }

    const target = (profile.login_target || 'both').toLowerCase();
    // CRM (crm|both) e trading (trading|both) entram na Veritas.
    // Só bloqueia se no futuro houver valor desconhecido.
    if (target !== 'crm' && target !== 'trading' && target !== 'both') {
      return reply.code(403).send({
        success: false,
        error: 'Esta conta não tem acesso à plataforma de trading.',
      });
    }

    const ok = await bcrypt.compare(password, profile.password_hash);
    if (!ok) {
      return reply.code(401).send({ success: false, error: 'Credenciais inválidas.' });
    }

    const demo = await ensureDemoAccount(profile.id);
    setSessionCookie(reply, profile.id);

    return {
      success: true,
      data: {
        user: {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          full_name: profile.full_name,
          login_target: target,
        },
        account: demo.account,
        cash_cents: demo.cashCents,
        cash_display: formatBrl(BigInt(demo.cashCents)),
        simulation: true,
        demo_created: demo.created,
        message: 'SIMULAÇÃO — crédito virtual. Nenhum valor real foi movimentado.',
      },
    };
  });

  app.post('/auth/logout', async (_req, reply) => {
    clearSessionCookie(reply);
    return { success: true };
  });

  app.get('/auth/me', async (req, reply) => {
    const userId = readUserId(req);
    if (!userId) {
      return reply.code(401).send({ success: false, error: 'Não autenticado.' });
    }

    const { data: profile, error } = await db()
      .from('profiles')
      .select('id, email, username, full_name, login_target, status')
      .eq('id', userId)
      .maybeSingle();
    if (error || !profile) {
      return reply.code(401).send({ success: false, error: 'Sessão inválida.' });
    }

    const demo = await ensureDemoAccount(userId);
    const cash = await sumCash(demo.account.id);

    return {
      success: true,
      data: {
        user: profile,
        account: demo.account,
        cash_cents: cash.toString(),
        cash_display: formatBrl(cash),
        simulation: true,
      },
    };
  });
}
