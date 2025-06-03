import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import ActivityChart from "@/components/activity-chart"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Genel Bakış</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Aktivite Grafiği</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>

        {/* Ore Points Info */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Ore Points Bilgisi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-700 p-4">
                <p className="text-white">
                  LootOre'da artık tek bir para birimi kullanılıyor:{" "}
                  <span className="font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                    Ore Points
                  </span>
                </p>
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

        {/* Goal Progress */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Hedef İlerlemesi</CardTitle>
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

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg bg-gray-700 p-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                  <img src="/neon-city-stream.png" alt="Yayın" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">GamerTurk</h4>
                  <p className="text-sm text-gray-400">Valorant Turnuvası</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">2 saat önce</p>
                  <p className="text-xs bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                    +120 Ore Points
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg bg-gray-700 p-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                  <img src="/intense-fps-action.png" alt="Yayın" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">KickMaster</h4>
                  <p className="text-sm text-gray-400">CS2 Rekabetçi</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">Dün</p>
                  <p className="text-xs bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent font-bold">
                    +108 Ore Points
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
