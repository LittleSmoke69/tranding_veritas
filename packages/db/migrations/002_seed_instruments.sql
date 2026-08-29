-- Seed de instrumentos (F1)
BEGIN;

INSERT INTO veritas.instruments (symbol, name, asset_class, quote_currency, qty_decimals, tick_size, products_enabled, is_active)
VALUES
  ('BTCBRL', 'Bitcoin / BRL', 'crypto', 'BRL', 8, 1, ARRAY['spot','margin','binary'], TRUE),
  ('ETHBRL', 'Ethereum / BRL', 'crypto', 'BRL', 8, 1, ARRAY['spot','margin','binary'], TRUE),
  ('SOLBRL', 'Solana / BRL', 'crypto', 'BRL', 8, 1, ARRAY['spot','margin','binary'], TRUE),
  ('BNBBRL', 'BNB / BRL', 'crypto', 'BRL', 8, 1, ARRAY['spot','margin','binary'], TRUE),
  ('PETR4', 'Petrobras PN', 'equity', 'BRL', 0, 1, ARRAY['spot','margin'], TRUE),
  ('VALE3', 'Vale ON', 'equity', 'BRL', 0, 1, ARRAY['spot','margin'], TRUE),
  ('ITUB4', 'Itaú PN', 'equity', 'BRL', 0, 1, ARRAY['spot','margin'], TRUE)
ON CONFLICT (symbol) DO UPDATE SET
  name = EXCLUDED.name,
  products_enabled = EXCLUDED.products_enabled,
  is_active = EXCLUDED.is_active;

COMMIT;
