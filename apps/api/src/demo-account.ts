import { DEMO_CREDIT_CENTS } from '@veritas/shared';
import { assertUuid, pgQuery } from './pg.js';

export type DemoAccount = {
  id: string;
  user_id: string;
  mode: 'demo' | 'live';
  currency: string;
  created_at: string;
};

/**
 * Garante account demo + crédito virtual R$ 10.000 via ledger append-only.
 * event_id estável: demo_credit:{accountId} — reenvio não duplica.
 */
export async function ensureDemoAccount(userId: string): Promise<{
  account: DemoAccount;
  cashCents: string;
  created: boolean;
}> {
  const uid = assertUuid(userId, 'user_id');

  const existing = await pgQuery<DemoAccount>(`
    SELECT id, user_id, mode, currency, created_at::text AS created_at
    FROM veritas.accounts
    WHERE user_id = '${uid}'::uuid AND mode = 'demo'
    LIMIT 1
  `);

  let account = existing[0] ?? null;
  let created = false;

  if (!account) {
    const inserted = await pgQuery<DemoAccount>(`
      INSERT INTO veritas.accounts (user_id, mode, currency)
      VALUES ('${uid}'::uuid, 'demo', 'BRL')
      ON CONFLICT (user_id, mode) DO UPDATE SET currency = veritas.accounts.currency
      RETURNING id, user_id, mode, currency, created_at::text AS created_at
    `);
    account = inserted[0] ?? null;
    if (!account) throw new Error('Não foi possível criar a conta.');
    created = true;
  }

  const accountId = assertUuid(account.id, 'account_id');
  const eventId = `demo_credit:${accountId}`;

  const prior = await pgQuery<{ id: string }>(`
    SELECT id FROM veritas.ledger_entries
    WHERE account_id = '${accountId}'::uuid
      AND event_id = '${eventId}'
    LIMIT 1
  `);

  if (!prior.length) {
    const credit = DEMO_CREDIT_CENTS.toString();
    try {
      await pgQuery(`
        INSERT INTO veritas.ledger_entries
          (account_id, event_id, leg, bucket, amount, asset)
        VALUES
          ('${accountId}'::uuid, '${eventId}', 'credit', 'cash', ${credit}, 'BRL'),
          ('${accountId}'::uuid, '${eventId}', 'debit', 'funding', -${credit}, 'BRL')
      `);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!/duplicate|unique/i.test(msg)) throw err;
    }
  }

  const cashCents = await sumCash(accountId);
  return { account, cashCents: cashCents.toString(), created };
}

export async function sumCash(accountId: string): Promise<bigint> {
  const id = assertUuid(accountId, 'account_id');
  const rows = await pgQuery<{ total: string | number | null }>(`
    SELECT COALESCE(SUM(amount), 0)::text AS total
    FROM veritas.ledger_entries
    WHERE account_id = '${id}'::uuid
      AND bucket = 'cash'
      AND asset = 'BRL'
  `);
  return BigInt(rows[0]?.total ?? '0');
}
