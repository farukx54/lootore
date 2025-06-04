import { create } from "zustand"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../supabase/types"
import type { AdminUser, AdminPublisher, AdminCoupon, AdminLoginData } from "../types/admin"
import { AuthErrorCode, AuthException } from "../types/auth" // Düzeltildi: utils/auth-exception -> types/auth

type PublisherRow = Database["public"]["Tables"]["publishers"]["Row"]
type CouponRow = Database["public"]["Tables"]["coupons"]["Row"]

interface AdminState {
  adminUser: AdminUser | null
  isAdminLoggedIn: boolean
  isLoading: boolean // Genel yükleme durumu
  isSubmitting: boolean // Form gönderme/işlem yükleme durumu
  error: string | null // Hata mesajlarını string olarak tutalım
  publishers: PublisherRow[]
  coupons: CouponRow[]

  // Actions
  adminLogin: (credentials: AdminLoginData) => Promise<void>
  adminLogout: () => Promise<void>
  checkAdminSession: () => Promise<void>

  fetchAdminPublishers: () => Promise<void>
  addPublisher: (
    publisherData: Omit<AdminPublisher, "id" | "created_at" | "updated_at">,
  ) => Promise<PublisherRow | null>
  updatePublisher: (
    id: string,
    publisherData: Partial<Omit<AdminPublisher, "id" | "created_at" | "updated_at">>,
  ) => Promise<PublisherRow | null>
  deletePublisher: (id: string) => Promise<boolean>

  fetchAdminCoupons: () => Promise<void>
  addCoupon: (couponData: Omit<AdminCoupon, "id" | "created_at" | "updated_at">) => Promise<CouponRow | null>
  updateCoupon: (
    id: string,
    couponData: Partial<Omit<AdminCoupon, "id" | "created_at" | "updated_at">>,
  ) => Promise<CouponRow | null>
  deleteCoupon: (id: string) => Promise<boolean>

  fetchUserPointsSummary: () => Promise<Array<{
    id: string
    display_name: string | null
    ore_points: number | null
  }> | null>
}

