import { FormEvent, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../lib/api';
import type { AdminUser } from './types';
import { UserOutcomePolicy } from './UserOutcomePolicy';
import { UserProfileEditor } from './UserProfileEditor';

const inputClass = 'u-focus h-11 w-full rounded-ctl border border-line bg-app px-3 text-sm text-ink';
const manageTabs = [
  { id: 'profile', label: 'Dados', icon: 'user' },
  { id: 'access', label: 'Acesso', icon: 'sliders' },
  { id: 'balance', label: 'Saldo', icon: 'wallet' },
  { id: 'agents', label: 'Agentes', icon: 'aiAgent' },
  { id: 'results', label: 'Resultados', icon: 'trendUp' },
] as const;
type ManageTab = typeof manageTabs[number]['id'];

export function UsersAdmin() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState('');
  const [activeManageTab, setActiveManageTab] = useState<ManageTab>('profile');

  const load = useCallback(async () => {
    const data = await api<AdminUser[]>(`/api/admin/users?q=${encodeURIComponent(query)}`);
    setUsers(data);
    setSelected((current) => current
      ? data.find((user) => user.id === current.id) ?? current
      : null);
    return data;
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load().catch((error) => setMessage(error.message)), 200);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form)),
    });
    event.currentTarget.reset();
    setShowCreate(false);
    setMessage('Usuário criado com saldo virtual inicial.');
    await load();
  };

  const saveAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form);
    await api(`/api/admin/users/${selected.id}/access`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...values,
        veritas_access_enabled: values.veritas_access_enabled === 'true',
      }),
    });
    setMessage('Acesso atualizado e registrado na auditoria.');
    await load();
  };

  const adjustBalance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const reais = Number(form.get('amount'));
    await api(`/api/admin/users/${selected.id}/balance`, {
      method: 'POST',
      body: JSON.stringify({
        amount_cents: String(Math.round(reais * 100)),
        reason: form.get('reason'),
      }),
    });
    event.currentTarget.reset();
    setMessage('Saldo virtual ajustado pelo ledger.');
    await load();
  };

  const saveRobotLimits = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    await api(`/api/admin/robots/settings/${selected.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        enabled: form.get('enabled') === 'on',
        allowed_profiles: form.getAll('profiles'),
        max_allocation_cents: String(Math.round(Number(form.get('max_allocation')) * 100)),
        max_target_bps: Math.round(Number(form.get('max_target')) * 100),
        reason: form.get('reason'),
      }),
    });
    setMessage('Meta e limites automáticos atualizados para este usuário.');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex min-w-64 flex-1 items-center gap-2 rounded-ctl border border-line bg-panel px-3">
          <Icon name="search" size={17} className="text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar usuário" className="h-11 min-w-0 flex-1 bg-transparent outline-none" />
        </label>
        <button type="button" onClick={() => setShowCreate((value) => !value)} className="u-focus u-lift flex h-11 items-center gap-2 rounded-btn bg-brand px-4 font-semibold text-app">
          <Icon name="plus" size={18} /> Criar usuário
        </button>
      </div>

      {message && <p role="status" className="rounded-ctl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">{message}</p>}

      {showCreate && (
        <form onSubmit={(event) => void createUser(event).catch((error) => setMessage(error.message))} className="grid gap-3 rounded-panel border border-line bg-panel p-4 md:grid-cols-2 lg:grid-cols-3">
          <input name="full_name" required placeholder="Nome completo" className={inputClass} />
          <input name="email" type="email" required placeholder="E-mail" className={inputClass} />
          <input name="username" placeholder="Usuário (opcional)" className={inputClass} />
          <input name="password" type="password" required minLength={8} placeholder="Senha inicial" className={inputClass} />
          <select name="login_target" defaultValue="trading" className={inputClass}>
            <option value="trading">Somente trading</option><option value="both">CRM + trading</option><option value="crm">Somente CRM</option>
          </select>
          <select name="status" defaultValue="user" className={inputClass}>
            <option value="user">Usuário</option><option value="admin">Admin</option><option value="super_admin">Super admin</option>
          </select>
          <button className="u-focus rounded-btn bg-cta px-4 py-2 font-semibold text-app md:col-span-2 lg:col-span-3">Salvar usuário</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-panel border border-line bg-panel">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="u-caps border-b border-line text-left"><tr>
            <th className="p-3">Usuário</th><th>Acesso</th><th>Perfil</th><th>Taxa de vitórias</th><th className="text-right">Lucro líquido</th><th className="text-right">Saldo</th><th className="p-3 text-right">Ações</th>
          </tr></thead>
          <tbody>{users.map((user) => (
            <tr key={user.id} className="border-b border-line last:border-0 hover:bg-elevated">
              <td className="p-3"><strong className="block">{user.full_name || user.username}</strong><span className="text-xs text-muted">{user.email}</span></td>
              <td className="uppercase text-muted">{user.veritas_access_enabled ? user.login_target : 'suspenso'}</td>
              <td className="text-muted">{user.status || 'user'}</td>
              <td>
                <span className="u-num font-semibold text-ink">{user.actual_win_rate_pct}%</span>
                <span className="ml-2 text-xs text-muted">meta {user.target_win_rate_pct}%</span>
                <span className="mt-1 block text-xs text-muted">{user.wins}G · {user.losses}P</span>
              </td>
              <td className={`u-num text-right font-semibold ${user.profit_alert_reached ? 'text-accent' : 'text-ink'}`}>
                {user.net_profit_display}
                {user.profit_alert_reached && <span className="ml-1 text-xs">Alerta</span>}
              </td>
              <td className="u-num text-right font-semibold text-accent">{user.cash_display}</td>
              <td className="p-3 text-right"><button type="button" onClick={() => {
                setActiveManageTab('profile');
                setMessage('');
                setSelected(user);
              }} className="u-focus rounded-ctl border border-line px-3 py-2 text-xs hover:border-brand">Gerenciar</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm lg:p-6"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelected(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-user-title"
            className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-panel border border-line bg-panel shadow-[var(--shadow-sheet)]"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-base font-semibold text-brand">
                  {(selected.full_name || selected.email).slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 id="manage-user-title" className="truncate text-lg font-semibold">{selected.full_name || selected.email}</h2>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="truncate">{selected.email}</span>
                    <span aria-hidden>•</span>
                    <span className={selected.veritas_access_enabled ? 'text-bull' : 'text-bear'}>
                      {selected.veritas_access_enabled ? 'Acesso ativo' : 'Acesso suspenso'}
                    </span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Fechar gerenciamento" className="u-focus flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl text-muted hover:bg-elevated hover:text-ink"><Icon name="close" /></button>
            </header>

            <nav aria-label="Seções do usuário" className="u-scroll flex shrink-0 gap-1 overflow-x-auto border-b border-line px-3 pt-2 sm:px-5">
              {manageTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveManageTab(tab.id);
                    setMessage('');
                  }}
                  aria-current={activeManageTab === tab.id ? 'page' : undefined}
                  className={`u-focus flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm transition ${
                    activeManageTab === tab.id
                      ? 'border-brand font-semibold text-brand'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  <Icon name={tab.icon} size={17} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="u-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              {message && <p role="status" className="mb-4 rounded-ctl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">{message}</p>}

              {activeManageTab === 'profile' && (
                <UserProfileEditor
                  key={`${selected.id}:${selected.email}:${selected.username}:${selected.full_name}:${selected.telefone}`}
                  user={selected}
                  onSaved={async (nextMessage) => {
                    setMessage(nextMessage);
                    await load();
                  }}
                />
              )}

              {activeManageTab === 'access' && (
                <form onSubmit={(event) => void saveAccess(event).catch((error) => setMessage(error.message))} className="grid gap-4 rounded-panel border border-line bg-app/45 p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="u-caps text-brand">Acesso e permissões</p>
                    <h3 className="mt-1 font-semibold">Defina onde e como o usuário pode entrar</h3>
                  </div>
                  <Field label="Produtos liberados"><select name="login_target" defaultValue={selected.login_target} className={inputClass}><option value="trading">Somente trading</option><option value="both">CRM + trading</option><option value="crm">Somente CRM</option></select></Field>
                  <Field label="Perfil de permissão"><select name="status" defaultValue={selected.status || 'user'} className={inputClass}><option value="user">Usuário</option><option value="admin">Administrador</option><option value="super_admin">Super administrador</option></select></Field>
                  <Field label="Situação do acesso"><select name="veritas_access_enabled" defaultValue={String(selected.veritas_access_enabled)} className={inputClass}><option value="true">Ativo</option><option value="false">Suspenso</option></select></Field>
                  <Field label="Justificativa"><input name="reason" required minLength={3} placeholder="Motivo obrigatório para auditoria" className={inputClass} /></Field>
                  <button className="u-focus min-h-11 rounded-btn bg-brand px-4 font-semibold text-app sm:col-span-2">Salvar acesso</button>
                </form>
              )}

              {activeManageTab === 'balance' && (
                <form onSubmit={(event) => void adjustBalance(event).catch((error) => setMessage(error.message))} className="mx-auto grid max-w-xl gap-4 rounded-panel border border-line bg-app/45 p-4">
                  <div className="rounded-ctl border border-accent/30 bg-accent/10 p-4">
                    <span className="u-caps text-muted">Saldo virtual atual</span>
                    <strong className="u-num mt-1 block text-2xl text-accent">{selected.cash_display}</strong>
                  </div>
                  <Field label="Valor do ajuste em reais" hint="Use um valor positivo para adicionar ou negativo para remover.">
                    <div className="flex items-center rounded-ctl border border-line bg-app px-3 focus-within:border-brand">
                      <span className="text-sm text-muted">R$</span>
                      <input name="amount" type="number" step="0.01" required placeholder="0,00" className="h-11 min-w-0 flex-1 bg-transparent px-2 text-ink outline-none u-num" />
                    </div>
                  </Field>
                  <Field label="Justificativa"><input name="reason" required minLength={3} placeholder="Motivo obrigatório para auditoria" className={inputClass} /></Field>
                  <button className="u-focus min-h-11 rounded-btn bg-accent px-4 font-semibold text-app">Registrar ajuste</button>
                </form>
              )}

              {activeManageTab === 'agents' && (
                <form onSubmit={(event) => void saveRobotLimits(event).catch((error) => setMessage(error.message))} className="grid gap-4 rounded-panel border border-line bg-app/45 p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="u-caps text-brand">Agentes de IA</p>
                    <h3 className="mt-1 font-semibold">Limites de automação da conta</h3>
                  </div>
                  <Field label="Capital máximo"><input name="max_allocation" type="number" min="10" required defaultValue="10000" className={inputClass} /></Field>
                  <Field label="Meta máxima de lucro (%)"><input name="max_target" type="number" min="0.5" max="8" step="0.1" required defaultValue="8" className={inputClass} /></Field>
                  <fieldset className="sm:col-span-2">
                    <legend className="mb-2 text-sm text-muted">Perfis permitidos</legend>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {[['conservative', 'Conservador'], ['moderate', 'Moderado'], ['aggressive', 'Agressivo']].map(([value, label]) => (
                        <label key={value} className="flex min-h-11 items-center gap-2 rounded-ctl border border-line bg-panel px-3 text-sm">
                          <input type="checkbox" name="profiles" value={value} defaultChecked />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="flex min-h-11 items-center gap-2 rounded-ctl border border-line bg-panel px-3 text-sm"><input type="checkbox" name="enabled" defaultChecked />Permitir agentes nesta conta</label>
                  <Field label="Justificativa"><input name="reason" required minLength={3} placeholder="Motivo da configuração" className={inputClass} /></Field>
                  <button className="u-focus min-h-11 rounded-btn bg-brand px-4 font-semibold text-app sm:col-span-2">Salvar limites dos agentes</button>
                </form>
              )}

              {activeManageTab === 'results' && (
                <UserOutcomePolicy
                  key={selected.id}
                  user={selected}
                  onSaved={async (nextMessage) => {
                    setMessage(nextMessage);
                    await load();
                  }}
                />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="text-sm">
      <span className="mb-2 block text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-5 text-muted">{hint}</span>}
    </label>
  );
}
