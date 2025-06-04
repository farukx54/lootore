"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, AlertCircle, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import StreamCard from "@/components/stream-card"
import ResponsiveContainer from "@/components/responsive-container"
import { cn } from "@/lib/utils"
import { usePublishersStore } from "@/lib/stores/publishers-store"
import type { Database } from "@/lib/supabase/types"

type Publisher = Database["public"]["Tables"]["publishers"]["Row"]

export default function Yayinlar() {
  const { publishers, isLoading: isLoadingPublishers, error: publishersError, fetchPublishers } = usePublishersStore()

  const { toast } = useToast()

  const [activePlatform, setActivePlatform] = useState<"all" | "twitch" | "kick">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  useEffect(() => {
    fetchPublishers(activePlatform === "all" ? undefined : activePlatform)
  }, [activePlatform, fetchPublishers])

  useEffect(() => {
    if (publishersError) {
      toast({
        title: "Yayıncı Yükleme Hatası",
        description: publishersError,
        variant: "destructive",
      })
    }
  }, [publishersError, toast])

  useEffect(() => {
    const isActive = activePlatform !== "all" || searchQuery !== "" || showSubscribedOnly
    setIsFilterActive(isActive)
  }, [activePlatform, searchQuery, showSubscribedOnly])

  const filteredPublishers = publishers.filter((publisher) => {
    if (
      searchQuery &&
      !publisher.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(publisher.username && publisher.username.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !(publisher.category && publisher.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }
    return true
  })

  const resetFilters = () => {
    setActivePlatform("all")
    setSearchQuery("")
    setShowSubscribedOnly(false)
    setIsMobileFilterOpen(false)
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
                Yayınlar
              </span>
            </h1>
            <p className="mb-8 text-lg text-gray-300 break-words">
              Favori yayıncılarınızı izleyin ve Ore Points kazanın. Yayın izleyerek dakika başına puan kazanabilirsiniz!
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-20 border-b border-gray-800 bg-gray-950/80 py-4 backdrop-blur-md">
        <ResponsiveContainer>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Yayıncı adı, kullanıcı adı veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-700 bg-gray-900 py-3 pl-10 pr-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
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

            <div className="flex w-full flex-1 items-center justify-end gap-2 sm:w-auto">
              <Popover onOpenChange={(open) => !open && setIsMobileFilterOpen(false)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "hidden border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white md:flex",
                      isFilterActive && "border-primary bg-primary/10 text-primary",
                    )}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrele
                    {isFilterActive && <Badge className="ml-2 bg-primary text-primary-foreground">Aktif</Badge>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 border-gray-700 bg-gray-900 p-0 text-white" align="end">
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
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Platform</h4>
                      <div className="flex flex-wrap gap-2">
                        {["all", "twitch", "kick"].map((platform) => (
                          <Button
                            key={platform}
                            variant="outline"
                            size="sm"
                            onClick={() => setActivePlatform(platform as "all" | "twitch" | "kick")}
                            className={cn(
                              "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                              activePlatform === platform &&
                                (platform === "kick"
                                  ? "border-green-500 bg-green-500/10 text-green-500"
                                  : "border-primary bg-primary/10 text-primary"),
                            )}
                          >
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className={cn(
                  "md:hidden border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                  isFilterActive && "border-primary bg-primary/10 text-primary",
                )}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
                {isFilterActive && <Badge className="ml-2 bg-primary text-primary-foreground">Aktif</Badge>}
              </Button>
            </div>
          </div>

          {isMobileFilterOpen && (
            <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-4 md:hidden">
              <div className="mb-4 flex items-center justify-between">
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
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-300">Platform</h4>
                  <div className="flex flex-wrap gap-2">
                    {["all", "twitch", "kick"].map((platform) => (
                      <Button
                        key={`mobile-${platform}`}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActivePlatform(platform as "all" | "twitch" | "kick")
                        }}
                        className={cn(
                          "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                          activePlatform === platform &&
                            (platform === "kick"
                              ? "border-green-500 bg-green-500/10 text-green-500"
                              : "border-primary bg-primary/10 text-primary"),
                        )}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ResponsiveContainer>
      </section>

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

          {isLoadingPublishers ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredPublishers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPublishers.map((publisher) => (
                <StreamCard
                  key={publisher.id}
                  platform={publisher.platform as "twitch" | "kick"}
                  image={
                    publisher.avatar_url ||
                    `/placeholder.svg?width=400&height=225&query=${encodeURIComponent(publisher.name)}`
                  }
                  streamerName={publisher.name}
                  viewerCount={publisher.follower_count || 0}
                  pointMultiplier={publisher.points_per_minute || 1}
                  streamUrl={publisher.channel_url || "#"}
                  category={publisher.category || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center min-h-[300px]">
              <AlertCircle className="h-16 w-16 text-primary mb-4" />
              <h3 className="mb-2 text-xl font-bold text-white">Yayın Bulunamadı</h3>
              <p className="mb-4 text-gray-400">
                {searchQuery
                  ? "Arama kriterlerinize uygun yayın bulunamadı."
                  : "Bu platformda henüz aktif yayıncı bulunmuyor."}
              </p>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </ResponsiveContainer>
      </section>
    </main>
  )
}
