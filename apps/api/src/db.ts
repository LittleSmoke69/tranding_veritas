import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

let publicClient: SupabaseClient | null = null;
let veritasClient: SupabaseClient | null = null;

/** Service role — acesso a public.profiles. */
export function db(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: 'public' },
    });
  }
  return publicClient;
}

/** Queries no schema veritas (PostgREST precisa expor o schema). */
export function veritasDb(): SupabaseClient {
  if (!veritasClient) {
    veritasClient = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      // Cast: schema customizado fora do tipado "public" do client.
      db: { schema: 'veritas' as 'public' },
    });
  }
  return veritasClient;
}
