export type AdminUser = {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  telefone: string | null;
  status: string | null;
  login_target: 'crm' | 'trading' | 'both';
  account_id: string | null;
  cash_cents: string;
  cash_display: string;
  veritas_access_enabled: boolean;
  created_at: string;
  outcome_policy_enabled: boolean;
  target_win_rate_bps: number;
  target_win_rate_pct: number;
  profit_alert_cents: string | null;
  profit_alert_display: string | null;
  profit_alert_reached: boolean;
  wins: number;
  losses: number;
  today_wins: number;
  today_losses: number;
  actual_win_rate_pct: number;
  today_win_rate_pct: number;
  net_profit_cents: string;
  net_profit_display: string;
};

export type AdminInstrument = {
  symbol: string;
  name: string;
  asset_class: 'crypto' | 'equity' | 'forex' | 'commodity' | 'index' | 'otc';
  quote_currency: string;
  base_price: number;
  volatility_bps: number;
  payout_pct: number;
  category: 'blitz' | 'binary' | 'digital' | 'margin';
  products_enabled: string[];
  is_active: boolean;
};

export type AdminRobot = {
  id: string;
  email: string;
  full_name: string | null;
  profile_code: string;
  status: string;
  allocation_cents: string;
  pnl_cents: string;
  wins: number;
  losses: number;
  started_at: string;
  stop_at: string;
};
