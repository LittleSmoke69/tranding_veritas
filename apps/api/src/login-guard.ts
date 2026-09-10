/**
 * Bloqueio de tentativas de login por identificador (e-mail/usuário).
 *
 * Complementa o rate limit por IP do fastify-rate-limit: aquele barra um IP
 * abusivo, este barra ataques distribuídos (várias origens tentando a MESMA
 * conta). Estado em memória — reinicia com o processo, o que é aceitável
 * para o escopo atual (single instance, ambiente de simulação).
 */

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60_000;
const LOCKOUT_MS = 15 * 60_000;

type Attempt = { count: number; firstAt: number; lockedUntil?: number };

const attempts = new Map<string, Attempt>();

function prune(now: number) {
  for (const [key, entry] of attempts) {
    const expired = entry.lockedUntil ? entry.lockedUntil <= now : now - entry.firstAt > ATTEMPT_WINDOW_MS;
    if (expired) attempts.delete(key);
  }
}

export function isLocked(identifier: string): boolean {
  const now = Date.now();
  prune(now);
  const entry = attempts.get(identifier);
  return Boolean(entry?.lockedUntil && entry.lockedUntil > now);
}

export function registerFailedAttempt(identifier: string): void {
  const now = Date.now();
  const entry = attempts.get(identifier);
  if (!entry || now - entry.firstAt > ATTEMPT_WINDOW_MS) {
    attempts.set(identifier, { count: 1, firstAt: now });
    return;
  }
  entry.count += 1;
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearAttempts(identifier: string): void {
  attempts.delete(identifier);
}
