import { useMemo, useState } from 'react';
import { HelpTip } from '../components/HelpTip';
import { Icon } from '../components/Icon';

type TradePanelProps = {
  invest: number;
  expirationSec: number;
  profitPct: number;
  busy?: boolean;
  onInvestChange: (v: number) => void;
  onExpirationChange: (v: number) => void;
  onTrade: (side: 'up' | 'down') => void | Promise<void>;
};

const EXPIRATIONS = [30, 60, 120, 300];
const QUICK = [50, 100, 500];
const STEP = 10;

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function expLabel(sec: number): string {
  return sec < 60 ? `${sec}s` : `${sec / 60}m`;
}

export function TradePanel({
  invest,
  expirationSec,
  profitPct,
  busy,
  onInvestChange,
  onExpirationChange,
  onTrade,
}: TradePanelProps) {
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expOpen, setExpOpen] = useState(false);

  const payout = useMemo(
    () => Math.round(invest * (profitPct / 100) * 100) / 100,
    [invest, profitPct],
  );

  const fire = async (side: 'up' | 'down') => {
    setError(null);
    try {
      await onTrade(side);
      setFlash(side === 'up' ? 'Posição ACIMA aberta' : 'Posição ABAIXO aberta');
      window.setTimeout(() => setFlash(null), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível abrir a posição.');
    }
  };

  return (
    <aside
      aria-label="Painel de ordem"
      className="u-scroll flex h-full min-h-0 flex-col gap-3 overflow-y-auto border-l border-line bg-panel p-3 max-lg:border-l-0"
    >
      {/* Investimento */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="invest" className="u-caps">
            Investimento
          </label>
          <HelpTip text="Valor debitado do saldo ao abrir a posição." />
        </div>

        <div className="flex items-stretch overflow-hidden rounded-ctl border border-line bg-app transition focus-within:border-brand">
          <span className="flex items-center pl-2.5 pr-1 text-[13px] text-muted">$</span>
          <input
            id="invest"
            type="number"
            inputMode="decimal"
            min={1}
            step={1}
            value={invest}
            disabled={busy}
            onChange={(e) => onInvestChange(Math.max(1, Number(e.target.value) || 1))}
            className="u-num u-stepper min-w-0 flex-1 bg-transparent py-2.5 text-[17px] font-semibold text-ink outline-none disabled:opacity-60"
          />
          <span className="flex w-9 shrink-0 flex-col border-l border-line">
            <button
              type="button"
              disabled={busy}
              onClick={() => onInvestChange(invest + STEP)}
              aria-label={`Aumentar investimento em ${STEP} reais`}
              className="u-focus flex flex-1 items-center justify-center border-b border-line text-muted transition hover:bg-elevated hover:text-ink disabled:opacity-50"
            >
              <Icon name="plus" size={14} strokeWidth={2} />
            </button>
            <button
              type="button"
              disabled={busy || invest <= 1}
              onClick={() => onInvestChange(Math.max(1, invest - STEP))}
              aria-label={`Diminuir investimento em ${STEP} reais`}
              className="u-focus flex flex-1 items-center justify-center text-muted transition hover:bg-elevated hover:text-ink disabled:opacity-50"
            >
              <Icon name="minus" size={14} strokeWidth={2} />
            </button>
          </span>
        </div>

        <div className="mt-1.5 flex gap-1">
          {QUICK.map((n) => (
            <button
              key={n}
              type="button"
              disabled={busy}
              onClick={() => onInvestChange(n)}
              className={`u-focus u-num flex-1 rounded-ctl border py-1 text-[11px] font-semibold transition ${
                invest === n
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-line bg-elevated text-muted hover:text-ink'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Expiração */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="u-caps">Expiração</span>
          <HelpTip text="Tempo até a posição liquidar automaticamente pelo preço do momento." />
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => setExpOpen((v) => !v)}
          aria-expanded={expOpen}
          className="u-focus flex w-full items-center gap-2 rounded-ctl border border-line bg-app px-2.5 py-2.5 text-left transition hover:border-line-strong disabled:opacity-60"
        >
          <Icon name="timer" size={18} className="shrink-0 text-muted" />
          <span className="u-num flex-1 text-[15px] font-semibold text-ink">
            {expLabel(expirationSec)}
          </span>
          <Icon
            name="chevronDown"
            size={16}
            className={`shrink-0 text-muted transition-transform duration-150 ${expOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {expOpen && (
          <div role="radiogroup" aria-label="Tempo de expiração" className="mt-1 grid grid-cols-4 gap-1">
            {EXPIRATIONS.map((s) => {
              const on = s === expirationSec;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={busy}
                  onClick={() => {
                    onExpirationChange(s);
                    setExpOpen(false);
                  }}
                  className={`u-focus u-num rounded-ctl border py-1.5 text-[11px] font-semibold transition ${
                    on
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-line bg-elevated text-muted hover:text-ink'
                  }`}
                >
                  {expLabel(s)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Payout */}
      <div className="rounded-panel border border-line bg-app px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="u-caps">Payout</span>
          <HelpTip text="Percentual de lucro sobre o investimento caso a direção se confirme." />
        </div>
        <p className="u-num mt-1 text-[32px] font-semibold leading-none tracking-tight text-bull-text sm:text-[40px] lg:text-[48px]">
          +{profitPct}
          <span className="text-[18px] font-medium sm:text-[22px] lg:text-[24px]">%</span>
        </p>
        <p className="u-num mt-1.5 text-[15px] font-semibold text-bull-text">+${brl(payout)}</p>
        <p className="u-num mt-0.5 text-[11px] text-muted">Retorno total ${brl(invest + payout)}</p>
      </div>

      {/* Direção */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => void fire('up')}
          className="u-focus u-lift u-glow-bull flex h-[72px] w-full flex-col items-center justify-center gap-1.5 rounded-btn bg-bull font-semibold text-on-bull transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:h-[88px]"
        >
          <Icon name="trendUp" size={26} strokeWidth={2} />
          <span className="font-cond text-[15px] uppercase tracking-[0.06em]">Acima</span>
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void fire('down')}
          className="u-focus u-lift u-glow-bear flex h-[72px] w-full flex-col items-center justify-center gap-1.5 rounded-btn bg-bear-fill font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:h-[88px]"
        >
          <Icon name="trendDown" size={26} strokeWidth={2} />
          <span className="font-cond text-[15px] uppercase tracking-[0.06em]">Abaixo</span>
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {flash ?? ''}
      </p>
      {flash && (
        <p className="rounded-ctl border border-brand/40 bg-brand/10 px-2.5 py-1.5 text-center text-[11px] text-brand">
          {flash}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="flex items-start gap-1.5 rounded-ctl border border-bear/50 bg-bear/10 px-2.5 py-1.5 text-[11px] text-bear-text"
        >
          <Icon name="info" size={14} className="mt-px shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </aside>
  );
}
