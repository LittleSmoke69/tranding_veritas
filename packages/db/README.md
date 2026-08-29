# Migrações VeritasTrader

Aplique **nesta ordem** no SQL Editor do Supabase (mesmo projeto do Zaploto):

1. `001_foundation.sql` — schema `veritas` + `profiles.login_target`
2. `002_seed_instruments.sql` — instrumentos
3. `003_grants.sql` — grants

Depois, no Dashboard Supabase → **Settings → API → Exposed schemas**, inclua `veritas` (além de `public`).

Para liberar um usuário de teste:

```sql
UPDATE public.profiles
SET login_target = 'both'
WHERE email = 'seu@email.com';
-- ou username:
-- WHERE username ILIKE 'seuuser';
```
