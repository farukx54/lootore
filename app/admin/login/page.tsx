"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield } from "lucide-react"
import { useAdminStore } from "@/lib/stores/admin-store"
import { adminService } from "@/lib/services/admin-service"
import { AuthException } from "@/lib/types/auth"
import { AdminLoginSchema } from "@/lib/types/admin"
import { z } from "zod"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const { isAdminLoading, adminError, setAdminLoading, setAdminError, adminLogin, clearAdminError } = useAdminStore()

  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field-specific validation error
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Clear general error
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

    if (!validateForm()) {
      return
    }

    setAdminLoading(true)
    clearAdminError()

    try {
      const adminUser = await adminService.login(formData)
      adminLogin(adminUser)

      // Set cookie for middleware
      document.cookie = "admin-logged-in=true; path=/; max-age=86400" // 24 hours

      router.push("/admin")
    } catch (error) {
      if (error instanceof AuthException) {
        setAdminError(error.message)
      } else {
        setAdminError("Giriş yapılırken beklenmeyen bir hata oluştu")
      }
    } finally {
      setAdminLoading(false)
    }
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
              <Label htmlFor="username" className="text-white">
                Kullanıcı Adı
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-red-500"
                placeholder="Admin kullanıcı adınızı girin"
                disabled={isAdminLoading}
              />
              {validationErrors.username && <p className="text-sm text-red-400">{validationErrors.username}</p>}
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
                  disabled={isAdminLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  disabled={isAdminLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.password && <p className="text-sm text-red-400">{validationErrors.password}</p>}
            </div>

            {adminError && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{adminError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isAdminLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
            >
              {isAdminLoading ? "Giriş yapılıyor..." : "Admin Girişi"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Demo: admin / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
