import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase/client"
import type { AdminPublisher, AdminCoupon } from "@/lib/types/admin"
import { StateCreator, StoreApi } from "zustand"
import { PersistOptions } from "zustand/middleware"

interface AdminState {
  isAdminLoggedIn: boolean
  adminUser: any | null
  error: string | null
  isLoading: boolean
  isSubmitting: boolean
  sessionChecked: boolean
  publishers: AdminPublisher[]
  coupons: AdminCoupon[]
}

interface AdminActions {
  adminLogin: (credentials: { username: string; password: string }) => Promise<void>
  adminLogout: () => Promise<void>
  clearAdminError: () => void
  checkAdminSession: () => Promise<void>
  // Publisher actions
  fetchAdminPublishers: () => Promise<void>
  addPublisher: (publisher: Omit<AdminPublisher, "id" | "created_at" | "updated_at">) => Promise<boolean>
  updatePublisher: (id: string, publisher: Partial<AdminPublisher>) => Promise<boolean>
  deletePublisher: (id: string) => Promise<boolean>
  // Coupon actions
  fetchAdminCoupons: () => Promise<void>
  addCoupon: (coupon: Omit<AdminCoupon, "id" | "created_at" | "updated_at">) => Promise<boolean>
  updateCoupon: (id: string, coupon: Partial<AdminCoupon>) => Promise<boolean>
  deleteCoupon: (id: string) => Promise<boolean>
}

type AdminStore = AdminState & AdminActions

