"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2, Users, Gift, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ReferralInfoModalProps {
  orePoints: number
  referralCode?: string
  trigger?: React.ReactNode
  onCopyCode?: () => void
  onShareCode?: () => void
}

export default function ReferralInfoModal({
  orePoints,
  referralCode,
  trigger,
  onCopyCode,
  onShareCode,
}: ReferralInfoModalProps) {
  const hasReferralCode = orePoints >= 5000
  const generatedCode =
    referralCode || (hasReferralCode ? `LOOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : "")

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span>Referans Programı</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#00FF00]" />
            Arkadaş Davet Programı
          </DialogTitle>
          <DialogDescription>Arkadaşlarınızı davet edin, birlikte kazanın</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {hasReferralCode ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 p-4">
                <h3 className="text-sm font-medium text-white mb-2">Referans Kodunuz</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-md bg-gray-900 px-3 py-2 font-mono text-center text-lg font-bold text-white">
                    {generatedCode}
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Bu kodu arkadaşlarınızla paylaşın. Onlar kaydolduğunda ikiniz de 1,000 Ore Points kazanacaksınız!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={onCopyCode} variant="outline" className="border-gray-700 hover:bg-gray-800">
                  Kodu Kopyala
                </Button>
                <Button
                  onClick={onShareCode}
                  className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00]"
                >
                  Paylaş
                </Button>
              </div>

              <div className="rounded-lg bg-gray-800 p-4">
                <h3 className="text-sm font-medium text-white mb-3">Nasıl Çalışır?</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#9146FF]/20">
                      <Share2 className="h-4 w-4 text-[#9146FF]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Davet Et</h4>
                      <p className="text-xs text-gray-400">Referans kodunuzu arkadaşlarınızla paylaşın</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#00FF00]/20">
                      <Users className="h-4 w-4 text-[#00FF00]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Katılım</h4>
                      <p className="text-xs text-gray-400">Arkadaşlarınız kodu kullanarak LootOre'a katılır</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#9146FF]/20">
                      <Gift className="h-4 w-4 text-[#9146FF]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Ödül</h4>
                      <p className="text-xs text-gray-400">İkiniz de 1,000 Ore Points kazanırsınız</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-800 p-4">
                <p className="text-sm text-gray-300 mb-2">
                  Referans kodunuzu oluşturmak için <span className="font-bold text-white">5,000 Ore Points</span>{" "}
                  kazanmanız gerekiyor.
                </p>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">İlerleme</span>
                  <span className="text-xs font-medium text-white">
                    {orePoints.toLocaleString()} / 5,000 Ore Points
                  </span>
                </div>
                <Progress
                  value={(orePoints / 5000) * 100}
                  className="h-2 bg-gray-700"
                  indicatorClassName="bg-gradient-to-r from-[#9146FF] to-[#00FF00]"
                />
                <p className="mt-2 text-xs text-gray-400">
                  {Math.max(0, 5000 - orePoints).toLocaleString()} Ore Points daha kazanmanız gerekiyor
                </p>
              </div>

              <div className="rounded-lg bg-gray-800 p-4">
                <h3 className="text-sm font-medium text-white mb-3">Nasıl Çalışır?</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#9146FF]/20">
                      <ArrowRight className="h-4 w-4 text-[#9146FF]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Ore Points Kazanın</h4>
                      <p className="text-xs text-gray-400">Yayınları izleyerek 5,000 Ore Points'e ulaşın</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#00FF00]/20">
                      <Share2 className="h-4 w-4 text-[#00FF00]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Referans Kodu Alın</h4>
                      <p className="text-xs text-gray-400">
                        5,000 Ore Points'e ulaştığınızda benzersiz bir kod alırsınız
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#9146FF]/20">
                      <Gift className="h-4 w-4 text-[#9146FF]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Ödüller Kazanın</h4>
                      <p className="text-xs text-gray-400">Her başarılı davet için 1,000 Ore Points kazanın</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
