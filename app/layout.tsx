import type React from "react"
import "@/app/globals.css" // globals.css en üstte olmalı
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import AuthGuard from "@/components/auth-guard"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer" // Footer'ı import et

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LootOre - Twitch ve Kick İzleme Ödül Platformu",
  description: "Twitch ve Kick yayınlarını izleyerek puan kazanın, ödülleri toplamaya başlayın!",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Navbar />
          <main className="flex-grow">
            {" "}
            {/* Ana içeriği main içine al */}
            <AuthGuard>{children}</AuthGuard>
          </main>
          <Footer /> {/* Footer'ı ekle */}
        </ThemeProvider>
      </body>
    </html>
  )
}
