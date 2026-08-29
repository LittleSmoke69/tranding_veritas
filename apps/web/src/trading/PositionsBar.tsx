import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { formatAssetPrice } from '../data/assets';

export type BinaryPosition = {
  id: string;
  symbol: string;
  side: 'up' | 'down';
  stake_cents?: string;
  stake_display: string;
  profit_display: string;
  profit_pct: number;
  entry_price: number;
  exit_price: number | null;
  expires_at: string;
  status: 'open' | 'won' | 'lost';
  created_at?: string;
  settled_at?: string | null;
  source?: 'manual' | 'robot';
  robot_instance_id?: string | null;
  is_assisted?: boolean;
  assistance_reason?: 'initial_agent_trade' | 'account_win_rate_policy' | string | null;
};

type Tab = 'open' | 'closed';

function countdown(expiresAt: string, now: number): string {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return '00:00';
  const s = Math.ceil(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function expectedPl(p: BinaryPosition, livePrice: number): { text: string; win: boolean } {
  if (p.status === 'won') return { text: `+${p.profit_display}`, win: true };
  if (p.status === 'lost') return { text: `-${p.stake_display}`, win: false };
  const winning =
    (p.side === 'up' && livePrice > p.entry_price) || (p.side === 'down' && livePrice < p.entry_price);
  return winning ? { text: `+${p.profit_display}`, win: true } : { text: `-${p.stake_display}`, win: false };
}

/** Direção nunca é indicada só por cor — sempre ícone + rótulo. */
function Direction({ side }: { side: 'up' | 'down' }) {
  const up = side === 'up';
  return (
    <span className={`inline-flex items-center gap-1 ${up ? 'text-bull-text' : 'text-bear-text'}`}>
      <Icon name={up ? 'trendUp' : 'trendDown'} size={13} strokeWidth={2} />
      <span className="font-cond text-[10px] font-semibold uppercase tracking-[0.06em]">
        {up ? 'Alta' : 'Baixa'}
      </span>
    </span>
  );
}

const TH_L = 'px-2 py-1.5 text-left font-semibold';
const TH_R = 'px-2 py-1.5 text-right font-semibold';
const TD_L = 'px-2 py-2 text-left';
const TD_R = 'u-num px-2 py-2 text-right';

type PositionsBarProps = {
  positions: BinaryPosition[];
  livePrice: number;
  toast: string | null;
  collapsed: boolean;
  onToggle: () => void;
  onOpenPicker: () => void;
};

export function PositionsBar({
  positions,
  livePrice,
  toast,
  collapsed,
  onToggle,
  onOpenPicker,
}: PositionsBarProps) {
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState<Tab>('open');

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);

  const open = positions.filter((p) => p.status === 'open');
  const closed = positions.filter((p) => p.status !== 'open').slice(0, 30);
  const rows = tab === 'open' ? open : closed;

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: 'open', label: 'Posições abertas', count: open.length },
    { id: 'closed', label: 'Encerradas', count: closed.length },
  ];

  return (
    <section aria-label="Posições" className="flex min-h-0 flex-col border-t border-line bg-panel">
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-line px-2">
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                if (collapsed) onToggle();
              }}
              aria-pressed={on}
              className={`u-focus flex items-center gap-1.5 rounded-ctl px-2 py-1 transition ${
                on ? 'bg-elevated text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              <span className="font-cond text-[11px] font-semibold uppercase tracking-[0.06em]">
                {t.label}
              </span>
              <span
                className={`u-num rounded-ctl px-1.5 text-[10px] font-semibold ${
                  on ? 'bg-brand/15 text-brand' : 'bg-elevated text-muted'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}

        <p aria-live="polite" className="min-w-0 flex-1 truncate px-2 text-right text-[11px] text-brand">
          {toast ?? ''}
        </p>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir painel de posições' : 'Recolher painel de posições'}
          className="u-focus flex h-7 w-7 shrink-0 items-center justify-center rounded-ctl text-muted transition hover:bg-elevated hover:text-ink"
        >
          <Icon name={collapsed ? 'chevronUp' : 'chevronDown'} size={16} />
        </button>
      </div>

      {!collapsed && (
        <div className="u-scroll max-h-[172px] min-h-0 overflow-y-auto">
          {!rows.length ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-7 text-center">
              <Icon name="inbox" size={22} className="text-faint" />
              <p className="text-[12px] text-muted">
                {tab === 'open'
                  ? 'Nenhuma posição aberta no momento.'
                  : 'Nenhuma posição encerrada ainda.'}
              </p>
              {tab === 'open' && (
                <button
                  type="button"
                  onClick={onOpenPicker}
                  className="u-focus u-lift mt-0.5 rounded-btn border border-line-strong px-3 py-1.5 text-[12px] font-semibold text-ink hover:border-brand hover:text-brand"
                >
                  Escolher um ativo
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 z-10 bg-panel font-cond uppercase tracking-[0.06em] text-muted">
                <tr className="border-b border-line">
                  <th scope="col" className={TH_L}>Ativo</th>
                  <th scope="col" className={TH_L}>Direção</th>
                  <th scope="col" className={TH_R}>{tab === 'open' ? 'Expira em' : 'Resultado'}</th>
                  <th scope="col" className={TH_R}>Investimento</th>
                  <th scope="col" className={TH_R}>Abertura</th>
                  <th scope="col" className={TH_R}>{tab === 'open' ? 'Preço atual' : 'Fechamento'}</th>
                  <th scope="col" className={TH_R}>{tab === 'open' ? 'L/P esperado' : 'L/P'}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const isOpen = p.status === 'open';
                  const pl = expectedPl(p, isOpen ? livePrice : (p.exit_price ?? livePrice));
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-line text-ink transition-colors last:border-b-0 hover:bg-elevated"
                    >
                      <td className={`${TD_L} font-semibold`}>{p.symbol.replace('_OTC', ' OTC')}</td>
                      <td className={TD_L}>
                        <Direction side={p.side} />
                      </td>
                      <td className={`${TD_R} ${isOpen ? 'text-accent' : 'text-muted'}`}>
                        {isOpen ? (
                          countdown(p.expires_at, now)
                        ) : (
                          <span className={p.status === 'won' ? 'text-bull-text' : 'text-bear-text'}>
                            {p.status === 'won' ? 'Ganha' : 'Perdida'}
                          </span>
                        )}
                      </td>
                      <td className={TD_R}>{p.stake_display}</td>
                      <td className={`${TD_R} text-muted`}>{formatAssetPrice(p.entry_price)}</td>
                      <td className={TD_R}>
                        {isOpen
                          ? formatAssetPrice(livePrice)
                          : p.exit_price != null
                            ? formatAssetPrice(p.exit_price)
                            : '—'}
                      </td>
                      <td className={`${TD_R} font-semibold ${pl.win ? 'text-bull-text' : 'text-bear-text'}`}>
                        {pl.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
