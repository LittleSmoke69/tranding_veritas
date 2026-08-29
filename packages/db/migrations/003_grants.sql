-- Expor schema veritas no PostgREST (Supabase Dashboard → Settings → API → Exposed schemas)
-- Ou rode via SQL se usar config customizada.
-- Nota: no Supabase hosted, adicione "veritas" em db-schemas / Exposed schemas.

GRANT USAGE ON SCHEMA veritas TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA veritas TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA veritas TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA veritas GRANT ALL ON TABLES TO service_role;
