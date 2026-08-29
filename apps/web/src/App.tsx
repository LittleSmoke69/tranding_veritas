import { FormEvent, useEffect, useState } from 'react';
import { VeritasLogo } from './components/VeritasLogo';
import { api } from './lib/api';
import { TradingTerminal } from './trading/TradingTerminal';
import { AdminApp } from './admin/AdminApp';
import { TradingLoadingScreen } from './components/TradingLoadingScreen';
import { RegisterScreen, type RegistrationData } from './auth/RegisterScreen';

type MeData = {
  user: {
    id: string;
    email: string;
    username?: string | null;
    full_name?: string | null;
    status?: string | null;
    login_target?: 'crm' | 'trading' | 'both';
  };
  account: { id: string; mode: string; currency: string };
  cash_cents: string;
  cash_display: string;
  simulation: boolean;
};

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-1.2M9.9 5.2A10.4 10.4 0 0112 5c6.5 0 10 7 10 7a17.5 17.5 0 01-4.1 4.8M6.1 6.1A17.7 17.7 0 002 12s3.5 7 10 7c1.4 0 2.7-.3 3.9-.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoginScreen({
  identifier,
  password,
  busy,
  error,
  showPassword,
  onIdentifier,
  onPassword,
  onTogglePassword,
  onSubmit,
  onRegister,
}: {
  identifier: string;
  password: string;
  busy: boolean;
  error: string | null;
  showPassword: boolean;
  onIdentifier: (v: string) => void;
  onPassword: (v: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent) => void;
  onRegister: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app px-4 py-10 text-ink">
      <div className="mb-8">
        <VeritasLogo size="lg" subtitle="TRADER" />
      </div>

      <div className="w-full max-w-[420px] overflow-hidden rounded-panel border border-line bg-panel shadow-[var(--shadow-float)]">
        <div className="flex items-start justify-between gap-3 px-7 pb-2 pt-7">
          <div>
            <p className="text-sm text-muted">Feliz em te ver</p>
            <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-ink">
              Bem-vindo novamente
            </h1>
          </div>
          <button
            type="button"
            className="u-focus mt-1 shrink-0 rounded-ctl border border-line bg-app px-2.5 py-1.5 text-xs text-muted"
            title="Idioma"
          >
            Português ▾
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-7 pb-6 pt-5">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">E-mail ou usuário</span>
            <input
              className="u-focus w-full rounded-ctl border border-line bg-app px-4 py-3.5 text-[15px] text-ink transition placeholder:text-faint focus:border-brand"
              value={identifier}
              onChange={(e) => onIdentifier(e.target.value)}
              placeholder="E-mail ou usuário"
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Senha</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="u-focus w-full rounded-ctl border border-line bg-app px-4 py-3.5 pr-12 text-[15px] text-ink transition placeholder:text-faint focus:border-brand"
                value={password}
                onChange={(e) => onPassword(e.target.value)}
                placeholder="Senha"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="u-focus absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-ctl text-muted hover:bg-elevated hover:text-ink"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="rounded-ctl border border-bear/50 bg-bear/10 px-3 py-2 text-sm text-bear-text">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="u-focus u-lift w-full rounded-btn bg-brand px-4 py-3.5 text-[15px] font-semibold text-app disabled:opacity-60"
          >
            {busy ? 'Entrando…' : 'Entrar'}
          </button>

          <div className="flex items-center justify-between gap-3 pt-1 text-sm">
            <span className="cursor-default text-brand">Esqueceu a senha?</span>
            <button type="button" onClick={onRegister} className="u-focus rounded-ctl px-1 font-medium text-brand hover:underline">Registrar-se</button>
          </div>
        </form>

        <div className="border-t border-line bg-elevated px-7 py-5">
          <p className="u-caps text-brand">
            VeritasTrader
          </p>
          <p className="mt-1 text-sm text-ink">Acesse sua conta e opere no terminal.</p>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<MeData | null>(null);
  const [path, setPath] = useState(() => window.location.pathname);
  const [enteringTrading, setEnteringTrading] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    void api<MeData>('/auth/me')
      .then(setSession)
      .catch(() => setSession(null));
  }, []);

  useEffect(() => {
    if (!enteringTrading) return;
    const timer = window.setTimeout(() => setEnteringTrading(false), 2_300);
    return () => window.clearTimeout(timer);
  }, [enteringTrading]);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (next: string) => {
    window.history.pushState({}, '', next);
    setPath(next);
  };

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };
      const data = await api<MeData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setSession(data);
      if (!path.startsWith('/admin')) setEnteringTrading(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível entrar. Verifique e-mail/usuário e senha.',
      );
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    setEnteringTrading(false);
    setAuthView('login');
    setSession(null);
  };

  const onRegister = async (registration: RegistrationData) => {
    const data = await api<MeData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registration),
    });
    setSession(data);
    setAuthView('login');
    setEnteringTrading(true);
  };

  if (!session) {
    if (authView === 'register') {
      return (
        <RegisterScreen
          onBack={() => setAuthView('login')}
          onRegister={onRegister}
        />
      );
    }
    return (
      <LoginScreen
        identifier={identifier}
        password={password}
        busy={busy}
        error={error}
        showPassword={showPassword}
        onIdentifier={setIdentifier}
        onPassword={setPassword}
        onTogglePassword={() => setShowPassword((v) => !v)}
        onSubmit={(e) => void onLogin(e)}
        onRegister={() => setAuthView('register')}
      />
    );
  }

  const isAdmin = ['admin', 'super_admin'].includes(String(session.user.status || '').toLowerCase());
  if (enteringTrading && !path.startsWith('/admin')) {
    return <TradingLoadingScreen />;
  }
  if (path.startsWith('/admin')) {
    if (!isAdmin) {
      return (
        <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-app p-6 text-center text-ink">
          <h1 className="text-2xl font-semibold">Acesso administrativo necessário</h1>
          <p className="text-muted">Sua conta não possui permissão para abrir esta área.</p>
          <button onClick={() => navigate('/')} className="u-focus rounded-btn bg-brand px-5 py-3 font-semibold text-app">Voltar ao terminal</button>
        </div>
      );
    }
    return (
      <AdminApp
        accountName={session.user.full_name || session.user.username || session.user.email}
        onTerminal={() => {
          navigate('/');
          setEnteringTrading(true);
        }}
        onLogout={() => void onLogout()}
      />
    );
  }

  return (
    <TradingTerminal
      session={session}
      onLogout={() => void onLogout()}
      onAdmin={isAdmin ? () => navigate('/admin') : undefined}
      onBalance={(cash_cents, cash_display) =>
        setSession((prev) => (prev ? { ...prev, cash_cents, cash_display } : prev))
      }
    />
  );
}
