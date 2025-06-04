"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Search, X, LogIn } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ResponsiveContainer from "@/components/responsive-container"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth-store"
import { supabaseService } from "@/lib/services/supabase-service"
import { RewardCardSkeleton } from "@/components/loading-skeleton"
import { AccessibleButton } from "@/components/accessible-button"
import type { Database } from "@/lib/supabase/types"

type Coupon = Database["public"]["Tables"]["coupons"]["Row"]

export default function Oduller() {
  const { user, isLoggedIn } = useAuthStore()
  const { toast } = useToast()

  // State
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [isFilterActive, setIsFilterActive] = useState(false)

  // Load coupons
  useEffect(() => {
    loadCoupons()
  }, [activeCategory])

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const data = await supabaseService.getCoupons(activeCategory)
      setCoupons(data)
    } catch (error) {
      console.error("Error loading coupons:", error)
      toast({
        title: "Hata",
        description: "Ödüller yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Search coupons
  useEffect(() => {
    if (searchQuery.trim()) {
      searchCoupons()
    } else {
      loadCoupons()
    }
  }, [searchQuery])

  const searchCoupons = async () => {
    setLoading(true)
    try {
      const data = await supabaseService.searchCoupons(searchQuery, activeCategory)
      setCoupons(data)
    } catch (error) {
      console.error("Error searching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    return coupon.ore_points_required >= priceRange[0] && coupon.ore_points_required <= priceRange[1]
  })

  // Categories from database
  const categories = [
    { id: "all", name: "Tüm Ödüller" },
    { id: "game-codes", name: "Oyun Kodları" },
    { id: "subscriptions", name: "Abonelikler" },
    { id: "gift-cards", name: "Hediye Kartları" },
    { id: "in-game-items", name: "Oyun İçi Öğeler" },
    { id: "equipment", name: "Ekipmanlar" },
    { id: "digital-games", name: "Dijital Oyunlar" },
  ]

  const handleRedeemCoupon = async (coupon: Coupon) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Giriş Yapın",
        description: "Ödül almak için lütfen giriş yapın.",
        variant: "destructive",
      })
      return
    }

    try {
      await supabaseService.redeemCoupon(user.id, coupon.id)
      toast({
        title: "Ödül Alındı!",
        description: `${coupon.title} başarıyla satın alındı.`,
        variant: "default",
      })
      // Reload coupons to update stock
      loadCoupons()
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Ödül alınırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/cosmic-loot.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#9146FF] opacity-20 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00FF00] opacity-10 blur-3xl"></div>

        <ResponsiveContainer className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                Ödüller
              </span>{" "}
              Kataloğu
            </h1>
            <p className="mb-4 text-lg text-gray-300">
              Biriktirdiğiniz Ore Points ile alabileceğiniz ödülleri keşfedin!
            </p>

            {isLoggedIn && user ? (
              <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 px-6 py-3">
                <div className="rounded-full bg-gradient-to-r from-[#9146FF]/30 to-[#00FF00]/30 p-2">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Mevcut Bakiyeniz</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                    {user.orePoints?.toLocaleString()} Ore Points
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto mb-6 flex w-full max-w-xs sm:max-w-md flex-col items-center gap-3 rounded-xl bg-gray-900/80 px-4 sm:px-6 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-[#9146FF]" />
                  <p className="text-white font-medium text-sm sm:text-base">
                    Ore Points bakiyenizi görmek için giriş yapın
                  </p>
                </div>
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </section>

      {/* Categories */}
      <section className="bg-gray-900 py-6 border-b border-gray-800">
        <ResponsiveContainer>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max pr-4">
              {categories.map((category) => (
                <AccessibleButton
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  ariaLabel={`${category.name} kategorisini seç`}
                  className={cn(
                    "h-auto py-3 px-4 min-w-[100px]",
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00] text-white border-transparent"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  {category.name}
                </AccessibleButton>
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-10 border-b border-gray-800 bg-gray-950/80 py-4 backdrop-blur-md">
        <ResponsiveContainer>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ödül ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-700 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-[#9146FF] focus:outline-none focus:ring-2 focus:ring-[#9146FF]/50"
                aria-label="Ödül arama"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2"
                  aria-label="Aramayı temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Rewards Grid */}
      <section className="py-12">
        <ResponsiveContainer>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <RewardCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCoupons.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCoupons.map((coupon) => (
                <RewardCard
                  key={coupon.id}
                  coupon={coupon}
                  onRedeem={handleRedeemCoupon}
                  userPoints={user?.orePoints || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Henüz ödül bulunamadı.</p>
            </div>
          )}
        </ResponsiveContainer>
      </section>
    </main>
  )
}

interface RewardCardProps {
  coupon: Coupon
  onRedeem: (coupon: Coupon) => void
  userPoints: number
}

function RewardCard({ coupon, onRedeem, userPoints }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)
  const canAfford = userPoints >= coupon.ore_points_required
  const isOutOfStock = coupon.stock_quantity <= 0

  const handleRedeem = async () => {
    setIsRedeeming(true)
    try {
      await onRedeem(coupon)
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-md transition-transform hover:scale-105">
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <Badge className="bg-red-600 text-white">Stokta Yok</Badge>
        </div>
      )}

      <img
        src={coupon.image || "/placeholder.svg?height=200&width=300"}
        alt={coupon.title}
        className="aspect-video w-full object-cover"
      />

      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-white">{coupon.title}</h3>
        <p className="mb-4 text-sm text-gray-400 line-clamp-2">{coupon.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-white">{coupon.ore_points_required.toLocaleString()} Ore</span>

          <AccessibleButton
            onClick={handleRedeem}
            disabled={!canAfford || isOutOfStock || isRedeeming}
            isLoading={isRedeeming}
            loadingText="Alınıyor..."
            ariaLabel={`${coupon.title} ödülünü al`}
            className="rounded-full bg-[#9146FF] hover:bg-[#7a38d5] disabled:opacity-50"
          >
            {isOutOfStock ? "Stokta Yok" : !canAfford ? "Yetersiz Puan" : "Satın Al"}
          </AccessibleButton>
        </div>

        {coupon.stock_quantity > 0 && coupon.stock_quantity <= 10 && (
          <p className="mt-2 text-xs text-orange-400">Son {coupon.stock_quantity} adet!</p>
        )}
      </div>
    </div>
  )
}
