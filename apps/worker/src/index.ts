import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
for (const candidate of [resolve(root, '.env'), resolve(root, '../ZaplotoV3/.env')]) {
  if (existsSync(candidate)) {
    config({ path: candidate });
    break;
  }
}

const apiUrl = process.env.VERITAS_API_URL?.trim() || 'http://127.0.0.1:4010';
const secret = process.env.VERITAS_WORKER_SECRET?.trim() || process.env.SESSION_SECRET?.trim();
if (!secret) throw new Error('SESSION_SECRET ou VERITAS_WORKER_SECRET é obrigatório.');

let running = false;
async function tick() {
  if (running) return;
  running = true;
  try {
    const response = await fetch(`${apiUrl}/internal/robots/tick`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!response.ok) console.error('robot_worker_tick_failed', { status: response.status });
  } catch (error) {
    console.error('robot_worker_unavailable', { message: error instanceof Error ? error.message : String(error) });
  } finally {
    running = false;
  }
}

console.log('Veritas robot worker ativo');
void tick();
setInterval(() => void tick(), 15_000);
