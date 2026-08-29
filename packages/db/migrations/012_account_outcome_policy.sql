BEGIN;

CREATE TABLE IF NOT EXISTS veritas.account_outcome_policies (
  account_id UUID PRIMARY KEY REFERENCES veritas.accounts(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  target_win_rate_bps INT NOT NULL DEFAULT 5000
    CHECK (target_win_rate_bps BETWEEN 0 AND 10000),
  profit_alert_cents BIGINT
    CHECK (profit_alert_cents IS NULL OR profit_alert_cents > 0),
  updated_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE veritas.binary_positions
  ADD COLUMN IF NOT EXISTS assistance_reason TEXT;

UPDATE veritas.binary_positions
SET assistance_reason = 'initial_agent_trade'
WHERE is_assisted AND assistance_reason IS NULL;

CREATE INDEX IF NOT EXISTS idx_binary_positions_account_settled
  ON veritas.binary_positions (account_id, settled_at DESC)
  WHERE status <> 'open';

CREATE OR REPLACE FUNCTION veritas.mark_first_agent_trade_assisted()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.source = 'robot'
    AND NEW.robot_instance_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM veritas.binary_positions
      WHERE robot_instance_id = NEW.robot_instance_id
    )
  THEN
    NEW.is_assisted := TRUE;
    NEW.assistance_reason := 'initial_agent_trade';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION veritas.settle_binary_position(
  p_position_id UUID,
  p_exit_e8 BIGINT
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = veritas, public
AS $$
DECLARE
  p veritas.binary_positions%ROWTYPE;
  v_policy veritas.account_outcome_policies%ROWTYPE;
  v_won BOOLEAN;
  v_profit BIGINT;
  v_status TEXT;
  v_prior_wins BIGINT;
  v_prior_total BIGINT;
  v_required_wins BIGINT;
  v_assistance_reason TEXT;
BEGIN
  SELECT * INTO p
  FROM veritas.binary_positions
  WHERE id = p_position_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Posição inexistente'; END IF;
  IF p.status <> 'open' THEN RETURN p.status; END IF;

  PERFORM pg_advisory_xact_lock(hashtext(p.account_id::text));

  SELECT * INTO v_policy
  FROM veritas.account_outcome_policies
  WHERE account_id = p.account_id AND enabled
  FOR UPDATE;

  IF FOUND THEN
    SELECT
      COUNT(*) FILTER (WHERE status = 'won'),
      COUNT(*)
    INTO v_prior_wins, v_prior_total
    FROM veritas.binary_positions
    WHERE account_id = p.account_id AND status <> 'open';

    v_required_wins := ROUND(
      ((v_prior_total + 1)::numeric * v_policy.target_win_rate_bps) / 10000
    )::bigint;
    v_won := v_prior_wins < v_required_wins;
    v_assistance_reason := 'account_win_rate_policy';
  ELSIF p.is_assisted THEN
    v_won := TRUE;
    v_assistance_reason := COALESCE(p.assistance_reason, 'initial_agent_trade');
  ELSE
    v_won := (p.side = 'up' AND p_exit_e8 > p.entry_price_e8)
      OR (p.side = 'down' AND p_exit_e8 < p.entry_price_e8);
    v_assistance_reason := NULL;
  END IF;

  v_status := CASE WHEN v_won THEN 'won' ELSE 'lost' END;
  v_profit := ROUND((p.stake_cents::numeric * p.profit_pct) / 100)::bigint;

  IF v_won THEN
    INSERT INTO veritas.ledger_entries
      (account_id,event_id,leg,bucket,amount,asset)
    VALUES
      (p.account_id,'binary_settle:'||p.id,'debit','binary_stake',-p.stake_cents,'BRL'),
      (p.account_id,'binary_settle:'||p.id,'credit','cash',p.stake_cents+v_profit,'BRL'),
      (p.account_id,'binary_settle:'||p.id,'debit','realized_pnl',-v_profit,'BRL')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO veritas.ledger_entries
      (account_id,event_id,leg,bucket,amount,asset)
    VALUES
      (p.account_id,'binary_settle:'||p.id,'debit','binary_stake',-p.stake_cents,'BRL'),
      (p.account_id,'binary_settle:'||p.id,'credit','realized_pnl',p.stake_cents,'BRL')
    ON CONFLICT DO NOTHING;
  END IF;

  UPDATE veritas.binary_positions
  SET
    status = v_status,
    exit_price_e8 = p_exit_e8,
    settled_at = NOW(),
    is_assisted = v_assistance_reason IS NOT NULL,
    assistance_reason = v_assistance_reason
  WHERE id = p.id;

  IF p.robot_instance_id IS NOT NULL THEN
    UPDATE veritas.robot_instances
    SET
      pnl_cents=pnl_cents + CASE WHEN v_won THEN v_profit ELSE -p.stake_cents END,
      wins=wins + CASE WHEN v_won THEN 1 ELSE 0 END,
      losses=losses + CASE WHEN v_won THEN 0 ELSE 1 END
    WHERE id=p.robot_instance_id;
  END IF;

  RETURN v_status;
END;
$$;

REVOKE ALL ON veritas.account_outcome_policies
  FROM PUBLIC, anon, authenticated;
GRANT ALL ON veritas.account_outcome_policies TO service_role;
GRANT EXECUTE ON FUNCTION veritas.settle_binary_position(UUID, BIGINT)
  TO service_role;

COMMIT;
