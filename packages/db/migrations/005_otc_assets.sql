-- Ativos OTC / FX / crypto das telas iniciais (F1+)
BEGIN;

-- Ampliar asset_class se necessário
ALTER TABLE veritas.instruments DROP CONSTRAINT IF EXISTS instruments_asset_class_check;
ALTER TABLE veritas.instruments
  ADD CONSTRAINT instruments_asset_class_check
  CHECK (asset_class IN ('crypto', 'equity', 'forex', 'commodity', 'index', 'otc'));

INSERT INTO veritas.instruments (symbol, name, asset_class, quote_currency, qty_decimals, tick_size, products_enabled, is_active)
VALUES
  ('OPENAI_OTC', 'OpenAI (OTC)', 'otc', 'USD', 4, 1, ARRAY['binary','blitz'], TRUE),
  ('EURUSD_OTC', 'EUR/USD (OTC)', 'forex', 'USD', 5, 1, ARRAY['binary','blitz'], TRUE),
  ('EURGBP_OTC', 'EUR/GBP (OTC)', 'forex', 'GBP', 5, 1, ARRAY['binary','blitz'], TRUE),
  ('USDDOP_OTC', 'USD/DOP (OTC)', 'forex', 'DOP', 4, 1, ARRAY['binary','blitz'], TRUE),
  ('VAULTA_OTC', 'Vaulta (OTC)', 'crypto', 'USD', 6, 1, ARRAY['binary','blitz'], TRUE),
  ('URANIUM_OTC', 'Uranium (OTC)', 'commodity', 'USD', 4, 1, ARRAY['binary','digital'], TRUE),
  ('WLD_OTC', 'Worldcoin (OTC)', 'crypto', 'USD', 6, 1, ARRAY['binary','blitz'], TRUE),
  ('AIG_OTC', 'AIG (OTC)', 'equity', 'USD', 4, 1, ARRAY['binary','digital'], TRUE),
  ('AMZN_OTC', 'Amazon (OTC)', 'equity', 'USD', 4, 1, ARRAY['binary','digital'], TRUE),
  ('AMZN_BABA_OTC', 'Amazon/Alibaba (OTC)', 'equity', 'USD', 6, 1, ARRAY['binary','digital'], TRUE),
  ('AMZN_EBAY_OTC', 'Amazon/Ebay (OTC)', 'equity', 'USD', 6, 1, ARRAY['binary','digital'], TRUE),
  ('AAPL_OTC', 'Apple (OTC)', 'equity', 'USD', 4, 1, ARRAY['binary','digital'], TRUE),
  ('ATOM_OTC', 'Cosmos (OTC)', 'crypto', 'USD', 6, 1, ARRAY['binary','blitz'], TRUE),
  ('AUDJPY_OTC', 'AUD/JPY (OTC)', 'forex', 'JPY', 4, 1, ARRAY['binary','blitz'], TRUE),
  ('ANTHROPIC_OTC', 'Anthropic (OTC)', 'otc', 'USD', 4, 1, ARRAY['binary','digital'], TRUE),
  ('BCH_OTC', 'Bitcoin Cash (OTC)', 'crypto', 'USD', 4, 1, ARRAY['binary','blitz'], TRUE),
  ('BTCUSD_OTC', 'BTC/USD (OTC)', 'crypto', 'USD', 2, 1, ARRAY['binary','blitz'], TRUE),
  ('CADCHF_OTC', 'CAD/CHF (OTC)', 'forex', 'CHF', 6, 1, ARRAY['binary','blitz'], TRUE),
  ('CASINO_OTC', 'Casino (OTC)', 'otc', 'USD', 3, 1, ARRAY['binary','digital'], TRUE),
  ('CHFJPY_OTC', 'CHF/JPY (OTC)', 'forex', 'JPY', 4, 1, ARRAY['binary','blitz'], TRUE),
  ('CHFNOK_OTC', 'CHF/NOK (OTC)', 'forex', 'NOK', 5, 1, ARRAY['binary','blitz'], TRUE),
  ('COFFEE_OTC', 'Café (OTC)', 'commodity', 'USD', 2, 1, ARRAY['binary','digital'], TRUE),
  ('COTTON_OTC', 'Algodão (OTC)', 'commodity', 'USD', 2, 1, ARRAY['binary','digital'], TRUE),
  ('DASH_OTC', 'Dash (OTC)', 'crypto', 'USD', 4, 1, ARRAY['binary','blitz'], TRUE),
  ('ETHUSD_OTC', 'ETH/USD (OTC)', 'crypto', 'USD', 2, 1, ARRAY['binary','blitz'], TRUE),
  ('EU50_OTC', 'EU 50 (OTC)', 'index', 'EUR', 2, 1, ARRAY['binary','digital'], TRUE),
  ('EURAUD_OTC', 'EUR/AUD (OTC)', 'forex', 'AUD', 5, 1, ARRAY['binary','blitz'], TRUE),
  ('EURCAD_OTC', 'EUR/CAD (OTC)', 'forex', 'CAD', 5, 1, ARRAY['binary','blitz'], TRUE),
  ('EURCHF_OTC', 'EUR/CHF (OTC)', 'forex', 'CHF', 5, 1, ARRAY['binary','blitz'], TRUE),
  ('META_OTC', 'Meta (OTC)', 'equity', 'USD', 2, 1, ARRAY['binary','digital'], TRUE),
  ('FLOKI_OTC', 'Floki (OTC)', 'crypto', 'USD', 8, 1, ARRAY['binary','blitz'], TRUE)
ON CONFLICT (symbol) DO UPDATE SET
  name = EXCLUDED.name,
  asset_class = EXCLUDED.asset_class,
  products_enabled = EXCLUDED.products_enabled,
  is_active = EXCLUDED.is_active;

COMMIT;
