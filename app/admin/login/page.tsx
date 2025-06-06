"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield } from "lucide-react"
import { useAdminStore } from "@/lib/stores/admin-store"
import { AdminLoginSchema } from "@/lib/types/admin"
import { z } from "zod"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "", // username yerine email kullanıyoruz
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const router = useRouter()

  // Store'dan state ve action'ları al
  const adminLogin = useAdminStore((state) => state.adminLogin)
  const isAdminLoggedIn = useAdminStore((state) => state.isAdminLoggedIn)
  const adminError = useAdminStore((state) => state.error)
  const isLoading = useAdminStore((state) => state.isLoading || state.isSubmitting)
  const clearAdminError = useAdminStore((state) => state.clearAdminError)

  useEffect(() => {
    // Eğer kullanıcı zaten admin olarak giriş yapmışsa ve yükleme durumu yoksa /admin sayfasına yönlendir
    if (isAdminLoggedIn && !isLoading) {
      window.location.href = "/admin"; // Tam sayfa yenileme ile yönlendirme
    }
  }, [isAdminLoggedIn, isLoading])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Input değiştiğinde ilgili alanın hata mesajını temizle
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    // Input değiştiğinde genel hata mesajını temizle
    if (adminError) {
      clearAdminError()
    }
  }

  const validateForm = () => {
    try {
      AdminLoginSchema.parse(formData)
      setValidationErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validasyonu
    if (!validateForm()) {
      return
    }

    // Hata mesajlarını temizle
    clearAdminError()
    
    // Login işlemini başlat
    await adminLogin({
      username: formData.email, // email'i username olarak gönder
      password: formData.password
    })
  }

  // Eğer zaten giriş yapılmışsa ve yönlendirme bekleniyorsa, başarılı mesaj göster
  if (isAdminLoggedIn && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <div className="absolute inset-0 bg-[url('/neon-fracture.png')] bg-cover bg-center opacity-10"></div>
        <Card className="w-full max-w-md border-green-500 bg-gray-800/90 backdrop-blur-sm relative z-10">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-500 mb-2">Giriş Başarılı!</h2>
            <p className="text-gray-300 text-center">Admin paneline yönlendiriliyorsunuz...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="absolute inset-0 bg-[url('/neon-fracture.png')] bg-cover bg-center opacity-10"></div>
      <Card className="w-full max-w-md border-gray-700 bg-gray-800/90 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Admin Girişi</CardTitle>
          <CardDescription className="text-gray-400">LootOre admin paneline erişim için giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                E-posta Adresi
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                placeholder="Admin e-posta adresinizi girin"
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-400">{validationErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Şifre
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white focus:border-red-500 pr-10"
                  placeholder="Şifrenizi girin"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-400">{validationErrors.password}</p>
              )}
            </div>
            {adminError && (
              <Alert variant="destructive" className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400 flex items-center">
                  <span className="mr-2">❌</span>
                  {adminError}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Giriş yapılıyor...
                </span>
              ) : (
                "Admin Girişi"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
