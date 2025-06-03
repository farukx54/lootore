"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type UserProfile, updateUsername } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface UsernameModalProps {
  isOpen: boolean
  userProfile: UserProfile
  onComplete: (updatedProfile: UserProfile) => void
}

export default function UsernameModal({ isOpen, userProfile, onComplete }: UsernameModalProps) {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim()) {
      setError("Kullanıcı adı boş olamaz")
      return
    }

    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır")
      return
    }

    if (username.length > 20) {
      setError("Kullanıcı adı en fazla 20 karakter olmalıdır")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir")
      return
    }

    setIsLoading(true)

    try {
      // Gerçek uygulamada, kullanıcı adının benzersiz olup olmadığını kontrol etmek için
      // bir API çağrısı yapılacak
      // Şimdilik simüle ediyoruz
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Kullanıcı adını güncelle
      const updatedProfile = updateUsername(userProfile, username)

      toast({
        title: "Kullanıcı adı oluşturuldu",
        description: `Kullanıcı adınız "${username}" olarak ayarlandı.`,
        variant: "default",
      })

      onComplete(updatedProfile)
    } catch (error) {
      setError("Kullanıcı adı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-gray-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Kullanıcı Adı Oluştur</DialogTitle>
          <DialogDescription className="text-gray-400">
            LootOre'da kullanacağınız bir kullanıcı adı oluşturun. Bu, profilinizde ve sıralama tablolarında görünecek.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              className="border-gray-700 bg-gray-800 text-white"
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-xs text-gray-400">
                {userProfile.provider === "twitch" ? "Twitch" : "Kick"} hesabınızla giriş yaptınız.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00]"
            >
              {isLoading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
