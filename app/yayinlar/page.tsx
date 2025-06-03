"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, Bell } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import StreamCard from "@/components/stream-card"
import ResponsiveContainer from "@/components/responsive-container"
import { cn } from "@/lib/utils"

// Define stream interface
interface Stream {
  id: string
  platform: "twitch" | "kick"
  streamerName: string
  image: string
  viewerCount: number
  pointMultiplier: number
  streamUrl: string
  isSubscribed: boolean
  category?: string
}

export default function Yayinlar() {
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activePlatform, setActivePlatform] = useState<"all" | "twitch" | "kick">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Sample streams data
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: "stream1",
      platform: "twitch",
      streamerName: "GameMaster",
      image: "/neon-city-stream.png",
      viewerCount: 12500,
      pointMultiplier: 2,
      streamUrl: "https://twitch.tv/gamemaster",
      isSubscribed: true,
      category: "FPS",
    },
    {
      id: "stream2",
      platform: "kick",
      streamerName: "ProGamer",
      image: "/intense-fps-action.png",
      viewerCount: 8700,
      pointMultiplier: 1.5,
      streamUrl: "https://kick.com/progamer",
      isSubscribed: false,
      category: "Battle Royale",
    },
    {
      id: "stream3",
      platform: "twitch",
      streamerName: "StreamQueen",
      image: "/epic-moba-battle.png",
      viewerCount: 15300,
      pointMultiplier: 2.5,
      streamUrl: "https://twitch.tv/streamqueen",
      isSubscribed: true,
      category: "MOBA",
    },
    {
      id: "stream4",
      platform: "twitch",
      streamerName: "RPGLover",
      image: "/intense-battle-royale.png",
      viewerCount: 5600,
      pointMultiplier: 1.8,
      streamUrl: "https://twitch.tv/rpglover",
      isSubscribed: false,
      category: "RPG",
    },
    {
      id: "stream5",
      platform: "kick",
      streamerName: "StrategyMaster",
      image: "/neon-fracture.png",
      viewerCount: 7200,
      pointMultiplier: 2.2,
      streamUrl: "https://kick.com/strategymaster",
      isSubscribed: true,
      category: "Strategy",
    },
  ])

  // Check login status on component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedInStatus)
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

  // Function to toggle subscription status
  const toggleSubscription = (streamId: string) => {
    setStreams((prevStreams) =>
      prevStreams.map((stream) =>
        stream.id === streamId ? { ...stream, isSubscribed: !stream.isSubscribed } : stream,
      ),
    )
  }

  // Filter streams based on active platform, search query, and subscription filter
  const getFilteredStreams = () => {
    return streams.filter((stream) => {
      // Filter by platform
      if (activePlatform !== "all" && stream.platform !== activePlatform) {
        return false
      }

      // Filter by search query
      if (
        searchQuery &&
        !stream.streamerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !stream.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Filter by subscription status
      if (showSubscribedOnly && !stream.isSubscribed) {
        return false
      }

      return true
    })
  }

  // Check if any filter is active
  useEffect(() => {
    const isActive = activePlatform !== "all" || searchQuery !== "" || showSubscribedOnly
    setIsFilterActive(isActive)
  }, [activePlatform, searchQuery, showSubscribedOnly])

  // Get filtered streams
  const filteredStreams = getFilteredStreams()

  // Reset filters
  const resetFilters = () => {
    setActivePlatform("all")
    setSearchQuery("")
    setShowSubscribedOnly(false)
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/modern-streaming-interface.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#9146FF] opacity-20 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00FF00] opacity-10 blur-3xl"></div>

        <ResponsiveContainer className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                Yayınlar
              </span>
            </h1>
            <p className="mb-8 text-lg text-gray-300">
              Favori yayıncılarınızı izleyin ve Ore Points kazanın. Yayın izleyerek dakika başına puan kazanabilirsiniz!
            </p>

            {!isLoggedIn && (
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-[#9146FF] hover:bg-[#7a38d5]" onClick={handleLogin}>
                  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="#FFFFFF">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                  Twitch ile Giriş Yap
                </Button>
                <Button className="bg-[#00FF00] hover:bg-[#00cc00] text-black" onClick={handleLogin}>
                  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="#000000">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
                  </svg>
                  Kick ile Giriş Yap
                </Button>
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-10 border-b border-gray-800 bg-gray-950/80 py-4 backdrop-blur-md">
        <ResponsiveContainer>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Yayıncı veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-700 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-[#9146FF] focus:outline-none"
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
                <PopoverContent className="w-72 bg-gray-900 p-0 text-white" align="end">
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
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Platform</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActivePlatform("all")}
                          className={cn(
                            "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                            activePlatform === "all" && "border-[#9146FF] bg-[#9146FF]/10 text-[#9146FF]",
                          )}
                        >
                          Tümü
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActivePlatform("twitch")}
                          className={cn(
                            "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                            activePlatform === "twitch" && "border-[#9146FF] bg-[#9146FF]/10 text-[#9146FF]",
                          )}
                        >
                          Twitch
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActivePlatform("kick")}
                          className={cn(
                            "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                            activePlatform === "kick" && "border-[#00FF00] bg-[#00FF00]/10 text-[#00FF00]",
                          )}
                        >
                          Kick
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="subscribed-only"
                          checked={showSubscribedOnly}
                          onCheckedChange={(checked) => setShowSubscribedOnly(checked === true)}
                        />
                        <Label
                          htmlFor="subscribed-only"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Sadece Abone Olduklarım
                        </Label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className={`md:hidden border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white ${
                  isFilterActive ? "border-[#9146FF] bg-[#9146FF]/10 text-[#9146FF]" : ""
                }`}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
                {isFilterActive && <Badge className="ml-2 bg-[#9146FF]">Aktif</Badge>}
              </Button>
            </div>
          </div>

          {/* Mobile Filters (Expanded) */}
          {isMobileFilterOpen && (
            <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-4 md:hidden">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Filtreler</h3>
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

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-300">Platform</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivePlatform("all")}
                      className={cn(
                        "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                        activePlatform === "all" && "border-[#9146FF] bg-[#9146FF]/10 text-[#9146FF]",
                      )}
                    >
                      Tümü
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivePlatform("twitch")}
                      className={cn(
                        "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                        activePlatform === "twitch" && "border-[#9146FF] bg-[#9146FF]/10 text-[#9146FF]",
                      )}
                    >
                      Twitch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivePlatform("kick")}
                      className={cn(
                        "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                        activePlatform === "kick" && "border-[#00FF00] bg-[#00FF00]/10 text-[#00FF00]",
                      )}
                    >
                      Kick
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-subscribed-only"
                      checked={showSubscribedOnly}
                      onCheckedChange={(checked) => setShowSubscribedOnly(checked === true)}
                    />
                    <Label
                      htmlFor="mobile-subscribed-only"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sadece Abone Olduklarım
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ResponsiveContainer>
      </section>

      {/* Streams Grid Section */}
      <section className="flex-1 py-8">
        <ResponsiveContainer>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Tüm Yayınlar</h2>
            {isFilterActive && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-400 hover:text-white">
                <X className="mr-2 h-4 w-4" />
                Filtreleri Temizle
              </Button>
            )}
          </div>

          {filteredStreams.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStreams.map((stream) => (
                <StreamCard
                  key={stream.id}
                  platform={stream.platform}
                  image={stream.image}
                  streamerName={stream.streamerName}
                  viewerCount={stream.viewerCount}
                  pointMultiplier={stream.pointMultiplier}
                  streamUrl={stream.streamUrl}
                  isSubscribed={stream.isSubscribed}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
              <div className="mb-4 rounded-full bg-gray-800 p-3">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Yayın Bulunamadı</h3>
              <p className="mb-4 text-gray-400">
                Arama kriterlerinize uygun yayın bulunamadı. Lütfen filtrelerinizi değiştirin veya daha sonra tekrar
                deneyin.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </ResponsiveContainer>
      </section>
    </main>
  )
}
