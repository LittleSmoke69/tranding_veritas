-- Contas CRM passam a ter acesso também à Veritas (mantêm o CRM).
-- trading puro continua exclusivo da plataforma de trading.

BEGIN;

ALTER TABLE public.profiles
  ALTER COLUMN login_target SET DEFAULT 'both';

UPDATE public.profiles
SET login_target = 'both'
WHERE login_target = 'crm';

COMMENT ON COLUMN public.profiles.login_target IS
  'crm = só Zaploto (legado); trading = só Veritas; both = CRM + Veritas (padrão)';

COMMIT;
