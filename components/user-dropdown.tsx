"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, LogOut, User, Gift, Clock, Settings } from "lucide-react"
import UserPanel from "./user-panel"
import { Button } from "./ui/button"
import { Dialog, DialogContent } from "./ui/dialog"
import Link from "next/link"
import type { UserProfile } from "@/lib/auth"
import { Badge } from "./ui/badge"

interface UserDropdownProps {
  onLogout: () => void
  orePoints?: number
  userProfile: UserProfile | null
}

export default function UserDropdown({ onLogout, orePoints = 15000, userProfile }: UserDropdownProps) {
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false)

  // Kullanıcı adını veya varsayılan görünen adı al
  const displayName = userProfile?.username || userProfile?.displayName || "Kullanıcı"

  // Kullanıcının hangi platformdan giriş yaptığını belirle
  const providerName = userProfile?.provider === "twitch" ? "Twitch" : "Kick"
  const providerColor = userProfile?.provider === "twitch" ? "#9146FF" : "#00FF00"

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isUserPanelOpen} onOpenChange={setIsUserPanelOpen}>
        <Link href="/profile">
          <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-gray-800 w-full justify-start">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={userProfile?.avatar || "/abstract-user-icon.png"} alt="Kullanıcı" />
              <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline-block truncate">{displayName}</span>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
          </Button>
        </Link>
        <DialogContent className="max-w-4xl w-[95vw] bg-gray-900 p-0 sm:rounded-2xl fixed-width-container">
          <UserPanel onClose={() => setIsUserPanelOpen(false)} orePoints={orePoints} userProfile={userProfile} />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 md:hidden">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-gray-900 text-white">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile?.avatar || "/abstract-user-icon.png"} alt="Kullanıcı" />
              <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{displayName}</p>
                <Badge style={{ backgroundColor: providerColor }} className="text-xs">
                  {providerName}
                </Badge>
              </div>
              <p className="text-xs bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-semibold">
                {orePoints.toLocaleString()} Ore Points
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex cursor-pointer items-center gap-2 text-gray-200 focus:bg-gray-800 focus:text-white"
            >
              <User className="h-4 w-4" />
              <span className="select-none">Profilim</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/profile/rewards"
              className="flex cursor-pointer items-center gap-2 text-gray-200 focus:bg-gray-800 focus:text-white"
            >
              <Gift className="h-4 w-4" />
              <span className="select-none">Ödül Geçmişi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/profile/history"
              className="flex cursor-pointer items-center gap-2 text-gray-200 focus:bg-gray-800 focus:text-white"
            >
              <Clock className="h-4 w-4" />
              <span className="select-none">İzleme Geçmişi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/profile/settings"
              className="flex cursor-pointer items-center gap-2 text-gray-200 focus:bg-gray-800 focus:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="select-none">Ayarlar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-red-400 focus:bg-red-900/20 focus:text-red-400"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="select-none">Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
