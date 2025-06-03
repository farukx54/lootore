"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info, Zap, ArrowRight, Share2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import ReferralInfoModal from "./referral-info-modal"

export default function OrePointsInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const [orePoints, setOrePoints] = useState(15000)

  // Get the ore points from localStorage on component mount
  useEffect(() => {
    const storedOrePoints = localStorage.getItem("orePoints")
    if (storedOrePoints) {
      setOrePoints(Number.parseInt(storedOrePoints))
    }
  }, [])

  // Add the referral code handling functions
  const copyReferralCode = () => {
    const referralCode = `LOOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    navigator.clipboard.writeText(referralCode)
    toast({
      title: "Kopyalandı!",
      description: "Referans kodunuz panoya kopyalandı.",
      variant: "default",
    })
  }

  const shareReferralCode = () => {
    const referralCode = `LOOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    if (navigator.share) {
      navigator
        .share({
          title: "LootOre Referans Kodum",
          text: `LootOre'a katıl ve 1000 Ore Points kazan! Referans kodum: ${referralCode}`,
          url: "https://lootore.com/register",
        })
        .catch((error) => {
          toast({
            title: "Paylaşım Hatası",
            description: "Referans kodunuz paylaşılırken bir hata oluştu.",
            variant: "destructive",
          })
        })
    } else {
      copyReferralCode()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="gap-1">
            <Info className="h-4 w-4 text-[#9146FF]" />
            <span>Ore Points Bilgisi</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-gray-900">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
            Ore Points Hakkında
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            LootOre'un evrensel sanal para birimi hakkında bilmeniz gerekenler
          </DialogDescription>

          <div className="mt-4 space-y-6">
            <div className="rounded-lg bg-gray-800 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#9146FF]" />
                <h3 className="text-lg font-medium text-white">Evrensel Para Birimi</h3>
              </div>
              <p className="text-gray-300">
                Ore Points, LootOre'un evrensel sanal para birimidir. Tüm ödülleri satın almak için Ore Points
                kullanabilirsiniz. Basit ve kullanımı kolay bir sistem ile istediğiniz ödüllere sahip olun.
              </p>
            </div>

            <div className="rounded-lg bg-gray-800 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#00FF00]" />
                <h3 className="text-lg font-medium text-white">Nasıl Kazanılır?</h3>
              </div>
              <p className="text-gray-300">Ore Points kazanmanın birkaç yolu:</p>
              <ul className="mt-2 space-y-1 text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                  <span>Yayınları izleyerek: dakika başına 1 Ore Point</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                  <span>Özel etkinliklere katılarak: 50-200 Ore Points bonus</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                  <span>Günlük giriş yaparak: 10 Ore Points</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                  <span>Arkadaşlarınızı davet ederek: davet başına 100 Ore Points</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-800 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-white" />
                <h3 className="text-lg font-medium text-white">Nasıl Kullanılır?</h3>
              </div>
              <p className="text-gray-300">Ore Points ile yapabilecekleriniz:</p>
              <ul className="mt-2 space-y-1 text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                  <span>Tüm ödülleri satın alabilirsiniz</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                  <span>Özel etkinliklere katılım sağlayabilirsiniz</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-white" />
                  <span>Sınırlı süreli ödüllere erişebilirsiniz</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-[#9146FF] to-[#00FF00] text-white hover:from-[#7a38d5] hover:to-[#00cc00]"
            >
              Anladım
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ReferralInfoModal
        orePoints={orePoints}
        onCopyCode={copyReferralCode}
        onShareCode={shareReferralCode}
        trigger={
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-gray-700 bg-gradient-to-r from-[#9146FF]/10 to-[#00FF00]/10 text-white hover:bg-gradient-to-r hover:from-[#9146FF]/20 hover:to-[#00FF00]/20"
          >
            <Share2 className="h-4 w-4 text-[#00FF00]" />
            <span className="hidden sm:inline">Davet Et</span>
          </Button>
        }
      />
    </div>
  )
}
