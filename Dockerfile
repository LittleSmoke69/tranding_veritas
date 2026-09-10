# syntax=docker/dockerfile:1
# Build único e multi-stage para os três serviços do monorepo (api, worker, web).
# Cada serviço final é construído com `docker compose build --target <nome>`;
# a etapa `build` (mais pesada) é compartilhada e cacheada entre os três.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/db/package.json packages/db/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build -w @veritas/shared \
 && npm run build -w @veritas/db \
 && npm run build -w @veritas/api \
 && npm run build -w @veritas/worker \
 && npm run build -w @veritas/web

# ── API (Fastify) ────────────────────────────────────────────────────────────
FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/packages/db ./packages/db
COPY --from=build /app/apps/api ./apps/api
EXPOSE 4010
CMD ["node", "apps/api/dist/index.js"]

# ── Worker (tick dos agentes de IA) ──────────────────────────────────────────
FROM node:22-alpine AS worker
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/worker ./apps/worker
CMD ["node", "apps/worker/dist/index.js"]

# ── Web (estático + proxy para a API) ────────────────────────────────────────
FROM nginx:alpine AS web
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY infra/nginx.web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# ── Landing institucional (investirbot.online) ───────────────────────────────
# Projeto à parte (Vite + pnpm), fora do workspace npm — build isolado.
FROM node:22-alpine AS landing-build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate
COPY ["LP VERITAS ACADEMY/package.json", "LP VERITAS ACADEMY/pnpm-lock.yaml", "./"]
RUN pnpm install --frozen-lockfile
COPY ["LP VERITAS ACADEMY/", "."]
RUN pnpm run build

FROM nginx:alpine AS landing
COPY --from=landing-build /app/dist /usr/share/nginx/html
COPY infra/nginx.spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
