import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { env } from './env.js';
import { registerAuthRoutes } from './auth.js';
import { AuthMessages } from './errors.js';
import { registerTradeRoutes } from './trades.js';
import { registerAdminUserRoutes } from './admin/users.js';
import { registerAdminInstrumentRoutes } from './admin/instruments.js';
import { registerMarketRoutes } from './market/routes.js';
import { registerRobotRoutes } from './robots/routes.js';
import { registerAccountRoutes } from './account/routes.js';
import { registerAdminUserProfileRoutes } from './admin/user-profile.js';

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: env.webOrigin,
    credentials: true,
  });
  await app.register(cookie);
  await app.register(rateLimit, {
    global: false,
    errorResponseBuilder: () => ({
      success: false,
      error: 'Muitas tentativas de cadastro. Aguarde um pouco e tente novamente.',
    }),
  });

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    const e = err as { statusCode?: number; validation?: unknown };
    const status = typeof e.statusCode === 'number' && e.statusCode >= 400 ? e.statusCode : 500;
    const message =
      status >= 500
        ? AuthMessages.unavailable
        : e.validation
          ? AuthMessages.validation
          : AuthMessages.generic;
    return reply.code(status).send({ success: false, error: message });
  });

  app.get('/health', async () => ({
    ok: true,
    service: 'veritas-api',
    env: env.nodeEnv,
  }));

  await registerAuthRoutes(app);
  await registerMarketRoutes(app);
  await registerTradeRoutes(app);
  await registerRobotRoutes(app);
  await registerAccountRoutes(app);
  await registerAdminUserRoutes(app);
  await registerAdminUserProfileRoutes(app);
  await registerAdminInstrumentRoutes(app);

  await app.listen({ port: env.port, host: '0.0.0.0' });
  app.log.info(`Veritas API em :${env.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
