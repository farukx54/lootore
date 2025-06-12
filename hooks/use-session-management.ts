"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { createClient } from "@/lib/supabase/auth-helpers"
import { supabaseService } from "@/lib/services/supabase-service"

const supabase = createClient()

export function useSessionManagement() {
  const { user, login, logout, setLoading } = useAuthStore()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Get user profile from database
          const userProfile = await supabaseService.getUserById(session.user.id)
          if (userProfile) {
            login({
              id: userProfile.id,
              username: userProfile.username,
              displayName: userProfile.display_name,
              avatar: userProfile.avatar || "/abstract-user-icon.png",
              provider: userProfile.provider as "twitch" | "kick",
              providerUsername: userProfile.provider_username,
              providerUserId: userProfile.provider_user_id,
              email: userProfile.email,
              createdAt: userProfile.created_at,
              updatedAt: userProfile.updated_at,
              orePoints: userProfile.ore_points,
              isActive: userProfile.is_active,
            })
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const userProfile = await supabaseService.getUserById(session.user.id)
        if (userProfile) {
          login({
            id: userProfile.id,
            username: userProfile.username,
            displayName: userProfile.display_name,
            avatar: userProfile.avatar || "/abstract-user-icon.png",
            provider: userProfile.provider as "twitch" | "kick",
            providerUsername: userProfile.provider_username,
            providerUserId: userProfile.provider_user_id,
            email: userProfile.email,
            createdAt: userProfile.created_at,
            updatedAt: userProfile.updated_at,
            orePoints: userProfile.ore_points,
            isActive: userProfile.is_active,
          })
        }
      } else if (event === "SIGNED_OUT") {
        logout()
      }
    })

    return () => subscription.unsubscribe()
  }, [login, logout, setLoading])

  return { user }
}
