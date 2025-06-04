import { supabase } from "../supabase/client"
import type { Database } from "../supabase/types"
import { AuthException, AuthErrorCode } from "../types/auth"

type Tables = Database["public"]["Tables"]
type User = Tables["users"]["Row"]
type Publisher = Tables["publishers"]["Row"]
type Coupon = Tables["coupons"]["Row"]
type UserActivity = Tables["user_activities"]["Row"]

export class SupabaseService {
  private user: User | null = null // Declare user variable

  // Users
  async getUsers(limit = 50): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching users:", error)
      throw new AuthException(AuthErrorCode.DATABASE_ERROR, "Failed to fetch users")
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

      if (error && error.code !== "PGRST116") throw error
      return data || null
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  }

  async updateUser(id: string, updates: Partial<Omit<User, "id" | "created_at">>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating user:", error)
      throw new AuthException(AuthErrorCode.DATABASE_ERROR, "Failed to update user")
    }
  }

  // Publishers
  async getPublishers(platform?: "twitch" | "kick"): Promise<Publisher[]> {
    try {
      let query = supabase
        .from("publishers")
        .select("*")
        .eq("is_active", true)
        .order("follower_count", { ascending: false })

      if (platform) {
        query = query.eq("platform", platform)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching publishers:", error)
      throw new AuthException(AuthErrorCode.DATABASE_ERROR, "Failed to fetch publishers")
    }
  }

  async searchPublishers(query: string, platform?: "twitch" | "kick"): Promise<Publisher[]> {
    try {
      let supabaseQuery = supabase
        .from("publishers")
        .select("*")
        .eq("is_active", true)
        .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
        .order("follower_count", { ascending: false })
        .limit(20)

      if (platform) {
        supabaseQuery = supabaseQuery.eq("platform", platform)
      }

      const { data, error } = await supabaseQuery
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error searching publishers:", error)
      return []
    }
  }

  // Coupons/Rewards
  async getCategories(): Promise<{ data: string[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("category")
        .eq("is_active", true)
        .not("category", "is", null)

      if (error) throw error

      // Benzersiz kategorileri al ve "all" kategorisini başa ekle
      const uniqueCategories = Array.from(new Set(data?.map((item) => item.category) || []))
      const categoriesWithAll = ["all", ...uniqueCategories]

      return { data: categoriesWithAll, error: null }
    } catch (error) {
      console.error("Error fetching categories:", error)
      return { data: null, error }
    }
  }

  async getCoupons(category?: string): Promise<{ data: Coupon[] | null; error: any }> {
    try {
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
      return { data: data || [], error: null }
    } catch (error) {
      console.error("Error fetching coupons:", error)
      return { data: null, error }
    }
  }

  async searchCoupons(searchQuery: string, category?: string): Promise<{ data: Coupon[] | null; error: any }> {
    try {
      let query = supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .gt("stock_quantity", 0)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false })
        .limit(50)

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      const { data, error } = await query
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error("Error searching coupons:", error)
      return { data: null, error }
    }
  }

  async redeemCoupon(couponId: string): Promise<{ error: any }> {
    try {
      if (!this.user) {
        throw new AuthException(AuthErrorCode.USER_NOT_FOUND, "User not found")
      }

      // Start transaction
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("*")
        .eq("id", couponId)
        .eq("is_active", true)
        .gt("stock_quantity", 0)
        .single()

      if (couponError || !coupon) {
        throw new AuthException(AuthErrorCode.VALIDATION_ERROR, "Coupon not available")
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("ore_points")
        .eq("id", this.user.id)
        .single()

      if (userError || !userData) {
        throw new AuthException(AuthErrorCode.USER_NOT_FOUND, "User not found")
      }

      if (userData.ore_points < coupon.ore_points_required) {
        throw new AuthException(AuthErrorCode.INSUFFICIENT_POINTS, "Insufficient Ore Points")
      }

      // Deduct points and update stock
      const { error: updateUserError } = await supabase
        .from("users")
        .update({
          ore_points: userData.ore_points - coupon.ore_points_required,
          updated_at: new Date().toISOString(),
        })
        .eq("id", this.user.id)

      if (updateUserError) throw updateUserError

      const { error: updateCouponError } = await supabase
        .from("coupons")
        .update({
          stock_quantity: coupon.stock_quantity - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", couponId)

      if (updateCouponError) throw updateCouponError

      // Log activity
      await this.logUserActivity(
        this.user.id,
        "coupon_redeem",
        -coupon.ore_points_required,
        `Redeemed: ${coupon.title}`,
      )

      return { error: null }
    } catch (error) {
      console.error("Error redeeming coupon:", error)
      if (error instanceof AuthException) return { error }
      return { error: new AuthException(AuthErrorCode.DATABASE_ERROR, "Failed to redeem coupon") }
    }
  }

  // User Activities
  async getUserActivities(userId: string, limit = 50): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching user activities:", error)
      return []
    }
  }

  async logUserActivity(
    userId: string,
    activityType: string,
    pointsEarned: number,
    description: string,
  ): Promise<void> {
    try {
      const { error } = await supabase.from("user_activities").insert({
        user_id: userId,
        activity_type: activityType,
        points_earned: pointsEarned,
        description,
        created_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (error) {
      console.error("Error logging user activity:", error)
      // Don't throw error for logging failures
    }
  }

  // Username validation
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.from("users").select("id").eq("username", username).limit(1)

      if (error) throw error
      return !data || data.length === 0
    } catch (error) {
      console.error("Error checking username availability:", error)
      return false
    }
  }

  // Statistics
  async getUserStats(userId: string): Promise<{
    totalPoints: number
    totalActivities: number
    rewardsRedeemed: number
    watchingTime: number
  }> {
    try {
      const [userResult, activitiesResult, rewardsResult] = await Promise.all([
        supabase.from("users").select("ore_points").eq("id", userId).single(),
        supabase.from("user_activities").select("id").eq("user_id", userId),
        supabase.from("user_activities").select("id").eq("user_id", userId).eq("activity_type", "reward_redeemed"),
      ])

      const totalPoints = userResult.data?.ore_points || 0
      const totalActivities = activitiesResult.data?.length || 0
      const rewardsRedeemed = rewardsResult.data?.length || 0

      // Calculate watching time from activities (mock for now)
      const watchingTime = totalActivities * 15 // Assume 15 minutes per activity

      return {
        totalPoints,
        totalActivities,
        rewardsRedeemed,
        watchingTime,
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
      return {
        totalPoints: 0,
        totalActivities: 0,
        rewardsRedeemed: 0,
        watchingTime: 0,
      }
    }
  }
}

export const supabaseService = new SupabaseService()
