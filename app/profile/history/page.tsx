import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">İzleme Geçmişi</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Son İzlenen Yayınlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-gray-700 p-3">
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

            <div className="flex items-center gap-4 rounded-lg bg-gray-700 p-3">
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

            <div className="flex items-center gap-4 rounded-lg bg-gray-700 p-3">
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

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>İzleme İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-700 p-4 text-center">
              <p className="text-sm text-gray-400">Toplam İzleme Süresi</p>
              <p className="text-2xl font-bold text-white">124 saat</p>
            </div>
            <div className="rounded-lg bg-gray-700 p-4 text-center">
              <p className="text-sm text-gray-400">Bu Ay Kazanılan</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#9146FF] to-[#00FF00] bg-clip-text text-transparent">
                4,560 Ore Points
              </p>
            </div>
            <div className="rounded-lg bg-gray-700 p-4 text-center">
              <p className="text-sm text-gray-400">İzlenen Yayıncı</p>
              <p className="text-2xl font-bold text-white">28</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
