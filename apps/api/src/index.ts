import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { env } from './env.js';
import { registerAuthRoutes } from './auth.js';

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: env.webOrigin,
    credentials: true,
  });
  await app.register(cookie);

  app.get('/health', async () => ({
    ok: true,
    service: 'veritas-api',
    simulation: true,
    env: env.nodeEnv,
  }));

  await registerAuthRoutes(app);

  await app.listen({ port: env.port, host: '0.0.0.0' });
  app.log.info(`Veritas API (SIMULAÇÃO) em :${env.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
