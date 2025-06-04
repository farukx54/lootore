import { create } from "zustand"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../supabase/types"
import type { User } from "../types/auth"

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Session kontrolü için yeni fonksiyon ekliyoruz
  checkSession: () => Promise<void>

  // Diğer mevcut fonksiyonlar...
  checkIfUsernameExists: (username: string) => Promise<boolean>
  updateUsername: (username: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  login: (user) => {
    set({ user, isLoggedIn: true, error: null })
    // Normal kullanıcı cookie'si
    if (typeof document !== "undefined") {
      document.cookie = "auth-logged-in=true; path=/; max-age=86400"
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false, error: null })
    // Normal kullanıcı cookie'sini sil
    if (typeof document !== "undefined") {
      document.cookie = "auth-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // Session kontrolü için yeni fonksiyon
  checkSession: async () => {
    set({ isLoading: true })
    const supabase = createClientComponentClient<Database>()

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Session check error:", error)
        set({ user: null, isLoggedIn: false, isLoading: false })
        return
      }

      if (session?.user) {
        // Kullanıcı bilgilerini users tablosundan çek
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (userError || !userData) {
          console.error("User data fetch error:", userError)
          set({ user: null, isLoggedIn: false, isLoading: false })
          return
        }

        const user: User = {
          id: userData.id,
          email: userData.email || session.user.email || "",
          username: userData.username,
          displayName: userData.display_name,
          orePoints: userData.ore_points || 0,
          // Diğer user alanları...
        }

        set({ user, isLoggedIn: true, isLoading: false })

        // Cookie'yi set et
        if (typeof document !== "undefined") {
          document.cookie = "auth-logged-in=true; path=/; max-age=86400"
        }
      } else {
        set({ user: null, isLoggedIn: false, isLoading: false })

        // Cookie'yi sil
        if (typeof document !== "undefined") {
          document.cookie = "auth-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
      }
    } catch (error) {
      console.error("Session check error:", error)
      set({ user: null, isLoggedIn: false, isLoading: false, error: "Session check failed" })
    }
  },

  // Mevcut fonksiyonlar (örnek olarak, gerçek implementasyonları mevcut kodunuzda olmalı)
  checkIfUsernameExists: async (username: string) => {
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("users").select("username").eq("username", username).maybeSingle()

      if (error) {
        console.error("Username check error:", error)
        return false
      }

      return !!data // Kullanıcı adı varsa true, yoksa false
    } catch (error) {
      console.error("Username check error:", error)
      return false
    }
  },

  updateUsername: async (username: string) => {
    const { user } = get()
    if (!user) return false

    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("users").update({ username }).eq("id", user.id).select().single()

      if (error) {
        console.error("Username update error:", error)
        return false
      }

      if (data) {
        // Store'daki user bilgisini güncelle
        set({ user: { ...user, username: data.username } })
        return true
      }

      return false
    } catch (error) {
      console.error("Username update error:", error)
      return false
    }
  },
}))
