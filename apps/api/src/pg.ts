import { env } from './env.js';

type PgQueryResult = Record<string, unknown>[];

/**
 * SQL direto via endpoint /pg/query do Supabase self-hosted.
 * Necessário porque o schema `veritas` existe no Postgres mas não está
 * exposto no PostgREST (Invalid schema: veritas).
 */
export async function pgQuery<T extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
): Promise<T[]> {
  const res = await fetch(`${env.supabaseUrl}/pg/query`, {
    method: 'POST',
    signal: AbortSignal.timeout(30_000),
    headers: {
      apikey: env.supabaseServiceKey,
      Authorization: `Bearer ${env.supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text.slice(0, 400);
    try {
      const j = JSON.parse(text) as { message?: string; error?: string };
      msg = j.message || j.error || msg;
    } catch {
      /* keep raw */
    }
    throw new Error(msg);
  }
  if (!text || text === 'null') return [];
  const data = JSON.parse(text) as T[] | T;
  return Array.isArray(data) ? data : [data];
}

export function assertUuid(value: string, label = 'id'): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error(`${label} inválido`);
  }
  return value;
}
