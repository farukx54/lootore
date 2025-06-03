"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, LogIn } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import ResponsiveContainer from "@/components/responsive-container"
import { cn } from "@/lib/utils"
import { RangeSlider } from "@/components/ui/range-slider"

// Define a more generic category type
// This would typically come from an API or database
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  displayOrder: number
}

// Define reward interface
interface Reward {
  id: string
  name: string
  description: string
  image: string
  points: number
  categoryId: string // Changed from specific category enum to a string ID
  isLimited?: boolean
  isNew?: boolean
  isPopular?: boolean
  discount?: number
  originalPoints?: number
  badge?: string
  badgeColor?: string
}

export default function Oduller() {
  // State for user's Ore Points
  const [orePoints, setOrePoints] = useState(15000)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()

  // Check login status on component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedInStatus)

    // Retrieve Ore Points from localStorage on component mount
    const storedOrePoints = localStorage.getItem("orePoints")
    if (storedOrePoints) {
      setOrePoints(Number.parseInt(storedOrePoints, 10))
    }
  }, [])

  // Function to handle login
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true")
    setIsLoggedIn(true)
    toast({
      title: "Giriş Başarılı",
      description: "Hesabınıza başarıyla giriş yaptınız.",
      variant: "default",
    })
  }

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 22,
  })

  // Mock categories data - in a real app, this would come from an API
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "Tüm Ödüller", slug: "all", isActive: true, displayOrder: 0 },
    { id: "limited-time", name: "Sınırlı Süre", slug: "limited-time", isActive: true, displayOrder: 1 },
    { id: "game-codes", name: "Oyun Kodları", slug: "game-codes", isActive: true, displayOrder: 2 },
    { id: "subscriptions", name: "Abonelikler", slug: "subscriptions", isActive: true, displayOrder: 3 },
    { id: "gift-cards", name: "Hediye Kartları", slug: "gift-cards", isActive: true, displayOrder: 4 },
    { id: "in-game-items", name: "Oyun İçi Öğeler", slug: "in-game-items", isActive: true, displayOrder: 5 },
    { id: "equipment", name: "Ekipmanlar", slug: "equipment", isActive: true, displayOrder: 6 },
    { id: "digital-games", name: "Dijital Oyunlar", slug: "digital-games", isActive: true, displayOrder: 7 },
  ])

  // Filter states
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [showLimitedOnly, setShowLimitedOnly] = useState(false)
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular">(
    "popular",
  )
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Add the gift code redemption state variables inside the component, after the other state declarations
  const [giftCode, setGiftCode] = useState("")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [redemptionResult, setRedemptionResult] = useState<{ success: boolean; message: string } | null>(null)
  const giftInputRef = useRef<HTMLInputElement>(null)

  // Add the gift code redemption function inside the component, before the return statement
  const redeemGiftCode = () => {
    if (!isLoggedIn) {
      toast({
        title: "Giriş Yapın",
        description: "Hediye kodu kullanmak için lütfen giriş yapın.",
        variant: "destructive",
      })
      return
    }

    if (!giftCode.trim()) {
      toast({
        title: "Kod Gerekli",
        description: "Lütfen bir hediye kodu girin.",
        variant: "destructive",
      })
      return
    }

    setIsRedeeming(true)
    setRedemptionResult(null)

    // Simulate API call with timeout
    setTimeout(() => {
      // Check if it's a referral code
      const isReferralCode = giftCode.startsWith("LOOT-") && giftCode.length === 11

      // Mock validation logic - in a real app, this would be a server call
      const isValidCode = giftCode.length >= 6 && /^[A-Z0-9-]+$/.test(giftCode)
      const isUsedCode = giftCode === "USED123"
      const isSpecialCode = giftCode === "BONUS500"
      const isAlreadyUsedReferralCode = false // In a real app, this would check if the user has already used a referral code

      if (isUsedCode || isAlreadyUsedReferralCode) {
        setRedemptionResult({
          success: false,
          message: "Bu kod daha önce kullanılmış.",
        })
      } else if (!isValidCode) {
        setRedemptionResult({
          success: false,
          message: "Geçersiz kod. Lütfen kontrol edip tekrar deneyin.",
        })
      } else {
        // Determine points to add - in a real app, this would come from the server
        let pointsToAdd = 100
        let message = `${pointsToAdd} Ore Points hesabınıza eklendi.`

        if (isReferralCode) {
          pointsToAdd = 1000
          message =
            "Referans kodu başarıyla kullanıldı! 1000 Ore Points hesabınıza eklendi. Arkadaşınız da 1000 Ore Points kazandı."
        } else if (isSpecialCode) {
          pointsToAdd = 500
        } else if (giftCode.startsWith("VIP")) {
          pointsToAdd = 250
        }

        // Update the redeemGiftCode function to store Ore Points in localStorage
        setOrePoints((prev) => {
          const newPoints = prev + pointsToAdd
          localStorage.setItem("orePoints", newPoints.toString())
          return newPoints
        })
        setRedemptionResult({
          success: true,
          message: `Tebrikler! ${message}`,
        })
        setGiftCode("")
      }
      setIsRedeeming(false)
    }, 1500)
  }

  // Function to simulate Ore Points deduction
  const purchaseReward = (reward: Reward) => {
    if (!isLoggedIn) {
      toast({
        title: "Giriş Yapın",
        description: "Ödül satın almak için lütfen giriş yapın.",
        variant: "destructive",
      })
      return false
    }

    if (orePoints >= reward.points) {
      setOrePoints((prevPoints) => {
        const newPoints = prevPoints - reward.points
        localStorage.setItem("orePoints", newPoints.toString())
        return newPoints
      })
      toast({
        title: "Ödül Alındı!",
        description: `${reward.name} başarıyla satın alındı. Kalan Ore Points: ${orePoints - reward.points}`,
        variant: "default",
      })
      return true
    } else {
      toast({
        title: "Yetersiz Ore Points",
        description: `Bu ödülü almak için ${reward.points} Ore Points gerekiyor. Mevcut: ${orePoints} Ore Points`,
        variant: "destructive",
      })
      return false
    }
  }

  // Sample rewards data - updated to use categoryId instead of category enum
  const limitedTimeRewards: Reward[] = [
    {
      id: "gaming-chair",
      name: "Pro Gaming Sandalye",
      description:
        "Sınırlı sayıda üretilen, özel tasarım ergonomik gaming sandalye. RGB aydınlatma ve özel LootOre logosu.",
      image: "/limited-gaming-chair.png",
      points: 45000,
      originalPoints: 60000,
      categoryId: "equipment",
      isLimited: true,
      discount: 25,
      badge: "Özel Seri",
      badgeColor: "bg-red-600",
    },
    {
      id: "streamer-hoodie",
      name: "Yayıncı Koleksiyon Hoodie",
      description: "Popüler yayıncı işbirliği ile tasarlanan özel koleksiyon hoodie. İmzalı ve sertifikalı.",
      image: "/streamer-collab-hoodie.png",
      points: 32000,
      originalPoints: 40000,
      categoryId: "equipment",
      isLimited: true,
      discount: 20,
    },
    {
      id: "collectors-bundle",
      name: "Koleksiyoner Paketi",
      description:
        "Özel tasarım figürler, poster, rozet ve daha fazlasını içeren koleksiyoner paketi. Sınırlı sayıda üretildi.",
      image: "/collectors-bundle.png",
      points: 29750,
      originalPoints: 35000,
      categoryId: "equipment",
      isLimited: true,
      discount: 15,
    },
    {
      id: "early-access",
      name: "Erken Erişim Oyun Paketi",
      description: "Henüz piyasaya sürülmemiş AAA oyuna 2 hafta erken erişim ve özel içerikler. Sınırlı kontenjan.",
      image: "/early-access-game.png",
      points: 35000,
      originalPoints: 50000,
      categoryId: "digital-games",
      isLimited: true,
      discount: 30,
      badge: "Erken Erişim",
      badgeColor: "bg-emerald-600",
    },
  ]

  const popularRewards: Reward[] = [
    {
      id: "discord-nitro",
      name: "Discord Nitro",
      description: "1 Aylık Discord Nitro aboneliği. Özel emojiler, daha yüksek dosya yükleme limiti ve daha fazlası!",
      image: "/digital-gift-explosion.png",
      points: 10000,
      categoryId: "subscriptions",
      isPopular: true,
      badge: "Popüler",
      badgeColor: "bg-gradient-to-r from-[#9146FF] to-[#00FF00]",
    },
    {
      id: "steam-gift-card",
      name: "Steam Gift Card",
      description:
        "50 TL değerinde Steam Gift Card. Steam'deki oyunlar, DLC'ler ve daha fazlası için kullanabilirsiniz.",
      image: "/steam-gift-card-display.png",
      points: 15000,
      categoryId: "gift-cards",
      isPopular: true,
    },
    {
      id: "riot-points",
      name: "Riot Points",
      description: "1650 Riot Points. League of Legends, Valorant ve diğer Riot oyunlarında kullanabilirsiniz.",
      image: "/digital-currency-gift.png",
      points: 12500,
      categoryId: "gift-cards",
      isPopular: true,
    },
    {
      id: "game-pass",
      name: "Xbox Game Pass",
      description: "1 Aylık Xbox Game Pass Ultimate. 100'den fazla yüksek kaliteli oyuna erişim.",
      image: "/game-pass-card.png",
      points: 17500,
      categoryId: "subscriptions",
      isNew: true,
      badge: "Yeni",
      badgeColor: "bg-gradient-to-r from-[#9146FF] to-[#00FF00]",
    },
  ]

  const inGameItems: Reward[] = [
    {
      id: "valorant-skin",
      name: "Valorant Silah Skini",
      description: "Valorant için özel tasarım silah skini. Yalnızca LootOre kullanıcılarına özel.",
      image: "/valorant-skin.png",
      points: 20000,
      categoryId: "in-game-items",
    },
    {
      id: "fortnite-vbucks",
      name: "Fortnite V-Bucks",
      description: "1000 V-Bucks. Fortnite'ta kostüm, dans ve Battle Pass satın almak için kullanabilirsiniz.",
      image: "/fortnite-vbucks.png",
      points: 14000,
      categoryId: "in-game-items",
    },
    {
      id: "cs2-skin",
      name: "CS2 Bıçak Skini",
      description: "Counter-Strike 2 için nadir bulunan bıçak skini. Sınırlı sayıda mevcut.",
      image: "/cs2-skin.png",
      points: 25000,
      categoryId: "in-game-items",
      badge: "Sınırlı",
      badgeColor: "bg-gradient-to-r from-[#9146FF] to-[#00FF00]",
    },
    {
      id: "minecraft-items",
      name: "Minecraft Özel Paket",
      description: "Minecraft için özel skin, texture pack ve harita içeren paket. Oyun deneyiminizi kişiselleştirin.",
      image: "/minecraft-items.png",
      points: 7500,
      categoryId: "in-game-items",
    },
  ]

  const gamingEquipment: Reward[] = [
    {
      id: "gaming-headset",
      name: "Gaming Kulaklık",
      description: "Yüksek kaliteli 7.1 surround ses gaming kulaklık. RGB aydınlatma ve gürültü önleyici mikrofon.",
      image: "/gaming-headset.png",
      points: 37500,
      categoryId: "equipment",
      badge: "Premium",
      badgeColor: "bg-gradient-to-r from-[#9146FF] to-[#00FF00]",
    },
    {
      id: "mechanical-keyboard",
      name: "Mekanik Klavye",
      description: "RGB aydınlatmalı mekanik gaming klavye. Özelleştirilebilir tuşlar ve makrolar.",
      image: "/mechanical-keyboard.png",
      points: 32500,
      categoryId: "equipment",
    },
    {
      id: "gaming-mouse",
      name: "Gaming Mouse",
      description: "Yüksek DPI ayarlanabilir gaming mouse. Programlanabilir düğmeler ve RGB aydınlatma.",
      image: "/gaming-mouse.png",
      points: 22500,
      categoryId: "equipment",
    },
    {
      id: "streaming-webcam",
      name: "Streaming Webcam",
      description: "4K çözünürlüklü, otomatik odaklamalı streaming webcam. Yayınlarınızı profesyonel seviyeye taşıyın.",
      image: "/streaming-webcam.png",
      points: 27500,
      categoryId: "equipment",
      isNew: true,
      badge: "Yeni",
      badgeColor: "bg-gradient-to-r from-[#9146FF] to-[#00FF00]",
    },
  ]

  const digitalGames: Reward[] = [
    {
      id: "aaa-game",
      name: "AAA Oyun",
      description: "En yeni AAA oyunlardan birini seçin. Steam, Epic Games veya diğer platformlar için dijital kod.",
      image: "/aaa-game.png",
      points: 30000,
      categoryId: "digital-games",
    },
    {
      id: "indie-bundle",
      name: "Indie Oyun Paketi",
      description: "5 popüler indie oyundan oluşan paket. Farklı türlerde benzersiz oyun deneyimleri.",
      image: "/indie-game-bundle.png",
      points: 20000,
      categoryId: "digital-games",
      badge: "Değer",
      badgeColor: "bg-gradient-to-r from-[#9146FF] to-[#00FF00]",
    },
    {
      id: "dlc-pack",
      name: "DLC Paketi",
      description: "Popüler oyunlar için DLC ve genişletme paketleri. Oyun deneyiminizi zenginleştirin.",
      image: "/dlc-pack.png",
      points: 12500,
      categoryId: "digital-games",
    },
    {
      id: "preorder-bonus",
      name: "Ön Sipariş Bonusu",
      description: "Yakında çıkacak oyunlar için ön sipariş ve beta erişim kodları. Herkesten önce oynayın.",
      image: "/preorder-bonus.png",
      points: 22500,
      categoryId: "digital-games",
    },
  ]

  // Combine all rewards
  const allRewards = [...limitedTimeRewards, ...popularRewards, ...inGameItems, ...gamingEquipment, ...digitalGames]

  // Apply filters to rewards
  const filterRewards = (rewards: Reward[]) => {
    return rewards.filter((reward) => {
      // Filter by search query
      if (
        searchQuery &&
        !reward.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !reward.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Filter by category
      if (
        activeCategoryId !== "all" &&
        (activeCategoryId === "limited-time" ? !reward.isLimited : reward.categoryId !== activeCategoryId)
      ) {
        return false
      }

      // Filter by price range
      if (reward.points < priceRange[0] || reward.points > priceRange[1]) {
        return false
      }

      // Filter by limited time only
      if (showLimitedOnly && !reward.isLimited) {
        return false
      }

      // Filter by new only
      if (showNewOnly && !reward.isNew) {
        return false
      }

      return true
    })
  }

  // Sort rewards
  const sortRewards = (rewards: Reward[]) => {
    switch (sortOption) {
      case "price-asc":
        return [...rewards].sort((a, b) => a.points - b.points)
      case "price-desc":
        return [...rewards].sort((a, b) => b.points - a.points)
      case "name-asc":
        return [...rewards].sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":
        return [...rewards].sort((a, b) => b.name.localeCompare(a.name))
      case "popular":
      default:
        return [...rewards].sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1
          if (!a.isPopular && b.isPopular) return 1
          if (a.isNew && !b.isNew) return -1
          if (!a.isNew && b.isNew) return 1
          return 0
        })
    }
  }

  // Get filtered rewards
  const getFilteredLimitedTimeRewards = () => {
    return sortRewards(filterRewards(limitedTimeRewards))
  }

  const getFilteredRewards = () => {
    // For limited time section, we always show all limited time rewards
    // For other sections, we filter based on the category and other filters
    const filteredRewards = sortRewards(filterRewards(allRewards.filter((r) => !r.isLimited)))

    // Group rewards by category
    const popularFiltered = filteredRewards.filter((r) => r.isPopular)
    const inGameItemsFiltered = filteredRewards.filter((r) => r.categoryId === "in-game-items")
    const equipmentFiltered = filteredRewards.filter((r) => r.categoryId === "equipment")
    const digitalGamesFiltered = filteredRewards.filter((r) => r.categoryId === "digital-games")

    return {
      popular: popularFiltered,
      inGameItems: inGameItemsFiltered,
      equipment: equipmentFiltered,
      digitalGames: digitalGamesFiltered,
    }
  }

  // Check if any filter is active
  useEffect(() => {
    const isActive =
      activeCategoryId !== "all" ||
      searchQuery !== "" ||
      priceRange[0] > 0 ||
      priceRange[1] < 100000 ||
      showLimitedOnly ||
      showNewOnly ||
      sortOption !== "popular"

    setIsFilterActive(isActive)
  }, [activeCategoryId, searchQuery, priceRange, showLimitedOnly, showNewOnly, sortOption])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds -= 1
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes -= 1
          } else {
            minutes = 59
            if (hours > 0) {
              hours -= 1
            } else {
              hours = 23
              if (days > 0) {
                days -= 1
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Reset filters
  const resetFilters = () => {
    setActiveCategoryId("all")
    setSearchQuery("")
    setPriceRange([0, 100000])
    setShowLimitedOnly(false)
    setShowNewOnly(false)
    setSortOption("popular")
  }

  // Get filtered rewards
  const filteredLimitedTimeRewards = getFilteredLimitedTimeRewards()
  const filteredRewards = getFilteredRewards()

  // Get active categories (for display in the UI)
  const activeCategories = categories.filter((cat) => cat.isActive).sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Hero Section with Ore Points Display */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 overflow-hidden rewards-hero-section">
        <div className="absolute inset-0 bg-[url('/cosmic-loot.png')] bg-cover bg-center opacity-10 mix-blend-overlay max-h-full"></div>
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#9146FF] opacity-20 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00FF00] opacity-10 blur-3xl"></div>

        <ResponsiveContainer className="relative overflow-visible">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl break-words">
              <span className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                Ödüller
              </span>{" "}
              Kataloğu
            </h1>
            <p className="mb-4 text-lg text-gray-300 break-words">
              Biriktirdiğiniz Ore Points ile alabileceğiniz ödülleri keşfedin. Oyun kodlarından ekipmanlara kadar birçok
              seçenek sizi bekliyor!
            </p>

            {/* Ore Points Balance Display - Only show when logged in */}
            {isLoggedIn ? (
              <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 px-6 py-3">
                <div className="rounded-full bg-gradient-to-r from-[#9146FF]/30 to-[#00FF00]/30 p-2">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Mevcut Bakiyeniz</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                    {orePoints.toLocaleString()} Ore Points
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto mb-6 flex w-full max-w-xs sm:max-w-md flex-col items-center gap-3 rounded-xl bg-gray-900/80 px-4 sm:px-6 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-[#9146FF]" />
                  <p className="text-white font-medium text-sm sm:text-base break-words">
                    Ore Points bakiyenizi görmek için giriş yapın
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 w-full">
                  <Button size="sm" className="bg-[#9146FF] hover:bg-[#7a38d5] cursor-pointer" onClick={handleLogin}>
                    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 pointer-events-none" fill="#FFFFFF">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                    </svg>
                    <span className="select-none">Twitch ile Giriş</span>
                  </Button>
                  <Button size="sm" className="bg-[#00FF00] hover:bg-[#00cc00] cursor-pointer" onClick={handleLogin}>
                    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 pointer-events-none" fill="#FFFFFF">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
                    </svg>
                    <span className="select-none">Kick ile Giriş</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </section>

      {/* Category Selection Section - Simplified and Dynamic */}
      <section className="bg-gray-900 py-6 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Kategoriler</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className={cn("text-gray-400 hover:text-white", isFilterActive ? "visible" : "invisible")}
              >
                <X className="h-4 w-4 mr-1" />
                Filtreleri Temizle
              </Button>
            </div>

            {/* Make category buttons scrollable with visual indicator */}
            <div className="overflow-x-auto pb-2 category-scroll-container">
              <div className="flex gap-2 min-w-max pr-4">
                {activeCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategoryId === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategoryId(category.id)}
                    className={cn(
                      "h-auto py-3 px-4 min-w-[100px]", // Increase touch target size
                      activeCategoryId === category.id
                        ? "bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00] text-white border-transparent"
                        : "border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white",
                    )}
                  >
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-10 border-b border-gray-800 bg-gray-950/80 py-4 backdrop-blur-md overflow-x-hidden rewards-filters-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row w-full max-w-full">
            <div className="relative w-full max-w-full sm:max-w-md overflow-hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ödül ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-700 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-[#9146FF] focus:outline-none text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex w-full flex-1 items-center justify-end gap-2 sm:w-auto">
              {/* Desktop Filter Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`hidden border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white md:flex ${
                      isFilterActive ? "border-[#9146FF] bg-[#9146FF]/10 text-[#9146FF]" : ""
                    }`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrele
                    {isFilterActive && <Badge className="ml-2 bg-[#9146FF]">Aktif</Badge>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-gray-900 p-0 text-white" align="end">
                  <div className="border-b border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Filtreler</h3>
                      {isFilterActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="h-8 text-xs text-gray-400 hover:text-white"
                        >
                          Sıfırla
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Fiyat Aralığı</h4>
                      <div className="px-2">
                        <RangeSlider
                          defaultValue={[0, 100000]}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100000}
                          step={5000}
                          className="py-4"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span>{priceRange[0].toLocaleString()} Ore Points</span>
                          <span>{priceRange[1].toLocaleString()} Ore Points</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Özel Filtreler</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="limited"
                            checked={showLimitedOnly}
                            onCheckedChange={(checked) => setShowLimitedOnly(checked === true)}
                          />
                          <label
                            htmlFor="limited"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Sadece Sınırlı Süre Ödülleri
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="new"
                            checked={showNewOnly}
                            onCheckedChange={(checked) => setShowNewOnly(checked === true)}
                          />
                          <label
                            htmlFor="new"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Sadece Yeni Ödüller
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Sıralama</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="popular"
                            checked={sortOption === "popular"}
                            onCheckedChange={(checked) => checked && setSortOption("popular")}
                          />
                          <label
                            htmlFor="popular"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Popülerliğe Göre
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="price-asc"
                            checked={sortOption === "price-asc"}
                            onCheckedChange={(checked) => checked && setSortOption("price-asc")}
                          />
                          <label
                            htmlFor="price-asc"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Fiyat: Düşükten Yükseğe
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="price-desc"
                            checked={sortOption === "price-desc"}
                            onCheckedChange={(checked) => checked && setSortOption("price-desc")}
                          />
                          <label
                            htmlFor="price-desc"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Fiyat: Yüksekten Düşüğe
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="name-asc"
                            checked={sortOption === "name-asc"}
                            onCheckedChange={(checked) => checked && setSortOption("name-asc")}
                          />
                          <label
                            htmlFor="name-asc"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            İsim: A-Z
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="name-desc"
                            checked={sortOption === "name-desc"}
                            onCheckedChange={(checked) => checked && setSortOption("name-desc")}
                          />
                          <label
                            htmlFor="name-desc"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            İsim: Z-A
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Grid Section */}
      <section className="py-12">
        <ResponsiveContainer>
          {/* Limited Time Rewards Section */}
          {filteredLimitedTimeRewards.length > 0 && (
            <div className="mb-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Sınırlı Süre Ödülleri</h2>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-[#9146FF]/30 to-[#00FF00]/30 px-3 py-1.5 text-xs font-bold uppercase text-white">
                    <svg viewBox="0 0 24 24" className="mr-2 inline-block h-4 w-4" fill="currentColor">
                      <path d="M2 21h19v2H2v-2zm11.172-6.778l-4.444 4.444L2 12.222l1.778-1.778 4.444 4.444 9.444-9.444L22 7.778 13.172 16.556z" />
                    </svg>
                    <span>{timeLeft.days} gün kaldı</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredLimitedTimeRewards.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} purchaseReward={purchaseReward} />
                ))}
              </div>
            </div>
          )}

          {/* Popular Rewards Section */}
          {filteredRewards.popular.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Popüler Ödüller</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredRewards.popular.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} purchaseReward={purchaseReward} />
                ))}
              </div>
            </div>
          )}

          {/* In-Game Items Section */}
          {filteredRewards.inGameItems.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Oyun İçi Öğeler</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredRewards.inGameItems.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} purchaseReward={purchaseReward} />
                ))}
              </div>
            </div>
          )}

          {/* Gaming Equipment Section */}
          {filteredRewards.equipment.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Ekipmanlar</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredRewards.equipment.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} purchaseReward={purchaseReward} />
                ))}
              </div>
            </div>
          )}

          {/* Digital Games Section */}
          {filteredRewards.digitalGames.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Dijital Oyunlar</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredRewards.digitalGames.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} purchaseReward={purchaseReward} />
                ))}
              </div>
            </div>
          )}

          {/* Gift Code Redemption Section */}
          <section className="relative bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 py-16 rewards-redemption-section">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl rounded-2xl bg-gray-900/80 backdrop-blur-sm p-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">Hediye Kodu Kullan</h2>
                <p className="mb-6 text-gray-300">
                  Hediye kodunuzu kullanarak Ore Points kazanın ve daha fazla ödüle ulaşın!
                </p>

                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-full max-w-md mx-auto">
                    <input
                      ref={giftInputRef}
                      type="text"
                      placeholder="Hediye kodunu girin"
                      value={giftCode}
                      onChange={(e) => setGiftCode(e.target.value)}
                      className="w-full rounded-full border border-gray-700 bg-gray-900/90 py-4 pl-6 pr-28 text-white placeholder-gray-400 focus:border-[#9146FF] focus:ring-2 focus:ring-[#9146FF]/50 focus:outline-none shadow-lg text-base"
                    />
                    <Button
                      onClick={redeemGiftCode}
                      disabled={isRedeeming}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#9146FF] hover:bg-[#7a38d5] px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg h-10"
                    >
                      {isRedeeming ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="sr-only sm:not-sr-only">Kontrol Ediliyor</span>
                        </>
                      ) : (
                        "Kullan"
                      )}
                    </Button>
                  </div>

                  {redemptionResult && (
                    <div
                      className={`w-full max-w-md rounded-lg p-4 text-left shadow-lg transition-all duration-300 ${
                        redemptionResult.success
                          ? "bg-gradient-to-r from-green-800/90 to-green-700/90 border border-green-600/30"
                          : "bg-gradient-to-r from-red-800/90 to-red-700/90 border border-red-600/30"
                      }`}
                    >
                      <p className="text-white break-words">
                        {redemptionResult.success && (
                          <svg
                            className="inline-block mr-2 h-5 w-5 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {!redemptionResult.success && (
                          <svg
                            className="inline-block mr-2 h-5 w-5 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        {redemptionResult.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
                    <p>
                      Örnek kodlar: <span className="font-mono bg-gray-800 px-2 py-1 rounded text-xs">BONUS500</span>{" "}
                      veya <span className="font-mono bg-gray-800 px-2 py-1 rounded text-xs">LOOT-ABC123</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ResponsiveContainer>
      </section>
    </main>
  )
}

interface RewardCardProps {
  reward: Reward
  purchaseReward: (reward: Reward) => boolean
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, purchaseReward }) => {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { toast } = useToast()

  const handlePurchase = async () => {
    setIsPurchasing(true)
    const success = purchaseReward(reward)
    setIsPurchasing(false)

    if (success) {
      toast({
        title: "Ödül Alındı!",
        description: `${reward.name} başarıyla satın alındı.`,
        variant: "default",
      })
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-md transition-transform hover:scale-105">
      {reward.discount && (
        <Badge className="absolute left-3 top-3 z-10 rounded-full bg-red-600 text-xs">%{reward.discount}</Badge>
      )}
      {reward.badge && (
        <Badge className={`absolute right-3 top-3 z-10 rounded-full text-xs ${reward.badgeColor || "bg-emerald-600"}`}>
          {reward.badge}
        </Badge>
      )}
      <img src={reward.image || "/placeholder.svg"} alt={reward.name} className="aspect-video w-full object-cover" />
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-white">{reward.name}</h3>
        <p className="mb-4 text-sm text-gray-400">{reward.description}</p>
        <div className="flex items-center justify-between">
          <div>
            {reward.originalPoints && reward.discount ? (
              <div className="flex items-center">
                <span className="mr-2 text-sm line-through text-gray-500">
                  {reward.originalPoints.toLocaleString()} Ore
                </span>
                <span className="text-base font-bold text-white">{reward.points.toLocaleString()} Ore</span>
              </div>
            ) : (
              <span className="text-base font-bold text-white">{reward.points.toLocaleString()} Ore</span>
            )}
          </div>
          <Button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="rounded-full bg-[#9146FF] hover:bg-[#7a38d5]"
          >
            {isPurchasing ? "Yükleniyor..." : "Satın Al"}
          </Button>
        </div>
      </div>
    </div>
  )
}
