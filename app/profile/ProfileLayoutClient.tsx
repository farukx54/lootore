"use client"
import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Gift, Clock, Settings, Share2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { UserStatsCard } from "@/components/UserStatsCard"

export default function ProfileLayoutClient({ children }: { children: React.ReactNode }) {
  // Client-side check for authentication would be done in a client component
  // This is a server component, so we're doing a basic check
  // In a real app, you would use a more robust auth check
  const isLoggedIn = true // This would be replaced with a real auth check

  if (!isLoggedIn) {
    redirect("/")
  }

  const pathname = usePathname()

  // Aktif sayfayı belirlemek için yardımcı fonksiyon
  const isActive = (path: string) => {
    if (path === "/profile" && pathname === "/profile") {
      return true
    }
    return pathname.startsWith(path) && path !== "/profile"
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Kullanıcı Profili</h1>
          <p className="text-gray-400">Hesap bilgilerinizi yönetin ve aktivitelerinizi görüntüleyin</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
              <nav className="flex flex-col">
                <Link
                  href="/profile"
                  className={`flex items-center gap-3 px-4 py-3 border-l-4 ${
                    isActive("/profile") ? "border-[#9146FF] bg-gray-800" : "border-transparent hover:bg-gray-800"
                  } transition-colors group`}
                  prefetch={false}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-gray-700">
                    <TrendingUp className="h-5 w-5 text-[#9146FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Genel Bakış</p>
                    <p className="text-xs text-gray-400">Hesap istatistikleriniz</p>
                  </div>
                </Link>

                <Link
                  href="/profile/rewards"
                  className={`flex items-center gap-3 px-4 py-3 border-l-4 ${
                    isActive("/profile/rewards")
                      ? "border-[#00FF00] bg-gray-800"
                      : "border-transparent hover:bg-gray-800"
                  } transition-colors group`}
                  prefetch={false}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-gray-700">
                    <Gift className="h-5 w-5 text-[#00FF00]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Ödül Geçmişi</p>
                    <p className="text-xs text-gray-400">Geçmiş ödülleriniz</p>
                  </div>
                </Link>

                <Link
                  href="/profile/history"
                  className={`flex items-center gap-3 px-4 py-3 border-l-4 ${
                    isActive("/profile/history")
                      ? "border-[#FF9900] bg-gray-800"
                      : "border-transparent hover:bg-gray-800"
                  } transition-colors group`}
                  prefetch={false}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-gray-700">
                    <Clock className="h-5 w-5 text-[#FF9900]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">İzleme Geçmişi</p>
                    <p className="text-xs text-gray-400">İzlediğiniz yayınlar</p>
                  </div>
                </Link>

                <Link
                  href="/profile/referrals"
                  className={`flex items-center gap-3 px-4 py-3 border-l-4 ${
                    isActive("/profile/referrals")
                      ? "border-[#FF3366] bg-gray-800"
                      : "border-transparent hover:bg-gray-800"
                  } transition-colors group`}
                  prefetch={false}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-gray-700">
                    <Share2 className="h-5 w-5 text-[#FF3366]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Referans Programı</p>
                    <p className="text-xs text-gray-400">Arkadaşlarınızı davet edin</p>
                  </div>
                </Link>

                <Link
                  href="/profile/settings"
                  className={`flex items-center gap-3 px-4 py-3 border-l-4 ${
                    isActive("/profile/settings")
                      ? "border-[#33CCFF] bg-gray-800"
                      : "border-transparent hover:bg-gray-800"
                  } transition-colors group`}
                  prefetch={false}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 group-hover:bg-gray-700">
                    <Settings className="h-5 w-5 text-[#33CCFF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Ayarlar</p>
                    <p className="text-xs text-gray-400">Hesap ayarlarınız</p>
                  </div>
                </Link>
              </nav>
            </div>

            {/* User Stats Card */}
            <UserStatsCard />
          </aside>

          {/* Main Content */}
          <main className="rounded-lg border border-gray-800 bg-gray-900 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
