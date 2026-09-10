# Mapa de páginas — veritasacademy.base44.app (site de referência)

Site original (base44, SPA client-side): `https://veritasacademy.base44.app`

> Todos os caminhos abaixo foram confirmados navegando de fato pelo menu do site
> (não são chutes) — descobertos em 2026-09-10 via Selenium, clicando em cada
> item do menu e do dropdown e lendo `window.location.pathname` resultante.

## Navegação principal (top nav)

| Label no menu | Caminho            | Status no nosso projeto                          |
|----------------|---------------------|---------------------------------------------------|
| Página Inicial | `/`                 | ✅ Portado — `App.tsx` (home)                      |
| Mercados       | `/Mercados`         | ✅ Portado — `pages/Mercados.tsx`                  |
| Trading Lab    | `/TradingLab`       | ⬜ **Não raspado ainda**                           |
| Educação       | `/Educacao`         | ✅ Portado — `pages/Educacao.tsx` (+ quiz)         |
| Planos         | `/Planos`           | ✅ Portado — `pages/Planos.tsx`                    |
| Contato        | (sem rota própria — clique não navega, provável seção/modal ainda não mapeado) | ⬜ Não mapeado |

## Dropdown "A Veritas"

| Label no menu | Caminho         | Status no nosso projeto             |
|----------------|------------------|--------------------------------------|
| Quem Somos     | `/QuemSomos`     | ✅ Portado — `pages/QuemSomos.tsx`   |
| Nossa Equipe   | `/NossaEquipe`   | ✅ Portado — `pages/NossaEquipe.tsx` |
| Carreiras      | `/Carreiras`     | ✅ Portado — `pages/Carreiras.tsx`   |

## Dropdown "Serviços"

| Label no menu | Caminho         | Status no nosso projeto                                   |
|----------------|------------------|-------------------------------------------------------------|
| Copy Trading   | `/CopyTrading`   | 🟡 Arquivo existe (`pages/CopyTrading.tsx`) — confirmar se já reflete o conteúdo raspado do original |
| Cursos         | `/Educacao` (mesma página de Educação, só um atalho) | ✅ Já coberto pelo Educacao.tsx |
| Análises       | `/Analises`      | ⬜ **Não raspado ainda**                                    |
| Consultoria    | `/Consultoria`   | 🟡 Arquivo existe (`pages/Consultoria.tsx`) — confirmar se já reflete o conteúdo raspado do original |
| Automação      | `/Automacao`     | 🟡 Arquivo existe (`pages/Automacao.tsx`) — confirmar se já reflete o conteúdo raspado do original |

## Rodapé — corretoras/exchanges parceiras (links externos, não são páginas do site)

| Nome              | URL                                     |
|-------------------|-------------------------------------------|
| Binance           | https://www.binance.com/pt-BR             |
| Coinbase          | https://www.coinbase.com/pt-br            |
| Bybit             | https://www.bybit.com/pt-BR/              |
| KuCoin            | https://www.kucoin.com/                   |
| Titanium FX       | https://titaniumfxpro.co.uk/              |
| Hantec Markets    | https://hmarkets.com/pt/                  |
| XM                | https://www.xm.com/pt                     |
| Pepperstone       | https://pepperstone.com/pt-br/            |
| BlackBull Markets | https://blackbull.com/                    |
| Avenue            | https://avenue.us/pt                      |

Já refletido no nosso `BrokersSection` (em `shared.tsx` de ambos os projetos) — conferir se a lista bate 100%.

## Contato

- E-mail do rodapé: `contato@academyveritas.net`

---

## Pendências de raspagem (o que falta fazer nesta pasta)

1. **`/TradingLab`** — página nova, ainda não temos nenhum conteúdo dela. Prioridade alta: é item do menu principal, não de dropdown.
2. **`/Analises`** — página nova do dropdown "Serviços", também sem conteúdo raspado ainda.
3. Confirmar se `CopyTrading.tsx`, `Consultoria.tsx` e `Automacao.tsx` (já existem como arquivo em ambos os projetos, aparentemente de outra sessão) realmente correspondem ao conteúdo do site original ou são só a estrutura de navegação — comparar texto/seções.
4. Investigar a rota/comportamento real de "Contato" no menu (não navegou para lugar nenhum no teste automatizado — pode abrir um modal, scroll até uma seção, ou ainda não estar implementado no site de referência).

## Como usar esta pasta

- `paginas/` — HTML bruto ou anotações de cada página raspada (uma subpasta por rota, ex. `paginas/TradingLab/`).
- `dados/` — dados estruturados extraídos (JSON) de cada página: textos, listas, quizzes, etc.
- `screenshots/` — capturas de tela (desktop e mobile) de cada página do site original, para referência visual durante a reimplementação.

A landing NOVA (nossa) continua vivendo dentro do projeto, sem mudanças de local:
- `LP VERITAS ACADEMY/` — site standalone (investirbot.online)
- `apps/web/src/landing/` — landing embutida no app de trading (demo.investirbot.online)

Esta pasta (`raspagem-veritas-academy/`) é só material de referência/raspagem do site
antigo, para consulta durante o port — não faz parte do build de nenhum dos dois projetos.
