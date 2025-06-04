"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useAdminStore } from "@/lib/stores/admin-store"
import { authService } from "@/lib/services/auth-service"
import { adminService } from "@/lib/services/admin-service"
import LoadingScreen from "./loading-screen"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export default function AuthGuard({ children, requireAuth = false, requireAdmin = false, redirectTo }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  const { isLoggedIn, user, login, logout } = useAuthStore()
  const { isAdminLoggedIn, adminUser, adminLogin, adminLogout } = useAdminStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check regular user auth if required
        if (requireAuth && !isLoggedIn) {
          const refreshedUser = await authService.refreshSession()
          if (refreshedUser) {
            login(refreshedUser)
            document.cookie = "auth-logged-in=true; path=/; max-age=86400"
          } else {
            const redirect = redirectTo || "/login"
            router.push(redirect)
            return
          }
        }

        // Check admin auth if required
        if (requireAdmin && !isAdminLoggedIn) {
          const adminUser = await adminService.verifyAdminSession()
          if (adminUser) {
            adminLogin(adminUser)
            document.cookie = "admin-logged-in=true; path=/; max-age=86400"
          } else {
            router.push("/admin/login")
            return
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)

        if (requireAuth) {
          logout()
          document.cookie = "auth-logged-in=false; path=/"
          router.push(redirectTo || "/login")
        }

        if (requireAdmin) {
          adminLogout()
          document.cookie = "admin-logged-in=false; path=/"
          router.push("/admin/login")
        }
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [requireAuth, requireAdmin, isLoggedIn, isAdminLoggedIn, router, redirectTo])

  if (isChecking) {
    return <LoadingScreen />
  }

  // If auth is required but user is not logged in, don't render children
  if (requireAuth && !isLoggedIn) {
    return null
  }

  // If admin is required but admin is not logged in, don't render children
  if (requireAdmin && !isAdminLoggedIn) {
    return null
  }

  return <>{children}</>
}
