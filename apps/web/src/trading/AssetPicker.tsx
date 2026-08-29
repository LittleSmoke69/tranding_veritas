import { useMemo, useState } from 'react';
import { AssetMark } from '../components/AssetMark';
import { Icon } from '../components/Icon';
import { formatAssetPrice, type AssetCategory, type TradingAsset } from '../data/assets';

type AssetPickerProps = {
  open: boolean;
  selectedSymbol: string;
  assets: TradingAsset[];
  onClose: () => void;
  onSelect: (asset: TradingAsset) => void;
};

const NAV: { id: AssetCategory | 'all'; label: string; count?: number }[] = [
  { id: 'trends', label: 'Tendências' },
  { id: 'blitz', label: 'Blitz' },
  { id: 'binary', label: 'Binárias' },
  { id: 'digital', label: 'Digital' },
  { id: 'margin', label: 'Margem' },
  { id: 'watchlist', label: 'Watchlist' },
];

function Flames({ n }: { n: number }) {
  return (
    <span aria-label={`Popularidade ${n} de 3`} className="u-num tracking-tighter text-accent">
      {'▲'.repeat(n)}
      <span className="text-faint">{'▲'.repeat(3 - n)}</span>
    </span>
  );
}

function Bars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-end gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-1 rounded-sm ${i <= n ? 'bg-brand' : 'bg-faint'}`}
          style={{ height: 4 + i * 3 }}
        />
      ))}
    </span>
  );
}

export function AssetPicker({ open, selectedSymbol, assets, onClose, onSelect }: AssetPickerProps) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<AssetCategory | 'all'>('digital');

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of assets) c[a.category] = (c[a.category] || 0) + 1;
    return c;
  }, [assets]);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return assets.filter((a) => {
      if (cat !== 'all' && cat !== 'trends' && a.category !== cat) return false;
      if (cat === 'trends' && a.popularity < 3) return false;
      if (!query) return true;
      return a.label.toLowerCase().includes(query) || a.symbol.toLowerCase().includes(query);
    });
  }, [q, cat, assets]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-stretch justify-center bg-[var(--scrim)] p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-panel border border-line bg-panel shadow-[var(--shadow-float)]">
        <aside className="w-44 shrink-0 border-r border-line bg-app p-3">
          <p className="u-caps mb-3 px-2">Mercados</p>
          {NAV.map((item) => {
            const count =
              item.id === 'trends'
                ? assets.filter((a) => a.popularity === 3).length
                : counts[item.id];
            const active = cat === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCat(item.id)}
                className={`u-focus mb-1 flex w-full items-center justify-between rounded-ctl px-2.5 py-2 text-left text-sm transition ${
                  active ? 'bg-elevated text-ink' : 'text-muted hover:bg-elevated hover:text-ink'
                }`}
              >
                <span>{item.label}</span>
                {count != null && (
                  <span className="u-num rounded-ctl bg-panel px-1.5 text-[10px] text-muted">{count}</span>
                )}
              </button>
            );
          })}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <label className="flex flex-1 items-center gap-2 rounded-ctl border border-line bg-app px-3 focus-within:border-brand">
              <Icon name="search" size={17} className="text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Pesquisar por nome ou ticker"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-faint"
              />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="u-focus flex h-10 w-10 items-center justify-center rounded-ctl text-muted hover:bg-elevated hover:text-ink"
              aria-label="Fechar"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr] gap-2 border-b border-line px-4 py-2 font-cond text-[11px] uppercase tracking-[0.06em] text-muted">
            <span>Ativo</span>
            <span>Lucro</span>
            <span>Popular</span>
            <span>Volatilidade</span>
          </div>

          <div className="u-scroll min-h-0 flex-1 overflow-y-auto">
            {rows.map((a) => {
              const active = a.symbol === selectedSymbol;
              return (
                <button
                  key={a.symbol}
                  type="button"
                  onClick={() => {
                    onSelect(a);
                    onClose();
                  }}
                  className={`u-focus grid w-full grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr] items-center gap-2 border-b border-line px-4 py-3 text-left transition hover:bg-elevated ${
                    active ? 'bg-elevated' : ''
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <AssetMark asset={a} size={32} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{a.label}</span>
                      <span className="u-num block text-xs text-muted">
                        {formatAssetPrice(a.price)}
                      </span>
                    </span>
                  </span>
                  <span className="u-num text-base font-semibold text-bull-text">{a.profitPct}%</span>
                  <Flames n={a.popularity} />
                  <Bars n={a.volatility} />
                </button>
              );
            })}
            {!rows.length && (
              <p className="px-4 py-8 text-center text-sm text-muted">Nenhum ativo encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
