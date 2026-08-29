import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const candidates = [
  resolve(root, '.env'),
  resolve(root, '../ZaplotoV3/.env'),
];

for (const p of candidates) {
  if (existsSync(p)) {
    config({ path: p });
    break;
  }
}

function required(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  return v;
}

export const env = {
  port: Number(process.env.VERITAS_API_PORT || 4010),
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: required('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseServiceKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  sessionSecret: required('SESSION_SECRET'),
  workerSecret: process.env.VERITAS_WORKER_SECRET?.trim() || required('SESSION_SECRET'),
  webOrigin: process.env.VERITAS_WEB_ORIGIN?.trim() || 'http://localhost:5173',
  cookieName: 'veritas_session',
  sessionTtlSec: 60 * 60 * 24 * 7,
};
