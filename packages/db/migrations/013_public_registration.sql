BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telefone TEXT;

CREATE OR REPLACE FUNCTION veritas.register_trading_user(
  p_email TEXT,
  p_username TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_password_hash TEXT
) RETURNS TABLE (
  profile_id UUID,
  account_id UUID,
  email TEXT,
  username TEXT,
  full_name TEXT,
  phone TEXT,
  cash_cents BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = veritas, public
AS $$
DECLARE
  v_profile_id UUID;
  v_account_id UUID;
  v_credit BIGINT := 1000000;
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE LOWER(TRIM(profiles.email)) = LOWER(TRIM(p_email))
  ) THEN
    RAISE EXCEPTION 'E-mail já cadastrado';
  END IF;

  INSERT INTO public.profiles (
    user_id,
    email,
    username,
    full_name,
    telefone,
    password_hash,
    status,
    login_target,
    veritas_access_enabled,
    created_at
  ) VALUES (
    gen_random_uuid(),
    LOWER(TRIM(p_email)),
    LOWER(TRIM(p_username)),
    TRIM(p_full_name),
    p_phone,
    p_password_hash,
    'user',
    'trading',
    TRUE,
    NOW()
  )
  RETURNING id INTO v_profile_id;

  INSERT INTO veritas.accounts (user_id, mode, currency)
  VALUES (v_profile_id, 'demo', 'BRL')
  RETURNING id INTO v_account_id;

  INSERT INTO veritas.ledger_entries
    (account_id, event_id, leg, bucket, amount, asset)
  VALUES
    (v_account_id, 'demo_credit:' || v_account_id, 'credit', 'cash', v_credit, 'BRL'),
    (v_account_id, 'demo_credit:' || v_account_id, 'debit', 'funding', -v_credit, 'BRL');

  RETURN QUERY
  SELECT
    v_profile_id,
    v_account_id,
    LOWER(TRIM(p_email)),
    LOWER(TRIM(p_username)),
    TRIM(p_full_name),
    p_phone,
    v_credit;
END;
$$;

REVOKE ALL ON FUNCTION veritas.register_trading_user(TEXT, TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION veritas.register_trading_user(TEXT, TEXT, TEXT, TEXT, TEXT)
  TO service_role;

COMMIT;
