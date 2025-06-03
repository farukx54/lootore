"use client"

import type React from "react"

import { useState, useCallback, memo } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, ExternalLink, Bell, BellOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface StreamCardProps {
  platform: "twitch" | "kick"
  image: string
  streamerName: string
  viewerCount: number
  pointMultiplier: number
  streamUrl: string
  isSubscribed?: boolean
  size?: "sm" | "md" | "lg"
}

// Use memo to prevent unnecessary re-renders
const StreamCard = memo(function StreamCard({
  platform,
  image,
  streamerName,
  viewerCount,
  pointMultiplier,
  streamUrl,
  isSubscribed = false,
  size = "md",
}: StreamCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [subscribed, setSubscribed] = useState(isSubscribed)
  const { toast } = useToast()

  // Memoize functions to prevent recreating on each render
  const formatViewerCount = useCallback((count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }, [])

  const toggleSubscription = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setSubscribed((prev) => {
        const newState = !prev

        toast({
          title: newState ? "Abone Olundu" : "Abonelik İptal Edildi",
          description: newState
            ? `${streamerName} yayıncısına başarıyla abone oldunuz.`
            : `${streamerName} yayıncısına aboneliğiniz iptal edildi.`,
          variant: "default",
        })

        return newState
      })
    },
    [streamerName, toast],
  )

  // Determine sizes based on the size prop
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
  const badgeSize = size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs"
  const titleSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"
  const buttonSize = size === "sm" ? "p-1.5" : size === "lg" ? "p-3" : "p-2"

  return (
    <Card
      className="group overflow-hidden rounded-lg border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        {/* Use next/image with proper sizing */}
        <Image
          src={image || "/placeholder.svg?height=720&width=1280&query=gaming+stream"}
          alt={`${streamerName} yayını`}
          className={cn("object-cover transition-transform duration-500", isHovered ? "scale-110" : "scale-100")}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={80}
          priority={false}
        />

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-80" : "opacity-60"
          }`}
        ></div>

        {/* Viewer count badge - increased touch target */}
        <div className="absolute bottom-3 left-3 flex items-center rounded-full bg-black/70 px-2.5 py-1.5 backdrop-blur-sm">
          <Eye className={cn("mr-1.5", iconSize)} />
          <span className={badgeSize}>{formatViewerCount(viewerCount)}</span>
        </div>

        {/* Platform badge - increased touch target */}
        <div
          className={cn("absolute right-3 top-3 rounded-full px-2.5 py-1.5 font-bold backdrop-blur-sm", badgeSize)}
          style={{
            backgroundColor: platform === "twitch" ? "rgba(145, 70, 255, 0.8)" : "rgba(0, 255, 0, 0.3)",
            border: platform === "twitch" ? "1px solid #9146FF" : "1px solid #00FF00",
          }}
        >
          {platform === "twitch" ? "Twitch" : "Kick"}
        </div>

        {/* Subscription button - increased touch target */}
        <button
          onClick={toggleSubscription}
          className={cn(
            "absolute right-3 bottom-3 rounded-full text-xs font-bold backdrop-blur-sm transition-all duration-200 hover:scale-110",
            buttonSize,
            subscribed
              ? "bg-[#9146FF]/80 text-white border border-[#9146FF]"
              : "bg-gray-800/80 text-gray-300 border border-gray-700 hover:text-white",
          )}
          aria-label={subscribed ? "Aboneliği İptal Et" : "Abone Ol"}
        >
          {subscribed ? <Bell className={iconSize} /> : <BellOff className={iconSize} />}
        </button>
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h3 className={cn("mb-1 font-bold text-white truncate max-w-[70%]", titleSize)}>{streamerName}</h3>
          {subscribed && (
            <span className="ml-2 text-xs font-medium bg-[#9146FF] text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Abonelik Aktif
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 px-2 py-1 backdrop-blur-sm">
            <span className={cn("font-medium text-white", badgeSize)}>Dakika başına </span>
            <span className={cn("font-bold text-[#00FF00]", badgeSize)}>x{pointMultiplier}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-800 p-3 sm:p-4">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-[#9146FF] to-[#00FF00] text-white hover:from-[#7a38d5] hover:to-[#00cc00] text-xs sm:text-sm"
        >
          <Link href={streamUrl} target="_blank" rel="noopener noreferrer">
            İzle
            <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
})

export default StreamCard
