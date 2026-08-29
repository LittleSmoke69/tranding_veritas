export type AssetCategory = 'blitz' | 'binary' | 'digital' | 'margin' | 'watchlist' | 'trends';

export type TradingAsset = {
  symbol: string;
  name: string;
  label: string;
  price: number;
  profitPct: number;
  change5mPct: number;
  popularity: 1 | 2 | 3;
  volatility: 1 | 2 | 3;
  category: AssetCategory;
  assetClass: 'forex' | 'crypto' | 'equity' | 'commodity' | 'index' | 'otc';
  flag?: string;
  /** Símbolo TradingView `EXCHANGE:TICKER` quando existir no índice TV. */
  tvSymbol?: string;
};

/** Catálogo inicial + mapeamento TradingView para referência de mercado. */
export const TRADING_ASSETS: TradingAsset[] = [
  { symbol: 'OPENAI_OTC', name: 'OpenAI', label: 'OpenAI (OTC)', price: 121.79, profitPct: 85, change5mPct: -0.42, popularity: 3, volatility: 3, category: 'blitz', assetClass: 'otc', flag: '🤖' },
  { symbol: 'EURUSD_OTC', name: 'EUR/USD', label: 'EUR/USD (OTC)', price: 1.08452, profitPct: 85, change5mPct: 0.12, popularity: 3, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇪🇺', tvSymbol: 'FX:EURUSD' },
  { symbol: 'EURGBP_OTC', name: 'EUR/GBP', label: 'EUR/GBP (OTC)', price: 0.86214, profitPct: 85, change5mPct: -0.08, popularity: 2, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇬🇧', tvSymbol: 'FX:EURGBP' },
  { symbol: 'USDDOP_OTC', name: 'USD/DOP', label: 'USD/DOP (OTC)', price: 60.125, profitPct: 84, change5mPct: 0.05, popularity: 1, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇩🇴', tvSymbol: 'FX_IDC:USDDOP' },
  { symbol: 'VAULTA_OTC', name: 'Vaulta', label: 'Vaulta (OTC)', price: 4.218, profitPct: 85, change5mPct: 1.24, popularity: 2, volatility: 3, category: 'digital', assetClass: 'crypto', flag: '🔷' },
  { symbol: 'URANIUM_OTC', name: 'Uranium', label: 'Uranium (OTC)', price: 78.45, profitPct: 84, change5mPct: -0.55, popularity: 2, volatility: 2, category: 'digital', assetClass: 'commodity', flag: '⚛️', tvSymbol: 'NASDAQ:URA' },
  { symbol: 'WLD_OTC', name: 'Worldcoin', label: 'Worldcoin (OTC)', price: 2.184, profitPct: 85, change5mPct: 0.88, popularity: 2, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '🌐', tvSymbol: 'BINANCE:WLDUSDT' },
  { symbol: 'AIG_OTC', name: 'AIG', label: 'AIG (OTC)', price: 72.2545, profitPct: 85, change5mPct: 0.31, popularity: 3, volatility: 2, category: 'digital', assetClass: 'equity', flag: '🇺🇸', tvSymbol: 'NYSE:AIG' },
  { symbol: 'AMZN_OTC', name: 'Amazon', label: 'Amazon (OTC)', price: 259.9702, profitPct: 85, change5mPct: -0.18, popularity: 3, volatility: 2, category: 'digital', assetClass: 'equity', flag: '🇺🇸', tvSymbol: 'NASDAQ:AMZN' },
  { symbol: 'AMZN_BABA_OTC', name: 'Amazon/Alibaba', label: 'Amazon/Alibaba (OTC)', price: 2.424525, profitPct: 85, change5mPct: 0.22, popularity: 2, volatility: 3, category: 'digital', assetClass: 'equity', flag: '🔀' },
  { symbol: 'AMZN_EBAY_OTC', name: 'Amazon/Ebay', label: 'Amazon/Ebay (OTC)', price: 2.213915, profitPct: 84, change5mPct: -0.11, popularity: 2, volatility: 2, category: 'digital', assetClass: 'equity', flag: '🔀' },
  { symbol: 'AAPL_OTC', name: 'Apple', label: 'Apple (OTC)', price: 324.38, profitPct: 85, change5mPct: 0.45, popularity: 3, volatility: 2, category: 'digital', assetClass: 'equity', flag: '🇺🇸', tvSymbol: 'NASDAQ:AAPL' },
  { symbol: 'ATOM_OTC', name: 'Cosmos', label: 'Cosmos (OTC)', price: 1.444975, profitPct: 84, change5mPct: -1.02, popularity: 2, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '⚛️', tvSymbol: 'BINANCE:ATOMUSDT' },
  { symbol: 'AUDJPY_OTC', name: 'AUD/JPY', label: 'AUD/JPY (OTC)', price: 112.1909, profitPct: 85, change5mPct: 0.09, popularity: 2, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇯🇵', tvSymbol: 'FX:AUDJPY' },
  { symbol: 'ANTHROPIC_OTC', name: 'Anthropic', label: 'Anthropic (OTC)', price: 189.1033, profitPct: 85, change5mPct: 0.67, popularity: 3, volatility: 3, category: 'digital', assetClass: 'otc', flag: '🧠' },
  { symbol: 'BCH_OTC', name: 'Bitcoin Cash', label: 'Bitcoin Cash (OTC)', price: 233.3089, profitPct: 85, change5mPct: -0.33, popularity: 2, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '₿', tvSymbol: 'BINANCE:BCHUSDT' },
  { symbol: 'BTCUSD_OTC', name: 'BTC/USD', label: 'BTC/USD (OTC)', price: 76324.57, profitPct: 85, change5mPct: 0.51, popularity: 3, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '₿', tvSymbol: 'BINANCE:BTCUSDT' },
  { symbol: 'CADCHF_OTC', name: 'CAD/CHF', label: 'CAD/CHF (OTC)', price: 0.566745, profitPct: 85, change5mPct: -0.04, popularity: 1, volatility: 1, category: 'blitz', assetClass: 'forex', flag: '🇨🇭', tvSymbol: 'FX:CADCHF' },
  { symbol: 'CASINO_OTC', name: 'Casino', label: 'Casino (OTC)', price: 2484.107, profitPct: 85, change5mPct: 1.15, popularity: 2, volatility: 3, category: 'digital', assetClass: 'otc', flag: '🎰' },
  { symbol: 'CHFJPY_OTC', name: 'CHF/JPY', label: 'CHF/JPY (OTC)', price: 197.9205, profitPct: 85, change5mPct: 0.14, popularity: 2, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇯🇵', tvSymbol: 'FX:CHFJPY' },
  { symbol: 'CHFNOK_OTC', name: 'CHF/NOK', label: 'CHF/NOK (OTC)', price: 11.44666, profitPct: 85, change5mPct: -0.92, popularity: 2, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇳🇴', tvSymbol: 'FX:CHFNOK' },
  { symbol: 'COFFEE_OTC', name: 'Café', label: 'Café (OTC)', price: 348.22, profitPct: 85, change5mPct: 0.28, popularity: 2, volatility: 2, category: 'digital', assetClass: 'commodity', flag: '☕', tvSymbol: 'TVC:CAFE' },
  { symbol: 'COTTON_OTC', name: 'Algodão', label: 'Algodão (OTC)', price: 84.55, profitPct: 85, change5mPct: -0.19, popularity: 1, volatility: 2, category: 'digital', assetClass: 'commodity', flag: '🌿', tvSymbol: 'TVC:COTTON' },
  { symbol: 'DASH_OTC', name: 'Dash', label: 'Dash (OTC)', price: 28.44, profitPct: 84, change5mPct: -0.71, popularity: 1, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '💠', tvSymbol: 'BINANCE:DASHUSDT' },
  { symbol: 'ETHUSD_OTC', name: 'ETH/USD', label: 'ETH/USD (OTC)', price: 3488.12, profitPct: 85, change5mPct: 0.36, popularity: 3, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: 'Ξ', tvSymbol: 'BINANCE:ETHUSDT' },
  { symbol: 'EU50_OTC', name: 'EU 50', label: 'EU 50 (OTC)', price: 5124.8, profitPct: 84, change5mPct: -0.22, popularity: 2, volatility: 2, category: 'digital', assetClass: 'index', flag: '🇪🇺', tvSymbol: 'PEPPERSTONE:EU50' },
  { symbol: 'EURAUD_OTC', name: 'EUR/AUD', label: 'EUR/AUD (OTC)', price: 1.6521, profitPct: 85, change5mPct: 0.07, popularity: 2, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇦🇺', tvSymbol: 'FX:EURAUD' },
  { symbol: 'EURCAD_OTC', name: 'EUR/CAD', label: 'EUR/CAD (OTC)', price: 1.4892, profitPct: 85, change5mPct: -0.06, popularity: 2, volatility: 2, category: 'blitz', assetClass: 'forex', flag: '🇨🇦', tvSymbol: 'FX:EURCAD' },
  { symbol: 'EURCHF_OTC', name: 'EUR/CHF', label: 'EUR/CHF (OTC)', price: 0.9418, profitPct: 85, change5mPct: 0.03, popularity: 2, volatility: 1, category: 'blitz', assetClass: 'forex', flag: '🇨🇭', tvSymbol: 'FX:EURCHF' },
  { symbol: 'META_OTC', name: 'Meta', label: 'Meta (OTC)', price: 612.4, profitPct: 85, change5mPct: 0.41, popularity: 3, volatility: 2, category: 'digital', assetClass: 'equity', flag: '🇺🇸', tvSymbol: 'NASDAQ:META' },
  { symbol: 'FLOKI_OTC', name: 'Floki', label: 'Floki (OTC)', price: 0.000148, profitPct: 85, change5mPct: 2.1, popularity: 2, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '🐶', tvSymbol: 'BINANCE:FLOKIUSDT' },
  { symbol: 'BTCBRL', name: 'Bitcoin / BRL', label: 'BTC/BRL', price: 428500, profitPct: 85, change5mPct: 0.48, popularity: 3, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '🇧🇷', tvSymbol: 'BINANCE:BTCBRL' },
  { symbol: 'ETHBRL', name: 'Ethereum / BRL', label: 'ETH/BRL', price: 19840, profitPct: 85, change5mPct: 0.29, popularity: 3, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '🇧🇷', tvSymbol: 'BINANCE:ETHBRL' },
  { symbol: 'SOLBRL', name: 'Solana / BRL', label: 'SOL/BRL', price: 842.5, profitPct: 84, change5mPct: -0.62, popularity: 2, volatility: 3, category: 'blitz', assetClass: 'crypto', flag: '🇧🇷', tvSymbol: 'BINANCE:SOLBRL' },
  { symbol: 'PETR4', name: 'Petrobras PN', label: 'PETR4', price: 38.42, profitPct: 82, change5mPct: 0.55, popularity: 3, volatility: 2, category: 'margin', assetClass: 'equity', flag: '🇧🇷', tvSymbol: 'BMFBOVESPA:PETR4' },
  { symbol: 'VALE3', name: 'Vale ON', label: 'VALE3', price: 58.1, profitPct: 82, change5mPct: -0.27, popularity: 3, volatility: 2, category: 'margin', assetClass: 'equity', flag: '🇧🇷', tvSymbol: 'BMFBOVESPA:VALE3' },
  { symbol: 'ITUB4', name: 'Itaú PN', label: 'ITUB4', price: 34.88, profitPct: 81, change5mPct: 0.14, popularity: 2, volatility: 1, category: 'margin', assetClass: 'equity', flag: '🇧🇷', tvSymbol: 'BMFBOVESPA:ITUB4' },
];

export function findAsset(symbol: string): TradingAsset {
  return TRADING_ASSETS.find((a) => a.symbol === symbol) ?? TRADING_ASSETS[0];
}

export function formatAssetPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
}

const CATEGORY_LABEL: Record<AssetCategory, string> = {
  blitz: 'Blitz',
  binary: 'Binárias',
  digital: 'Digital',
  margin: 'Margem',
  watchlist: 'Watchlist',
  trends: 'Tendências',
};

/** Rótulo de modo exibido como subtítulo da aba e no cabeçalho do gráfico. */
export function categoryLabel(category: AssetCategory): string {
  return CATEGORY_LABEL[category];
}

/** Monograma de 1–2 caracteres usado no selo vetorial do ativo. */
export function assetMonogram(asset: TradingAsset): string {
  const pair = asset.name.match(/^([A-Z]{3})\/([A-Z]{3})$/);
  if (pair) return pair[1].slice(0, 1) + pair[2].slice(0, 1);
  const words = asset.name.replace(/[^\p{L}\p{N} /]/gu, '').split(/[\s/]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return asset.name.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase();
}
