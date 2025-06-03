"use client"

import StreamCard from "@/components/stream-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in from localStorage or other state management
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedInStatus)
  }, [])

  const handleLogin = () => {
    // Implement your login logic here
    console.log("Login clicked")
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="absolute inset-0 bg-[url('/neon-fracture.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#9146FF] opacity-30 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00FF00] opacity-20 blur-3xl"></div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold sm:text-6xl md:text-7xl">
              <span className="animate-gradient-text bg-gradient-to-r from-[#9146FF] via-white to-[#00FF00] bg-clip-text text-transparent">
                LootOre
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300">
              Twitch ve Kick yayınlarını izleyerek puan kazanın, ödülleri toplamaya başlayın!
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-[#9146FF] hover:bg-[#7a38d5]">
                <Link href="/nasil-kazanilir">Nasıl Kazanılır</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10"
              >
                <Link href="/oduller">Ödülleri Keşfet</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] text-white hover:from-[#7a38d5] hover:to-[#00cc00]"
              >
                <Link href="/yayinlar">Yayınları İzle</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Streams Section */}
      <section className="bg-gray-950 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Öne Çıkan Yayınlar</h2>
            <Button variant="ghost" className="text-[#9146FF] hover:text-[#7a38d5]">
              Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StreamCard
              platform="twitch"
              image="/neon-city-stream.png"
              streamerName="GamerTurk"
              viewerCount={12500}
              pointMultiplier={1.5}
              streamUrl="https://twitch.tv"
            />
            <StreamCard
              platform="kick"
              image="/intense-fps-action.png"
              streamerName="KickMaster"
              viewerCount={8700}
              pointMultiplier={2.0}
              streamUrl="https://kick.com"
            />
            <StreamCard
              platform="twitch"
              image="/epic-moba-battle.png"
              streamerName="EfsaneTR"
              viewerCount={5300}
              pointMultiplier={1.2}
              streamUrl="https://twitch.tv"
            />
            <StreamCard
              platform="kick"
              image="/intense-battle-royale.png"
              streamerName="YayıncıKral"
              viewerCount={9200}
              pointMultiplier={1.8}
              streamUrl="https://kick.com"
            />
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">LootOre ile Kazanmaya Başlayın</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9146FF]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#9146FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">İzle</h3>
              <p className="text-gray-400">
                Favori Twitch ve Kick yayıncılarınızı izleyin ve her dakika için puan kazanın.
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#00FF00]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#00FF00]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Biriktir</h3>
              <p className="text-gray-400">
                Puanlarınızı biriktirin ve hesabınızda takip edin. Bonus etkinliklerle daha fazla puan kazanın.
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9146FF]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#9146FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Ödülleri Al</h3>
              <p className="text-gray-400">
                Biriktirdiğiniz puanları oyun kodları, Discord Nitro ve daha fazlası için kullanın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show when not logged in */}
      {!isLoggedIn && (
        <section className="relative bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gray-900/80 backdrop-blur-sm p-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Hemen Başlayın</h2>
              <p className="mb-6 text-gray-300">
                Twitch veya Kick hesabınızla giriş yapın ve puanları biriktirmeye başlayın!
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  className="w-full bg-[#9146FF] hover:bg-[#7a38d5] sm:w-auto cursor-pointer"
                  onClick={handleLogin}
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 pointer-events-none" fill="#FFFFFF">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                  <span className="select-none">Twitch ile Giriş Yap</span>
                </Button>
                <Button
                  className="w-full bg-[#00FF00] hover:bg-[#00cc00] sm:w-auto cursor-pointer"
                  onClick={handleLogin}
                >
                  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 pointer-events-none" fill="#FFFFFF">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
                  </svg>
                  <span className="select-none">Kick ile Giriş Yap</span>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
