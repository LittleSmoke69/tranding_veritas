export function toUserMessage(raw: unknown, status?: number): string {
  const msg = typeof raw === 'string' ? raw.trim() : '';
  if (
    !msg ||
    /^HTTP\s*\d+/i.test(msg) ||
    /internal server|invalid schema|pgrst|sqlstate|stack|exception/i.test(msg)
  ) {
    if (status === 401 || status === 403) {
      return 'Não foi possível entrar. Verifique e-mail/usuário e senha.';
    }
    return 'Não foi possível concluir agora. Tente novamente em instantes.';
  }
  return msg;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new Error('Não foi possível conectar. Verifique sua internet e tente de novo.');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(toUserMessage(json.error, res.status));
  }
  return json.data as T;
}
