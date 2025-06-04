import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../supabase/types"

type UserProfile = Database["public"]["Tables"]["users"]["Row"]

interface AuthState {
  user: UserProfile | null
  session: any | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null

  // Actions
  initialize: () => Promise<void>
  login: (provider: "twitch" | "kick") => Promise<void> // Kick eklendi
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoggedIn: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        try {
          const supabase = createClientComponentClient<Database>()
          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session) {
            const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()
            set({
              session,
              user: profile || null,
              isLoggedIn: !!profile,
              isLoading: false,
            })
          } else {
            set({ isLoggedIn: false, isLoading: false })
          }
        } catch (error) {
          console.error("Auth initialization error:", error)
          set({ isLoggedIn: false, isLoading: false, error: "Failed to initialize auth" })
        }
      },

      login: async (provider: "twitch" | "kick") => {
        try {
          set({ isLoading: true, error: null })
          const supabase = createClientComponentClient<Database>()

          if (provider === "twitch") {
            await supabase.auth.signInWithOAuth({
              provider: "twitch",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            })
          } else if (provider === "kick") {
            // Kick login için "Yakında Gelecek" uyarısı
            // Bu kısım UI tarafında yönetilmeli, store sadece hatayı set edebilir veya özel bir state tutabilir.
            // Şimdilik bir console log ve error state'i set edelim.
            console.warn("Kick login is coming soon!")
            // Toast hook'unu burada doğrudan kullanamayız, UI bileşeninde kullanılmalı.
            // Bunun yerine bir error mesajı set edebiliriz.
            set({ isLoading: false, error: "Kick ile giriş özelliği yakında eklenecektir." })
            // Veya UI'da bu provider tıklandığında toast gösterilir.
          }
        } catch (error: any) {
          console.error("Login error:", error)
          set({ isLoading: false, error: error.message || "Login failed" })
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })
          const supabase = createClientComponentClient<Database>()
          await supabase.auth.signOut()
          set({ user: null, session: null, isLoggedIn: false, isLoading: false })
        } catch (error) {
          console.error("Logout error:", error)
          set({ isLoading: false, error: "Logout failed" })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    },
  ),
)
