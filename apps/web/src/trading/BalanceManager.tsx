import { useEffect, useState, type FormEvent } from 'react';
import { Icon } from '../components/Icon';

type BalanceManagerProps = {
  balanceCents: string;
  balanceDisplay: string;
  onSetBalance: (amount: number) => Promise<void>;
};

export function BalanceManager({
  balanceCents,
  balanceDisplay,
  onSetBalance,
}: BalanceManagerProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setAmount(Number(balanceCents) / 100);
    setError('');
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [balanceCents, open]);

  const update = async (nextAmount: number) => {
    if (!Number.isFinite(nextAmount) || nextAmount < 0) {
      setError('Informe um valor válido.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSetBalance(nextAmount);
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível atualizar o saldo.');
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void update(amount);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="u-focus rounded-ctl px-2 py-1 text-right leading-none transition hover:bg-elevated"
        aria-label={`Gerenciar saldo atual: ${balanceDisplay}`}
      >
        <span className="u-caps hidden sm:block">Saldo</span>
        <span className="u-num mt-0 block text-[15px] font-semibold text-accent sm:mt-1 sm:text-[17px]">{balanceDisplay}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="balance-title"
            className="w-full max-w-md rounded-panel border border-line bg-panel p-5 shadow-[var(--shadow-sheet)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="u-caps text-brand">Saldo virtual</p>
                <h2 id="balance-title" className="mt-1 text-xl font-semibold">Gerenciar saldo</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="u-focus flex h-11 w-11 items-center justify-center rounded-ctl text-muted hover:bg-elevated hover:text-ink" aria-label="Fechar">
                <Icon name="close" size={18} />
              </button>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={() => void update(10_000)}
              className="u-focus mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-btn border border-brand bg-brand/10 px-4 font-semibold text-brand transition hover:bg-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="refresh" size={19} />
              Recarregar para R$ 10.000,00
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-line" /><span>ou edite o valor</span><span className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={submit}>
              <label htmlFor="balance-amount" className="u-caps mb-2 block">Novo saldo</label>
              <div className="flex h-12 items-center rounded-ctl border border-line bg-app focus-within:border-brand">
                <span className="pl-3 text-muted">R$</span>
                <input id="balance-amount" type="number" min="0" max="100000000" step="0.01" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="h-full min-w-0 flex-1 bg-transparent px-2 u-num text-ink outline-none" autoFocus />
              </div>
              {error && <p role="alert" className="mt-2 text-sm text-bear-text">{error}</p>}
              <button type="submit" disabled={busy} className="u-focus mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-btn bg-cta px-5 font-semibold text-app disabled:cursor-not-allowed disabled:opacity-50">
                <Icon name="pen" size={17} />
                {busy ? 'Atualizando…' : 'Salvar novo saldo'}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
