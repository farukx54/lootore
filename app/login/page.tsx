"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react" // Construction ikonu kaldırıldı
import { signInWithTwitch, createClient } from "@/lib/supabase/auth-helpers"
import { useToast } from "@/hooks/use-toast" // useToast hala Twitch hataları için kullanılıyor
import UsernameModal from "@/components/username-modal"
import type { UserProfile } from "@/lib/types/auth"
import { checkUsernameAvailability, updateUsername } from "@/lib/auth"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<"twitch" | "kick" | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast() // Twitch hataları ve username modalı için hala gerekli

  const redirectUrl = searchParams.get("redirect") || "/"

  useEffect(() => {
    const checkSessionAndHandleRedirect = async () => {
      const supabase = createClient()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Error getting session:", sessionError)
        return
      }

      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error fetching user profile:", profileError)
          setError("Kullanıcı profili alınırken bir hata oluştu.")
          return
        }

        if (profile && !profile.username) {
          setUserProfile(profile as UserProfile)
          setShowUsernameModal(true)
        } else if (profile && profile.username) {
          router.push(redirectUrl)
        }
      }
    }

    checkSessionAndHandleRedirect()

    const supabase = createClient()
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        checkSessionAndHandleRedirect()
      } else if (event === "SIGNED_OUT") {
        setUserProfile(null)
        setShowUsernameModal(false)
      }
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [router, redirectUrl])

  const handleTwitchAuth = async () => {
    setIsLoading(true)
    setProvider("twitch")
    setError(null)

    try {
      const { error } = await signInWithTwitch({
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Twitch auth error:", error)
      const errorMessage = error instanceof Error ? error.message : "Twitch ile giriş yapılırken bir hata oluştu."
      setError(errorMessage)
      toast({
        title: "Giriş hatası",
        description: errorMessage,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleKickAuth = async () => {
    // Kick butonu tıklandığında artık bir işlem yapılmayacak.
    // "YAKINDA" ibaresi kullanıcıyı bilgilendirmek için yeterli.
    // İstenirse buraya bir console.log eklenebilir:
    // console.log("Kick ile giriş özelliği yakında aktif olacaktır.");
    setError(null) // Varsa önceki hataları temizle
  }

  const handleUsernameComplete = async (newUsername: string) => {
    if (!userProfile || !userProfile.id) {
      setError("Kullanıcı bilgileri eksik, kullanıcı adı güncellenemiyor.")
      toast({ title: "Hata", description: "Kullanıcı bilgileri eksik.", variant: "destructive" })
      setShowUsernameModal(false)
      return
    }

    setIsLoading(true)
    try {
      const isAvailable = await checkUsernameAvailability(newUsername)
      if (!isAvailable) {
        toast({
          title: "Kullanıcı Adı Kullanımda",
          description: "Lütfen farklı bir kullanıcı adı seçin.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      await updateUsername(userProfile.id, newUsername)

      toast({
        title: "Hoş geldiniz!",
        description: "Kullanıcı adınız başarıyla oluşturuldu.",
      })
      setShowUsernameModal(false)
      router.push(redirectUrl)
    } catch (error) {
      console.error("Error updating username:", error)
      const errorMessage = error instanceof Error ? error.message : "Kullanıcı adı güncellenirken bir hata oluştu."
      setError(errorMessage)
      toast({
        title: "Kullanıcı Adı Güncelleme Hatası",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
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
          {error && (
            <Alert variant="destructive" className="border-red-800 bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {error}
                <Button
                  variant="link"
                  className="h-auto p-0 ml-2 text-red-300 hover:text-red-100"
                  onClick={handleRetry}
                >
                  Tekrar dene
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleTwitchAuth}
            disabled={isLoading && provider === "twitch"}
            className="w-full bg-[#9146FF] hover:bg-[#7a38d5] py-6 text-lg"
            aria-label="Twitch ile Giriş Yap"
          >
            {isLoading && provider === "twitch" ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Giriş yapılıyor...
              </span>
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
            onClick={handleKickAuth} // Artık sadece setError(null) çağırıyor
            className="w-full bg-black text-[#00FF00] border border-[#00FF00] hover:bg-[#00FF00]/10 py-6 text-lg relative"
            aria-label="Kick ile Giriş Yap (Yakında)"
            disabled={isLoading && provider === "kick"}
          >
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="#00FF00">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
              </svg>
              <span>Kick ile Giriş Yap</span>
            </div>
            <span
              className="absolute top-1 right-1 bg-yellow-500 text-black text-[10px] font-semibold px-1.5 py-0.5 rounded"
              aria-hidden="true"
            >
              YAKINDA
            </span>
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Giriş yaparak,{" "}
              <a
                href="#"
                className="text-[#9146FF] hover:underline focus:outline-none focus:ring-2 focus:ring-[#9146FF] focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
              >
                Kullanım Şartları
              </a>{" "}
              ve{" "}
              <a
                href="#"
                className="text-[#9146FF] hover:underline focus:outline-none focus:ring-2 focus:ring-[#9146FF] focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
              >
                Gizlilik Politikası
              </a>
              'nı kabul etmiş olursunuz.
            </p>
          </div>
        </CardContent>
      </Card>
      {showUsernameModal && userProfile && (
        <UsernameModal
          isOpen={showUsernameModal}
          onClose={() => {
            setShowUsernameModal(false)
          }}
          onSubmit={handleUsernameComplete}
          currentUsername={userProfile.username || ""}
          userId={userProfile.id}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
