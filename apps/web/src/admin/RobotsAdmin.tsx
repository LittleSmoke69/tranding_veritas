import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { AdminRobot } from './types';

const field = 'u-focus h-10 rounded-ctl border border-line bg-app px-3 text-sm';

function money(cents: string) {
  return (Number(cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function RobotsAdmin() {
  const [robots, setRobots] = useState<AdminRobot[]>([]);
  const [message, setMessage] = useState('');
  const load = useCallback(async () => setRobots(await api<AdminRobot[]>('/api/admin/robots')), []);
  useEffect(() => {
    void load().catch((error) => setMessage(error.message));
    const timer = window.setInterval(() => void load().catch(() => undefined), 5_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const stop = async (id: string) => {
    await api(`/api/admin/robots/${id}/stop`, { method: 'POST' });
    setMessage('Robô interrompido pelo administrador.');
    await load();
  };

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const userId = String(form.get('user_id'));
    await api(`/api/admin/robots/settings/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        enabled: form.get('enabled') === 'on',
        allowed_profiles: form.getAll('profiles'),
        max_allocation_cents: String(Math.round(Number(form.get('max_allocation')) * 100)),
        max_target_bps: Math.round(Number(form.get('max_target')) * 100),
        reason: form.get('reason'),
      }),
    });
    setMessage('Limites do usuário atualizados.');
  };

  const active = robots.filter((robot) => robot.status === 'active');
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-panel border border-line bg-panel p-4"><span className="u-caps">Em execução</span><strong className="u-num mt-1 block text-3xl text-brand">{active.length}</strong></div>
        <div className="rounded-panel border border-line bg-panel p-4"><span className="u-caps">Operações ganhas</span><strong className="u-num mt-1 block text-3xl text-bull-text">{robots.reduce((sum, r) => sum + r.wins, 0)}</strong></div>
        <div className="rounded-panel border border-line bg-panel p-4"><span className="u-caps">Operações perdidas</span><strong className="u-num mt-1 block text-3xl text-bear-text">{robots.reduce((sum, r) => sum + r.losses, 0)}</strong></div>
      </div>
      {message && <p role="status" className="rounded-ctl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">{message}</p>}

      <form onSubmit={(event) => void saveSettings(event).catch((error) => setMessage(error.message))} className="grid gap-3 rounded-panel border border-line bg-panel p-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-4"><h2 className="font-semibold">Limites por usuário</h2><p className="text-sm text-muted">Configure risco e disponibilidade; resultados nunca são forçados.</p></div>
        <input name="user_id" required placeholder="ID do usuário" className={field} />
        <input name="max_allocation" type="number" min="1" required defaultValue="10000" placeholder="Capital máximo em R$" className={field} />
        <input name="max_target" type="number" min="0.01" max="50" step="0.01" required defaultValue="8" placeholder="Meta máxima %" className={field} />
        <input name="reason" required placeholder="Motivo da alteração" className={field} />
        <fieldset className="flex flex-wrap items-center gap-4 md:col-span-2"><legend className="u-caps mb-2">Perfis permitidos</legend>{['conservative','moderate','aggressive'].map((code) => <label key={code} className="flex items-center gap-2 text-sm"><input type="checkbox" name="profiles" value={code} defaultChecked />{code}</label>)}</fieldset>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="enabled" defaultChecked />Automação habilitada</label>
        <button className="u-focus rounded-btn bg-brand px-4 py-2 font-semibold text-app">Salvar limites</button>
      </form>

      <div className="overflow-x-auto rounded-panel border border-line bg-panel">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="u-caps border-b border-line text-left"><tr><th className="p-3">Usuário</th><th>Perfil</th><th>Status</th><th className="text-right">Capital</th><th className="text-right">P/L</th><th className="text-right">G/P</th><th className="p-3 text-right">Controle</th></tr></thead>
          <tbody>{robots.map((robot) => <tr key={robot.id} className="border-b border-line last:border-0 hover:bg-elevated">
            <td className="p-3"><strong className="block">{robot.full_name || robot.email}</strong><span className="text-xs text-muted">{robot.email}</span></td>
            <td className="capitalize">{robot.profile_code}</td><td className="text-muted">{robot.status}</td>
            <td className="u-num text-right">{money(robot.allocation_cents)}</td>
            <td className={`u-num text-right font-semibold ${Number(robot.pnl_cents) >= 0 ? 'text-bull-text' : 'text-bear-text'}`}>{money(robot.pnl_cents)}</td>
            <td className="u-num text-right">{robot.wins}/{robot.losses}</td>
            <td className="p-3 text-right">{robot.status === 'active' ? <button onClick={() => void stop(robot.id).catch((error) => setMessage(error.message))} className="u-focus rounded-ctl border border-bear/40 px-3 py-2 text-xs text-bear-text">Interromper</button> : '—'}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
