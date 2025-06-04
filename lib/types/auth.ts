import { z } from "zod"

// Auth Provider Types
export type AuthProvider = "twitch" | "kick"

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  display_name: z.string().min(1, "Display name is required"),
  username: z.string().nullable(), // Kullanıcı daha sonra belirleyebilir
  avatar: z.string().url("Invalid avatar URL").optional(),
  provider: z.enum(["twitch", "kick"]),
  provider_username: z.string().min(1, "Provider username is required"),
  provider_user_id: z.string().min(1, "Provider user ID is required"),
  email: z.string().email("Invalid email").optional(), // Twitch'ten gelirse
  ore_points: z.number().int().min(0).default(0),
  // created_at, updated_at, is_active, referral_code MVP için kaldırılabilir veya DB default'larına bırakılabilir
})

export type UserProfile = z.infer<typeof UserProfileSchema>

// Username Validation Schema
export const UsernameSchema = z
  .string()
  .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
  .max(20, "Kullanıcı adı en fazla 20 karakter olabilir")
  .regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir")
  .refine((val) => !["admin", "root", "system", "lootore"].includes(val.toLowerCase()), "Bu kullanıcı adı kullanılamaz")

// Auth Error Types
export enum AuthErrorCode {
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED", // Genel giriş hatası
  DATABASE_ERROR = "DATABASE_ERROR", // Veritabanı işlemi hatası
  VALIDATION_ERROR = "VALIDATION_ERROR", // Veri doğrulama hatası
  NETWORK_ERROR = "NETWORK_ERROR", // Ağ hatası
  USERNAME_TAKEN = "USERNAME_TAKEN",
  INVALID_USERNAME = "INVALID_USERNAME",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INSUFFICIENT_POINTS = "INSUFFICIENT_POINTS",
}

export interface AuthError {
  code: AuthErrorCode
  message: string
  details?: any
}

// Custom Auth Exception
export class AuthException extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "AuthException"
  }
}

// API Response Types
export interface AuthResponse {
  success: boolean
  data?: UserProfile
  error?: AuthError
}

export interface UsernameCheckResponse {
  available: boolean
  suggestions?: string[]
}
