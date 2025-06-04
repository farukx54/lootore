// Geliştirilmiş auth sistemi
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./supabase/types"

export type AuthProvider = "twitch" | "kick"

export interface UserProfile {
  id: string
  username: string | null
  displayName: string
  avatar: string
  provider: AuthProvider
  providerUsername: string
  email?: string
  createdAt?: string
}

export interface AuthError {
  code: string
  message: string
  details?: any
}

// Custom error class
export class AuthenticationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "AuthenticationError"
  }
}

// Kullanıcı adı validasyonu
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: "Kullanıcı adı boş olamaz" }
  }

  if (username.length < 3) {
    return { isValid: false, error: "Kullanıcı adı en az 3 karakter olmalıdır" }
  }

  if (username.length > 20) {
    return { isValid: false, error: "Kullanıcı adı en fazla 20 karakter olabilir" }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir" }
  }

  return { isValid: true }
}

// Geliştirilmiş Twitch auth (şimdilik mock, Supabase'de gerçek olacak)
export const authenticateWithTwitch = async (): Promise<UserProfile> => {
  try {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulated random failure for testing
    if (Math.random() < 0.1) {
      throw new AuthenticationError("TWITCH_AUTH_FAILED", "Twitch kimlik doğrulama başarısız")
    }

    return {
      id: `twitch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      username: null,
      displayName: "Twitch Kullanıcısı",
      avatar: "/abstract-user-icon.png",
      provider: "twitch",
      providerUsername: `twitch_user_${Math.random().toString(36).substring(2, 6)}`,
      email: "user@example.com",
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError("NETWORK_ERROR", "Ağ bağlantısı hatası")
  }
}

// Geliştirilmiş Kick auth
export const authenticateWithKick = async (): Promise<UserProfile> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (Math.random() < 0.1) {
      throw new AuthenticationError("KICK_AUTH_FAILED", "Kick kimlik doğrulama başarısız")
    }

    return {
      id: `kick-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      username: null,
      displayName: "Kick Kullanıcısı",
      avatar: "/abstract-user-icon.png",
      provider: "kick",
      providerUsername: `kick_user_${Math.random().toString(36).substring(2, 6)}`,
      email: "user@example.com",
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError("NETWORK_ERROR", "Ağ bağlantısı hatası")
  }
}

// Kullanıcı adı kontrolü (Supabase'de gerçek kontrol yapılacak)
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("users").select("username").eq("username", username).maybeSingle()

    if (error) {
      console.error("Username check error:", error)
      throw new AuthenticationError("DATABASE_ERROR", "Kullanıcı adı kontrolü yapılamadı")
    }

    return data === null // Eğer data null ise kullanıcı adı müsait demektir
  } catch (error) {
    console.error("Username availability check error:", error)
    // Fallback to mock data if Supabase fails
    const takenUsernames = ["admin", "test", "user", "lootore", "twitch", "kick"]
    return !takenUsernames.includes(username.toLowerCase())
  }
}

// Kullanıcının ilk kez giriş yapıp yapmadığını kontrol etme
export const isFirstTimeLogin = (profile: UserProfile): boolean => {
  return profile.username === null || profile.username === ""
}

// Kullanıcı oturum bilgilerini localStorage'dan alma
export const getUserSession = (): UserProfile | null => {
  if (typeof window === "undefined") return null

  try {
    const profile = localStorage.getItem("userProfile")
    return profile ? JSON.parse(profile) : null
  } catch (error) {
    console.error("Error getting user session:", error)
    return null
  }
}

// Kullanıcı oturumunu sonlandırma
export const clearUserSession = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("userProfile")
  localStorage.setItem("isLoggedIn", "false")
}

// Kullanıcı oturumunu kaydetme
export const saveUserSession = (profile: UserProfile) => {
  if (typeof window === "undefined") return

  localStorage.setItem("userProfile", JSON.stringify(profile))
  localStorage.setItem("isLoggedIn", "true")
}

// Kullanıcı adını güncelleme
export const updateUsername = async (userId: string, username: string): Promise<UserProfile> => {
  try {
    const supabase = createClientComponentClient<Database>()

    // Önce kullanıcı adının müsait olup olmadığını kontrol et
    const isAvailable = await checkUsernameAvailability(username)
    if (!isAvailable) {
      throw new AuthenticationError("USERNAME_TAKEN", "Bu kullanıcı adı zaten alınmış")
    }

    // Kullanıcı adını güncelle
    const { data, error } = await supabase.from("users").update({ username }).eq("id", userId).select().single()

    if (error) {
      console.error("Username update error:", error)
      throw new AuthenticationError("UPDATE_FAILED", "Kullanıcı adı güncellenemedi")
    }

    if (!data) {
      throw new AuthenticationError("USER_NOT_FOUND", "Kullanıcı bulunamadı")
    }

    // Mevcut kullanıcı profilini al ve güncelle
    const currentProfile = getUserSession()
    if (!currentProfile) {
      throw new AuthenticationError("SESSION_ERROR", "Kullanıcı oturumu bulunamadı")
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      username,
    }

    // Güncellenmiş profili kaydet
    saveUserSession(updatedProfile)

    return updatedProfile
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError("UNKNOWN_ERROR", "Kullanıcı adı güncellenirken bir hata oluştu", error)
  }
}
