import { type CSSProperties, FormEvent, useEffect, useState } from 'react';
import { api } from './lib/api';
import { TradingTerminal } from './trading/TradingTerminal';
import { AdminApp } from './admin/AdminApp';
import { TradingLoadingScreen } from './components/TradingLoadingScreen';
import { RegisterScreen, type RegistrationData } from './auth/RegisterScreen';
import { LandingPage } from './landing/Landing';
import landingLogo from './landing/assets/logo_1.png';

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
  onBack,
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
  onBack: () => void;
}) {
  const fieldStyle: CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    color: 'var(--foreground)',
    fontFamily: "'Manrope', sans-serif",
  };
  return (
    <div
      className="veritas-landing grid-bg relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(25,172,254,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <button
        type="button"
        onClick={onBack}
        className="relative z-10 mb-8 flex items-center gap-2"
        style={{ color: 'var(--muted-foreground)', fontSize: '0.8125rem', fontWeight: 600 }}
      >
        <img
          src={landingLogo}
          alt="Veritas"
          className="h-11 w-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(25,172,254,0.3))' }}
        />
      </button>

      <div className="bento-card relative z-10 w-full max-w-[420px] overflow-hidden" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="flex items-start justify-between gap-3 px-7 pb-2 pt-7">
          <div>
            <span
              className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: 'var(--primary-dim)',
                border: '1px solid var(--primary-border)',
                color: 'var(--primary)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              Ambiente de simulação
            </span>
            <h1
              className="mt-3 text-[28px] leading-tight"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--foreground)' }}
            >
              Bem-vindo <span className="blue-gradient">novamente</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Acesse sua conta e opere na plataforma.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-7 pb-6 pt-5">
          <label className="block">
            <span className="mb-1.5 block text-sm" style={{ color: 'var(--muted-foreground)' }}>E-mail ou usuário</span>
            <input
              className="u-focus w-full rounded-xl px-4 py-3.5 text-[15px] outline-none transition"
              style={fieldStyle}
              value={identifier}
              onChange={(e) => onIdentifier(e.target.value)}
              placeholder="E-mail ou usuário"
              autoComplete="username"
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary-border)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm" style={{ color: 'var(--muted-foreground)' }}>Senha</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="u-focus w-full rounded-xl px-4 py-3.5 pr-12 text-[15px] outline-none transition"
                style={fieldStyle}
                value={password}
                onChange={(e) => onPassword(e.target.value)}
                placeholder="Senha"
                autoComplete="current-password"
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary-border)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                required
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="u-focus absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl px-3 py-2 text-sm"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--red)' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="u-focus w-full rounded-xl px-4 py-3.5 text-[15px] font-bold transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-60"
            style={{ background: 'var(--primary)', color: '#fff', boxShadow: '0 0 40px var(--primary-glow)' }}
          >
            {busy ? 'Entrando…' : 'Entrar'}
          </button>

          <div className="flex items-center justify-between gap-3 pt-1 text-sm">
            <span className="cursor-default" style={{ color: 'var(--primary)' }}>Esqueceu a senha?</span>
            <button
              type="button"
              onClick={onRegister}
              className="u-focus rounded-lg px-1 font-medium hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Registrar-se
            </button>
          </div>
        </form>

        <div className="border-t px-7 py-5" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            VeritasTrader
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--foreground)' }}>Simulação com fins educacionais. Nenhum valor real é movimentado.</p>
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
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>(() =>
    window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register')
      ? window.location.pathname.startsWith('/register')
        ? 'register'
        : 'login'
      : 'landing',
  );

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
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Best-effort: mesmo sem rede/API, a sessão local é encerrada abaixo.
    }
    setEnteringTrading(false);
    setSession(null);
    setAuthView('landing');
    navigate('/');
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
    if (authView === 'landing') {
      return (
        <LandingPage
          onAccessPlatform={() => {
            navigate('/login');
            setAuthView('login');
          }}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterScreen
          onBack={() => {
            navigate('/login');
            setAuthView('login');
          }}
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
        onRegister={() => {
          navigate('/register');
          setAuthView('register');
        }}
        onBack={() => {
          navigate('/');
          setAuthView('landing');
        }}
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
