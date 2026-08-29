# VeritasTrader — Invariantes e antipadrões

Ambiente: **SIMULAÇÃO**. Nenhum valor real é movimentado.

## Invariantes (não negociáveis)

- **I1** Dinheiro é inteiro (BIGINT centavos / qty 1e-8). Sem FLOAT/DOUBLE/REAL.
- **I2** Ledger append-only. Nenhum UPDATE de saldo.
- **I3** Partida dobrada: SUM(amount) = 0.
- **I4** Patrimônio é derivado (`derive`), nunca coluna fonte de verdade.
- **I5** Idempotência via `client_order_id` / `event_id` estável.
- **I6** Motor de risco puro (tempo e preço entram como parâmetro).
- **I7** Carimbo de SIMULAÇÃO permanente na UI; depósito virtual explícito.

## Antipadrões

RUIM: `UPDATE accounts SET balance = ...`  
BOM: `INSERT INTO ledger_entries ...` (débito + crédito).

RUIM: `(price - entry) * qty` com float  
BOM: aritmética `Money` só com inteiros.

RUIM: três saldos por produto  
BOM: um ledger, buckets diferentes.
