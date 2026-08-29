export type AssetClass = 'crypto' | 'equity';
export type ProductKind = 'spot' | 'margin' | 'binary';
export type AccountMode = 'demo' | 'live';
export type LedgerLeg = 'debit' | 'credit';
export type LedgerBucket =
  | 'cash'
  | 'spot_holding'
  | 'cfd_margin'
  | 'binary_stake'
  | 'realized_pnl'
  | 'fee'
  | 'funding';

export type LoginTarget = 'crm' | 'trading' | 'both';

export interface Instrument {
  symbol: string;
  name: string;
  asset_class: AssetClass;
  quote_currency: string;
  qty_decimals: number;
  tick_size: bigint;
  products_enabled: ProductKind[];
  is_active: boolean;
}

export interface Account {
  id: string;
  user_id: string;
  mode: AccountMode;
  currency: string;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  account_id: string;
  event_id: string;
  leg: LedgerLeg;
  bucket: LedgerBucket;
  /** Centavos com sinal (partida dobrada). */
  amount: bigint;
  asset: string;
  created_at: string;
}
