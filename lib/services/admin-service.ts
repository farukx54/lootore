// import { z } from "zod" // Artık kullanılmıyor olabilir
// import { AdminLoginSchema, AdminUserSchema, type AdminUser, type AdminLoginData } from "../types/admin" // Artık kullanılmıyor olabilir
import { AuthException, AuthErrorCode } from "../types/auth"

// Bu servis artık login/logout/session yönetimi yapmayacak.
// Bu sorumluluklar useAdminStore'a ve Supabase client'ına geçti.
// Eğer admin paneli için özel backend API endpoint'leriniz varsa,
// bu servis o endpoint'lere istek atmak için kullanılabilir.
// Şimdilik boş veya minimal bırakılabilir.

class AdminService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Bu fonksiyon, admin-spesifik API endpoint'lerine istek atmak için kullanılabilir.
    // Örnek: /api/admin/some-action
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
        errorData.message || "Admin API request failed",
        errorData.details,
      )
    }
    return await response.json()
  }

  // Örnek bir admin-spesifik API çağrısı (eğer varsa)
  // async getAdminDashboardStats(): Promise<any> {
  //   return this.makeRequest("/dashboard-stats");
  // }
}

export const adminService = new AdminService()
