import { config } from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');
for (const candidate of [resolve(root, '.env'), resolve(root, '../ZaplotoV3/.env')]) {
  if (existsSync(candidate)) {
    config({ path: candidate });
    break;
  }
}

const name = process.argv[2];
if (!name || !/^\d{3}_[a-z0-9_]+\.sql$/.test(name)) {
  throw new Error('Informe o nome seguro da migration, por exemplo 007_admin_market_robots.sql');
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) throw new Error('Variáveis do Supabase ausentes.');
const sql = readFileSync(resolve(import.meta.dirname, '../migrations', name), 'utf8');
const response = await fetch(`${url}/pg/query`, {
  method: 'POST',
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
});
if (!response.ok) throw new Error((await response.text()).slice(0, 600));
console.log(`Migration aplicada: ${name}`);