export const useAdminStore = create<AdminState>((set, get) => ({
  adminUser: null,
  isAdminLoggedIn: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
  publishers: [],
  coupons: [],

  adminLogin: async (credentials) => {
    set({ isLoading: true, isSubmitting: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      })

      if (authError) throw new AuthException(AuthErrorCode.AUTHENTICATION_FAILED, authError.message)
      if (!authData.user) throw new AuthException(AuthErrorCode.USER_NOT_FOUND, "Admin user not found in auth")

      // Kullanıcının profil bilgilerini ve admin durumunu çek
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authData.user.id)
        .single()

      if (profileError || !profileData) {
        throw new AuthException(AuthErrorCode.USER_NOT_FOUND, "Admin profile not found or error fetching profile.")
      }

      if (!profileData.is_admin || profileData.role !== "admin") {
        await supabase.auth.signOut() // Yetkisiz kullanıcıyı logout yap
        throw new AuthException(AuthErrorCode.UNAUTHORIZED, "User is not authorized as admin.")
      }

      const adminProfile: AdminUser = {
        id: authData.user.id,
        email: authData.user.email!,
        role: profileData.role as "admin" | "user",
      }

      // Admin cookie'sini set et - ÖNEMLİ!
      document.cookie = "admin-logged-in=true; path=/; max-age=86400" // 24 saat

      set({ adminUser: adminProfile, isAdminLoggedIn: true, isLoading: false, isSubmitting: false })
    } catch (e: any) {
      // Hata durumunda cookie'yi temizle
      document.cookie = "admin-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      set({
        isLoading: false,
        isSubmitting: false,
        error: e instanceof AuthException ? e.message : e.message || "Admin login failed",
        isAdminLoggedIn: false,
        adminUser: null,
      })
    }
  },

  adminLogout: async () => {
    set({ isLoading: true })
    const supabase = createClientComponentClient<Database>()
    await supabase.auth.signOut()

    // Admin cookie'sini sil - ÖNEMLİ!
    document.cookie = "admin-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    set({ adminUser: null, isAdminLoggedIn: false, isLoading: false, publishers: [], coupons: [] })
  },

  checkAdminSession: async () => {
    set({ isLoading: true })
    const supabase = createClientComponentClient<Database>()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (profileError || !profileData) {
          // Profil bulunamazsa cookie'yi sil ve admin değil olarak işaretle
          document.cookie = "admin-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          set({ adminUser: null, isAdminLoggedIn: false, isLoading: false })
          return
        }

        if (profileData.is_admin && profileData.role === "admin") {
          const adminProfile: AdminUser = {
            id: session.user.id,
            email: session.user.email!,
            role: profileData.role as "admin" | "user",
          }

          // Admin yetkisi varsa cookie'yi set et
          document.cookie = "admin-logged-in=true; path=/; max-age=86400" // 24 saat

          set({ adminUser: adminProfile, isAdminLoggedIn: true, isLoading: false })
        } else {
          // Admin yetkisi yoksa cookie'yi sil
          document.cookie = "admin-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          set({ adminUser: null, isAdminLoggedIn: false, isLoading: false })
        }
      } catch (e) {
        // Hata durumunda cookie'yi sil
        document.cookie = "admin-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        set({
          adminUser: null,
          isAdminLoggedIn: false,
          isLoading: false,
          error: "Error checking admin session profile.",
        })
      }
    } else {
      // Session yoksa cookie'yi sil
      document.cookie = "admin-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      set({ adminUser: null, isAdminLoggedIn: false, isLoading: false })
    }
  },

  fetchAdminPublishers: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("publishers").select("*").order("name")
      if (error) throw new Error(error.message)
      set({ publishers: data || [], isLoading: false })
    } catch (e: any) {
      set({
        isLoading: false,
        error: e.message || "Failed to fetch publishers",
      })
    }
  },

  addPublisher: async (publisherData) => {
    set({ isSubmitting: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase
        .from("publishers")
        .insert(publisherData as Omit<PublisherRow, "id" | "created_at" | "updated_at">) // Tip uyumu
        .select()
        .single()
      if (error) {
        console.error("Add publisher Supabase error:", error)
        throw new Error(error.message)
      }
      if (data) {
        await get().fetchAdminPublishers() // Re-fetch to ensure consistency
      }
      set({ isSubmitting: false })
      return data
    } catch (e: any) {
      console.error("Add publisher catch error:", e)
      set({
        isSubmitting: false,
        error: e.message || "Failed to add publisher",
      })
      return null
    }
  },

  updatePublisher: async (id, publisherData) => {
    set({ isSubmitting: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("publishers").update(publisherData).eq("id", id).select().single()
      if (error) {
        console.error("Update publisher Supabase error:", error)
        throw new Error(error.message)
      }
      if (data) {
        await get().fetchAdminPublishers() // Re-fetch
      }
      set({ isSubmitting: false })
      return data
    } catch (e: any) {
      console.error("Update publisher catch error:", e)
      set({
        isSubmitting: false,
        error: e.message || "Failed to update publisher",
      })
      return null
    }
  },

  deletePublisher: async (id) => {
    set({ isSubmitting: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { error } = await supabase.from("publishers").delete().eq("id", id)
      if (error) {
        console.error("Delete publisher Supabase error:", error)
        throw new Error(error.message)
      }
      await get().fetchAdminPublishers() // Re-fetch
      set({ isSubmitting: false })
      return true
    } catch (e: any) {
      console.error("Delete publisher catch error:", e)
      set({
        isSubmitting: false,
        error: e.message || "Failed to delete publisher",
      })
      return false
    }
  },

  fetchAdminCoupons: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("coupons").select("*").order("title")
      if (error) throw new Error(error.message)
      set({ coupons: data || [], isLoading: false })
    } catch (e: any) {
      set({
        isLoading: false,
        error: e.message || "Failed to fetch coupons",
      })
    }
  },

  addCoupon: async (couponData) => {
    set({ isSubmitting: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase
        .from("coupons")
        .insert(couponData as Omit<CouponRow, "id" | "created_at" | "updated_at">) // Tip uyumu
        .select()
        .single()
      if (error) {
        console.error("Add coupon Supabase error:", error)
        throw new Error(error.message)
      }
      if (data) {
        await get().fetchAdminCoupons() // Re-fetch
      }
      set({ isSubmitting: false })
      return data
    } catch (e: any) {
      console.error("Add coupon catch error:", e)
      set({
        isSubmitting: false,
        error: e.message || "Failed to add coupon",
      })
      return null
    }
  },

  updateCoupon: async (id, couponData) => {
    set({ isSubmitting: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("coupons").update(couponData).eq("id", id).select().single()
      if (error) {
        console.error("Update coupon Supabase error:", error)
        throw new Error(error.message)
      }
      if (data) {
        await get().fetchAdminCoupons() // Re-fetch
      }
      set({ isSubmitting: false })
      return data
    } catch (e: any) {
      console.error("Update coupon catch error:", e)
      set({
        isSubmitting: false,
        error: e.message || "Failed to update coupon",
      })
      return null
    }
  },

  deleteCoupon: async (id) => {
    set({ isSubmitting: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id)
      if (error) {
        console.error("Delete coupon Supabase error:", error)
        throw new Error(error.message)
      }
      await get().fetchAdminCoupons() // Re-fetch
      set({ isSubmitting: false })
      return true
    } catch (e: any) {
      console.error("Delete coupon catch error:", e)
      set({
        isSubmitting: false,
        error: e.message || "Failed to delete coupon",
      })
      return false
    }
  },

  fetchUserPointsSummary: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, display_name, ore_points")
        .order("ore_points", { ascending: false })
        .limit(100)

      if (error) throw new Error(error.message)
      set({ isLoading: false })
      return data || []
    } catch (e: any) {
      set({
        isLoading: false,
        error: e.message || "Failed to fetch user points summary",
      })
      return null
    }
  },
}))
