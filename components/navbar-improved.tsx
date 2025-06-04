"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import UserDropdown from "./user-dropdown"
import { usePathname, useRouter } from "next/navigation"
import MessagingDropdown from "./messaging-dropdown"
import { useAuth } from "@/lib/auth-context"

export default function NavbarImproved() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, isLoggedIn, logout } = useAuth()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Loading state için skeleton
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
            <Link href="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-extrabold">
                <span className="bg-gradient-to-r from-[#9146FF] via-white to-[#00FF00] bg-clip-text text-transparent">
                  LootOre
                </span>
              </span>
            </Link>

            <nav className="hidden md:flex md:items-center md:space-x-6 flex-1 justify-center">
              <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white">
                Ana Sayfa
              </Link>
              <Link href="/nasil-kazanilir" className="text-sm font-medium text-gray-400 hover:text-white">
                Nasıl Kazanılır
              </Link>
              <Link href="/yayinlar" className="text-sm font-medium text-gray-400 hover:text-white">
                Yayınlar
              </Link>
              <Link href="/oduller" className="text-sm font-medium text-gray-400 hover:text-white">
                Ödüller
              </Link>
            </nav>

            <div className="flex items-center justify-end w-auto sm:w-[120px] md:w-[180px]">
              <div className="h-8 w-20 bg-gray-700 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-extrabold">
              <span className="bg-gradient-to-r from-[#9146FF] via-white to-[#00FF00] bg-clip-text text-transparent">
                LootOre
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex md:items-center md:space-x-6 flex-1 justify-center">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-white hover:underline decoration-[#9146FF] decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#9146FF] focus:ring-offset-2 focus:ring-offset-black rounded-md px-2 py-1 ${
                isActive("/") ? "text-white font-semibold" : "text-gray-400"
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/nasil-kazanilir"
              className={`text-sm font-medium transition-colors hover:text-white hover:underline decoration-[#9146FF] decoration-2 underline-offset-4 ${
                isActive("/nasil-kazanilir") ? "text-white font-semibold" : "text-gray-400"
              }`}
            >
              Nasıl Kazanılır
            </Link>
            <Link
              href="/yayinlar"
              className={`text-sm font-medium transition-colors hover:text-white hover:underline decoration-[#9146FF] decoration-2 underline-offset-4 ${
                isActive("/yayinlar") ? "text-white font-semibold" : "text-gray-400"
              }`}
            >
              Yayınlar
            </Link>
            <Link
              href="/oduller"
              className={`text-sm font-medium transition-colors hover:text-white hover:underline decoration-[#9146FF] decoration-2 underline-offset-4 ${
                isActive("/oduller") ? "text-white font-semibold" : "text-gray-400"
              }`}
            >
              Ödüller
            </Link>
          </nav>

          <div className="flex items-center justify-end w-auto sm:w-[120px] md:w-[180px]">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <MessagingDropdown />
                <UserDropdown onLogout={handleLogout} userProfile={user} />
              </div>
            ) : (
              <div className="hidden md:block">
                <Button onClick={handleLogin} className="bg-[#9146FF] hover:bg-[#7a38d5]">
                  Giriş Yap
                </Button>
              </div>
            )}

            <button
              className="ml-2 sm:ml-4 md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9146FF] focus:ring-offset-2 focus:ring-offset-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{mobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}</span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <nav aria-label="Mobile Navigation">
            <ul className="space-y-1 px-4 pb-3 pt-2">
              <li>
                <Link
                  href="/"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/")
                      ? "bg-gray-900 text-white font-semibold border-l-4 border-[#9146FF]"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  href="/nasil-kazanilir"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/nasil-kazanilir")
                      ? "bg-gray-900 text-white font-semibold border-l-4 border-[#9146FF]"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nasıl Kazanılır
                </Link>
              </li>
              <li>
                <Link
                  href="/yayinlar"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/yayinlar")
                      ? "bg-gray-900 text-white font-semibold border-l-4 border-[#9146FF]"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Yayınlar
                </Link>
              </li>
              <li>
                <Link
                  href="/oduller"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/oduller")
                      ? "bg-gray-900 text-white font-semibold border-l-4 border-[#9146FF]"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ödüller
                </Link>
              </li>
              {!isLoggedIn && (
                <li className="pt-2">
                  <Button
                    onClick={() => {
                      handleLogin()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full bg-[#9146FF] hover:bg-[#7a38d5]"
                  >
                    Giriş Yap
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
