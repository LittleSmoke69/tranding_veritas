import { useCallback, useEffect, useRef, useState } from 'react';
import { TRADING_ASSETS, findAsset, type AssetCategory, type TradingAsset } from '../data/assets';
import { api } from '../lib/api';
import { AssetPicker } from './AssetPicker';
import { ChartPane } from './ChartPane';
import { Icon } from '../components/Icon';
import { LeftNav, type NavId } from './LeftNav';
import { PositionsBar, type BinaryPosition } from './PositionsBar';
import { TerminalHeader } from './TerminalHeader';
import { TradePanel } from './TradePanel';
import { RobotPanel } from './RobotPanel';
import { HistoryPanel } from './HistoryPanel';

export type TradingSession = {
  cash_cents: string;
  cash_display: string;
  user: { full_name?: string | null; username?: string | null; email: string };
};

type TradingTerminalProps = {
  session: TradingSession;
  onLogout: () => void;
  onBalance: (cashCents: string, cashDisplay: string) => void;
  onAdmin?: () => void;
};

type TradeListData = {
  positions: BinaryPosition[];
  settled: BinaryPosition[];
  cash_cents: string;
  cash_display: string;
};

type OpenTradeData = {
  position: BinaryPosition;
  cash_cents: string;
  cash_display: string;
};

type BalanceData = {
  cash_cents: string;
  cash_display: string;
};

type MarketInstrument = {
  symbol: string;
  name: string;
  asset_class: TradingAsset['assetClass'];
  quote_currency: string;
  base_price: number;
  volatility_bps: number;
  payout_pct: number;
  category: string;
};

