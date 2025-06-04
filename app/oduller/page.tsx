"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Search, X, ShoppingCart, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ResponsiveContainer from "@/components/responsive-container"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth-store"
import { supabaseService } from "@/lib/services/supabase-service"
import { RewardCardSkeleton } from "@/components/loading-skeleton"
import { AccessibleButton } from "@/components/accessible-button"
import { format, parseISO } from "date-fns"
import type { Database } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"

type Coupon = Database["public"]["Tables"]["coupons"]["Row"]

export default function Oduller() {
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuthStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoadingRewards, setIsLoadingRewards] = useState(false)
  const [rewardsError, setRewardsError] = useState<string | null>(null)

  const fetchCoupons = async (category: string) => {
    setIsLoadingRewards(true)
    setRewardsError(null)
    try {
      const { data, error } = await supabaseService.getCoupons(category)
      if (error) {
        throw new Error(error.message)
      }
      setCoupons(data || [])
    } catch (err: any) {
      setRewardsError(err.message)
      setCoupons([])
    } finally {
      setIsLoadingRewards(false)
    }
  }

  const redeemCoupon = async (couponId: string) => {
    try {
      const { error } = await supabaseService.redeemCoupon(couponId)
      if (error) {
        throw new Error(error.message)
      }
      await fetchCoupons(activeCategory)
      return true
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err.message,
        variant: "destructive",
      })
      return false
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabaseService.getCategories()
      if (error) {
        throw new Error(error.message)
      }
      setCategories(data || ["all"])
    } catch (err: any) {
      console.error("Kategori yükleme hatası:", err.message)
      setCategories([
        "all",
        "game-codes",
        "subscriptions",
        "gift-cards",
        "in-game-items",
        "equipment",
        "digital-games",
        "general",
      ])
    }
  }

  useEffect(() => {
    fetchCoupons(activeCategory)
  }, [activeCategory])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (rewardsError) {
      toast({
        title: "Ödül Yükleme Hatası",
        description: rewardsError,
        variant: "destructive",
      })
    }
  }, [rewardsError, toast])

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      !searchQuery ||
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (coupon.code && coupon.code.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const handleRedeemCoupon = async (coupon: Coupon) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Giriş Yapın",
        description: "Ödül almak için lütfen yukarıdan giriş yapın.",
        variant: "destructive",
      })
      return
    }

    if (user.ore_points < coupon.ore_points_required) {
      toast({
        title: "Yetersiz Puan",
        description: `Bu ödül için ${coupon.ore_points_required} puana ihtiyacınız var. Mevcut puanınız: ${user.ore_points}`,
        variant: "destructive",
      })
      return
    }

    const success = await redeemCoupon(coupon.id)
    if (success) {
      toast({
        title: "Ödül Alındı!",
        description: `${coupon.title} başarıyla satın alındı.`,
        variant: "default",
      })
    }
  }

  const categoryDisplayNames: { [key: string]: string } = {
    all: "Tüm Ödüller",
    "game-codes": "Oyun Kodları",
    subscriptions: "Abonelikler",
    "gift-cards": "Hediye Kartları",
    "in-game-items": "Oyun İçi Öğeler",
    equipment: "Ekipmanlar",
    "digital-games": "Dijital Oyunlar",
    other: "Diğer",
    general: "Genel",
  }

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/digital-weave.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#9146FF] opacity-20 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00FF00] opacity-10 blur-3xl"></div>

        <div className="container relative mx-auto px-4 w-full max-w-full">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl break-words">
              <span className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                Ödüller
              </span>{" "}
              Kataloğu
            </h1>
            <p className="mb-4 text-lg text-gray-300 break-words">
              Biriktirdiğiniz Ore Points ile alabileceğiniz ödülleri keşfedin!
            </p>

            {isLoggedIn && user ? (
              <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 px-6 py-3 shadow-lg">
                <div className="rounded-full bg-gradient-to-r from-[#9146FF]/30 to-[#00FF00]/30 p-2">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Mevcut Bakiyeniz</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                    {user.ore_points?.toLocaleString() || 0} Ore Points
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-6 border-b border-gray-800">
        <ResponsiveContainer>
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <div className="flex gap-2 min-w-max pr-4">
              {categories.map((categoryKey) => (
                <AccessibleButton
                  key={categoryKey}
                  variant={activeCategory === categoryKey ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(categoryKey)}
                  ariaLabel={`${categoryDisplayNames[categoryKey] || categoryKey} kategorisini seç`}
                  className={cn(
                    "h-auto py-3 px-4 min-w-[100px] whitespace-nowrap rounded-full transition-all duration-200 ease-in-out",
                    activeCategory === categoryKey
                      ? "bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:shadow-lg text-white border-transparent"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-primary",
                  )}
                >
                  {categoryDisplayNames[categoryKey] || categoryKey}
                </AccessibleButton>
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      <section className="sticky top-16 z-20 border-b border-gray-800 bg-gray-950/80 py-4 backdrop-blur-md">
        <ResponsiveContainer>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ödül adı, açıklama veya kod ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-700 bg-gray-900 py-3 pl-10 pr-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Ödül arama"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  aria-label="Aramayı temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      <section className="py-12 flex-1">
        <ResponsiveContainer>
          {isLoadingRewards ? (
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
                  isLoggedIn={isLoggedIn}
                  userPoints={user?.ore_points || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center min-h-[300px]">
              <AlertCircle className="h-16 w-16 text-primary mb-4" />
              <p className="text-gray-300 text-xl font-semibold">Ödül Bulunamadı</p>
              <p className="text-gray-400 mt-2">
                {searchQuery ? "Arama kriterlerinize uygun ödül bulunamadı." : "Bu kategoride henüz ödül bulunmuyor."}
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery("")} variant="link" className="mt-4 text-primary">
                  Aramayı Temizle
                </Button>
              )}
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
  isLoggedIn: boolean
  userPoints: number
}

function RewardCard({ coupon, onRedeem, isLoggedIn, userPoints }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)
  const canAfford = userPoints >= coupon.ore_points_required
  const isOutOfStock = coupon.stock_quantity !== null && coupon.stock_quantity <= 0

  const handleRedeemClick = async () => {
    setIsRedeeming(true)
    try {
      await onRedeem(coupon)
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-xl transition-all duration-300 hover:shadow-primary/30 hover:border-primary/50 flex flex-col">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center backdrop-blur-sm">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              STOKTA YOK
            </Badge>
          </div>
        )}
        <img
          src={coupon.image_url || `/placeholder.svg?width=300&height=200&query=${encodeURIComponent(coupon.title)}`}
          alt={coupon.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {coupon.code && (
          <Badge className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs">Kod: {coupon.code}</Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="mb-1 text-lg font-semibold text-white truncate" title={coupon.title}>
          {coupon.title}
        </h3>
        <p className="mb-3 text-xs text-gray-400 line-clamp-2 flex-grow min-h-[30px]" title={coupon.description || ""}>
          {coupon.description || "Açıklama bulunmuyor."}
        </p>

        {coupon.expires_at && (
          <p className="text-xs text-amber-400 mb-2">
            Son Kullanma: {format(parseISO(coupon.expires_at), "dd/MM/yyyy")}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-700/50">
          <span className="text-lg font-bold text-primary">{coupon.ore_points_required.toLocaleString()} Ore</span>
          <Button
            onClick={handleRedeemClick}
            disabled={!isLoggedIn || !canAfford || isOutOfStock || isRedeeming}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              !isLoggedIn
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : isOutOfStock
                  ? "bg-red-700 text-white cursor-not-allowed"
                  : !canAfford
                    ? "bg-yellow-600 text-white cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground",
            )}
          >
            {isRedeeming ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isRedeeming
              ? "Alınıyor..."
              : !isLoggedIn
                ? "Giriş Yapın"
                : isOutOfStock
                  ? "Stok Bitti"
                  : !canAfford
                    ? "Yetersiz Puan"
                    : "Satın Al"}
          </Button>
        </div>

        {coupon.stock_quantity !== null && coupon.stock_quantity > 0 && coupon.stock_quantity <= 10 && (
          <p className="mt-2 text-xs text-orange-400 text-center">Son {coupon.stock_quantity} adet!</p>
        )}
      </div>
    </div>
  )
}
