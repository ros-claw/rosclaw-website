import { getSupabaseClient } from './supabase/client'

export async function signInWithProvider(provider: 'google' | 'github') {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  })
  if (error) throw error
}

export async function signOut() {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const supabase = getSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (user: any) => void) {
  const supabase = getSupabaseClient()
  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null)
  })
  return () => subscription.unsubscribe()
}
