"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Gift, Clock, Settings, TrendingUp, AlertCircle, Copy, Share2, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import ActivityChart from "./activity-chart"
import { useToast } from "@/hooks/use-toast"
import OrePointsInfo from "./ore-points-info"
import ReferralInfoModal from "./referral-info-modal"
import type { UserProfile } from "@/lib/auth"
import { clearUserSession } from "@/lib/auth"

interface UserPanelProps {
  onClose: () => void
  orePoints?: number
  userProfile: UserProfile | null
}

export default function UserPanel({ onClose, orePoints = 15000, userProfile }: UserPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [referralCopied, setReferralCopied] = useState(false)
  const { toast } = useToast()

  // Kullanıcı adını veya varsayılan görünen adı al
  const displayName = userProfile?.username || userProfile?.displayName || "Kullanıcı"

  // Kullanıcının hangi platformdan giriş yaptığını belirle
  const providerName = userProfile?.provider === "twitch" ? "Twitch" : "Kick"
  const providerColor = userProfile?.provider === "twitch" ? "#9146FF" : "#00FF00"
  const providerUsername = userProfile?.providerUsername || ""

  // Generate a unique referral code based on the username
  const referralCode = `LOOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // Function to simulate Ore Points deduction
  const spendOrePoints = (amount: number) => {
    if (orePoints >= amount) {
      // In a real app, this would call an API to update the user's balance
      toast({
        title: "Başarılı",
        description: `${amount} Ore Points harcandı. Kalan: ${orePoints - amount} Ore Points`,
        variant: "default",
      })
      return true
    } else {
      toast({
        title: "Yetersiz Ore Points",
        description: `Bu işlem için ${amount} Ore Points gerekiyor. Mevcut: ${orePoints} Ore Points`,
        variant: "destructive",
      })
      return false
    }
  }

  // Function to copy referral code to clipboard
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setReferralCopied(true)
    toast({
      title: "Kopyalandı!",
      description: "Referans kodunuz panoya kopyalandı.",
      variant: "default",
    })

    setTimeout(() => {
      setReferralCopied(false)
    }, 2000)
  }

  // Function to share referral code
  const shareReferralCode = () => {
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

  // Add this function after the shareReferralCode function
  const handleTwitchIntegration = () => {
    toast({
      title: "Twitch Entegrasyonu",
      description: "Twitch hesabınız başarıyla bağlandı.",
      variant: "default",
    })
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6 w-full max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Kullanıcı Paneli</h2>
      </div>

      <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-start overflow-hidden px-2 sm:px-4">
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-gradient-to-r from-[#9146FF] to-[#00FF00]">
          <AvatarImage src={userProfile?.avatar || "/abstract-user-icon.png"} alt="Kullanıcı" />
          <AvatarFallback className="text-lg sm:text-xl">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-white">{displayName}</h3>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge style={{ backgroundColor: providerColor }} className="text-xs">
              {providerName} Bağlı
            </Badge>
            <Badge className="bg-black text-gray-300 hover:bg-black/80 text-xs">{providerUsername}</Badge>
            <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
              Yeni Üye
            </Badge>
          </div>
        </div>

        <div className="ml-auto flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Ore Points</p>
              <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                {orePoints.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 p-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <OrePointsInfo />
            <ReferralInfoModal
              orePoints={orePoints}
              referralCode={referralCode}
              onCopyCode={copyReferralCode}
              onShareCode={shareReferralCode}
              trigger={
                <Button variant="secondary" size="sm" className="gap-1 text-xs">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-[#00FF00]" />
                  <span>Davet Et</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Improve tabs for mobile */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 overflow-hidden mb-6 h-auto">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gray-700 px-1 sm:px-2 min-w-[70px] flex-shrink-0 py-3"
          >
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xs:inline-block text-xs sm:text-sm ml-1 sm:ml-2 truncate">Genel Bakış</span>
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="data-[state=active]:bg-gray-700 px-1 sm:px-2 min-w-[70px] flex-shrink-0 py-3"
          >
            <Gift className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xs:inline-block text-xs sm:text-sm ml-1 sm:ml-2 truncate">Ödül Geçmişi</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-gray-700 px-1 sm:px-2 min-w-[70px] flex-shrink-0 py-3"
          >
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xs:inline-block text-xs sm:text-sm ml-1 sm:ml-2 truncate">Geçmiş</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gray-700 px-1 sm:px-2 min-w-[70px] flex-shrink-0 py-3"
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xs:inline-block text-xs sm:text-sm ml-1 sm:ml-2 truncate">Ayarlar</span>
          </TabsTrigger>
        </TabsList>

        {/* Improve tab content scrolling */}
        <TabsContent value="overview" className="px-2 sm:px-4 overflow-auto">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle>Aktivite Grafiği</CardTitle>
                <CardDescription>Son 7 günlük izleme aktiviteniz</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>

            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle>Ore Points Bilgisi</CardTitle>
                <CardDescription>Nasıl Ore Points kazanırsınız</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-700 p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <p className="text-white">
                        LootOre'da artık tek bir para birimi kullanılıyor:{" "}
                        <span className="font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                          Ore Points
                        </span>
                      </p>
                    </div>
                  </div>

                  <h3 className="font-medium text-white">Ore Points Kazanma Yolları:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00]"></div>
                      <span>Twitch yayınlarını izleyerek: dakika başına 1 Ore Point</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00]"></div>
                      <span>Kick yayınlarını izleyerek: dakika başına 1.2 Ore Point</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00]"></div>
                      <span>Özel etkinliklere katılarak: etkinlik başına 50-100 Ore Point</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00]"></div>
                      <span>Günlük giriş yaparak: gün başına 10 Ore Point</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#9146FF] to-[#00FF00]"></div>
                      <span>Arkadaş davet ederek: davet başına 1000 Ore Point</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle>Puan Durumu</CardTitle>
                <CardDescription>Toplam puanlarınız ve hedefleriniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Discord Nitro (1 Ay)</span>
                      <span className="text-sm font-medium text-white">6,500 / 10,000 Ore Points</span>
                    </div>
                    <Progress
                      value={65}
                      className="h-2 bg-gray-700"
                      indicatorClassName="bg-gradient-to-r from-[#9146FF] to-[#00FF00]"
                    />
                    <p className="mt-1 text-xs text-gray-500">3,500 Ore Points daha kazanmanız gerekiyor</p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Steam Gift Card (50 TL)</span>
                      <span className="text-sm font-medium text-white">4,200 / 15,000 Ore Points</span>
                    </div>
                    <Progress
                      value={28}
                      className="h-2 bg-gray-700"
                      indicatorClassName="bg-gradient-to-r from-[#9146FF] to-[#00FF00]"
                    />
                    <p className="mt-1 text-xs text-gray-500">10,800 Ore Points daha kazanmanız gerekiyor</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral System Card */}
            <Card className="bg-gray-800 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-[#00FF00]" />
                  Arkadaş Davet Sistemi
                </CardTitle>
                <CardDescription>Arkadaşlarınızı davet edin, birlikte kazanın</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-hidden">
                {orePoints < 5000 ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-700/50 p-4">
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
                    <div className="rounded-lg bg-gray-900/50 p-4">
                      <h4 className="text-sm font-medium text-white mb-2">Referans Sistemi Nasıl Çalışır?</h4>
                      <ul className="space-y-1 text-xs text-gray-400">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#9146FF]"></div>
                          <span>5,000 Ore Points kazandığınızda benzersiz bir referans kodu alırsınız</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00FF00]"></div>
                          <span>Arkadaşlarınız bu kodu kullandığında siz 1,000 Ore Points kazanırsınız</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#9146FF]"></div>
                          <span>Arkadaşlarınız da 1,000 Ore Points ile başlar</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#9146FF]/20 to-[#00FF00]/20 p-4">
                      <h4 className="text-sm font-medium text-white mb-2">Referans Kodunuz</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-gray-900 px-3 py-2 font-mono text-center text-sm sm:text-lg font-bold text-white overflow-x-auto">
                          {referralCode}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10 border-gray-700 bg-gray-800 hover:bg-gray-700 flex-shrink-0"
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
                        Bu kodu arkadaşlarınızla paylaşın. Onlar kaydolduğunda ikiniz de 1,000 Ore Points
                        kazanacaksınız!
                      </p>
                    </div>

                    <Button
                      onClick={shareReferralCode}
                      className="w-full bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00] text-sm"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Arkadaşlarınızı Davet Edin
                    </Button>

                    <div className="rounded-lg bg-gray-900/50 p-4">
                      <h4 className="text-sm font-medium text-white mb-2">Davet İstatistikleri</h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-400">Toplam Davet</p>
                          <p className="text-lg sm:text-xl font-bold text-white">0</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Kazanılan Ore Points</p>
                          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                            0
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="px-2 sm:px-4">
          <div className="space-y-6">
            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle>Ödül Geçmişi</CardTitle>
                <CardDescription>Kazandığınız ödüller</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                    <Gift className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Henüz Ödül Kazanmadınız</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Yayınları izleyerek Ore Points kazanın ve ödülleri almaya başlayın. Kazandığınız ödüller burada
                    görüntülenecek.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="px-2 sm:px-4">
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle>İzleme Geçmişi</CardTitle>
              <CardDescription>Son izlediğiniz yayınlar ve kazandığınız Ore Points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg bg-gray-900 p-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <img src="/neon-city-stream.png" alt="Yayın" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">GamerTurk</h4>
                    <p className="text-sm text-gray-400">Valorant Turnuvası</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge className="bg-[#9146FF]">Twitch</Badge>
                      <span className="text-xs text-gray-500">2 saat önce</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">120 dakika</p>
                    <p className="text-sm bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                      +120 Ore Points
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-gray-900 p-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <img src="/intense-fps-action.png" alt="Yayın" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">KickMaster</h4>
                    <p className="text-sm text-gray-400">CS2 Rekabetçi</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge className="bg-black text-[#00FF00]">Kick</Badge>
                      <span className="text-xs text-gray-500">Dün</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">90 dakika</p>
                    <p className="text-sm bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                      +108 Ore Points
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-gray-900 p-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <img src="/epic-moba-battle.png" alt="Yayın" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">EfsaneTR</h4>
                    <p className="text-sm text-gray-400">League of Legends</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge className="bg-[#9146FF]">Twitch</Badge>
                      <span className="text-xs text-gray-500">2 gün önce</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">150 dakika</p>
                    <p className="text-sm bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                      +150 Ore Points
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="px-2 sm:px-4">
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle>Hesap Ayarları</CardTitle>
              <CardDescription>Hesap bilgilerinizi yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-400">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={displayName}
                    className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                    readOnly
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-400">Bağlı Hesaplar</label>
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2 hover:bg-gray-800 transition-colors"
                      onClick={handleTwitchIntegration}
                    >
                      <div className="flex items-center gap-2 cursor-pointer">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#9146FF]" fill="currentColor">
                          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                        </svg>
                        <span className="text-white select-none">Twitch</span>
                      </div>
                      <Badge className="bg-green-600 cursor-default">Bağlı</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
                      <div className="flex items-center gap-2 cursor-pointer">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#00FF00]" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
                        </svg>
                        <span className="text-white select-none">Kick</span>
                      </div>
                      <Badge className="bg-green-600 cursor-default">Bağlı</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00] transition-all duration-200 py-3 text-base">
                    Değişiklikleri Kaydet
                  </Button>
                </div>

                <div className="mt-4">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 transition-all duration-200 py-3 text-base"
                    onClick={() => {
                      clearUserSession()
                      onClose()
                      window.location.reload()
                    }}
                  >
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
