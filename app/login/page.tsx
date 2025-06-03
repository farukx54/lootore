"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  authenticateWithTwitch,
  authenticateWithKick,
  saveUserSession,
  isFirstTimeLogin,
  type UserProfile,
} from "@/lib/auth"
import UsernameModal from "@/components/username-modal"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<"twitch" | "kick" | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      router.push("/")
    }
  }, [router])

  const handleAuth = async (authProvider: "twitch" | "kick") => {
    setIsLoading(true)
    setProvider(authProvider)

    try {
      let profile: UserProfile

      if (authProvider === "twitch") {
        profile = await authenticateWithTwitch()
      } else {
        profile = await authenticateWithKick()
      }

      setUserProfile(profile)

      // İlk kez giriş yapıyorsa kullanıcı adı oluşturma modalını göster
      if (isFirstTimeLogin(profile)) {
        setShowUsernameModal(true)
      } else {
        // Kullanıcı adı zaten varsa oturumu kaydet ve ana sayfaya yönlendir
        saveUserSession(profile)
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Giriş hatası",
        description: "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUsernameComplete = (updatedProfile: UserProfile) => {
    saveUserSession(updatedProfile)
    setShowUsernameModal(false)
    router.push("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="absolute inset-0 bg-[url('/neon-fracture.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#9146FF] opacity-30 blur-3xl"></div>
      <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00FF00] opacity-20 blur-3xl"></div>

      <Card className="w-full max-w-md border-gray-800 bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">LootOre'a Hoş Geldiniz</CardTitle>
          <CardDescription className="text-gray-400">
            Twitch veya Kick hesabınızla giriş yaparak puanları biriktirmeye başlayın!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleAuth("twitch")}
            disabled={isLoading}
            className="w-full bg-[#9146FF] hover:bg-[#7a38d5] py-6 text-lg"
          >
            {isLoading && provider === "twitch" ? (
              "Giriş yapılıyor..."
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="#FFFFFF">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
                <span>Twitch ile Giriş Yap</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => handleAuth("kick")}
            disabled={isLoading}
            className="w-full bg-black text-[#00FF00] border border-[#00FF00] hover:bg-[#00FF00]/10 py-6 text-lg"
          >
            {isLoading && provider === "kick" ? (
              "Giriş yapılıyor..."
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="#00FF00">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
                </svg>
                <span>Kick ile Giriş Yap</span>
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Giriş yaparak,{" "}
              <a href="#" className="text-[#9146FF] hover:underline">
                Kullanım Şartları
              </a>{" "}
              ve{" "}
              <a href="#" className="text-[#9146FF] hover:underline">
                Gizlilik Politikası
              </a>
              'nı kabul etmiş olursunuz.
            </p>
          </div>
        </CardContent>
      </Card>

      {userProfile && (
        <UsernameModal isOpen={showUsernameModal} userProfile={userProfile} onComplete={handleUsernameComplete} />
      )}
    </div>
  )
}