export const useAdminStore = create<AdminStore>()(
  persist(
    (set: StoreApi<AdminStore>["setState"], get: StoreApi<AdminStore>["getState"]) => ({
      // Initial state
      isAdminLoggedIn: false,
      adminUser: null,
      error: null,
      isLoading: false,
      isSubmitting: false,
      sessionChecked: false,
      publishers: [],
      coupons: [],

      // Actions
      adminLogin: async (credentials: { username: string; password: string }) => {
        try {
          set({ isSubmitting: true, error: null })

          // Supabase ile giriş yap
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.username, // username olarak gelen değer aslında email
            password: credentials.password,
          })

          if (error) {
            console.error("Admin login error:", error)
            let errorMessage = "Giriş bilgileri hatalı. Lütfen e-posta ve şifrenizi kontrol edin."

            // Supabase'den gelen hata mesajlarını daha anlaşılır hale getir
            if (error.message === "Email logins are disabled") {
              errorMessage = "Email ile giriş devre dışı. Lütfen sistem yöneticisi ile iletişime geçin."
            } else if (error.message === "Invalid login credentials") {
              errorMessage = "Geçersiz giriş bilgileri. Lütfen e-posta ve şifrenizi kontrol edin."
            } else if (error.message.includes("rate limit")) {
              errorMessage = "Çok fazla başarısız deneme. Lütfen bir süre bekleyin."
            }

            set({
              error: errorMessage,
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
            .select("is_admin")
            .eq("user_id", data.user.id)
            .single()

          if (profileError) {
            console.error("Profile fetch error:", profileError)
            set({
              error: "Kullanıcı bilgileri alınamadı. Lütfen tekrar deneyin.",
              isSubmitting: false,
            })
            return
          }

          if (!profile || !profile.is_admin) {
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

          if (error || !session?.user) {
            set({
              isAdminLoggedIn: false,
              adminUser: null,
              isLoading: false,
              sessionChecked: true,
            })
            return
          }

          // Admin rolünü kontrol et
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("user_id", session.user.id)
            .single()

          if (profileError || !profile || !profile.is_admin) {
            // Admin değilse oturumu kapat
            await supabase.auth.signOut()
            set({
              isAdminLoggedIn: false,
              adminUser: null,
              isLoading: false,
              sessionChecked: true,
            })
            return
          }

          // Admin oturumu geçerli
          set({
            isAdminLoggedIn: true,
            adminUser: session.user,
            isLoading: false,
            sessionChecked: true,
          })
        } catch (error) {
          console.error("Unexpected session check error:", error)
          set({
            isAdminLoggedIn: false,
            adminUser: null,
            isLoading: false,
            sessionChecked: true,
          })
        }
      },

      // Publisher actions
      fetchAdminPublishers: async () => {
        try {
          // Session ve admin kontrolü
          const { isAdminLoggedIn, sessionChecked } = get()
          if (!sessionChecked) {
            // Session kontrolü tamamlanmadan fetch yapılmasın
            return
          }
          if (!isAdminLoggedIn) {
            set({ error: "Admin girişi yapılmadan yayıncılar getirilemez." })
            return
          }
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.from("publishers").select("*").order("created_at", { ascending: false })

          if (error) throw error
          set({ publishers: data || [], isLoading: false })
        } catch (error: any) {
          console.error("Fetch publishers error:", error)
          set({ error: error.message || "Failed to fetch publishers", isLoading: false })
        }
      },

      addPublisher: async (publisher: Omit<AdminPublisher, "id" | "created_at" | "updated_at">) => {
        try {
          set({ isSubmitting: true, error: null })
          const { data, error } = await supabase.from("publishers").insert(publisher).select().single()

          if (error) throw error
          set((state: AdminStore) => ({ publishers: [data, ...state.publishers], isSubmitting: false }))
          return true
        } catch (error: any) {
          console.error("Add publisher error:", error)
          set({ error: error.message || "Failed to add publisher", isSubmitting: false })
          return false
        }
      },

      updatePublisher: async (id: string, publisher: Partial<AdminPublisher>) => {
        try {
          set({ isSubmitting: true, error: null })
          const { data, error } = await supabase
            .from("publishers")
            .update(publisher)
            .eq("id", id)
            .select()
            .single()

          if (error) throw error
          set((state: AdminStore) => ({
            publishers: state.publishers.map((p: AdminPublisher) => (p.id === id ? data : p)),
            isSubmitting: false,
          }))
          return true
        } catch (error: any) {
          console.error("Update publisher error:", error)
          set({ error: error.message || "Failed to update publisher", isSubmitting: false })
          return false
        }
      },

      deletePublisher: async (id: string) => {
        try {
          set({ isSubmitting: true, error: null })
          const { error } = await supabase.from("publishers").delete().eq("id", id)

          if (error) throw error
          set((state: AdminStore) => ({
            publishers: state.publishers.filter((p: AdminPublisher) => p.id !== id),
            isSubmitting: false,
          }))
          return true
        } catch (error: any) {
          console.error("Delete publisher error:", error)
          set({ error: error.message || "Failed to delete publisher", isSubmitting: false })
          return false
        }
      },

      // Coupon actions
      fetchAdminCoupons: async () => {
        try {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false })

          if (error) throw error
          set({ coupons: data || [], isLoading: false })
        } catch (error: any) {
          console.error("Fetch coupons error:", error)
          set({ error: error.message || "Failed to fetch coupons", isLoading: false })
        }
      },

      addCoupon: async (coupon: Omit<AdminCoupon, "id" | "created_at" | "updated_at">) => {
        try {
          set({ isSubmitting: true, error: null })
          const { data, error } = await supabase.from("coupons").insert(coupon).select().single()

          if (error) throw error
          set((state: AdminStore) => ({ coupons: [data, ...state.coupons], isSubmitting: false }))
          return true
        } catch (error: any) {
          console.error("Add coupon error:", error)
          set({ error: error.message || "Failed to add coupon", isSubmitting: false })
          return false
        }
      },

      updateCoupon: async (id: string, coupon: Partial<AdminCoupon>) => {
        try {
          set({ isSubmitting: true, error: null })
          const { data, error } = await supabase.from("coupons").update(coupon).eq("id", id).select().single()

          if (error) throw error
          set((state: AdminStore) => ({
            coupons: state.coupons.map((c: AdminCoupon) => (c.id === id ? data : c)),
            isSubmitting: false,
          }))
          return true
        } catch (error: any) {
          console.error("Update coupon error:", error)
          set({ error: error.message || "Failed to update coupon", isSubmitting: false })
          return false
        }
      },

      deleteCoupon: async (id: string) => {
        try {
          set({ isSubmitting: true, error: null })
          const { error } = await supabase.from("coupons").delete().eq("id", id)

          if (error) throw error
          set((state: AdminStore) => ({
            coupons: state.coupons.filter((c: AdminCoupon) => c.id !== id),
            isSubmitting: false,
          }))
          return true
        } catch (error: any) {
          console.error("Delete coupon error:", error)
          set({ error: error.message || "Failed to delete coupon", isSubmitting: false })
          return false
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
