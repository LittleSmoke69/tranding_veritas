-- VeritasTrader F2 — administração, mercado simulado unificado e robôs
BEGIN;

ALTER TABLE veritas.instruments
  ADD COLUMN IF NOT EXISTS base_price_e8 BIGINT NOT NULL DEFAULT 100000000,
  ADD COLUMN IF NOT EXISTS volatility_bps INT NOT NULL DEFAULT 15 CHECK (volatility_bps BETWEEN 1 AND 1000),
  ADD COLUMN IF NOT EXISTS payout_pct INT NOT NULL DEFAULT 85 CHECK (payout_pct BETWEEN 1 AND 100),
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'binary',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE veritas.instruments SET base_price_e8 = CASE symbol
  WHEN 'OPENAI_OTC' THEN 12100000000
  WHEN 'EURUSD_OTC' THEN 108500000
  WHEN 'BTCUSD_OTC' THEN 6700000000000
  WHEN 'ETHUSD_OTC' THEN 350000000000
  ELSE GREATEST(base_price_e8, 100000000)
END;

CREATE TABLE IF NOT EXISTS veritas.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created
  ON veritas.admin_audit_log (created_at DESC);

CREATE TABLE IF NOT EXISTS veritas.market_candles (
  symbol TEXT NOT NULL REFERENCES veritas.instruments(symbol),
  interval_sec INT NOT NULL CHECK (interval_sec IN (15, 60, 300)),
  bar_time TIMESTAMPTZ NOT NULL,
  open_e8 BIGINT NOT NULL,
  high_e8 BIGINT NOT NULL,
  low_e8 BIGINT NOT NULL,
  close_e8 BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (symbol, interval_sec, bar_time)
);

