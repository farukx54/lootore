import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./types"
import type { AuthError } from "@supabase/supabase-js"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Client-side Supabase client (browser)
export const createClient = () => {
  return createClientComponentClient<Database>()
}

// Server-side Supabase client (API routes, Server Components)
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Twitch OAuth sign in
export const signInWithTwitch = async () => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitch",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "user:read:email", // Add more scopes as needed
      },
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Twitch sign in error:", error)
    return { data: null, error: error as AuthError }
  }
}

// Sign out
export const signOut = async () => {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: error as AuthError }
  }
}

// Get current session
export const getSession = async () => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session: data.session, error: null }
  } catch (error) {
    console.error("Get session error:", error)
    return { session: null, error: error as AuthError }
  }
}

// Get user profile from database
export const getUserProfile = async (userId: string) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return { profile: data, error: null }
  } catch (error) {
    console.error("Get user profile error:", error)
    return { profile: null, error }
  }
}

// Check if username is available
export const checkUsernameAvailability = async (username: string) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("users").select("username").eq("username", username).maybeSingle()

    if (error) throw error
    return { isAvailable: !data, error: null }
  } catch (error) {
    console.error("Username check error:", error)
    return { isAvailable: false, error }
  }
}

// Update username
export const updateUsername = async (userId: string, username: string) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("users").update({ username }).eq("id", userId).select().single()

    if (error) throw error
    return { profile: data, error: null }
  } catch (error) {
    console.error("Update username error:", error)
    return { profile: null, error }
  }
}
