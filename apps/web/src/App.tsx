import { FormEvent, useEffect, useState } from 'react';

type MeData = {
  user: {
    id: string;
    email: string;
    username?: string | null;
    full_name?: string | null;
  };
  account: { id: string; mode: string; currency: string };
  cash_cents: string;
  cash_display: string;
  simulation: boolean;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }
  return json.data as T;
}

function SimulationStamp() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-rose-500/40 bg-rose-950/90 px-4 py-2 text-center text-xs font-semibold tracking-[0.2em] text-rose-200">
      SIMULAÇÃO — NENHUM VALOR REAL É MOVIMENTADO
    </footer>
  );
}

export function App() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<MeData | null>(null);

  useEffect(() => {
    void api<MeData>('/auth/me')
      .then(setSession)
      .catch(() => setSession(null));
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };
      const data = await api<MeData & { message?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    setSession(null);
  };

  return (
    <div className="min-h-screen pb-14">
      <header className="border-b border-stone-800/80 px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand)]">VeritasTrader</p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-50">Terminal de simulação</h1>
          </div>
          <span className="rounded border border-rose-500/50 bg-rose-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-300">
            Simulação
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-12">
        {!session ? (
          <form onSubmit={onLogin} className="space-y-4 rounded-2xl border border-stone-800 bg-stone-900/60 p-6 shadow-2xl">
            <p className="text-sm text-stone-400">
              Login próprio Validando <code className="text-stone-300">profiles</code> do Zaploto.
              Requer <code className="text-stone-300">login_target = trading | both</code>.
            </p>
            <label className="block text-sm">
              <span className="text-stone-400">Usuário ou e-mail</span>
              <input
                className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 outline-none focus:border-[var(--brand)]"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-stone-400">Senha</span>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 outline-none focus:border-[var(--brand)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-stone-950 disabled:opacity-60"
            >
              {busy ? 'Entrando…' : 'Entrar na simulação'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
            <p className="text-sm text-stone-400">Conta demo criada no primeiro acesso com crédito virtual.</p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-stone-800 pb-2">
                <dt className="text-stone-500">Usuário</dt>
                <dd>{session.user.full_name || session.user.username || session.user.email}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-stone-800 pb-2">
                <dt className="text-stone-500">Account</dt>
                <dd className="font-mono text-xs">{session.account.id}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-stone-800 pb-2">
                <dt className="text-stone-500">Modo</dt>
                <dd className="uppercase">{session.account.mode}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Saldo cash (derivado)</dt>
                <dd className="text-lg font-semibold text-[var(--brand)]">{session.cash_display}</dd>
              </div>
              <div className="flex justify-between gap-4 text-xs text-stone-500">
                <dt>Centavos (BIGINT)</dt>
                <dd className="font-mono">{session.cash_cents}</dd>
              </div>
            </dl>
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Depósito virtual de simulação — não é Pix, cartão nem TED.
            </p>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="w-full rounded-lg border border-stone-600 px-4 py-2 text-sm text-stone-200 hover:bg-stone-800"
            >
              Sair
            </button>
          </div>
        )}
      </main>

      <SimulationStamp />
    </div>
  );
}
