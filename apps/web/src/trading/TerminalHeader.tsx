import { AssetMark } from '../components/AssetMark';
import { Icon } from '../components/Icon';
import { VeritasLogo } from '../components/VeritasLogo';
import { categoryLabel, type TradingAsset } from '../data/assets';
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
  return (
    <header
      className="flex h-full items-stretch gap-3 border-b border-line bg-app pr-3"
      style={{ paddingLeft: 12 }}
    >
      <div className="flex shrink-0 items-center">
        <VeritasLogo size="sm" subtitle="Trader" />
      </div>

      <div className="mx-1 my-3 w-px shrink-0 bg-line" aria-hidden="true" />

      {/* Abas de ativos */}
      <div
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
                className={`u-focus u-lift flex h-12 items-center gap-2.5 rounded-t-panel border-b-2 py-2 pl-3 transition ${
                  openAssets.length > 1 ? 'pr-8' : 'pr-3'
                } ${
                  isActive
                    ? 'border-accent bg-elevated'
                    : 'border-transparent bg-transparent hover:bg-elevated/60'
                }`}
              >
                <AssetMark asset={a} size={24} />
                <span className="min-w-0 text-left leading-none">
                  <span
                    className={`block max-w-[132px] truncate text-[13px] font-semibold ${
                      isActive ? 'text-ink' : 'text-muted'
                    }`}
                  >
                    {a.name}
                  </span>
                  <span className="u-caps mt-1 block">{categoryLabel(a.category)}</span>
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
          className="u-focus u-lift mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-ctl border border-line text-muted hover:border-line-strong hover:text-ink"
        >
          <Icon name="plus" size={18} />
        </button>
      </div>

      {/* Conta, saldo e depósito */}
      <div className="flex shrink-0 items-center gap-3">
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
