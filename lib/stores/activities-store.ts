import { create } from "zustand"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../supabase/types"

type UserActivity = Database["public"]["Tables"]["user_activities"]["Row"]

interface ActivitiesState {
  activities: UserActivity[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchActivities: (limit?: number) => Promise<void>
  logActivity: (activityType: string, pointsEarned: number, description: string) => Promise<void>
}

export const useActivitiesStore = create<ActivitiesState>((set) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async (limit = 50) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClientComponentClient<Database>()

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        set({ isLoading: false })
        return
      }

      const { data, error } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      set({ activities: data || [], isLoading: false })
    } catch (error: any) {
      console.error("Fetch activities error:", error)
      set({ isLoading: false, error: error.message || "Failed to fetch activities" })
    }
  },

  logActivity: async (activityType, pointsEarned, description) => {
    try {
      const supabase = createClientComponentClient<Database>()

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated")

      // Insert activity
      const { error } = await supabase.from("user_activities").insert({
        user_id: session.user.id,
        activity_type: activityType,
        points_earned: pointsEarned,
        description,
        created_at: new Date().toISOString(),
      })

      if (error) throw error

      // Update user points
      if (pointsEarned !== 0) {
        const { data: user } = await supabase.from("users").select("ore_points").eq("id", session.user.id).single()

        if (user) {
          await supabase
            .from("users")
            .update({
              ore_points: user.ore_points + pointsEarned,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.user.id)
        }
      }

      // Refresh activities
      const { fetchActivities } = set.getState() as ActivitiesState
      await fetchActivities()
    } catch (error) {
      console.error("Log activity error:", error)
    }
  },
}))
