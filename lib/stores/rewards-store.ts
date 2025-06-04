import { create } from "zustand"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../supabase/types"

type Coupon = Database["public"]["Tables"]["coupons"]["Row"]

interface RewardsState {
  coupons: Coupon[]
  categories: string[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchCoupons: (category?: string) => Promise<void>
  // searchCoupons: (query: string, category?: string) => Promise<void>
  redeemCoupon: (couponId: string) => Promise<boolean>
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
  coupons: [],
  categories: ["all", "game-codes", "subscriptions", "gift-cards", "in-game-items", "equipment", "digital-games"],
  isLoading: false,
  error: null,

  fetchCoupons: async (category) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClientComponentClient<Database>()

      let query = supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .gt("stock_quantity", 0)
        .order("created_at", { ascending: false })

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (error) throw error
      set({ coupons: data || [], isLoading: false })
    } catch (error: any) {
      console.error("Fetch coupons error:", error)
      set({ isLoading: false, error: error.message || "Failed to fetch rewards" })
    }
  },

  /*
searchCoupons: async (query, category) => {
  try {
    set({ isLoading: true, error: null })
    const supabase = createClientComponentClient<Database>()

    let supabaseQuery = supabase
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .gt("stock_quantity", 0)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (category && category !== "all") {
      supabaseQuery = supabaseQuery.eq("category", category)
    }

    const { data, error } = await supabaseQuery

    if (error) throw error
    set({ coupons: data || [], isLoading: false })
  } catch (error: any) {
    console.error("Search coupons error:", error)
    set({ isLoading: false, error: error.message || "Failed to search rewards" })
  }
},
*/

  redeemCoupon: async (couponId) => {
    try {
      const supabase = createClientComponentClient<Database>()

      // Get the coupon
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("*")
        .eq("id", couponId)
        .eq("is_active", true)
        .gt("stock_quantity", 0)
        .single()

      if (couponError || !coupon) {
        throw new Error("Coupon not available")
      }

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated")

      // Get user profile
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("ore_points")
        .eq("id", session.user.id)
        .single()

      if (userError || !user) {
        throw new Error("User profile not found")
      }

      // Check if user has enough points
      if (user.ore_points < coupon.ore_points_required) {
        throw new Error("Insufficient Ore Points")
      }

      // Update user points
      const { error: updateUserError } = await supabase
        .from("users")
        .update({
          ore_points: user.ore_points - coupon.ore_points_required,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id)

      if (updateUserError) throw updateUserError

      // Update coupon stock
      const { error: updateCouponError } = await supabase
        .from("coupons")
        .update({
          stock_quantity: coupon.stock_quantity - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", couponId)

      if (updateCouponError) throw updateCouponError

      // Log activity
      await supabase.from("user_activities").insert({
        user_id: session.user.id,
        activity_type: "reward_redeemed",
        points_earned: -coupon.ore_points_required,
        description: `Redeemed: ${coupon.title}`,
        created_at: new Date().toISOString(),
      })

      // Refresh coupons list
      const { fetchCoupons } = get()
      await fetchCoupons()

      return true
    } catch (error: any) {
      console.error("Redeem coupon error:", error)
      throw error
    }
  },
}))
