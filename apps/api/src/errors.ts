/** Mensagens amigáveis — nunca vazar detalhes técnicos ao cliente. */

const FRIENDLY = {
  auth: 'Não foi possível entrar. Verifique e-mail/usuário e senha.',
  session: 'Sua sessão expirou. Entre novamente.',
  access: 'Esta conta não tem acesso à plataforma.',
  unavailable: 'Não foi possível concluir o login agora. Tente novamente em instantes.',
  validation: 'Preencha usuário/e-mail e senha para continuar.',
  generic: 'Algo deu errado. Tente novamente.',
  lockout: 'Muitas tentativas para esta conta. Aguarde alguns minutos e tente novamente.',
  rateLimited: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.',
} as const;

export function friendlyAuthError(err: unknown): string {
  const raw = (err instanceof Error ? err.message : String(err || '')).toLowerCase();

  if (!raw) return FRIENDLY.generic;

  if (
    /credential|senha|password|inválid|invalid|unauthorized|401/.test(raw) ||
    /não autenticado|sessão inválida/.test(raw)
  ) {
    return FRIENDLY.auth;
  }

  if (/acesso|forbidden|403|login_target/.test(raw)) {
    return FRIENDLY.access;
  }

  if (/schema|veritas|ledger|account|postgres|supabase|fetch|network|econn|timeout|500|internal/.test(raw)) {
    return FRIENDLY.unavailable;
  }

  if (/obrigat|dados inválidos|validation|zod/.test(raw)) {
    return FRIENDLY.validation;
  }

  // Evita vazar stack/SQL/PostgREST
  if (/error:|select |insert |exception|stack|pgrst|sqlstate|uuid|bigint/.test(raw)) {
    return FRIENDLY.unavailable;
  }

  return FRIENDLY.generic;
}

export const AuthMessages = FRIENDLY;
