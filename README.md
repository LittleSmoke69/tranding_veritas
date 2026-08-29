# VeritasTrader

Plataforma de trading multiproduto (**SPOT / MARGEM / BINÁRIA**) sobre **uma conta e um ledger**.

> **AMBIENTE: SIMULAÇÃO** — nenhum valor real é movimentado. Créditos iniciais são virtuais.

## Stack

- Monorepo npm workspaces
- `apps/api` — Fastify (auth + saúde)
- `apps/web` — Vite + React (login + carimbo SIMULAÇÃO)
- `packages/shared` — `Money` + tipos de domínio
- `packages/db` — migrações SQL schema `veritas`

## Auth / banco

- Mesmo Supabase do ZaplotoV3 (`profiles` + `password_hash`)
- Schema isolado `veritas`
- Coluna `public.profiles.login_target` ∈ `crm` | `trading` | `both`
- Env: symlink para `../ZaplotoV3/.env` (não versionar secrets)

## Setup

```bash
cd veritastrader
ln -sf ../ZaplotoV3/.env .env
npm install
npm test
npm run lint:money
npm run dev
```

- API: http://localhost:4010  
- Web: http://localhost:5173  

Aplique as migrações SQL em `packages/db/migrations/` no Supabase (SQL Editor ou `psql`).

## Fase atual

**F1 Fundação** — Money, schema, auth, conta demo R$ 10.000 (1_000_000 centavos).
