import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { AdminPublisher, AdminCoupon } from "@/lib/types/admin"

interface AdminState {
  isAdminLoggedIn: boolean
  adminUser: User | null
  error: string | null
  isLoading: boolean
  isSubmitting: boolean
  sessionChecked: boolean
  publishers: AdminPublisher[]
  coupons: AdminCoupon[]
  adminLogin: (credentials: { username: string; password: string }) => Promise<void>
  adminLogout: () => Promise<void>
  clearAdminError: () => void
  checkAdminSession: () => Promise<void>
  fetchPublishers: () => Promise<void>
  fetchCoupons: () => Promise<void>
  createPublisher: (publisher: Omit<AdminPublisher, "id">) => Promise<void>
  updatePublisher: (id: string, publisher: Partial<AdminPublisher>) => Promise<void>
  deletePublisher: (id: string) => Promise<void>
  createCoupon: (coupon: Omit<AdminCoupon, "id">) => Promise<void>
  updateCoupon: (id: string, coupon: Partial<AdminCoupon>) => Promise<void>
  deleteCoupon: (id: string) => Promise<void>
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      adminUser: null,
      error: null,
      isLoading: false,
      isSubmitting: false,
      sessionChecked: false,
      publishers: [],
      coupons: [],

      adminLogin: async (credentials) => {
        try {
          set({ isSubmitting: true, error: null })

          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.username,
            password: credentials.password,
          })

          if (error) {
            console.error("Admin login error:", error)
            let errorMessage = "Giriş bilgileri hatalı. Lütfen e-posta ve şifrenizi kontrol edin."

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

          // Admin rolü kontrolü
          const isAdmin = data.user.user_metadata?.role === "admin"

          if (!isAdmin) {
            await supabase.auth.signOut()
            set({
              error: "Bu hesap admin yetkisine sahip değil.",
              isSubmitting: false,
            })
            return
          }

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

          const { data: { session }, error } = await supabase.auth.getSession()

          if (error || !session?.user) {
            set({
              isAdminLoggedIn: false,
              adminUser: null,
              isLoading: false,
              sessionChecked: true,
            })
            return
          }

          // Admin rolü kontrolü
          const isAdmin = session.user.user_metadata?.role === "admin"

          if (!isAdmin) {
            await supabase.auth.signOut()
            set({
              isAdminLoggedIn: false,
              adminUser: null,
              isLoading: false,
              sessionChecked: true,
            })
            return
          }

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

      fetchPublishers: async () => {
        try {
          set({ isLoading: true })

          const { data, error } = await supabase
            .from("publishers")
            .select("*")
            .order("name")

          if (error) {
            console.error("Error fetching publishers:", error)
            set({ error: "Yayıncılar yüklenirken hata oluştu.", isLoading: false })
            return
          }

          set({ publishers: data || [], isLoading: false })
        } catch (error) {
          console.error("Unexpected error fetching publishers:", error)
          set({ error: "Yayıncılar yüklenirken beklenmeyen hata oluştu.", isLoading: false })
        }
      },

      fetchCoupons: async () => {
        try {
          set({ isLoading: true })

          const { data, error } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false })

          if (error) {
            console.error("Error fetching coupons:", error)
            set({ error: "Kuponlar yüklenirken hata oluştu.", isLoading: false })
            return
          }

          set({ coupons: data || [], isLoading: false })
        } catch (error) {
          console.error("Unexpected error fetching coupons:", error)
          set({ error: "Kuponlar yüklenirken beklenmeyen hata oluştu.", isLoading: false })
        }
      },

      createPublisher: async (publisher) => {
        try {
          set({ isSubmitting: true })

          const { error } = await supabase.from("publishers").insert(publisher)

          if (error) {
            console.error("Error creating publisher:", error)
            set({ error: "Yayıncı oluşturulurken hata oluştu.", isSubmitting: false })
            return
          }

          set({ isSubmitting: false })
          // Refresh publishers list
          await useAdminStore.getState().fetchPublishers()
        } catch (error) {
          console.error("Unexpected error creating publisher:", error)
          set({ error: "Yayıncı oluşturulurken beklenmeyen hata oluştu.", isSubmitting: false })
        }
      },

      updatePublisher: async (id, publisher) => {
        try {
          set({ isSubmitting: true })

          const { error } = await supabase
            .from("publishers")
            .update(publisher)
            .eq("id", id)

          if (error) {
            console.error("Error updating publisher:", error)
            set({ error: "Yayıncı güncellenirken hata oluştu.", isSubmitting: false })
            return
          }

          set({ isSubmitting: false })
          // Refresh publishers list
          await useAdminStore.getState().fetchPublishers()
        } catch (error) {
          console.error("Unexpected error updating publisher:", error)
          set({ error: "Yayıncı güncellenirken beklenmeyen hata oluştu.", isSubmitting: false })
        }
      },

      deletePublisher: async (id) => {
        try {
          set({ isSubmitting: true })

          const { error } = await supabase.from("publishers").delete().eq("id", id)

          if (error) {
            console.error("Error deleting publisher:", error)
            set({ error: "Yayıncı silinirken hata oluştu.", isSubmitting: false })
            return
          }

          set({ isSubmitting: false })
          // Refresh publishers list
          await useAdminStore.getState().fetchPublishers()
        } catch (error) {
          console.error("Unexpected error deleting publisher:", error)
          set({ error: "Yayıncı silinirken beklenmeyen hata oluştu.", isSubmitting: false })
        }
      },

      createCoupon: async (coupon) => {
        try {
          set({ isSubmitting: true })

          const { error } = await supabase.from("coupons").insert(coupon)

          if (error) {
            console.error("Error creating coupon:", error)
            set({ error: "Kupon oluşturulurken hata oluştu.", isSubmitting: false })
            return
          }

          set({ isSubmitting: false })
          // Refresh coupons list
          await useAdminStore.getState().fetchCoupons()
        } catch (error) {
          console.error("Unexpected error creating coupon:", error)
          set({ error: "Kupon oluşturulurken beklenmeyen hata oluştu.", isSubmitting: false })
        }
      },

      updateCoupon: async (id, coupon) => {
        try {
          set({ isSubmitting: true })

          const { error } = await supabase
            .from("coupons")
            .update(coupon)
            .eq("id", id)

          if (error) {
            console.error("Error updating coupon:", error)
            set({ error: "Kupon güncellenirken hata oluştu.", isSubmitting: false })
            return
          }

          set({ isSubmitting: false })
          // Refresh coupons list
          await useAdminStore.getState().fetchCoupons()
        } catch (error) {
          console.error("Unexpected error updating coupon:", error)
          set({ error: "Kupon güncellenirken beklenmeyen hata oluştu.", isSubmitting: false })
        }
      },

      deleteCoupon: async (id) => {
        try {
          set({ isSubmitting: true })

          const { error } = await supabase.from("coupons").delete().eq("id", id)

          if (error) {
            console.error("Error deleting coupon:", error)
            set({ error: "Kupon silinirken hata oluştu.", isSubmitting: false })
            return
          }

          set({ isSubmitting: false })
          // Refresh coupons list
          await useAdminStore.getState().fetchCoupons()
        } catch (error) {
          console.error("Unexpected error deleting coupon:", error)
          set({ error: "Kupon silinirken beklenmeyen hata oluştu.", isSubmitting: false })
        }
      },
    }),
    {
      name: "admin-storage",
    },
  ),
)