CREATE TABLE IF NOT EXISTS veritas.robot_profile_templates (
  code TEXT PRIMARY KEY CHECK (code IN ('conservative', 'moderate', 'aggressive')),
  name TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  target_min_bps INT NOT NULL,
  target_max_bps INT NOT NULL,
  stake_bps INT NOT NULL,
  stop_loss_bps INT NOT NULL,
  interval_sec INT NOT NULL CHECK (interval_sec IN (15, 60, 300)),
  expiration_sec INT NOT NULL,
  cooldown_sec INT NOT NULL,
  max_trades_day INT NOT NULL,
  confirmation_level INT NOT NULL CHECK (confirmation_level BETWEEN 1 AND 3),
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO veritas.robot_profile_templates
  (code, name, target_min_bps, target_max_bps, stake_bps, stop_loss_bps,
   interval_sec, expiration_sec, cooldown_sec, max_trades_day, confirmation_level)
VALUES
  ('conservative', 'Conservador', 50, 100, 100, 200, 300, 300, 900, 10, 3),
  ('moderate', 'Moderado', 200, 400, 250, 500, 60, 120, 300, 25, 2),
  ('aggressive', 'Agressivo', 500, 800, 500, 1000, 15, 60, 120, 50, 1)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  target_min_bps = EXCLUDED.target_min_bps,
  target_max_bps = EXCLUDED.target_max_bps,
  stake_bps = EXCLUDED.stake_bps,
  stop_loss_bps = EXCLUDED.stop_loss_bps,
  interval_sec = EXCLUDED.interval_sec,
  expiration_sec = EXCLUDED.expiration_sec,
  cooldown_sec = EXCLUDED.cooldown_sec,
  max_trades_day = EXCLUDED.max_trades_day,
  confirmation_level = EXCLUDED.confirmation_level;

CREATE TABLE IF NOT EXISTS veritas.robot_user_settings (
  account_id UUID PRIMARY KEY REFERENCES veritas.accounts(id),
  allowed_profiles TEXT[] NOT NULL DEFAULT ARRAY['conservative','moderate','aggressive'],
  max_allocation_cents BIGINT NOT NULL DEFAULT 1000000 CHECK (max_allocation_cents > 0),
  max_target_bps INT NOT NULL DEFAULT 800 CHECK (max_target_bps BETWEEN 1 AND 5000),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS veritas.robot_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES veritas.accounts(id),
  profile_code TEXT NOT NULL REFERENCES veritas.robot_profile_templates(code),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','target_reached','stop_loss','time_limit','stopped','disabled')),
  allocation_cents BIGINT NOT NULL CHECK (allocation_cents > 0),
  target_bps INT NOT NULL CHECK (target_bps BETWEEN 1 AND 5000),
  initial_cash_cents BIGINT NOT NULL,
  pnl_cents BIGINT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  symbols TEXT[] NOT NULL DEFAULT ARRAY['OPENAI_OTC'],
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stop_at TIMESTAMPTZ NOT NULL,
  stopped_at TIMESTAMPTZ,
  stop_reason TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_robot_active_account
  ON veritas.robot_instances (account_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS veritas.robot_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES veritas.robot_instances(id),
  symbol TEXT NOT NULL,
  bar_time TIMESTAMPTZ NOT NULL,
  side TEXT CHECK (side IN ('up','down')),
  confidence INT NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  indicators JSONB NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('enter','skip')),
  skip_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_robot_signal_bar
  ON veritas.robot_signals (instance_id,symbol,bar_time);

ALTER TABLE veritas.binary_positions
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual','robot')),
  ADD COLUMN IF NOT EXISTS robot_instance_id UUID REFERENCES veritas.robot_instances(id);

CREATE OR REPLACE FUNCTION veritas.is_admin(p_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND LOWER(COALESCE(status, '')) IN ('admin','super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION veritas.admin_adjust_balance(
  p_actor_id UUID, p_account_id UUID, p_amount BIGINT, p_reason TEXT, p_event_key TEXT
) RETURNS BIGINT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_event TEXT; v_balance BIGINT;
BEGIN
  IF NOT veritas.is_admin(p_actor_id) THEN RAISE EXCEPTION 'Acesso administrativo negado'; END IF;
  IF p_amount = 0 THEN RAISE EXCEPTION 'O ajuste não pode ser zero'; END IF;
  IF LENGTH(TRIM(p_reason)) < 3 THEN RAISE EXCEPTION 'Motivo obrigatório'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext(p_account_id::text));
  v_event := 'admin_adjust:' || regexp_replace(p_event_key, '[^a-zA-Z0-9_-]', '', 'g');
  INSERT INTO veritas.ledger_entries (account_id,event_id,leg,bucket,amount,asset)
  VALUES
    (p_account_id,v_event,CASE WHEN p_amount > 0 THEN 'credit' ELSE 'debit' END,'cash',p_amount,'BRL'),
    (p_account_id,v_event,CASE WHEN p_amount > 0 THEN 'debit' ELSE 'credit' END,'funding',p_amount * -1,'BRL')
  ON CONFLICT DO NOTHING;
  SELECT COALESCE(SUM(amount),0) INTO v_balance FROM veritas.ledger_entries
    WHERE account_id=p_account_id AND bucket='cash' AND asset='BRL';
  IF v_balance < 0 THEN RAISE EXCEPTION 'Ajuste deixaria o saldo negativo'; END IF;
  INSERT INTO veritas.admin_audit_log(actor_id,action,target_type,target_id,reason,after_data)
  VALUES(p_actor_id,'balance.adjust','account',p_account_id::text,p_reason,
    jsonb_build_object('amount_cents',p_amount,'balance_cents',v_balance,'event_id',v_event));
  RETURN v_balance;
END $$;

CREATE OR REPLACE FUNCTION veritas.open_binary_position(
  p_account_id UUID, p_symbol TEXT, p_side TEXT, p_stake BIGINT, p_profit_pct INT,
  p_expiration_sec INT, p_entry_e8 BIGINT, p_client_order_id TEXT,
  p_source TEXT DEFAULT 'manual', p_robot_instance_id UUID DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id UUID; v_cash BIGINT;
BEGIN
  IF p_side NOT IN ('up','down') OR p_stake <= 0 THEN RAISE EXCEPTION 'Ordem inválida'; END IF;
  IF NOT EXISTS (SELECT 1 FROM veritas.instruments WHERE symbol=p_symbol AND is_active) THEN
    RAISE EXCEPTION 'Ativo indisponível';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(p_account_id::text));
  SELECT COALESCE(SUM(amount),0) INTO v_cash FROM veritas.ledger_entries
    WHERE account_id=p_account_id AND bucket='cash' AND asset='BRL';
  IF v_cash < p_stake THEN RAISE EXCEPTION 'Saldo insuficiente'; END IF;
  INSERT INTO veritas.binary_positions
    (account_id,symbol,side,stake_cents,profit_pct,entry_price_e8,expires_at,
     status,client_order_id,source,robot_instance_id)
  VALUES
    (p_account_id,p_symbol,p_side,p_stake,p_profit_pct,p_entry_e8,
     NOW()+make_interval(secs=>p_expiration_sec),'open',p_client_order_id,p_source,p_robot_instance_id)
  ON CONFLICT (account_id,client_order_id) DO UPDATE SET client_order_id=EXCLUDED.client_order_id
  RETURNING id INTO v_id;
  INSERT INTO veritas.ledger_entries(account_id,event_id,leg,bucket,amount,asset)
  VALUES
    (p_account_id,'binary_open:'||v_id,'debit','cash',-p_stake,'BRL'),
    (p_account_id,'binary_open:'||v_id,'credit','binary_stake',p_stake,'BRL')
  ON CONFLICT DO NOTHING;
  RETURN v_id;
END $$;

CREATE OR REPLACE FUNCTION veritas.settle_binary_position(p_position_id UUID, p_exit_e8 BIGINT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE p veritas.binary_positions%ROWTYPE; v_won BOOLEAN; v_profit BIGINT; v_status TEXT;
BEGIN
  SELECT * INTO p FROM veritas.binary_positions WHERE id=p_position_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Posição inexistente'; END IF;
  IF p.status <> 'open' THEN RETURN p.status; END IF;
  v_won := (p.side='up' AND p_exit_e8>p.entry_price_e8)
        OR (p.side='down' AND p_exit_e8<p.entry_price_e8);
  v_status := CASE WHEN v_won THEN 'won' ELSE 'lost' END;
  v_profit := ROUND((p.stake_cents::numeric*p.profit_pct)/100)::bigint;
  IF v_won THEN
    INSERT INTO veritas.ledger_entries(account_id,event_id,leg,bucket,amount,asset) VALUES
      (p.account_id,'binary_settle:'||p.id,'debit','binary_stake',-p.stake_cents,'BRL'),
      (p.account_id,'binary_settle:'||p.id,'credit','cash',p.stake_cents+v_profit,'BRL'),
      (p.account_id,'binary_settle:'||p.id,'debit','realized_pnl',-v_profit,'BRL')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO veritas.ledger_entries(account_id,event_id,leg,bucket,amount,asset) VALUES
      (p.account_id,'binary_settle:'||p.id,'debit','binary_stake',-p.stake_cents,'BRL'),
      (p.account_id,'binary_settle:'||p.id,'credit','realized_pnl',p.stake_cents,'BRL')
    ON CONFLICT DO NOTHING;
  END IF;
  UPDATE veritas.binary_positions SET status=v_status,exit_price_e8=p_exit_e8,settled_at=NOW()
    WHERE id=p.id;
  IF p.robot_instance_id IS NOT NULL THEN
    UPDATE veritas.robot_instances SET
      pnl_cents=pnl_cents + CASE WHEN v_won THEN v_profit ELSE -p.stake_cents END,
      wins=wins + CASE WHEN v_won THEN 1 ELSE 0 END,
      losses=losses + CASE WHEN v_won THEN 0 ELSE 1 END
    WHERE id=p.robot_instance_id;
  END IF;
  RETURN v_status;
END $$;

GRANT ALL ON ALL TABLES IN SCHEMA veritas TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA veritas TO service_role;
COMMIT;
