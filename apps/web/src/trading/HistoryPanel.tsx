import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { formatAssetPrice } from '../data/assets';
import type { BinaryPosition } from './PositionsBar';

type HistoryFilter = 'all' | 'won' | 'lost' | 'robot';

const dateTime = (value?: string | null) =>
  value ? new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(value)) : '—';

const assistanceLabel = (position: BinaryPosition) =>
  position.assistance_reason === 'account_win_rate_policy'
    ? 'Política de taxa da conta'
    : 'Operação inicial assistida';

function Result({ position }: { position: BinaryPosition }) {
  if (position.status === 'open') return <span className="text-accent">Em andamento</span>;
  const won = position.status === 'won';
  return (
    <span className={`u-num font-semibold ${won ? 'text-bull-text' : 'text-bear-text'}`}>
      {won ? `+${position.profit_display} (+${position.profit_pct}%)` : `-${position.stake_display} (-100%)`}
    </span>
  );
}

export function HistoryPanel({
  positions,
  onClose,
}: {
  positions: BinaryPosition[];
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closed = useMemo(
    () => positions.filter((position) => position.status !== 'open').filter((position) => {
      if (filter === 'all') return true;
      if (filter === 'robot') return position.source === 'robot';
      return position.status === filter;
    }),
    [filter, positions],
  );
  const selected = positions.find((position) => position.id === selectedId) ?? null;

  return (
    <section className="grid h-full min-h-0 bg-chart lg:grid-cols-[310px_minmax(0,1fr)]" aria-label="Histórico de operações">
      <div className={`${selected ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col border-r border-line bg-panel`}>
        <header className="border-b border-line p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="u-caps text-brand">Suas operações</p>
              <h1 className="mt-1 text-xl font-semibold">Histórico de trading</h1>
            </div>
            <button type="button" onClick={onClose} className="u-focus flex h-11 w-11 items-center justify-center rounded-ctl text-muted hover:bg-elevated hover:text-ink" aria-label="Fechar histórico">
              <Icon name="close" size={18} />
            </button>
          </div>
          <label className="mt-4 block">
            <span className="sr-only">Filtrar histórico</span>
            <select value={filter} onChange={(event) => setFilter(event.target.value as HistoryFilter)} className="u-focus h-11 w-full rounded-ctl border border-line bg-elevated px-3 text-sm text-ink">
              <option value="all">Todas as operações</option>
              <option value="won">Operações ganhas</option>
              <option value="lost">Operações perdidas</option>
              <option value="robot">Executadas por Agente IA</option>
            </select>
          </label>
        </header>

        <div className="u-scroll min-h-0 flex-1 overflow-y-auto">
          {!closed.length ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-muted">
              <Icon name="inbox" size={28} />
              <p className="text-sm">Nenhuma operação encontrada neste filtro.</p>
            </div>
          ) : closed.map((position) => (
            <button
              key={position.id}
              type="button"
              onClick={() => setSelectedId(position.id)}
              className={`u-focus flex min-h-[88px] w-full cursor-pointer items-center gap-4 border-b border-line px-4 py-3 text-left transition hover:bg-elevated ${selectedId === position.id ? 'bg-brand/10' : ''}`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${position.side === 'up' ? 'border-bull/40 text-bull-text' : 'border-bear/40 text-bear-text'}`}>
                <Icon name={position.side === 'up' ? 'trendUp' : 'trendDown'} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{position.symbol.replace('_OTC', ' OTC')}</span>
                <span className="mt-1 block text-xs text-muted">{dateTime(position.created_at)}</span>
              </span>
              <span className="min-w-[126px] shrink-0 whitespace-nowrap text-right text-xs">
                <span className="u-num block text-ink">{position.stake_display}</span>
                <Result position={position} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={`${selected ? 'flex' : 'hidden lg:flex'} min-h-0 flex-col bg-chart`}>
        {selected ? (
          <>
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="u-caps text-brand">Detalhes da operação</p>
                <h2 className="mt-1 text-xl font-semibold">{selected.symbol.replace('_OTC', ' OTC')}</h2>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="u-focus flex h-11 w-11 items-center justify-center rounded-ctl text-muted hover:bg-elevated hover:text-ink" aria-label="Fechar detalhes">
                <Icon name="close" size={18} />
              </button>
            </header>

            <div className="u-scroll min-h-0 flex-1 overflow-y-auto p-5 md:p-7">
              <div className="rounded-panel border border-line bg-panel p-5">
                <p className="u-caps">Resultado líquido</p>
                <div className="mt-2 text-3xl"><Result position={selected} /></div>
                <p className="mt-2 text-sm text-muted">
                  {selected.status === 'won' ? 'Posição finalizada com ganho.' : 'Posição finalizada com perda.'}
                </p>
                {selected.is_assisted && (
                  <p className="mt-3 inline-flex rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    Resultado assistido · {assistanceLabel(selected)}
                  </p>
                )}
              </div>

              <dl className="mt-5 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['Investimento', selected.stake_display],
                  ['Direção', selected.side === 'up' ? 'Acima · Alta' : 'Abaixo · Baixa'],
                  ['Origem', selected.source === 'robot'
                    ? selected.is_assisted ? `Agente IA · ${assistanceLabel(selected)}` : 'Agente de IA'
                    : selected.is_assisted ? `Manual · ${assistanceLabel(selected)}` : 'Operação manual'],
                  ['Preço de abertura', formatAssetPrice(selected.entry_price)],
                  ['Preço de fechamento', selected.exit_price == null ? '—' : formatAssetPrice(selected.exit_price)],
                  ['Retorno contratado', `${selected.profit_pct}%`],
                ].map(([label, value]) => (
                  <div key={label} className="bg-panel p-4">
                    <dt className="u-caps">{label}</dt>
                    <dd className="u-num mt-2 text-base font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <dl className="mt-5 space-y-4 rounded-panel border border-line bg-panel p-5 text-sm">
                <div><dt className="text-muted">Abertura</dt><dd className="u-num mt-1">{dateTime(selected.created_at)}</dd></div>
                <div><dt className="text-muted">Expiração</dt><dd className="u-num mt-1">{dateTime(selected.expires_at)}</dd></div>
                <div><dt className="text-muted">Fechamento</dt><dd className="u-num mt-1">{dateTime(selected.settled_at)}</dd></div>
                <div><dt className="text-muted">ID da posição</dt><dd className="u-num mt-1 break-all">{selected.id}</dd></div>
              </dl>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-muted">
            <Icon name="clock" size={34} />
            <p className="text-sm">Selecione uma operação para visualizar todos os detalhes.</p>
          </div>
        )}
      </div>
    </section>
  );
}
