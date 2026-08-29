import { useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import type { AdminUser } from './types';

const inputClass = 'u-focus h-11 w-full rounded-ctl border border-line bg-app px-3 text-sm text-ink';

type UserProfileEditorProps = {
  user: AdminUser;
  onSaved: (message: string) => Promise<void>;
};

export function UserProfileEditor({ user, onSaved }: UserProfileEditorProps) {
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSaving(true);
    try {
      await api(`/api/admin/users/${user.id}/profile`, {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: form.get('full_name'),
          email: form.get('email'),
          phone: form.get('phone'),
          username: form.get('username'),
          password: form.get('password'),
          reason: form.get('reason'),
        }),
      });
      formElement.reset();
      await onSaved('Informações do usuário atualizadas e registradas na auditoria.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(event) => void save(event)} className="grid gap-4 rounded-panel border border-line bg-app/45 p-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="u-caps text-brand">Informações do usuário</p>
        <h3 className="mt-1 font-semibold">Dados pessoais e credenciais</h3>
      </div>

      <label className="text-sm">
        <span className="mb-2 block text-muted">Nome completo</span>
        <input name="full_name" required minLength={2} defaultValue={user.full_name ?? ''} className={inputClass} />
      </label>
      <label className="text-sm">
        <span className="mb-2 block text-muted">E-mail de acesso</span>
        <input name="email" type="email" required defaultValue={user.email} autoComplete="off" className={inputClass} />
      </label>
      <label className="text-sm">
        <span className="mb-2 block text-muted">Telefone com DDD</span>
        <input name="phone" type="tel" required minLength={10} maxLength={30} defaultValue={user.telefone ?? ''} autoComplete="off" className={inputClass} />
      </label>
      <label className="text-sm">
        <span className="mb-2 block text-muted">Nome de usuário</span>
        <input name="username" required minLength={3} pattern="[a-zA-Z0-9._-]+" defaultValue={user.username ?? ''} autoComplete="off" className={inputClass} />
      </label>

      <label className="text-sm">
        <span className="mb-2 block text-muted">Nova senha opcional</span>
        <div className="relative">
          <input name="password" type={showPassword ? 'text' : 'password'} minLength={8} autoComplete="new-password" placeholder="Mínimo de 8 caracteres" className={`${inputClass} pr-20`} />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="u-focus absolute right-1 top-1 h-9 rounded-ctl px-2 text-xs text-muted hover:text-ink">
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </label>
      <label className="text-sm">
        <span className="mb-2 block text-muted">Justificativa da alteração</span>
        <input name="reason" required minLength={3} placeholder="Motivo obrigatório para auditoria" className={inputClass} />
      </label>

      <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-3 text-xs text-muted md:col-span-2">
        <span>ID: <span className="u-num text-ink">{user.id}</span></span>
        <span>Conta: <span className="u-num text-ink">{user.account_id ?? 'Ainda não criada'}</span></span>
        <span>Cadastro: <span className="u-num text-ink">{new Intl.DateTimeFormat('pt-BR').format(new Date(user.created_at))}</span></span>
      </div>

      <button disabled={saving} className="u-focus min-h-11 rounded-btn bg-cta px-4 font-semibold text-app disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2">
        {saving ? 'Salvando alterações…' : 'Salvar informações do usuário'}
      </button>
    </form>
  );
}
