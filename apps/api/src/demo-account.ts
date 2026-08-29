import { DEMO_CREDIT_CENTS } from '@veritas/shared';
import { veritasDb } from './db.js';

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
  const vdb = veritasDb();

  const { data: existing, error: findErr } = await vdb
    .from('accounts')
    .select('id, user_id, mode, currency, created_at')
    .eq('user_id', userId)
    .eq('mode', 'demo')
    .maybeSingle();
  if (findErr) throw new Error(`accounts: ${findErr.message}`);

  let account = existing as DemoAccount | null;
  let created = false;

  if (!account) {
    const { data: inserted, error: insErr } = await vdb
      .from('accounts')
      .insert({ user_id: userId, mode: 'demo', currency: 'BRL' })
      .select('id, user_id, mode, currency, created_at')
      .single();
    if (insErr) throw new Error(`criar account: ${insErr.message}`);
    account = inserted as DemoAccount;
    created = true;
  }

  const eventId = `demo_credit:${account.id}`;
  const { data: prior } = await vdb
    .from('ledger_entries')
    .select('id')
    .eq('account_id', account.id)
    .eq('event_id', eventId)
    .limit(1);

  if (!prior?.length) {
    const credit = DEMO_CREDIT_CENTS;
    const rows = [
      {
        account_id: account.id,
        event_id: eventId,
        leg: 'credit',
        bucket: 'cash',
        amount: credit.toString(),
        asset: 'BRL',
      },
      {
        account_id: account.id,
        event_id: eventId,
        leg: 'debit',
        bucket: 'funding',
        amount: (-credit).toString(),
        asset: 'BRL',
      },
    ];
    const { error: ledErr } = await vdb.from('ledger_entries').insert(rows);
    if (ledErr) {
      // corrida idempotente
      if (!/duplicate|unique/i.test(ledErr.message)) {
        throw new Error(`ledger demo: ${ledErr.message}`);
      }
    }
  }

  const cashCents = await sumCash(account.id);
  return { account, cashCents: cashCents.toString(), created };
}

export async function sumCash(accountId: string): Promise<bigint> {
  const { data, error } = await veritasDb()
    .from('ledger_entries')
    .select('amount')
    .eq('account_id', accountId)
    .eq('bucket', 'cash')
    .eq('asset', 'BRL');
  if (error) throw new Error(`sum cash: ${error.message}`);
  let total = 0n;
  for (const row of data || []) {
    total += BigInt(row.amount as number | string);
  }
  return total;
}
