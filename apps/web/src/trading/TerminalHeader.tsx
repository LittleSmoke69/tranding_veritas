import { useEffect, useRef, useState } from 'react';
import { AssetMark } from '../components/AssetMark';
import { Icon } from '../components/Icon';
import { categoryLabel, type TradingAsset } from '../data/assets';
import landingLogo from '../landing/assets/logo_1.png';
import { BalanceManager } from './BalanceManager';

type TerminalHeaderProps = {
  openAssets: TradingAsset[];
  activeSymbol: string;
  balanceCents: string;
  balanceDisplay: string;
  accountName: string;
  onSelectTab: (symbol: string) => void;
  onOpenPicker: () => void;
  onCloseTab: (symbol: string) => void;
  onLogout: () => void;
  onSetBalance: (amount: number) => Promise<void>;
  onAdmin?: () => void;
};

export function TerminalHeader({
  openAssets,
  activeSymbol,
  balanceCents,
  balanceDisplay,
  accountName,
  onSelectTab,
  onOpenPicker,
  onCloseTab,
  onLogout,
  onSetBalance,
  onAdmin,
}: TerminalHeaderProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const updateFades = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    const observer = new ResizeObserver(updateFades);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', updateFades);
      observer.disconnect();
    };
  }, [openAssets.length]);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const activeTab = el.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    activeTab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeSymbol]);

  return (
    <header
      className="flex h-full items-stretch gap-2 border-b border-line bg-app pr-2 sm:gap-3 sm:pr-3"
      style={{ paddingLeft: 8 }}
    >
      <div className="hidden shrink-0 items-center lg:flex">
        <img
          src={landingLogo}
          alt="Veritas"
          className="h-10 w-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(25,172,254,0.3))' }}
        />
      </div>

      <div className="mx-0.5 my-3 hidden w-px shrink-0 bg-line lg:block" aria-hidden="true" />

      {/* Abas de ativos */}
      <div className="relative flex min-w-0 flex-1 items-stretch">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-app to-transparent transition-opacity duration-200 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Ativos abertos"
          className="u-scroll flex min-w-0 flex-1 items-end gap-1 overflow-x-auto pb-0"
        >
        {openAssets.map((a) => {
          const isActive = a.symbol === activeSymbol;
          return (
            <div key={a.symbol} className="group relative flex shrink-0 items-stretch">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab(a.symbol)}
                className={`u-focus u-lift flex h-12 items-center gap-2 rounded-t-panel border-b-2 py-2 pl-2 transition sm:pl-3 ${
                  openAssets.length > 1 ? 'pr-7 sm:pr-8' : 'pr-2 sm:pr-3'
                } ${
                  isActive
                    ? 'border-brand bg-elevated'
                    : 'border-transparent bg-transparent hover:bg-elevated/60'
                }`}
              >
                <AssetMark asset={a} size={24} />
                <span className="min-w-0 text-left leading-none">
                  <span
                    className={`block max-w-[88px] truncate text-[13px] font-semibold sm:max-w-[132px] ${
                      isActive ? 'text-ink' : 'text-muted'
                    }`}
                  >
                    {a.name}
                  </span>
                  <span className="u-caps mt-1 hidden sm:block">{categoryLabel(a.category)}</span>
                </span>
              </button>

              {openAssets.length > 1 && (
                <button
                  type="button"
                  onClick={() => onCloseTab(a.symbol)}
                  aria-label={`Fechar aba ${a.name}`}
                  className="u-focus absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-ctl text-faint opacity-0 transition hover:bg-app hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Icon name="close" size={14} strokeWidth={1.8} />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={onOpenPicker}
          aria-label="Abrir novo ativo"
          className="u-focus u-lift mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-ctl border border-line text-muted hover:border-brand hover:text-brand"
        >
          <Icon name="plus" size={18} />
        </button>
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-app to-transparent transition-opacity duration-200 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Conta, saldo e depósito */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="hidden items-center gap-2 lg:flex">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-elevated text-muted"
            aria-hidden="true"
          >
            <Icon name="user" size={16} />
          </span>
          <span className="max-w-[120px] truncate text-[13px] text-muted">{accountName}</span>
        </div>

        <BalanceManager
          balanceCents={balanceCents}
          balanceDisplay={balanceDisplay}
          onSetBalance={onSetBalance}
        />

        {onAdmin && (
          <button
            type="button"
            onClick={onAdmin}
            aria-label="Abrir painel administrativo"
            className="u-focus u-lift flex h-9 w-9 items-center justify-center rounded-ctl border border-line text-muted hover:bg-elevated hover:text-ink"
          >
            <Icon name="grid" size={17} />
          </button>
        )}

        <button
          type="button"
          onClick={onLogout}
          aria-label="Sair da conta"
          className="u-focus u-lift flex h-9 w-9 items-center justify-center rounded-ctl text-faint hover:bg-elevated hover:text-ink"
        >
          <Icon name="logout" size={17} />
        </button>
      </div>
    </header>
  );
}
