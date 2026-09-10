import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { formatBrl } from '@veritas/shared';
import { db } from './db.js';
import { ensureDemoAccount, sumCash } from './demo-account.js';
import { env } from './env.js';
import { AuthMessages, friendlyAuthError } from './errors.js';
import { clearAttempts, isLocked, registerFailedAttempt } from './login-guard.js';
import { createSessionToken, verifySessionToken } from './session.js';
import { pgQuery } from './pg.js';
import { sqlText } from './sql.js';

/** Hash bcrypt "de descarte": nunca corresponde a nenhuma senha real.
 *  Usado para manter o tempo de resposta parecido quando o identificador
 *  não existe, evitando enumeração de contas por diferença de latência. */
const DUMMY_PASSWORD_HASH = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8p9pKZ8v0zZM/9mVoI3l5X2xhk2VJa';

type ProfileRow = {
  id: string;
  email: string;
  username: string | null;
  password_hash: string | null;
  status: string | null;
  login_target: string | null;
  full_name: string | null;
  veritas_access_enabled: boolean | null;
};

const LOGIN_SELECT =
  'id, email, username, password_hash, status, login_target, full_name, veritas_access_enabled';

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

const registerBody = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(10).max(30),
  password: z.string().min(8).max(120),
});

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/auth/register', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 hour',
      },
    },
  }, async (req, reply) => {
    try {
      const parsed = registerBody.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({
          success: false,
          error: 'Preencha nome, e-mail, telefone e senha com pelo menos 8 caracteres.',
        });
      }
      const phone = parsed.data.phone.replace(/\D/g, '');
      if (phone.length < 10 || phone.length > 15) {
        return reply.code(400).send({
          success: false,
          error: 'Informe um telefone válido com DDD.',
        });
      }
      const email = parsed.data.email.toLowerCase();
      const usernameBase = email.split('@')[0]
        ?.replace(/[^a-z0-9._-]/g, '')
        .slice(0, 36) || 'usuario';
      const username = `${usernameBase}_${randomUUID().slice(0, 6)}`;
      const passwordHash = await bcrypt.hash(parsed.data.password.trim(), 10);
      const rows = await pgQuery<{
        profile_id: string;
        account_id: string;
        email: string;
        username: string;
        full_name: string;
        phone: string;
        cash_cents: string;
      }>(`
        SELECT * FROM veritas.register_trading_user(
          ${sqlText(email)},
          ${sqlText(username)},
          ${sqlText(parsed.data.full_name)},
          ${sqlText(phone)},
          ${sqlText(passwordHash)}
        )
      `);
      const created = rows[0];
      if (!created) throw new Error('Cadastro não concluído.');
      setSessionCookie(reply, created.profile_id);
      return reply.code(201).send({
        success: true,
        data: {
          user: {
            id: created.profile_id,
            email: created.email,
            username: created.username,
            full_name: created.full_name,
            login_target: 'trading',
            status: 'user',
          },
          account: {
            id: created.account_id,
            user_id: created.profile_id,
            mode: 'demo',
            currency: 'BRL',
          },
          cash_cents: String(created.cash_cents),
          cash_display: formatBrl(BigInt(created.cash_cents)),
          simulation: true,
          demo_created: true,
        },
      });
    } catch (error) {
      req.log.error(error);
      const message = error instanceof Error ? error.message : '';
      if (/cadastrado|duplicate|unique/i.test(message)) {
        return reply.code(409).send({
          success: false,
          error: 'Este e-mail já possui uma conta.',
        });
      }
      return reply.code(500).send({ success: false, error: friendlyAuthError(error) });
    }
  });

  app.post('/auth/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
        errorResponseBuilder: (_req, context) => ({
          success: false,
          error: AuthMessages.rateLimited,
          statusCode: context.statusCode,
        }),
      },
    },
  }, async (req, reply) => {
    try {
      const parsed = loginBody.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ success: false, error: AuthMessages.validation });
      }

      const rawId =
        (parsed.data.username && parsed.data.username.trim()) ||
        (parsed.data.email && parsed.data.email.trim()) ||
        '';
      const identifier = rawId.trim().toLowerCase();
      const password = parsed.data.password.trim();
      if (!identifier || !password) {
        return reply.code(400).send({ success: false, error: AuthMessages.validation });
      }

      if (isLocked(identifier)) {
        return reply.code(429).send({ success: false, error: AuthMessages.lockout });
      }

      const profile = await findProfile(identifier);
      if (!profile?.password_hash) {
        // Compara contra um hash de descarte para não vazar, pelo tempo de resposta,
        // se o identificador existe ou não (mitiga enumeração de contas).
        await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
        registerFailedAttempt(identifier);
        return reply.code(401).send({ success: false, error: AuthMessages.auth });
      }

      const target = (profile.login_target || 'both').toLowerCase();
      const role = (profile.status || '').toLowerCase();
      const isAdmin = role === 'admin' || role === 'super_admin';
      if (profile.veritas_access_enabled === false) {
        return reply.code(403).send({ success: false, error: AuthMessages.access });
      }
      if (
        (target !== 'trading' && target !== 'both' && !isAdmin) ||
        !['crm', 'trading', 'both'].includes(target)
      ) {
        return reply.code(403).send({ success: false, error: AuthMessages.access });
      }

      const ok = await bcrypt.compare(password, profile.password_hash);
      if (!ok) {
        registerFailedAttempt(identifier);
        return reply.code(401).send({ success: false, error: AuthMessages.auth });
      }

      clearAttempts(identifier);
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
            status: profile.status,
          },
          account: demo.account,
          cash_cents: demo.cashCents,
          cash_display: formatBrl(BigInt(demo.cashCents)),
          simulation: true,
          demo_created: demo.created,
        },
      };
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({ success: false, error: friendlyAuthError(err) });
    }
  });

  app.post('/auth/logout', async (_req, reply) => {
    clearSessionCookie(reply);
    return { success: true };
  });

  app.get('/auth/me', async (req, reply) => {
    try {
      const userId = readUserId(req);
      if (!userId) {
        return reply.code(401).send({ success: false, error: AuthMessages.session });
      }

      const { data: profile, error } = await db()
        .from('profiles')
        .select('id, email, username, full_name, login_target, status, veritas_access_enabled')
        .eq('id', userId)
        .maybeSingle();
      if (error || !profile) {
        return reply.code(401).send({ success: false, error: AuthMessages.session });
      }
      if (profile.veritas_access_enabled === false) {
        clearSessionCookie(reply);
        return reply.code(403).send({ success: false, error: AuthMessages.access });
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
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({ success: false, error: friendlyAuthError(err) });
    }
  });
}
