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
    // fastify-rate-limit lança o retorno deste builder como erro; sem `statusCode`
    // próprio, cairia no branch de 500 do setErrorHandler abaixo.
    errorResponseBuilder: (_req, context) => ({
      success: false,
      error: 'Muitas tentativas de cadastro. Aguarde um pouco e tente novamente.',
      statusCode: context.statusCode,
    }),
  });

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    const e = err as { statusCode?: number; validation?: unknown; success?: boolean; error?: string };
    const status = typeof e.statusCode === 'number' && e.statusCode >= 400 ? e.statusCode : 500;
    // Erros já formatados por esta própria API (ex.: rate limit por rota) seguem
    // com a mensagem original em vez de serem genéricos.
    if (e.success === false && typeof e.error === 'string') {
      return reply.code(status).send({ success: false, error: e.error });
    }
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
