import { z } from "zod"

// Admin User Schema (Basit MVP versiyonu)
export const AdminUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "super_admin"]).default("admin"), // MVP için tek rol yeterli olabilir
  // created_at, last_login_at gibi alanlar eklenebilir
})
export type AdminUser = z.infer<typeof AdminUserSchema>

// Admin Panelinde Yayıncı Yönetimi için Şema
export const AdminPublisherSchema = z.object({
  id: z.string().uuid().optional(), // Yeni eklerken olmayacak, düzenlerken olacak
  name: z.string().min(1, "Yayıncı adı gerekli"),
  platform: z.enum(["twitch", "kick"]),
  channel_url: z.string().url("Geçerli bir kanal URL'si girin"),
  username: z.string().min(1, "Platform kullanıcı adı gerekli"), // Twitch/Kick kullanıcı adı
  avatar_url: z.string().url("Geçerli avatar URL'si").optional(),
  is_active: z.boolean().default(true),
  points_per_minute: z.number().int().min(0).default(1), // İzleme başına dk/puan
  follower_count: z.number().int().min(0).optional().default(0), // Admin manuel girebilir veya API'den çekilebilir
  // description, category gibi alanlar eklenebilir
})
export type AdminPublisher = z.infer<typeof AdminPublisherSchema>

// Admin Panelinde Kupon Yönetimi için Şema
export const AdminCouponSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Kupon başlığı gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  code: z.string().min(3, "Kupon kodu en az 3 karakter olmalı").toUpperCase().optional(), // Otomatik de üretilebilir
  ore_points_required: z.number().int().min(1, "Puan maliyeti en az 1 olmalı"),
  category: z.string().min(1, "Kategori gerekli"), // Örn: "Oyun Kodu", "Hediye Kartı"
  image_url: z.string().url("Geçerli görsel URL'si").optional(),
  is_active: z.boolean().default(true),
  stock_quantity: z.number().int().min(0).default(0), // 0 = sınırsız veya stok bitti
  expires_at: z.string().datetime().optional().nullable(), // ISO string formatında
  // max_uses_per_user gibi kısıtlamalar eklenebilir
})
export type AdminCoupon = z.infer<typeof AdminCouponSchema>

// Admin Login Şeması
export const AdminLoginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
})
export type AdminLoginData = z.infer<typeof AdminLoginSchema>
