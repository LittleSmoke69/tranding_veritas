import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../lib/api';
import type { AdminInstrument } from './types';

const field = 'u-focus h-10 rounded-ctl border border-line bg-app px-3 text-sm';

export function AssetsAdmin() {
  const [assets, setAssets] = useState<AdminInstrument[]>([]);
  const [editing, setEditing] = useState<AdminInstrument | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const load = useCallback(async () => setAssets(await api<AdminInstrument[]>('/api/admin/instruments')), []);
  useEffect(() => { void load().catch((error) => setMessage(error.message)); }, [load]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      ...raw,
      base_price: Number(raw.base_price),
      volatility_bps: Number(raw.volatility_bps),
      payout_pct: Number(raw.payout_pct),
      products_enabled: [String(raw.category) === 'margin' ? 'margin' : 'binary'],
    };
    await api(editing ? `/api/admin/instruments/${editing.symbol}` : '/api/admin/instruments', {
      method: editing ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    });
    setEditing(null); setCreating(false); setMessage('Ativo salvo com sucesso.'); await load();
  };

  const disable = async (asset: AdminInstrument) => {
    await api(`/api/admin/instruments/${asset.symbol}`, { method: 'DELETE' });
    setMessage('Ativo desativado; o histórico foi preservado.');
    await load();
  };

  const formAsset = editing;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="text-lg font-semibold">Catálogo e gráficos</h2><p className="text-sm text-muted">O preço base e a volatilidade alimentam o gráfico simulado compartilhado.</p></div>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="u-focus u-lift flex h-11 items-center gap-2 rounded-btn bg-brand px-4 font-semibold text-app"><Icon name="plus" size={18} /> Novo ativo</button>
      </div>
      {message && <p role="status" className="rounded-ctl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">{message}</p>}
      {(creating || editing) && (
        <form onSubmit={(event) => void save(event).catch((error) => setMessage(error.message))} className="grid gap-3 rounded-panel border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-4">
          <input name="symbol" required readOnly={Boolean(editing)} defaultValue={formAsset?.symbol} placeholder="Símbolo: NOVO_OTC" className={field} />
          <input name="name" required defaultValue={formAsset?.name} placeholder="Nome do ativo" className={field} />
          <select name="asset_class" defaultValue={formAsset?.asset_class || 'otc'} className={field}><option value="otc">OTC</option><option value="forex">Forex</option><option value="crypto">Cripto</option><option value="equity">Ação</option><option value="commodity">Commodity</option><option value="index">Índice</option></select>
          <input name="quote_currency" required maxLength={3} defaultValue={formAsset?.quote_currency || 'USD'} placeholder="Moeda" className={field} />
          <input name="base_price" type="number" step="0.00000001" min="0.00000001" required defaultValue={formAsset?.base_price} placeholder="Preço base" className={field} />
          <input name="volatility_bps" type="number" min="1" max="1000" required defaultValue={formAsset?.volatility_bps || 15} placeholder="Volatilidade bps" className={field} />
          <input name="payout_pct" type="number" min="1" max="100" required defaultValue={formAsset?.payout_pct || 85} placeholder="Payout %" className={field} />
          <select name="category" defaultValue={formAsset?.category || 'binary'} className={field}><option value="binary">Binária</option><option value="blitz">Blitz</option><option value="digital">Digital</option><option value="margin">Margem</option></select>
          <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
            <button className="u-focus rounded-btn bg-cta px-5 py-2 font-semibold text-app">Salvar ativo</button>
            <button type="button" onClick={() => { setCreating(false); setEditing(null); }} className="u-focus rounded-btn border border-line px-5 py-2 text-muted">Cancelar</button>
          </div>
        </form>
      )}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <article key={asset.symbol} className={`rounded-panel border border-line bg-panel p-4 ${asset.is_active ? '' : 'opacity-55'}`}>
            <div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold">{asset.name}</h3><p className="u-caps mt-1">{asset.symbol} · {asset.asset_class}</p></div><span className={`rounded-ctl px-2 py-1 text-[10px] ${asset.is_active ? 'bg-bull/15 text-bull-text' : 'bg-bear/15 text-bear-text'}`}>{asset.is_active ? 'ATIVO' : 'INATIVO'}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs"><div><span className="u-caps block">Preço</span><strong className="u-num">{asset.base_price}</strong></div><div><span className="u-caps block">Payout</span><strong className="u-num text-bull-text">{asset.payout_pct}%</strong></div><div><span className="u-caps block">Vol.</span><strong className="u-num">{asset.volatility_bps} bps</strong></div></div>
            <div className="mt-4 flex gap-2"><button onClick={() => { setEditing(asset); setCreating(false); }} className="u-focus flex-1 rounded-ctl border border-line py-2 text-xs hover:border-brand">Editar</button>{asset.is_active && <button onClick={() => void disable(asset).catch((error) => setMessage(error.message))} className="u-focus flex-1 rounded-ctl border border-bear/40 py-2 text-xs text-bear-text">Desativar</button>}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
