"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useAdminStore } from "@/lib/stores/admin-store"
import LoadingScreen from "./loading-screen"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname()
  const router = useRouter()

  const { isLoggedIn } = useAuthStore()
  const { isAdminLoggedIn, checkAdminSession, isLoading: isAdminLoading } = useAdminStore()

  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const performChecks = async () => {
      setIsChecking(true)

      if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) {
        console.log("AuthGuard: Checking admin session for", pathname)
        await checkAdminSession()
      }

      setIsChecking(false)
    }

    performChecks()
  }, [pathname, checkAdminSession])

  useEffect(() => {
    if (isChecking) return

    if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) {
      if (!isAdminLoggedIn) {
        console.log("AuthGuard: Redirecting to admin login")
        router.push("/admin/login")
        return
      }
    }

    if (pathname === "/admin/login" && isAdminLoggedIn) {
      console.log("AuthGuard: Admin already logged in, redirecting to /admin")
      router.push("/admin")
      return
    }

    const protectedUserRoutes = ["/profile"]
    if (protectedUserRoutes.some((route) => pathname?.startsWith(route))) {
      if (!isLoggedIn) {
        console.log("AuthGuard: User not logged in, redirecting to login")
        const redirectUrl = new URL("/login", window.location.origin)
        redirectUrl.searchParams.set("redirect", pathname)
        router.push(redirectUrl.toString())
        return
      }
    }

    const authRoutes = ["/login"]
    if (authRoutes.some((route) => pathname?.startsWith(route)) && isLoggedIn) {
      console.log("AuthGuard: User already logged in, redirecting to home")
      router.push("/")
      return
    }
  }, [isChecking, pathname, isAdminLoggedIn, isLoggedIn, router])

  if (isChecking || (pathname?.startsWith("/admin") && isAdminLoading)) {
    return <LoadingScreen />
  }

  if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login") && !isAdminLoggedIn) {
    console.log("AuthGuard: Blocking admin route access")
    return <LoadingScreen /> // Yönlendirme sırasında LoadingScreen göster
  }

  const protectedUserRoutes = ["/profile"]
  if (protectedUserRoutes.some((route) => pathname?.startsWith(route)) && !isLoggedIn) {
    console.log("AuthGuard: Blocking protected user route access")
    return <LoadingScreen /> // Yönlendirme sırasında LoadingScreen göster
  }

  return <>{children}</>
}
