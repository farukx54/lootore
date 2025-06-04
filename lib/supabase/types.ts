export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          display_name: string
          avatar: string | null
          provider: "twitch" | "kick"
          provider_username: string
          provider_user_id: string
          email: string | null
          created_at: string
          updated_at: string
          ore_points: number
          is_active: boolean
          referral_code: string | null
          referred_by: string | null
        }
        Insert: {
          id?: string
          username?: string | null
          display_name: string
          avatar?: string | null
          provider: "twitch" | "kick"
          provider_username: string
          provider_user_id: string
          email?: string | null
          created_at?: string
          updated_at?: string
          ore_points?: number
          is_active?: boolean
          referral_code?: string | null
          referred_by?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string
          avatar?: string | null
          provider?: "twitch" | "kick"
          provider_username?: string
          provider_user_id?: string
          email?: string | null
          created_at?: string
          updated_at?: string
          ore_points?: number
          is_active?: boolean
          referral_code?: string | null
          referred_by?: string | null
        }
      }
      publishers: {
        Row: {
          id: string
          name: string
          platform: "twitch" | "kick"
          username: string
          avatar: string | null
          follower_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          platform: "twitch" | "kick"
          username: string
          avatar?: string | null
          follower_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          platform?: "twitch" | "kick"
          username?: string
          avatar?: string | null
          follower_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          title: string
          description: string
          image: string
          category: string
          ore_points_required: number
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image: string
          category: string
          ore_points_required: number
          stock_quantity: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image?: string
          category?: string
          ore_points_required?: number
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: "watch_stream" | "referral" | "daily_bonus" | "coupon_redeem"
          points_earned: number
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: "watch_stream" | "referral" | "daily_bonus" | "coupon_redeem"
          points_earned: number
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: "watch_stream" | "referral" | "daily_bonus" | "coupon_redeem"
          points_earned?: number
          description?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
