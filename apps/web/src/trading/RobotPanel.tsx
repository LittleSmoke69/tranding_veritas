import { useCallback, useEffect, useState } from 'react';
import { ROBOT_PROFILES, type RobotProfileCode } from '@veritas/shared';
import { Icon } from '../components/Icon';
import { api } from '../lib/api';
import type { TradingAsset } from '../data/assets';
import { AgentHistory } from './AgentHistory';
import { AgentActivationLoading } from './AgentActivationLoading';
import { AgentPositions } from './AgentPositions';
import type { BinaryPosition } from './PositionsBar';

export type RobotInstance = {
  id: string;
  profile_code: RobotProfileCode;
  status: string;
  allocation_cents: string;
  allocation_display: string;
  target_bps: number;
  pnl_display: string;
  target_display: string;
  progress_pct: number;
  wins: number;
  losses: number;
  win_rate: number;
  symbols: string[];
  started_at: string;
  stop_at: string;
  stopped_at: string | null;
  stop_reason: string | null;
  last_decision: 'enter' | 'skip' | null;
  last_skip_reason: string | null;
  last_confidence: number | null;
  last_signal_at: string | null;
  signal_count: number;
  position_count: number;
};

const analysisTime = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date(value))
    : null;

const nextCycleCountdown = (intervalSec: number, now: number) => {
  const currentSecond = Math.floor(now / 1000);
  const remaining = intervalSec - (currentSecond % intervalSec);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

type RobotPanelProps = {
  asset: TradingAsset;
  positions: BinaryPosition[];
  livePrice: number;
};

export function RobotPanel({ asset, positions, livePrice }: RobotPanelProps) {
  const [profile, setProfile] = useState<RobotProfileCode>('conservative');
  const [allocation, setAllocation] = useState(1000);
  const [target, setTarget] = useState(1);
  const [instances, setInstances] = useState<RobotInstance[]>([]);
  const [message, setMessage] = useState('');
  const [activating, setActivating] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const selected = ROBOT_PROFILES[profile];
  const active = instances.find((item) => item.status === 'active');
  const visibleInstance = active ?? instances[0];
  const agentPositions = visibleInstance
    ? positions.filter((position) => position.robot_instance_id === visibleInstance.id)
    : [];
  const load = useCallback(async () => setInstances(await api<RobotInstance[]>('/robots')), []);

  useEffect(() => {
    void load().catch((error) => setMessage(error.message));
    const timer = window.setInterval(() => void load().catch(() => undefined), 6_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [active?.id]);

  const choose = (code: RobotProfileCode) => {
    setProfile(code);
    setTarget(ROBOT_PROFILES[code].targetMaxBps / 100);
  };

  const start = async () => {
    if (activating) return;
    setActivating(true);
    setMessage('');
    const startedAt = Date.now();
    try {
      await api('/robots/start', {
        method: 'POST',
        body: JSON.stringify({
          profile_code: profile,
          allocation_cents: String(Math.round(allocation * 100)),
          target_bps: Math.round(target * 100),
          duration_hours: 12,
          symbols: [asset.symbol],
        }),
      });
      const remaining = Math.max(0, 1_600 - (Date.now() - startedAt));
      if (remaining) await new Promise((resolve) => window.setTimeout(resolve, remaining));
      await load();
      setMessage('Agente de IA ativado. A primeira análise será exibida em instantes.');
    } finally {
      setActivating(false);
    }
  };

  const stop = async () => {
    if (!active || stopping) return;
    setStopping(true);
    setMessage('Interrompendo o Agente de IA…');
    try {
      await api(`/robots/${active.id}/stop`, { method: 'POST' });
      setInstances((current) => current.map((instance) =>
        instance.id === active.id
          ? { ...instance, status: 'stopped', stopped_at: new Date().toISOString(), stop_reason: 'Interrompido pelo usuário' }
          : instance));
      setMessage('Agente de IA interrompido com sucesso.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível parar o agente. Tente novamente.');
    } finally {
      setStopping(false);
    }
  };

  return (
    <section className="u-scroll h-full overflow-y-auto bg-chart p-4 lg:p-6" aria-label="Agentes de IA para trading">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="relative overflow-hidden rounded-panel border border-brand/40 bg-panel p-5 md:p-7">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[32px] border-brand/5" aria-hidden="true" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 u-caps text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                Oferta principal Veritas
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Agentes de IA para Trading
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Automação inteligente com estratégias transparentes, limites de risco e acompanhamento em tempo real.
              </p>
            </div>
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-panel border border-brand/40 bg-brand/10 text-brand">
              <Icon name="aiAgent" size={52} strokeWidth={1.25} />
            </div>
          </div>
          <div className="relative mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-ctl border border-line bg-line text-center">
            {['Operação 24/7', 'Risco controlado', '3 estratégias'].map((benefit) => (
              <span key={benefit} className="bg-app/80 px-2 py-3 text-xs font-medium text-ink">{benefit}</span>
            ))}
          </div>
        </header>

        <div>
          <p className="u-caps text-brand">Escolha seu perfil</p>
          <h2 className="mt-1 text-xl font-semibold">Qual agente combina com sua estratégia?</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {(Object.keys(ROBOT_PROFILES) as RobotProfileCode[]).map((code) => {
            const item = ROBOT_PROFILES[code];
            const isSelected = profile === code;
            const strategyIcon = code === 'conservative' ? 'trendUp' : code === 'moderate' ? 'bars' : 'flag';
            return <button key={code} type="button" aria-pressed={isSelected} onClick={() => choose(code)} className={`u-focus group cursor-pointer rounded-panel border p-5 text-left transition duration-200 ${isSelected ? 'border-brand bg-brand/10 shadow-[inset_0_0_0_1px_var(--brand)]' : 'border-line bg-panel hover:-translate-y-0.5 hover:border-brand/50 hover:bg-elevated'}`}>
              <span className="flex items-start justify-between gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-panel border transition ${isSelected ? 'border-brand/50 bg-brand text-app' : 'border-line bg-app text-brand group-hover:border-brand/40'}`}>
                  <Icon name="aiAgent" size={28} strokeWidth={1.5} />
                </span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full border border-line ${code === 'aggressive' ? 'text-bear-text' : 'text-brand'}`}>
                  <Icon name={strategyIcon} size={18} />
                </span>
              </span>
              <span className="mt-4 block text-xs font-medium text-muted">Agente IA</span>
              <strong className="mt-0.5 block text-lg">{item.name}</strong>
              <span className="u-num mt-4 block text-3xl font-semibold text-ink">{item.targetMinBps / 100}%–{item.targetMaxBps / 100}%</span>
              <span className="u-caps mt-1 block">Meta sobre capital alocado</span>
              <span className="mt-4 block border-t border-line pt-3 text-xs leading-5 text-muted">Stake até {item.stakeBps / 100}% · stop {item.stopLossBps / 100}% · vela {item.intervalSec === 300 ? '5m' : item.intervalSec === 60 ? '1m' : '15s'}</span>
            </button>;
          })}
        </div>
        <p className="flex items-center gap-2 rounded-ctl border border-brand/30 bg-brand/10 px-4 py-3 text-xs text-brand">
          <Icon name="info" size={16} />
          A primeira operação de cada ativação é assistida e identificada no histórico; as seguintes obedecem integralmente à estratégia escolhida.
        </p>

        {active ? (
          <div className="rounded-panel border border-brand/40 bg-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="u-caps text-brand">Agente IA em execução</p><h3 className="text-lg font-semibold">{ROBOT_PROFILES[active.profile_code].name}</h3></div><button type="button" disabled={stopping} onClick={() => void stop()} className="u-focus min-h-11 rounded-btn border border-bear/50 px-4 py-2 text-sm text-bear-text disabled:cursor-not-allowed disabled:opacity-50">{stopping ? 'Parando agente…' : 'Parar agente'}</button></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-app"><div className="h-full bg-brand transition-[width]" style={{ width: `${Math.max(0, active.progress_pct)}%` }} /></div>
            <div className="mt-4 flex flex-col gap-3 rounded-panel border border-line bg-app/70 p-4 sm:flex-row sm:items-center">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-brand">
                <span className="absolute inset-1 animate-ping rounded-full border border-brand/30" aria-hidden="true" />
                <Icon name={active.last_decision === 'enter' ? 'trendUp' : 'aiAgent'} size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm">
                  {active.last_decision === 'enter' ? 'Sinal identificado e operação enviada' : 'Analisando o mercado'}
                </strong>
                <p className="mt-1 text-xs text-muted">
                  {active.last_skip_reason || 'Aguardando a próxima leitura da estratégia.'}
                </p>
                <p className="mt-1 text-[11px] text-faint">
                  {active.last_signal_at
                    ? `Última leitura às ${analysisTime(active.last_signal_at)} · novo ciclo a cada ${ROBOT_PROFILES[active.profile_code].intervalSec === 300 ? '5 min' : ROBOT_PROFILES[active.profile_code].intervalSec === 60 ? '1 min' : '15 s'}`
                    : 'A primeira leitura será exibida em instantes.'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-xs sm:text-right">
                <div><span className="u-num block font-semibold text-ink">{active.signal_count}</span><span className="text-muted">análises</span></div>
                <div><span className="u-num block font-semibold text-ink">{active.position_count}</span><span className="text-muted">operações</span></div>
                <div><span className="u-num block font-semibold text-ink">{active.last_confidence ?? 0}%</span><span className="text-muted">confiança</span></div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-ctl border border-brand/30 bg-brand/10 px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-muted">
                <Icon name="timer" size={18} className="text-brand" />
                Próxima análise
              </span>
              <strong className="u-num text-xl text-brand">
                {nextCycleCountdown(ROBOT_PROFILES[active.profile_code].intervalSec, now)}
              </strong>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4"><div><span className="u-caps block">Capital</span>{active.allocation_display}</div><div><span className="u-caps block">Resultado</span><strong className={active.pnl_display.startsWith('-') ? 'text-bear-text' : 'text-bull-text'}>{active.pnl_display}</strong></div><div><span className="u-caps block">Meta</span>{active.target_display}</div><div><span className="u-caps block">Ganhas/perdidas</span>{active.wins}/{active.losses} · {active.win_rate}%</div></div>
          </div>
        ) : (
          <div className="grid gap-4 rounded-panel border border-line bg-panel p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="text-sm"><span className="u-caps mb-2 block">Capital virtual alocado</span><input type="number" min="10" value={allocation} onChange={(e) => setAllocation(Number(e.target.value))} className="u-focus h-11 w-full rounded-ctl border border-line bg-app px-3 u-num" /></label>
            <label className="text-sm"><span className="u-caps mb-2 block">Meta de lucro</span><input type="number" min={selected.targetMinBps / 100} max={selected.targetMaxBps / 100} step="0.1" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="u-focus h-11 w-full rounded-ctl border border-line bg-app px-3 u-num" /></label>
            <button disabled={activating} onClick={() => void start().catch((error) => setMessage(error.message))} className="u-focus u-lift h-11 rounded-btn bg-cta px-5 font-semibold text-app disabled:cursor-not-allowed disabled:opacity-50">{activating ? 'Ativando…' : 'Ativar Agente IA'}</button>
          </div>
        )}
        {visibleInstance && (
          <AgentPositions
            positions={agentPositions}
            activeSymbol={asset.symbol}
            livePrice={livePrice}
          />
        )}
        <AgentHistory instances={instances} />
        {message && <p role="status" className="rounded-ctl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">{message}</p>}
      </div>
      {activating && (
        <AgentActivationLoading
          profileName={selected.name}
          assetName={asset.name}
        />
      )}
    </section>
  );
}
