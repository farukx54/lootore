import { z } from "zod"
import { AdminLoginSchema, AdminUserSchema, type AdminUser, type AdminLoginData } from "../types/admin"
import { AuthException, AuthErrorCode } from "../types/auth"

class AdminService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api/admin${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AuthException(
        errorData.code || AuthErrorCode.UNAUTHORIZED,
        errorData.message || "Admin request failed",
        errorData.details,
      )
    }

    return await response.json()
  }

  async login(credentials: AdminLoginData): Promise<AdminUser> {
    try {
      // Validate input
      const validatedCredentials = AdminLoginSchema.parse(credentials)

      // For now, simulate admin login - will be replaced with real auth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock admin credentials
      if (validatedCredentials.username === "admin" && validatedCredentials.password === "admin123") {
        const adminUser = {
          id: "admin-1",
          username: "admin",
          email: "admin@lootore.com",
          role: "super_admin" as const,
          permissions: ["manage_users", "manage_publishers", "manage_coupons", "view_analytics", "manage_admins"],
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        return AdminUserSchema.parse(adminUser)
      }

      throw new AuthException(AuthErrorCode.UNAUTHORIZED, "Invalid admin credentials")
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AuthException(AuthErrorCode.VALIDATION_ERROR, "Invalid input data", error.errors)
      }
      if (error instanceof AuthException) {
        throw error
      }
      throw new AuthException(AuthErrorCode.NETWORK_ERROR, "Admin login failed", error)
    }
  }

  async verifyAdminSession(): Promise<AdminUser | null> {
    try {
      // This will check admin session with real API
      const response = await this.makeRequest<{ user: AdminUser }>("/verify-session")
      return AdminUserSchema.parse(response.user)
    } catch (error) {
      return null
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest("/logout", { method: "POST" })
    } catch (error) {
      console.error("Admin logout failed:", error)
    }
  }
}

export const adminService = new AdminService()