export function TradingTerminal({ session, onLogout, onBalance, onAdmin }: TradingTerminalProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [openSymbols, setOpenSymbols] = useState<string[]>(['OPENAI_OTC', 'EURUSD_OTC']);
  const [assets, setAssets] = useState<TradingAsset[]>(TRADING_ASSETS);
  const [activeSymbol, setActiveSymbol] = useState('OPENAI_OTC');
  const [invest, setInvest] = useState(100);
  const [expirationSec, setExpirationSec] = useState(30);
  const [clock, setClock] = useState(() => new Date());
  const [livePrice, setLivePrice] = useState(findAsset('OPENAI_OTC').price);
  const [positions, setPositions] = useState<BinaryPosition[]>([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<NavId>('assets');
  const [contentNav, setContentNav] = useState<Exclude<NavId, 'history'>>('assets');
  const [positionsCollapsed, setPositionsCollapsed] = useState(false);
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);
  const priceRef = useRef(livePrice);

  const active = assets.find((asset) => asset.symbol === activeSymbol) ?? findAsset(activeSymbol);
  const openAssets = openSymbols.map((symbol) => assets.find((asset) => asset.symbol === symbol) ?? findAsset(symbol));

  const onPrice = useCallback((price: number) => {
    priceRef.current = price;
    setLivePrice(price);
  }, []);

  const refreshTrades = useCallback(async () => {
    const data = await api<TradeListData>('/trades/binary');
    setPositions(data.positions);
    onBalance(data.cash_cents, data.cash_display);
    if (data.settled.length) {
      const last = data.settled[0];
      const msg =
        last.status === 'won'
          ? `Opção ganha — crédito ${last.profit_display} + stake`
          : `Opção perdida — stake ${last.stake_display}`;
      setToast(msg);
      window.setTimeout(() => setToast(null), 4000);
    }
  }, [onBalance]);

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    void api<MarketInstrument[]>('/market/instruments').then((rows) => {
      setAssets(rows.map((row) => {
        const fallback = TRADING_ASSETS.find((item) => item.symbol === row.symbol);
        return {
          symbol: row.symbol,
          name: row.name.replace(/\s*\(OTC\)$/i, ''),
          label: row.name,
          price: row.base_price,
          profitPct: row.payout_pct,
          change5mPct: 0,
          popularity: fallback?.popularity ?? 1,
          volatility: Math.min(3, Math.max(1, Math.ceil(row.volatility_bps / 10))) as 1 | 2 | 3,
          category: (['blitz', 'binary', 'digital', 'margin'].includes(row.category)
            ? row.category : 'binary') as AssetCategory,
          assetClass: row.asset_class,
        };
      }));
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    void refreshTrades().catch(() => undefined);
    const id = window.setInterval(() => {
      void refreshTrades().catch(() => undefined);
    }, 5000);
    return () => window.clearInterval(id);
  }, [refreshTrades]);

  const selectAsset = (asset: TradingAsset) => {
    setOpenSymbols((prev) => (prev.includes(asset.symbol) ? prev : [...prev, asset.symbol]));
    setActiveSymbol(asset.symbol);
  };

  const closeTab = (symbol: string) => {
    setOpenSymbols((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((s) => s !== symbol);
      if (symbol === activeSymbol) setActiveSymbol(next[0]);
      return next;
    });
  };

  const onTrade = async (side: 'up' | 'down') => {
    setBusy(true);
    try {
      const stakeCents = Math.round(invest * 100);
      const data = await api<OpenTradeData>('/trades/binary', {
        method: 'POST',
        body: JSON.stringify({
          symbol: active.symbol,
          side,
          stake_cents: String(stakeCents),
          profit_pct: active.profitPct,
          expiration_sec: expirationSec,
          entry_price: priceRef.current || active.price,
          client_order_id: `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        }),
      });
      onBalance(data.cash_cents, data.cash_display);
      setPositions((prev) => [data.position, ...prev.filter((p) => p.id !== data.position.id)]);
    } finally {
      setBusy(false);
    }
  };

  const accountName =
    session.user.full_name || session.user.username || session.user.email;
  const hasDedicatedPanel = contentNav === 'robots';

  const navigate = (id: NavId) => {
    setActiveNav(id);
    if (id !== 'history') {
      setContentNav(id);
      if (id === 'robots') setOrderSheetOpen(false);
    }
  };

  const setBalance = async (amount: number) => {
    const data = await api<BalanceData>('/api/account/balance', {
      method: 'PUT',
      body: JSON.stringify({ amount }),
    });
    onBalance(data.cash_cents, data.cash_display);
  };

  return (
    <div className={`app-grid ${hasDedicatedPanel ? 'app-grid--agents' : ''}`}>
      <div className="area-top">
        <TerminalHeader
          openAssets={openAssets}
          activeSymbol={activeSymbol}
          balanceCents={session.cash_cents}
          balanceDisplay={session.cash_display}
          accountName={accountName}
          onSelectTab={setActiveSymbol}
          onOpenPicker={() => setPickerOpen(true)}
          onCloseTab={closeTab}
          onLogout={onLogout}
          onSetBalance={setBalance}
          onAdmin={onAdmin}
        />
      </div>

      <div className="area-rail hidden lg:block">
        <LeftNav activeId={activeNav} onNavigate={navigate} />
      </div>

      <main className="area-chart relative">
        {contentNav === 'robots' ? (
          <RobotPanel
            asset={active}
            positions={positions}
            livePrice={livePrice}
          />
        ) : (
          <>
            <ChartPane
              asset={active}
              positions={positions}
              onPrice={onPrice}
              onOpenPicker={() => setPickerOpen(true)}
            />
            <button
              type="button"
              onClick={() => setOrderSheetOpen(true)}
              className="u-focus u-lift absolute bottom-3 right-3 z-[var(--z-chart-ui)] flex h-11 items-center gap-2 rounded-btn bg-brand px-4 font-cond text-[12px] font-semibold uppercase tracking-[0.06em] text-app lg:hidden"
              aria-label="Abrir painel de ordem"
            >
              <Icon name="trendUp" size={18} />
              Ordem
            </button>
          </>
        )}

        {activeNav === 'history' && (
          <div className="absolute inset-y-0 left-0 z-[var(--z-sheet)] w-full shadow-[var(--shadow-sheet)] lg:w-[860px] lg:max-w-[86%]">
            <HistoryPanel
              positions={positions}
              onClose={() => setActiveNav(contentNav)}
            />
          </div>
        )}
      </main>

      {!hasDedicatedPanel && (
        <div className={`area-order ${orderSheetOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            onClick={() => setOrderSheetOpen(false)}
            className="u-focus absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-ctl bg-elevated text-muted hover:text-ink lg:hidden"
            aria-label="Fechar painel de ordem"
          >
            <Icon name="close" size={17} />
          </button>
          <TradePanel
            invest={invest}
            expirationSec={expirationSec}
            profitPct={active.profitPct}
            busy={busy}
            onInvestChange={setInvest}
            onExpirationChange={setExpirationSec}
            onTrade={onTrade}
          />
        </div>
      )}

      <div className="area-pos">
        <PositionsBar
          positions={positions}
          livePrice={livePrice}
          toast={toast}
          collapsed={positionsCollapsed}
          onToggle={() => setPositionsCollapsed((value) => !value)}
          onOpenPicker={() => setPickerOpen(true)}
        />
      </div>

      <footer className="area-stat flex h-full items-center justify-between border-t border-line bg-app px-4 font-cond text-[10px] uppercase tracking-[0.06em] text-muted">
        <span className="flex items-center gap-2">
          <Icon name="message" size={15} />
          Suporte · support@veritas.trader
        </span>
        <span className="hidden items-center gap-1 sm:flex">
          Powered by <strong className="font-semibold text-ink">Veritas</strong>
        </span>
        <span className="u-num text-[11px] text-ink">
          UTC−3 · {clock.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      </footer>

      <div className="area-rail block lg:hidden">
        <LeftNav
          activeId={activeNav}
          orientation="bar"
          onNavigate={navigate}
        />
      </div>

      <AssetPicker
        open={pickerOpen}
        assets={assets}
        selectedSymbol={activeSymbol}
        onClose={() => setPickerOpen(false)}
        onSelect={selectAsset}
      />
    </div>
  );
}
