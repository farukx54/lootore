import { create } from "zustand"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../supabase/types"
import type { AdminUser, AdminPublisher, AdminCoupon, AdminLoginData } from "../types/admin"
import { type AuthError, AuthErrorCode, AuthException } from "../types/auth"

type PublisherRow = Database["public"]["Tables"]["publishers"]["Row"]
type CouponRow = Database["public"]["Tables"]["coupons"]["Row"]

interface AdminState {
  adminUser: AdminUser | null
  isAdminLoggedIn: boolean
  isLoading: boolean
  error: AuthError | null
  publishers: PublisherRow[]
  coupons: CouponRow[]

  // Actions
  adminLogin: (credentials: AdminLoginData) => Promise<void>
  adminLogout: () => Promise<void>
  checkAdminSession: () => Promise<void>

  fetchAdminPublishers: () => Promise<void>
  addPublisher: (publisherData: Omit<AdminPublisher, "id">) => Promise<PublisherRow | null>
  updatePublisher: (id: string, publisherData: Partial<AdminPublisher>) => Promise<PublisherRow | null>
  deletePublisher: (id: string) => Promise<boolean>

  fetchAdminCoupons: () => Promise<void>
  addCoupon: (couponData: Omit<AdminCoupon, "id">) => Promise<CouponRow | null>
  updateCoupon: (id: string, couponData: Partial<AdminCoupon>) => Promise<CouponRow | null>
  deleteCoupon: (id: string) => Promise<boolean>

  // Basit kullanıcı puanı görüntüleme (MVP için örnek)
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
  error: null,
  publishers: [],
  coupons: [],

  adminLogin: async (credentials) => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials)
      if (error) throw new AuthException(AuthErrorCode.AUTHENTICATION_FAILED, error.message)
      if (!data.user) throw new AuthException(AuthErrorCode.USER_NOT_FOUND, "Admin user not found")

      // Burada admin rolü kontrolü yapılabilir. Örneğin, user_metadata'da bir admin rolü var mı?
      // Veya ayrı bir admin tablosundan kullanıcı çekilebilir.
      // Şimdilik giriş başarılıysa admin kabul edelim.
      const adminProfile: AdminUser = {
        id: data.user.id,
        email: data.user.email!,
        role: "admin", // Bu dinamik olmalı
      }
      set({ adminUser: adminProfile, isAdminLoggedIn: true, isLoading: false })
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.AUTHENTICATION_FAILED, message: e.message || "Admin login failed" },
      })
    }
  },

  adminLogout: async () => {
    set({ isLoading: true })
    const supabase = createClientComponentClient<Database>()
    await supabase.auth.signOut()
    set({ adminUser: null, isAdminLoggedIn: false, isLoading: false })
  },

  checkAdminSession: async () => {
    set({ isLoading: true })
    const supabase = createClientComponentClient<Database>()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) {
      // Admin rol kontrolü burada da yapılmalı
      const adminProfile: AdminUser = {
        id: session.user.id,
        email: session.user.email!,
        role: "admin", // Bu dinamik olmalı
      }
      set({ adminUser: adminProfile, isAdminLoggedIn: true, isLoading: false })
    } else {
      set({ adminUser: null, isAdminLoggedIn: false, isLoading: false })
    }
  },

  fetchAdminPublishers: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("publishers").select("*").order("name")
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      set({ publishers: data || [], isLoading: false })
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to fetch publishers" },
      })
    }
  },

  addPublisher: async (publisherData) => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      // AdminPublisherSchema ile publisherData valide edilebilir.
      const { data, error } = await supabase
        .from("publishers")
        .insert(publisherData as PublisherRow)
        .select()
        .single()
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      if (data) set((state) => ({ publishers: [...state.publishers, data], isLoading: false }))
      return data
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to add publisher" },
      })
      return null
    }
  },

  updatePublisher: async (id, publisherData) => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      // AdminPublisherSchema ile publisherData valide edilebilir.
      const { data, error } = await supabase
        .from("publishers")
        .update(publisherData as Partial<PublisherRow>)
        .eq("id", id)
        .select()
        .single()
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      if (data)
        set((state) => ({ publishers: state.publishers.map((p) => (p.id === id ? data : p)), isLoading: false }))
      return data
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to update publisher" },
      })
      return null
    }
  },

  deletePublisher: async (id) => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { error } = await supabase.from("publishers").delete().eq("id", id)
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      set((state) => ({ publishers: state.publishers.filter((p) => p.id !== id), isLoading: false }))
      return true
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to delete publisher" },
      })
      return false
    }
  },

  fetchAdminCoupons: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { data, error } = await supabase.from("coupons").select("*").order("title")
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      set({ coupons: data || [], isLoading: false })
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to fetch coupons" },
      })
    }
  },

  addCoupon: async (couponData) => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      // AdminCouponSchema ile couponData valide edilebilir.
      const { data, error } = await supabase
        .from("coupons")
        .insert(couponData as CouponRow)
        .select()
        .single()
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      if (data) set((state) => ({ coupons: [...state.coupons, data], isLoading: false }))
      return data
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to add coupon" },
      })
      return null
    }
  },

  updateCoupon: async (id, couponData) => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      // AdminCouponSchema ile couponData valide edilebilir.
      const { data, error } = await supabase
        .from("coupons")
        .update(couponData as Partial<CouponRow>)
        .eq("id", id)
        .select()
        .single()
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      if (data) set((state) => ({ coupons: state.coupons.map((c) => (c.id === id ? data : c)), isLoading: false }))
      return data
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to update coupon" },
      })
      return null
    }
  },

  deleteCoupon: async (id) => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id)
      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id), isLoading: false }))
      return true
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to delete coupon" },
      })
      return false
    }
  },

  fetchUserPointsSummary: async () => {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()
    try {
      // Bu işlem için admin yetkisi veya özel bir RLS politikası gerekebilir.
      const { data, error } = await supabase
        .from("users")
        .select("id, display_name, ore_points")
        .order("ore_points", { ascending: false })
        .limit(100) // Örnek olarak ilk 100 kullanıcı

      if (error) throw new AuthException(AuthErrorCode.DATABASE_ERROR, error.message)
      set({ isLoading: false })
      return data || []
    } catch (e: any) {
      set({
        isLoading: false,
        error:
          e instanceof AuthException
            ? e
            : { code: AuthErrorCode.DATABASE_ERROR, message: e.message || "Failed to fetch user points summary" },
      })
      return null
    }
  },
}))
