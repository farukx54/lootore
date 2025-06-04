import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase/client"

interface AdminState {
  isAdminLoggedIn: boolean
  adminUser: any | null
  error: string | null
  isLoading: boolean
  isSubmitting: boolean
}

interface AdminActions {
  adminLogin: (credentials: { username: string; password: string }) => Promise<void>
  adminLogout: () => Promise<void>
  clearAdminError: () => void
  checkAdminSession: () => Promise<void>
}

type AdminStore = AdminState & AdminActions

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAdminLoggedIn: false,
      adminUser: null,
      error: null,
      isLoading: false,
      isSubmitting: false,

      // Actions
      adminLogin: async (credentials) => {
        try {
          set({ isSubmitting: true, error: null })

          // Supabase ile giriş yap
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.username,
            password: credentials.password,
          })

          if (error) {
            console.error("Admin login error:", error)
            set({
              error: "Giriş bilgileri hatalı. Lütfen e-posta ve şifrenizi kontrol edin.",
              isSubmitting: false,
            })
            return
          }

          if (!data.user) {
            set({
              error: "Giriş yapılamadı. Lütfen tekrar deneyin.",
              isSubmitting: false,
            })
            return
          }

          // Kullanıcının admin olup olmadığını kontrol et
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single()

          if (profileError || !profile || profile.role !== "admin") {
            console.error("Admin role check failed:", profileError)

            // Admin değilse oturumu kapat
            await supabase.auth.signOut()

            set({
              error: "Bu hesap admin yetkisine sahip değil.",
              isSubmitting: false,
            })
            return
          }

          // Başarılı giriş
          set({
            isAdminLoggedIn: true,
            adminUser: data.user,
            error: null,
            isSubmitting: false,
          })
        } catch (error) {
          console.error("Unexpected admin login error:", error)
          set({
            error: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
            isSubmitting: false,
          })
        }
      },

      adminLogout: async () => {
        try {
          set({ isLoading: true })

          const { error } = await supabase.auth.signOut()

          if (error) {
            console.error("Admin logout error:", error)
            set({ error: "Çıkış yapılırken hata oluştu.", isLoading: false })
            return
          }

          set({
            isAdminLoggedIn: false,
            adminUser: null,
            error: null,
            isLoading: false,
          })
        } catch (error) {
          console.error("Unexpected admin logout error:", error)
          set({
            error: "Çıkış yapılırken beklenmeyen hata oluştu.",
            isLoading: false,
          })
        }
      },

      clearAdminError: () => {
        set({ error: null })
      },

      checkAdminSession: async () => {
        try {
          set({ isLoading: true })

          const {
            data: { session },
            error,
          } = await supabase.auth.getSession()

          if (error) {
            console.error("Session check error:", error)
            set({
              isAdminLoggedIn: false,
              adminUser: null,
              isLoading: false,
            })
            return
          }

          if (!session?.user) {
            set({
              isAdminLoggedIn: false,
              adminUser: null,
              isLoading: false,
            })
            return
          }

          // Admin rolünü kontrol et
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (profileError || !profile || profile.role !== "admin") {
            // Admin değilse oturumu kapat
            await supabase.auth.signOut()
            set({
              isAdminLoggedIn: false,
              adminUser: null,
              isLoading: false,
            })
            return
          }

          // Admin oturumu geçerli
          set({
            isAdminLoggedIn: true,
            adminUser: session.user,
            isLoading: false,
          })
        } catch (error) {
          console.error("Unexpected session check error:", error)
          set({
            isAdminLoggedIn: false,
            adminUser: null,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        isAdminLoggedIn: state.isAdminLoggedIn,
        adminUser: state.adminUser,
      }),
    },
  ),
)
