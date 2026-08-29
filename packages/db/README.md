# Migrações VeritasTrader

Aplique **nesta ordem** no SQL Editor do Supabase (mesmo projeto do Zaploto):

1. `001_foundation.sql` — schema `veritas` + `profiles.login_target`
2. `002_seed_instruments.sql` — instrumentos
3. `003_grants.sql` — grants
4. `004_crm_users_both.sql` — contas CRM (`crm` → `both`) mantêm CRM e ganham Veritas

Depois, no Dashboard Supabase → **Settings → API → Exposed schemas**, inclua `veritas` (além de `public`).

Padrão de acesso:

| login_target | Zaploto CRM | VeritasTrader |
|--------------|-------------|---------------|
| `both` (padrão) | sim | sim |
| `crm` | sim | sim (legado) |
| `trading` | não | sim |

Para conta **só trading** (sem CRM):

```sql
UPDATE public.profiles
SET login_target = 'trading'
WHERE email = 'trader@email.com';
```
