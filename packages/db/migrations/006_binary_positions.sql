-- Posições de opção binária (ACIMA / ABAIXO)
BEGIN;

CREATE TABLE IF NOT EXISTS veritas.binary_positions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID NOT NULL REFERENCES veritas.accounts(id),
  symbol          TEXT NOT NULL,
  side            TEXT NOT NULL CHECK (side IN ('up', 'down')),
  stake_cents     BIGINT NOT NULL CHECK (stake_cents > 0),
  profit_pct      INT NOT NULL CHECK (profit_pct >= 0 AND profit_pct <= 100),
  entry_price_e8  BIGINT NOT NULL,
  exit_price_e8   BIGINT,
  expires_at      TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'won', 'lost')),
  client_order_id TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  settled_at      TIMESTAMPTZ,
  UNIQUE (account_id, client_order_id)
);

CREATE INDEX IF NOT EXISTS idx_veritas_binary_open
  ON veritas.binary_positions (account_id, status, expires_at);

GRANT ALL ON veritas.binary_positions TO service_role;

COMMIT;
