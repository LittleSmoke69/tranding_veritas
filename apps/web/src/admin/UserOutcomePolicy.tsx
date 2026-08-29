import { useState, type FormEvent } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../lib/api';
import type { AdminUser } from './types';

const inputClass = 'u-focus h-11 w-full rounded-ctl border border-line bg-app px-3 text-sm text-ink';

type UserOutcomePolicyProps = {
  user: AdminUser;
  onSaved: (message: string) => Promise<void>;
};

export function UserOutcomePolicy({ user, onSaved }: UserOutcomePolicyProps) {
  const [saving, setSaving] = useState(false);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const alertValue = String(form.get('profit_alert') ?? '').trim();
    setSaving(true);
    try {
      await api(`/api/admin/users/${user.id}/outcome-policy`, {
        method: 'PUT',
        body: JSON.stringify({
          enabled: form.get('enabled') === 'on',
          target_win_rate_pct: Number(form.get('target_win_rate')),
          profit_alert_cents: alertValue
            ? String(Math.round(Number(alertValue) * 100))
            : null,
          reason: form.get('reason'),
        }),
      });
      await onSaved('Política de resultados atualizada e registrada na auditoria.');
    } finally {
      setSaving(false);
    }
  };

  const total = user.wins + user.losses;
  const todayTotal = user.today_wins + user.today_losses;

  return (
    <section className="overflow-hidden rounded-panel border border-brand/30 bg-app/45">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="u-caps text-brand">Política de resultados</p>
          <h3 className="mt-1 font-semibold">Taxa da conta e alerta de lucro</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          user.outcome_policy_enabled ? 'bg-brand/10 text-brand' : 'bg-elevated text-muted'
        }`}>
          {user.outcome_policy_enabled ? 'Controle ativo' : 'Controle desativado'}
        </span>
      </header>

      <div className="grid gap-px border-b border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Taxa total" value={`${user.actual_win_rate_pct}%`} detail={`${user.wins} ganhas · ${user.losses} perdidas`} />
        <Metric label="Operações totais" value={String(total)} detail={`Meta configurada: ${user.target_win_rate_pct}%`} />
        <Metric label="Hoje" value={`${user.today_win_rate_pct}%`} detail={`${user.today_wins} ganhas · ${user.today_losses} perdidas · ${todayTotal} operações`} />
        <Metric
          label="Lucro líquido"
          value={user.net_profit_display}
          detail={user.profit_alert_display ? `Alerta em ${user.profit_alert_display}` : 'Sem alerta configurado'}
          alert={user.profit_alert_reached}
        />
      </div>

      {user.profit_alert_reached && (
        <p role="status" className="flex items-center gap-2 border-b border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          <Icon name="bell" size={17} />
          O lucro alcançou o valor de alerta. As operações continuam normalmente.
        </p>
      )}

      <form onSubmit={(event) => void save(event)} className="grid gap-4 p-4 lg:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm">
          <span className="mb-2 block text-muted">Taxa de vitórias da conta</span>
          <div className="relative">
            <input name="target_win_rate" type="number" min="0" max="100" step="0.1" required defaultValue={user.target_win_rate_pct} className={`${inputClass} pr-9 u-num`} />
            <span className="pointer-events-none absolute right-3 top-3 text-muted">%</span>
          </div>
        </label>
        <label className="text-sm">
          <span className="mb-2 block text-muted">Alerta de lucro opcional</span>
          <input name="profit_alert" type="number" min="0.01" step="0.01" defaultValue={user.profit_alert_cents == null ? '' : Number(user.profit_alert_cents) / 100} placeholder="Ex.: 10000,00" className={`${inputClass} u-num`} />
        </label>
        <label className="text-sm">
          <span className="mb-2 block text-muted">Justificativa da alteração</span>
          <input name="reason" required minLength={3} placeholder="Motivo obrigatório" className={inputClass} />
        </label>
        <div className="flex flex-col justify-end gap-2">
          <label className="flex min-h-11 items-center gap-2 rounded-ctl border border-line bg-panel px-3 text-sm text-muted">
            <input name="enabled" type="checkbox" defaultChecked={user.outcome_policy_enabled} />
            Controlar resultados
          </label>
          <button disabled={saving} className="u-focus min-h-11 rounded-btn bg-brand px-4 font-semibold text-app disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? 'Salvando…' : 'Salvar política'}
          </button>
        </div>
        <p className="text-xs leading-5 text-muted lg:col-span-2 xl:col-span-4">
          A taxa considera operações manuais e dos Agentes de IA em todo o histórico. O alerta monetário não bloqueia nem reduz créditos.
        </p>
      </form>
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
  alert = false,
}: {
  label: string;
  value: string;
  detail: string;
  alert?: boolean;
}) {
  return (
    <div className="bg-panel p-4">
      <span className="u-caps">{label}</span>
      <strong className={`u-num mt-2 block text-xl ${alert ? 'text-accent' : 'text-ink'}`}>{value}</strong>
      <span className="mt-1 block text-xs text-muted">{detail}</span>
    </div>
  );
}
