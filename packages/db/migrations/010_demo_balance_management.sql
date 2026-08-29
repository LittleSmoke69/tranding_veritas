BEGIN;

CREATE OR REPLACE FUNCTION veritas.set_demo_balance(
  p_user_id UUID,
  p_target_cents BIGINT,
  p_event_key TEXT
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = veritas, public
AS $$
DECLARE
  v_account_id UUID;
  v_current BIGINT;
  v_delta BIGINT;
  v_event TEXT;
BEGIN
  IF p_target_cents < 0 THEN
    RAISE EXCEPTION 'O saldo não pode ser negativo';
  END IF;

  SELECT id INTO v_account_id
  FROM veritas.accounts
  WHERE user_id = p_user_id AND mode = 'demo';

  IF v_account_id IS NULL THEN
    RAISE EXCEPTION 'Conta virtual não encontrada';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_account_id::text));

  SELECT COALESCE(SUM(amount), 0) INTO v_current
  FROM veritas.ledger_entries
  WHERE account_id = v_account_id AND bucket = 'cash' AND asset = 'BRL';

  v_delta := p_target_cents - v_current;
  IF v_delta = 0 THEN
    RETURN v_current;
  END IF;

  v_event := 'demo_balance_set:' ||
    regexp_replace(p_event_key, '[^a-zA-Z0-9_-]', '', 'g');

  INSERT INTO veritas.ledger_entries
    (account_id, event_id, leg, bucket, amount, asset)
  VALUES
    (
      v_account_id,
      v_event,
      CASE WHEN v_delta > 0 THEN 'credit' ELSE 'debit' END,
      'cash',
      v_delta,
      'BRL'
    ),
    (
      v_account_id,
      v_event,
      CASE WHEN v_delta > 0 THEN 'debit' ELSE 'credit' END,
      'funding',
      v_delta * -1,
      'BRL'
    )
  ON CONFLICT DO NOTHING;

  SELECT COALESCE(SUM(amount), 0) INTO v_current
  FROM veritas.ledger_entries
  WHERE account_id = v_account_id AND bucket = 'cash' AND asset = 'BRL';

  RETURN v_current;
END;
$$;

REVOKE ALL ON FUNCTION veritas.set_demo_balance(UUID, BIGINT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION veritas.set_demo_balance(UUID, BIGINT, TEXT)
  TO service_role;

COMMIT;
