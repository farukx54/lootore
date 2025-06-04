"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Share2, Users, Gift, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function ReferralsPage() {
  const [referralCopied, setReferralCopied] = useState(false)
  const orePoints = 15000 // This would come from your state management
  const hasReferralCode = orePoints >= 5000
  const referralCode = hasReferralCode ? `LOOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : ""

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setReferralCopied(true)
    setTimeout(() => {
      setReferralCopied(false)
    }, 2000)
  }

  const shareReferralCode = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "LootOre Referans Kodum",
          text: `LootOre'a katıl ve 1000 Ore Points kazan! Referans kodum: ${referralCode}`,
          url: "https://lootore.com/register",
        })
        .catch((error) => {
          console.error("Sharing failed:", error)
        })
    } else {
      copyReferralCode()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Referans Programı</h2>

      <>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-[#00FF00]" />
              Arkadaş Davet Programı
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasReferralCode ? (
              <div className="space-y-6">
                <div className="rounded-lg bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 p-4">
                  <h3 className="text-sm font-medium text-white mb-2">Referans Kodunuz</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-md bg-gray-900 px-3 py-2 font-mono text-center text-lg font-bold text-white">
                      {referralCode}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-gray-700 bg-gray-800 hover:bg-gray-700"
                      onClick={copyReferralCode}
                    >
                      {referralCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Bu kodu arkadaşlarınızla paylaşın. Onlar kaydolduğunda ikiniz de 1,000 Ore Points kazanacaksınız!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                    Kodu Kopyala
                  </Button>
                  <Button
                    onClick={shareReferralCode}
                    className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00]"
                  >
                    Paylaş
                  </Button>
                </div>

                <div className="rounded-lg bg-gray-700 p-4">
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

                <div className="rounded-lg bg-gray-700 p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Davet İstatistikleri</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-400">Toplam Davet</p>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Kazanılan Ore Points</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                        3,000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-700 p-4">
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
                    className="h-2 bg-gray-800"
                    indicatorClassName="bg-gradient-to-r from-[#9146FF] to-[#00FF00]"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    {Math.max(0, 5000 - orePoints).toLocaleString()} Ore Points daha kazanmanız gerekiyor
                  </p>
                </div>

                <div className="rounded-lg bg-gray-700 p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Nasıl Çalışır?</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#9146FF]/20">
                        <Share2 className="h-4 w-4 text-[#9146FF]" />
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
          </CardContent>
        </Card>

        {hasReferralCode && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Davet Edilen Arkadaşlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-600">
                      <img src="/abstract-user-icon.png" alt="User" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">GameMaster42</h4>
                      <p className="text-xs text-gray-400">Katılım: 12 Nisan 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                      +1,000 Ore Points
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-600">
                      <img src="/abstract-user-icon.png" alt="User" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">StreamFan99</h4>
                      <p className="text-xs text-gray-400">Katılım: 5 Mayıs 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                      +1,000 Ore Points
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-600">
                      <img src="/abstract-user-icon.png" alt="User" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">GamerGirl123</h4>
                      <p className="text-xs text-gray-400">Katılım: 20 Mayıs 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                      +1,000 Ore Points
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </>
    </div>
  )
}
