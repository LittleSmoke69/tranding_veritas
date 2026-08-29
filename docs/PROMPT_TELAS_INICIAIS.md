# Prompt — Telas iniciais VeritasTrader (terminal)

## Objetivo
Montar o terminal de trading pós-login no estilo IQ Option (layout funcional), com branding Veritas Finance Academy e paleta azul/cyan — sem menções a CRM ou “simulação” na UI.

## Layout (desktop-first)
1. **Header:** logo Veritas | abas de ativos abertos (+ Blitz) | saldo em destaque cyan | botão Depositar (verde) | avatar/sair
2. **Nav esquerda (ícones):** Portfólio, Histórico, Desempenho, Chats, Tutoriais, Promoções, Líderes, Análise, Torneios
3. **Centro:** gráfico candlestick (fundo escuro, candles verde/vermelho) + ferramentas laterais
4. **Direita — ordem:** Investir | Expiração | Lucro % | botões **ACIMA** (verde) e **ABAIXO** (vermelho)
5. **Picker de ativos (overlay):** busca, categorias (Tendências / Opções: Blitz, Binárias, Digital / Margem / Watchlist), tabela Ativo · Lucro · Popular · Volatilidade
6. **Rodapé fino:** suporte · horário local

## Paleta
- Fundo: `#0A0C10` / painéis `#121A28` / `#162238`
- Acento Veritas: `#00C2FF` (links, saldo, foco)
- Azul marca: `#1E4FD8`
- ACIMA: `#00BF63` · ABAIXO: `#FF3C2F`
- Texto: `#FFFFFF` / muted `#88929B`
- Tipografia: Cinzel (wordmark) + Plus Jakarta Sans (UI)

## Ativos (OTC das referências + seed)
Incluir lista completa do catálogo (`assets.ts`): OpenAI, EUR/USD, pares FX, criptos, ações OTC, commodities (Café, Algodão), índices (EU 50), etc. Lucro típico 84–85%.

## Gráficos
- **Apache ECharts** (candlestick) — sem widget TradingView.
- Intervalos 15s / 1m / 5m; preço ao vivo alimenta a abertura de opção.

## Opções ACIMA / ABAIXO
- Ao abrir: debita `cash` → `binary_stake` (ledger append-only).
- Ao expirar: se acertou a direção, credita stake + lucro em `cash`; se errou, stake vai para `realized_pnl`.

## Comportamento inicial (F1+)
- Picker abre no primeiro acesso; selecionar ativo fecha e foca o gráfico
- Chart com série sintética tickando (lightweight-charts)
- Painel calcula lucro estimado sobre invest + %
- Saldo vem da sessão (ledger); Depositar pode ser no-op visual por enquanto
