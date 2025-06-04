import { AuthException, AuthErrorCode, type UserProfile, type AuthResponse, UserProfileSchema } from "../types/auth"

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

class AuthService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new AuthException(
          errorData.code || AuthErrorCode.NETWORK_ERROR,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.details,
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof AuthException) {
        throw error
      }
      throw new AuthException(AuthErrorCode.NETWORK_ERROR, "Network request failed", error)
    }
  }

  async authenticateWithTwitch(): Promise<UserProfile> {
    try {
      // For now, simulate the API call - will be replaced with real Supabase auth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate random failure for testing
      if (Math.random() < 0.1) {
        throw new AuthException(AuthErrorCode.TWITCH_AUTH_FAILED, "Twitch authentication failed. Please try again.")
      }

      const mockProfile = {
        id: `twitch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        username: null,
        displayName: "Twitch User",
        avatar: "/abstract-user-icon.png",
        provider: "twitch" as const,
        providerUsername: `twitch_user_${Math.random().toString(36).substring(2, 6)}`,
        providerUserId: `twitch_${Date.now()}`,
        email: "user@example.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        orePoints: 0,
        isActive: true,
      }

      // Validate the profile
      return UserProfileSchema.parse(mockProfile)
    } catch (error) {
      if (error instanceof AuthException) {
        throw error
      }
      throw new AuthException(AuthErrorCode.TWITCH_AUTH_FAILED, "Failed to authenticate with Twitch", error)
    }
  }

  async authenticateWithKick(): Promise<UserProfile> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (Math.random() < 0.1) {
        throw new AuthException(AuthErrorCode.KICK_AUTH_FAILED, "Kick authentication failed. Please try again.")
      }

      const mockProfile = {
        id: `kick-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        username: null,
        displayName: "Kick User",
        avatar: "/abstract-user-icon.png",
        provider: "kick" as const,
        providerUsername: `kick_user_${Math.random().toString(36).substring(2, 6)}`,
        providerUserId: `kick_${Date.now()}`,
        email: "user@example.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        orePoints: 0,
        isActive: true,
      }

      return UserProfileSchema.parse(mockProfile)
    } catch (error) {
      if (error instanceof AuthException) {
        throw error
      }
      throw new AuthException(AuthErrorCode.KICK_AUTH_FAILED, "Failed to authenticate with Kick", error)
    }
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock taken usernames
      const takenUsernames = ["admin", "test", "user", "lootore", "twitch", "kick"]
      return !takenUsernames.includes(username.toLowerCase())
    } catch (error) {
      throw new AuthException(AuthErrorCode.NETWORK_ERROR, "Failed to check username availability", error)
    }
  }

  async updateUsername(userId: string, username: string): Promise<UserProfile> {
    try {
      // This will be a real API call to Supabase
      const response = await this.makeRequest<AuthResponse>("/auth/update-username", {
        method: "POST",
        body: JSON.stringify({ userId, username }),
      })

      if (!response.success || !response.data) {
        throw new AuthException(AuthErrorCode.VALIDATION_ERROR, "Failed to update username")
      }

      return UserProfileSchema.parse(response.data)
    } catch (error) {
      if (error instanceof AuthException) {
        throw error
      }
      throw new AuthException(AuthErrorCode.NETWORK_ERROR, "Failed to update username", error)
    }
  }

  async refreshSession(): Promise<UserProfile | null> {
    try {
      const response = await this.makeRequest<AuthResponse>("/auth/refresh")

      if (!response.success || !response.data) {
        return null
      }

      return UserProfileSchema.parse(response.data)
    } catch (error) {
      console.error("Session refresh failed:", error)
      return null
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest("/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      // Log error but don't throw - logout should always succeed locally
      console.error("Logout API call failed:", error)
    }
  }
}

export const authService = new AuthService()
