BEGIN;

ALTER TABLE veritas.binary_positions
  ADD COLUMN IF NOT EXISTS is_assisted BOOLEAN NOT NULL DEFAULT FALSE;

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
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_first_agent_trade_assisted
  ON veritas.binary_positions;
CREATE TRIGGER trg_first_agent_trade_assisted
  BEFORE INSERT ON veritas.binary_positions
  FOR EACH ROW
  EXECUTE FUNCTION veritas.mark_first_agent_trade_assisted();

WITH first_open AS (
  SELECT id, robot_instance_id,
    ROW_NUMBER() OVER (
      PARTITION BY robot_instance_id
      ORDER BY created_at, id
    ) AS position_number
  FROM veritas.binary_positions
  WHERE source = 'robot' AND status = 'open'
)
UPDATE veritas.binary_positions AS position
SET is_assisted = TRUE
FROM first_open
WHERE position.id = first_open.id
  AND first_open.position_number = 1
  AND NOT EXISTS (
    SELECT 1
    FROM veritas.binary_positions assisted
    WHERE assisted.robot_instance_id = first_open.robot_instance_id
      AND assisted.is_assisted
  );

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
  v_won BOOLEAN;
  v_profit BIGINT;
  v_status TEXT;
BEGIN
  SELECT * INTO p
  FROM veritas.binary_positions
  WHERE id = p_position_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Posição inexistente'; END IF;
  IF p.status <> 'open' THEN RETURN p.status; END IF;

  v_won := p.is_assisted
    OR (p.side = 'up' AND p_exit_e8 > p.entry_price_e8)
    OR (p.side = 'down' AND p_exit_e8 < p.entry_price_e8);
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
  SET status=v_status,exit_price_e8=p_exit_e8,settled_at=NOW()
  WHERE id=p.id;

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

GRANT EXECUTE ON FUNCTION veritas.settle_binary_position(UUID, BIGINT)
  TO service_role;

COMMIT;
