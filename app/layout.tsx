import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import LoadingScreen from "@/components/loading-screen"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LootOre - Twitch ve Kick İzleme Ödül Platformu",
  description: "Twitch ve Kick yayınlarını izleyerek puan kazanın, ödülleri toplamaya başlayın!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LoadingScreen />
          <Navbar />
          {children}
          <footer className="border-t border-gray-800 bg-black py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center">
                  <span className="text-xl font-extrabold">
                    <span className="bg-gradient-to-r from-[#9146FF] via-white to-[#00FF00] bg-clip-text text-transparent">
                      LootOre
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                  <a href="#" className="hover:text-white">
                    Hakkımızda
                  </a>
                  <a href="#" className="hover:text-white">
                    Gizlilik Politikası
                  </a>
                  <a href="#" className="hover:text-white">
                    Kullanım Şartları
                  </a>
                  <a href="#" className="hover:text-white">
                    İletişim
                  </a>
                </div>
                <div className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} LootOre. Tüm hakları saklıdır.
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
