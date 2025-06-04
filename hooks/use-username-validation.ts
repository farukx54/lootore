"use client"

import { useState, useEffect } from "react"
import { supabaseService } from "@/lib/services/supabase-service"
import { validateUsername } from "@/lib/auth"

interface UseUsernameValidationProps {
  username: string
  debounceMs?: number
}

interface ValidationResult {
  isValid: boolean
  isChecking: boolean
  error: string | null
  isAvailable: boolean | null
}

export function useUsernameValidation({ username, debounceMs = 500 }: UseUsernameValidationProps): ValidationResult {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset states
    setError(null)
    setIsAvailable(null)
    setIsChecking(false)

    // Early validation
    const validation = validateUsername(username)
    if (!validation.isValid) {
      setError(validation.error || null)
      return
    }

    if (!username.trim()) {
      return
    }

    // Debounce the availability check
    const timeoutId = setTimeout(async () => {
      setIsChecking(true)
      try {
        const available = await supabaseService.checkUsernameAvailability(username)
        setIsAvailable(available)
        if (!available) {
          setError("Bu kullanıcı adı zaten kullanılıyor")
        }
      } catch (error) {
        setError("Kullanıcı adı kontrolü yapılamadı")
        setIsAvailable(null)
      } finally {
        setIsChecking(false)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [username, debounceMs])

  const validation = validateUsername(username)
  const isValid = validation.isValid && isAvailable === true

  return {
    isValid,
    isChecking,
    error,
    isAvailable,
  }
}
