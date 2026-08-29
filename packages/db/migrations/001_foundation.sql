-- VeritasTrader F1 — schema isolado + gate de login
-- Aplicar no mesmo Supabase do ZaplotoV3 (SQL Editor ou psql).

BEGIN;

-- ── Gate de acesso nas contas Zaploto ───────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS login_target TEXT NOT NULL DEFAULT 'crm';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_login_target_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_login_target_check
  CHECK (login_target IN ('crm', 'trading', 'both'));

COMMENT ON COLUMN public.profiles.login_target IS
  'crm = só Zaploto; trading = só Veritas; both = ambos';

-- Contas existentes permanecem no CRM
UPDATE public.profiles
SET login_target = 'crm'
WHERE login_target IS NULL OR login_target = '';

-- ── Schema Veritas ──────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS veritas;

CREATE TABLE IF NOT EXISTS veritas.instruments (
  symbol            TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  asset_class       TEXT NOT NULL CHECK (asset_class IN ('crypto', 'equity')),
  quote_currency    TEXT NOT NULL DEFAULT 'BRL',
  qty_decimals      INT  NOT NULL DEFAULT 8,
  tick_size         BIGINT NOT NULL DEFAULT 1, -- centavos
  products_enabled  TEXT[] NOT NULL,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS veritas.accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  mode        TEXT NOT NULL CHECK (mode IN ('demo', 'live')),
  currency    TEXT NOT NULL DEFAULT 'BRL',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, mode)
);

CREATE TABLE IF NOT EXISTS veritas.ledger_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  UUID NOT NULL REFERENCES veritas.accounts(id),
  event_id    TEXT NOT NULL,
  leg         TEXT NOT NULL CHECK (leg IN ('debit', 'credit')),
  bucket      TEXT NOT NULL CHECK (bucket IN (
                  'cash', 'spot_holding', 'cfd_margin', 'binary_stake',
                  'realized_pnl', 'fee', 'funding'
                )),
  amount      BIGINT NOT NULL, -- centavos com sinal; partida dobrada
  asset       TEXT NOT NULL DEFAULT 'BRL',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_ledger_account_created
  ON veritas.ledger_entries (account_id, created_at);

CREATE INDEX IF NOT EXISTS idx_veritas_ledger_event
  ON veritas.ledger_entries (event_id);

-- Um event_id não pode ser aplicado duas vezes na mesma conta (idempotência)
CREATE UNIQUE INDEX IF NOT EXISTS uq_veritas_ledger_account_event_leg_bucket_asset
  ON veritas.ledger_entries (account_id, event_id, leg, bucket, asset);

COMMIT;
