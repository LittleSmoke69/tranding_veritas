import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env.js';

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Cookie: userId.exp.sig (mesmo formato conceitual do Zaploto). */
export function createSessionToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + env.sessionTtlSec;
  const payload = `${userId}.${exp}`;
  const sig = signPayload(payload, env.sessionSecret);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | null | undefined): string | null {
  if (!token?.trim()) return null;
  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;
  const [userId, expStr, sig] = parts;
  if (!userId || !expStr || !sig) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const payload = `${userId}.${expStr}`;
  const expected = signPayload(payload, env.sessionSecret);
  if (!safeEqual(sig, expected)) return null;
  return userId;
}
