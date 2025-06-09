"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PublisherManager from "@/components/admin/publisher-manager"
import CouponManager from "@/components/admin/coupon-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Gift, Settings, BarChart3, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/lib/stores/admin-store"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("publishers")
  const adminLogout = useAdminStore((state) => state.adminLogout)
  const router = useRouter()

  const handleLogout = async () => {
    await adminLogout()
    router.push("/admin/login")
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yayıncı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 bu ay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kuponlar</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 bu hafta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kupon Kullanımları</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,483</div>
            <p className="text-xs text-muted-foreground">+24% geçen aya göre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dağıtılan Puanlar</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-muted-foreground">+12% geçen aya göre</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="publishers">Yayıncı Yönetimi</TabsTrigger>
          <TabsTrigger value="coupons">Kupon Yönetimi</TabsTrigger>
        </TabsList>

        <TabsContent value="publishers" className="space-y-4">
          <PublisherManager />
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <CouponManager />
        </TabsContent>
      </Tabs>
    </main>
  )
}
