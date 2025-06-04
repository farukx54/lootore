"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { UserProfile } from "./auth"

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (profile: UserProfile) => void
  logout: () => void
  updateUser: (updates: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Client-side'da localStorage'ı kontrol et
    try {
      const storedUser = localStorage.getItem("userProfile")
      const storedLoginStatus = localStorage.getItem("isLoggedIn")

      if (storedUser && storedLoginStatus === "true") {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error("Auth state recovery failed:", error)
      // Clear corrupted data
      localStorage.removeItem("userProfile")
      localStorage.removeItem("isLoggedIn")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (profile: UserProfile) => {
    setUser(profile)
    setIsLoggedIn(true)
    localStorage.setItem("userProfile", JSON.stringify(profile))
    localStorage.setItem("isLoggedIn", "true")
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("userProfile")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("orePoints")
  }

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("userProfile", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
