import { useState, type FormEvent } from 'react';
import { VeritasLogo } from '../components/VeritasLogo';

export type RegistrationData = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
};

type RegisterScreenProps = {
  onBack: () => void;
  onRegister: (data: RegistrationData) => Promise<void>;
};

const inputClass = 'u-focus w-full rounded-ctl border border-line bg-app px-4 py-3.5 text-[15px] text-ink transition placeholder:text-faint focus:border-brand';

export function RegisterScreen({ onBack, onRegister }: RegisterScreenProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirmation = String(form.get('password_confirmation') ?? '');
    if (password !== confirmation) {
      setError('As senhas informadas não são iguais.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onRegister({
        full_name: String(form.get('full_name') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''),
        password,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar sua conta.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-app px-4 py-10 text-ink">
      <div className="mb-6">
        <VeritasLogo size="lg" subtitle="TRADER" />
      </div>

      <div className="w-full max-w-[460px] overflow-hidden rounded-panel border border-line bg-panel shadow-[var(--shadow-float)]">
        <header className="px-7 pb-2 pt-7">
          <p className="text-sm text-brand">Comece agora</p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight">Crie sua conta</h1>
          <p className="mt-2 text-sm text-muted">Preencha seus dados para acessar o VeritasTrader.</p>
        </header>

        <form onSubmit={(event) => void submit(event)} className="space-y-4 px-7 pb-7 pt-5">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Nome completo</span>
            <input name="full_name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Seu nome completo" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">E-mail</span>
            <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="voce@email.com" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Telefone com DDD</span>
            <input name="phone" type="tel" required minLength={10} maxLength={30} autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Senha</span>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} required minLength={8} maxLength={120} autoComplete="new-password" placeholder="Mínimo de 8 caracteres" className={`${inputClass} pr-20`} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="u-focus absolute right-1 top-1/2 h-9 -translate-y-1/2 rounded-ctl px-2 text-xs text-muted hover:text-ink">
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Confirme sua senha</span>
            <input name="password_confirmation" type={showPassword ? 'text' : 'password'} required minLength={8} maxLength={120} autoComplete="new-password" placeholder="Digite a senha novamente" className={inputClass} />
          </label>

          {error && <p role="alert" className="rounded-ctl border border-bear/50 bg-bear/10 px-3 py-2 text-sm text-bear-text">{error}</p>}

          <button type="submit" disabled={busy} className="u-focus u-lift w-full rounded-btn bg-brand px-4 py-3.5 text-[15px] font-semibold text-app disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? 'Criando sua conta…' : 'Criar conta'}
          </button>
          <button type="button" onClick={onBack} className="u-focus w-full rounded-btn py-2 text-sm font-medium text-brand hover:bg-brand/10">
            Já tenho uma conta
          </button>
        </form>
      </div>
    </div>
  );
}
