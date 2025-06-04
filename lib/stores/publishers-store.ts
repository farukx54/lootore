import { create } from "zustand"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../supabase/types"

type Publisher = Database["public"]["Tables"]["publishers"]["Row"]

interface PublishersState {
  publishers: Publisher[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchPublishers: (platform?: "twitch" | "kick") => Promise<void>
  // searchPublishers: (query: string, platform?: "twitch" | "kick") => Promise<void>
}

export const usePublishersStore = create<PublishersState>((set) => ({
  publishers: [],
  isLoading: false,
  error: null,

  fetchPublishers: async (platform) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClientComponentClient<Database>()

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
      set({ publishers: data || [], isLoading: false })
    } catch (error: any) {
      console.error("Fetch publishers error:", error)
      set({ isLoading: false, error: error.message || "Failed to fetch publishers" })
    }
  },

  // searchPublishers: async (query, platform) => {
  //   try {
  //     set({ isLoading: true, error: null })
  //     const supabase = createClientComponentClient<Database>()

  //     let supabaseQuery = supabase
  //       .from("publishers")
  //       .select("*")
  //       .eq("is_active", true)
  //       .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
  //       .order("follower_count", { ascending: false })

  //     if (platform) {
  //       supabaseQuery = supabaseQuery.eq("platform", platform)
  //     }

  //     const { data, error } = await supabaseQuery

  //     if (error) throw error
  //     set({ publishers: data || [], isLoading: false })
  //   } catch (error: any) {
  //     console.error("Search publishers error:", error)
  //     set({ isLoading: false, error: error.message || "Failed to search publishers" })
  //   }
  // },
}))
