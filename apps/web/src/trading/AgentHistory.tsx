import { useEffect, useState } from 'react';
import { ROBOT_PROFILES } from '@veritas/shared';
import { Icon } from '../components/Icon';
import type { RobotInstance } from './RobotPanel';

const dateTime = (value?: string | null) =>
  value ? new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value)) : '—';

const statusLabel: Record<string, string> = {
  active: 'Em execução',
  stopped: 'Interrompido',
  disabled: 'Desativado',
  target_reached: 'Meta atingida',
  stop_loss: 'Limite de perda',
  time_limit: 'Prazo encerrado',
};

export function AgentHistory({ instances }: { instances: RobotInstance[] }) {
  const [selected, setSelected] = useState<RobotInstance | null>(null);

  useEffect(() => {
    if (!selected) return;
    const latest = instances.find((instance) => instance.id === selected.id);
    if (latest) setSelected(latest);
  }, [instances, selected?.id]);

  if (!instances.length) return null;

  return (
    <section className="rounded-panel border border-line bg-panel" aria-labelledby="agent-history-title">
      <header className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="u-caps text-brand">Atividade recente</p>
          <h2 id="agent-history-title" className="mt-1 text-lg font-semibold">Histórico dos Agentes de IA</h2>
        </div>
        <span className="u-num rounded-full bg-elevated px-2.5 py-1 text-xs text-muted">{instances.length}</span>
      </header>

      <div className="grid gap-px bg-line md:grid-cols-2">
        {instances.map((instance, index) => {
          const positive = !instance.pnl_display.startsWith('-');
          const isLastOdd = instances.length % 2 === 1 && index === instances.length - 1;
          return (
            <button
              key={instance.id}
              type="button"
              onClick={() => setSelected(instance)}
              className={`u-focus flex min-h-[92px] cursor-pointer items-center gap-3 bg-panel px-4 py-3 text-left transition hover:bg-elevated ${isLastOdd ? 'md:col-span-2' : ''}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel border border-brand/30 bg-brand/10 text-brand">
                <Icon name="aiAgent" size={25} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate">Agente {ROBOT_PROFILES[instance.profile_code].name}</strong>
                <span className="mt-1 block text-xs text-muted">{dateTime(instance.started_at)}</span>
                <span className="mt-1 block text-xs text-brand">{statusLabel[instance.status] ?? instance.status}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className={`u-num block font-semibold ${positive ? 'text-bull-text' : 'text-bear-text'}`}>{instance.pnl_display}</span>
                <span className="mt-1 flex items-center justify-end gap-1 text-xs text-muted">
                  Ver detalhes <Icon name="info" size={13} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[var(--z-modal)] bg-black/60" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setSelected(null);
        }}>
          <aside role="dialog" aria-modal="true" aria-labelledby="agent-detail-title" className="u-scroll ml-auto flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-line bg-chart shadow-[var(--shadow-sheet)]">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel px-5 py-4">
              <div>
                <p className="u-caps text-brand">Detalhes da automação</p>
                <h2 id="agent-detail-title" className="mt-1 text-xl font-semibold">Agente {ROBOT_PROFILES[selected.profile_code].name}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="u-focus flex h-11 w-11 items-center justify-center rounded-ctl text-muted hover:bg-elevated hover:text-ink" aria-label="Fechar detalhes">
                <Icon name="close" size={18} />
              </button>
            </header>

            <div className="space-y-5 p-5">
              <div className="rounded-panel border border-brand/30 bg-brand/10 p-5">
                <span className="u-caps text-brand">{statusLabel[selected.status] ?? selected.status}</span>
                <p className={`u-num mt-2 text-3xl font-semibold ${selected.pnl_display.startsWith('-') ? 'text-bear-text' : 'text-bull-text'}`}>{selected.pnl_display}</p>
                <p className="mt-1 text-sm text-muted">Resultado acumulado do agente</p>
              </div>

              <dl className="grid gap-px overflow-hidden rounded-panel border border-line bg-line grid-cols-2">
                {[
                  ['Capital alocado', selected.allocation_display],
                  ['Meta de lucro', selected.target_display],
                  ['Operações ganhas', String(selected.wins)],
                  ['Operações perdidas', String(selected.losses)],
                  ['Taxa de acerto', `${selected.win_rate}%`],
                  ['Progresso da meta', `${Math.max(0, selected.progress_pct).toFixed(1)}%`],
                  ['Análises realizadas', String(selected.signal_count)],
                  ['Operações abertas', String(selected.position_count)],
                ].map(([label, value]) => (
                  <div key={label} className="bg-panel p-4">
                    <dt className="u-caps">{label}</dt>
                    <dd className="u-num mt-2 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>

              <dl className="space-y-4 rounded-panel border border-line bg-panel p-5 text-sm">
                <div><dt className="text-muted">Ativos utilizados</dt><dd className="mt-1">{selected.symbols?.join(', ') || '—'}</dd></div>
                <div><dt className="text-muted">Início</dt><dd className="u-num mt-1">{dateTime(selected.started_at)}</dd></div>
                <div><dt className="text-muted">Prazo programado</dt><dd className="u-num mt-1">{dateTime(selected.stop_at)}</dd></div>
                <div><dt className="text-muted">Encerramento</dt><dd className="u-num mt-1">{dateTime(selected.stopped_at)}</dd></div>
                <div><dt className="text-muted">Motivo</dt><dd className="mt-1">{selected.stop_reason || (selected.status === 'active' ? 'Agente operando normalmente' : '—')}</dd></div>
                <div><dt className="text-muted">Última análise</dt><dd className="mt-1">{selected.last_skip_reason || 'Aguardando análise'} · {selected.last_confidence ?? 0}% de confiança</dd></div>
                <div><dt className="text-muted">ID do agente</dt><dd className="u-num mt-1 break-all">{selected.id}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
