export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  cookieOptions: {
    domain: process.env.NODE_ENV === 'production' ? '.lootore.com' : undefined,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  }
}

if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  throw new Error("Missing Supabase environment variables")
}
