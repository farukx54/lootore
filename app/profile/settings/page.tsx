"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getUserSession, updateUsername } from "@/lib/auth"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const userProfile = getUserSession()
  const [username, setUsername] = useState(userProfile?.username || "")

  const handleSaveSettings = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (userProfile && username !== userProfile.username) {
        updateUsername(userProfile, username)
      }

      setIsLoading(false)
      toast({
        title: "Ayarlar Kaydedildi",
        description: "Profil ayarlarınız başarıyla güncellendi.",
        variant: "default",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Hesap Ayarları</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar">Profil Resmi</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#9146FF]">
                  <img
                    src={userProfile?.avatar || "/abstract-user-icon.png"}
                    alt="Kullanıcı"
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
                  Resim Değiştir
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Bağlı Hesaplar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 p-3">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#9146FF]" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
                <div>
                  <h4 className="font-medium text-white">Twitch</h4>
                  <p className="text-xs text-gray-400">
                    {userProfile?.provider === "twitch" ? userProfile.providerUsername : "Bağlı değil"}
                  </p>
                </div>
              </div>
              <Badge className={userProfile?.provider === "twitch" ? "bg-green-600" : "bg-gray-600"}>
                {userProfile?.provider === "twitch" ? "Bağlı" : "Bağlı Değil"}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 p-3">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#00FF00]" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16.5v-9l7 4.5-7 4.5z" />
                </svg>
                <div>
                  <h4 className="font-medium text-white">Kick</h4>
                  <p className="text-xs text-gray-400">
                    {userProfile?.provider === "kick" ? userProfile.providerUsername : "Bağlı değil"}
                  </p>
                </div>
              </div>
              <Badge className={userProfile?.provider === "kick" ? "bg-green-600" : "bg-gray-600"}>
                {userProfile?.provider === "kick" ? "Bağlı" : "Bağlı Değil"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Bildirim Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Yayıncı Bildirimleri</h4>
                <p className="text-sm text-gray-400">Abone olduğunuz yayıncılar yayına başladığında bildirim alın</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Ödül Bildirimleri</h4>
                <p className="text-sm text-gray-400">Yeni ödüller eklendiğinde bildirim alın</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
          İptal
        </Button>
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#9146FF] to-[#00FF00] hover:from-[#7a38d5] hover:to-[#00cc00]"
        >
          {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-500">Tehlikeli Bölge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-400">
              Hesabınızı silmek tüm verilerinizi kalıcı olarak kaldıracaktır. Bu işlem geri alınamaz.
            </p>
            <Button variant="destructive">Hesabımı Sil</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
