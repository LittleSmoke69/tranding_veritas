import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { formatAssetPrice } from '../data/assets';
import type { BinaryPosition } from './PositionsBar';

type AgentPositionsProps = {
  positions: BinaryPosition[];
  activeSymbol: string;
  livePrice: number;
};

const countdown = (expiresAt: string, now: number) => {
  const seconds = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

export function AgentPositions({
  positions,
  activeSymbol,
  livePrice,
}: AgentPositionsProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!positions.some((position) => position.status === 'open')) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [positions]);

  return (
    <section className="overflow-hidden rounded-panel border border-line bg-panel" aria-labelledby="agent-positions-title">
      <header className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="u-caps text-brand">Operações automáticas</p>
          <h2 id="agent-positions-title" className="mt-1 text-lg font-semibold">Entradas do Agente de IA</h2>
        </div>
        <span className="u-num rounded-full bg-elevated px-2.5 py-1 text-xs text-muted">{positions.length}</span>
      </header>

      {!positions.length ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-8 text-center">
          <Icon name="candles" size={27} className="text-faint" />
          <p className="text-sm text-muted">Nenhuma entrada foi aberta ainda.</p>
          <p className="text-xs text-faint">O agente está aguardando uma confirmação válida da estratégia.</p>
        </div>
      ) : (
        <div className="u-scroll overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-app/70 text-left">
              <tr className="u-caps">
                <th className="px-4 py-3">Ativo</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Direção</th>
                <th className="px-4 py-3 text-right">Expira em</th>
                <th className="px-4 py-3 text-right">Investimento</th>
                <th className="px-4 py-3 text-right">Abertura</th>
                <th className="px-4 py-3 text-right">Preço atual</th>
                <th className="px-4 py-3 text-right">Situação</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => {
                const isOpen = position.status === 'open';
                const currentPrice = isOpen && position.symbol === activeSymbol
                  ? livePrice
                  : position.exit_price ?? position.entry_price;
                const isUp = position.side === 'up';
                return (
                  <tr key={position.id} className="border-t border-line text-ink transition hover:bg-elevated">
                    <td className="px-4 py-3 font-semibold">{position.symbol.replace('_OTC', ' OTC')}</td>
                    <td className="px-4 py-3 text-muted">
                      <span className="block">Opção binária</span>
                      {position.is_assisted && (
                        <span className="mt-1 inline-flex rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                          {position.assistance_reason === 'account_win_rate_policy'
                            ? 'Política da conta'
                            : 'Inicial assistida'}
                        </span>
                      )}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${isUp ? 'text-bull-text' : 'text-bear-text'}`}>
                      <span className="flex items-center gap-1.5">
                        <Icon name={isUp ? 'trendUp' : 'trendDown'} size={15} />
                        {isUp ? 'Acima · Alta' : 'Abaixo · Baixa'}
                      </span>
                    </td>
                    <td className="u-num px-4 py-3 text-right text-accent">{isOpen ? countdown(position.expires_at, now) : '00:00'}</td>
                    <td className="u-num px-4 py-3 text-right">{position.stake_display}</td>
                    <td className="u-num px-4 py-3 text-right">{formatAssetPrice(position.entry_price)}</td>
                    <td className="u-num px-4 py-3 text-right">{formatAssetPrice(currentPrice)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        isOpen ? 'bg-brand/10 text-brand' : position.status === 'won' ? 'bg-bull/10 text-bull-text' : 'bg-bear/10 text-bear-text'
                      }`}>
                        {isOpen ? 'Em andamento' : position.status === 'won' ? 'Ganha' : 'Perdida'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
