"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { validateUsername, checkUsernameAvailability, updateUsername, type UserProfile } from "@/lib/auth"
import { useDebounce } from "@/hooks/use-debounce"

interface UsernameModalProps {
  isOpen: boolean
  userProfile: UserProfile
  onComplete: (updatedProfile: UserProfile) => void
}

export default function UsernameModal({ isOpen, userProfile, onComplete }: UsernameModalProps) {
  const [username, setUsername] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const debouncedUsername = useDebounce(username, 500)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername("")
      setIsAvailable(null)
      setValidationError(null)
      setSubmitError(null)
    }
  }, [isOpen])

  // Check username availability when debounced value changes
  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) return

      const validation = validateUsername(debouncedUsername)
      if (!validation.isValid) {
        setValidationError(validation.error || "Geçersiz kullanıcı adı")
        setIsAvailable(false)
        return
      }

      setIsChecking(true)
      setValidationError(null)

      try {
        const available = await checkUsernameAvailability(debouncedUsername)
        setIsAvailable(available)
        if (!available) {
          setValidationError("Bu kullanıcı adı zaten alınmış")
        }
      } catch (error) {
        console.error("Username check error:", error)
        setValidationError("Kullanıcı adı kontrolü yapılamadı")
        setIsAvailable(false)
      } finally {
        setIsChecking(false)
      }
    }

    if (debouncedUsername) {
      checkUsername()
    } else {
      setIsAvailable(null)
      setValidationError(null)
    }
  }, [debouncedUsername])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !isAvailable) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const updatedProfile = await updateUsername(userProfile.id, username)
      onComplete(updatedProfile)
    } catch (error: any) {
      console.error("Username update error:", error)
      setSubmitError(error.message || "Kullanıcı adı güncellenirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Kullanıcı Adı Oluştur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Kullanıcı Adı
            </Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adınızı girin"
                className={`pr-10 ${validationError ? "border-red-500" : isAvailable ? "border-green-500" : ""}`}
                disabled={isSubmitting}
                aria-invalid={validationError ? "true" : "false"}
                aria-describedby={validationError ? "username-error" : isAvailable ? "username-success" : undefined}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isChecking ? (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                ) : isAvailable ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : validationError ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
            </div>

            {validationError && (
              <p id="username-error" className="text-sm text-red-500">
                {validationError}
              </p>
            )}

            {isAvailable && !validationError && (
              <p id="username-success" className="text-sm text-green-500">
                Bu kullanıcı adı kullanılabilir
              </p>
            )}
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="submit" disabled={!isAvailable || isSubmitting || isChecking} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Kullanıcı Adını Kaydet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
