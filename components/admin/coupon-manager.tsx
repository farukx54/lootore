"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Plus, Trash2, Edit, Calendar, Tag, ImageIcon } from "lucide-react"
import ImageUploader from "./image-uploader"
import { useAdminStore } from "@/lib/stores/admin-store"
import type { AdminCoupon } from "@/lib/types/admin"
import { format, parseISO, isValid } from "date-fns"

const INITIAL_COUPON_STATE: Omit<AdminCoupon, "id" | "created_at" | "updated_at"> = {
  title: "",
  description: "",
  code: "",
  ore_points_required: 100,
  category: "general",
  image_url: "",
  is_active: true,
  stock_quantity: 0,
  expires_at: null,
}

export default function CouponManager() {
  const {
    coupons,
    isLoading: isListLoading, // Renamed from isAdminLoading for clarity
    isSubmitting, // New state for form operations
    error: adminError,
    fetchAdminCoupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
  } = useAdminStore()

  const [activeTab, setActiveTab] = useState<string>("coupons")
  const [currentCoupon, setCurrentCoupon] = useState<Partial<AdminCoupon>>(INITIAL_COUPON_STATE)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchAdminCoupons()
  }, [fetchAdminCoupons])

  useEffect(() => {
    if (adminError) {
      toast({
        title: "Hata Oluştu",
        description: adminError, // adminError is now a string
        variant: "destructive",
      })
    }
  }, [adminError, toast])

  const handleImageSelect = (imageData: { url: string; file?: File }) => {
    setCurrentCoupon((prev) => ({
      ...prev,
      image_url: imageData.url,
    }))
    if (imageData.file) {
      console.log("Selected image file:", imageData.file)
    }
  }

  const resetForm = () => {
    setCurrentCoupon(INITIAL_COUPON_STATE)
    setIsEditing(false)
  }

  const handleEditCoupon = (coupon: AdminCoupon) => {
    const expiresAtDate = coupon.expires_at ? parseISO(coupon.expires_at) : null
    setCurrentCoupon({
      ...coupon,
      expires_at: expiresAtDate && isValid(expiresAtDate) ? format(expiresAtDate, "yyyy-MM-dd") : null,
    })
    setIsEditing(true)
    setActiveTab("edit")
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!id) {
      toast({ title: "Hata", description: "Geçersiz kupon ID.", variant: "destructive" })
      return
    }
    if (window.confirm("Bu kuponu silmek istediğinizden emin misiniz?")) {
      const success = await deleteCoupon(id)
      if (success) {
        toast({
          title: "Başarılı",
          description: "Kupon silindi.",
        })
        // fetchAdminCoupons(); // Re-fetch is now handled in the store
      } else {
        // Error toast is handled by the store's error state
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const couponDataToSubmit: Omit<AdminCoupon, "id" | "created_at" | "updated_at"> = {
      title: currentCoupon.title || "",
      description: currentCoupon.description || "",
      code: currentCoupon.code?.toUpperCase() || undefined,
      ore_points_required: Number(currentCoupon.ore_points_required) || 0,
      category: currentCoupon.category || "general",
      image_url: currentCoupon.image_url || undefined,
      is_active: currentCoupon.is_active === undefined ? true : currentCoupon.is_active,
      stock_quantity: Number(currentCoupon.stock_quantity) || 0,
      expires_at: currentCoupon.expires_at ? new Date(currentCoupon.expires_at).toISOString() : null,
    }

    if (!couponDataToSubmit.title) {
      toast({ title: "Hata", description: "Başlık boş olamaz.", variant: "destructive" })
      return
    }

    let success = false
    if (isEditing && currentCoupon.id) {
      const result = await updateCoupon(currentCoupon.id, couponDataToSubmit)
      if (result) success = true
    } else {
      const result = await addCoupon(couponDataToSubmit)
      if (result) success = true
    }

    if (success) {
      toast({
        title: "Başarılı",
        description: isEditing ? "Kupon güncellendi." : "Yeni kupon eklendi.",
      })
      resetForm()
      setActiveTab("coupons")
      // fetchAdminCoupons(); // Re-fetch is now handled in the store
    } else {
      // Error toast is handled by the store's error state
    }
  }

  if (isListLoading && coupons.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Kuponlar yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="coupons">Kuponlar ({coupons.length})</TabsTrigger>
          <TabsTrigger value="edit">{isEditing ? "Kupon Düzenle" : "Yeni Kupon Ekle"}</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Kupon Listesi</h2>
            <Button
              onClick={() => {
                resetForm()
                setActiveTab("edit")
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kupon
            </Button>
          </div>

          {coupons.length === 0 && !isListLoading && (
            <p className="text-center text-muted-foreground py-4">Henüz kupon bulunmuyor.</p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <Card key={coupon.id} className="overflow-hidden shadow-lg">
                <div className="relative aspect-video bg-muted">
                  {coupon.image_url ? (
                    <img
                      src={coupon.image_url || "/placeholder.svg"}
                      alt={coupon.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted"
                      onClick={() => handleEditCoupon(coupon)}
                      aria-label="Kuponu düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-red-600/80 text-white backdrop-blur-sm hover:bg-red-700/80"
                      onClick={() => coupon.id && handleDeleteCoupon(coupon.id)}
                      disabled={isSubmitting}
                      aria-label="Kuponu sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-white truncate" title={coupon.title}>
                          {coupon.title}
                        </h3>
                        <span className="text-sm font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                          {coupon.ore_points_required} Puan
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-1" title={coupon.description || ""}>
                        {coupon.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Kod: {coupon.code || "N/A"}</p>

                      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            SKT:{" "}
                            {coupon.expires_at && isValid(parseISO(coupon.expires_at))
                              ? format(parseISO(coupon.expires_at), "dd/MM/yyyy")
                              : "Yok"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          <span>Stok: {coupon.stock_quantity}</span>
                        </div>
                      </div>
                      <Badge
                        variant={coupon.is_active ? "default" : "outline"}
                        className={`mt-2 ${coupon.is_active ? "bg-green-600 text-white" : "border-yellow-500 text-yellow-500"}`}
                      >
                        {coupon.is_active ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Kupon Düzenle" : "Yeni Kupon Ekle"}</CardTitle>
              <CardDescription>
                {isEditing ? "Kupon bilgilerini güncelleyin." : "Yeni bir kupon eklemek için aşağıdaki formu doldurun."}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      value={currentCoupon.title || ""}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, title: e.target.value })}
                      placeholder="Örn: %10 İndirim Kuponu"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="code">Kupon Kodu (Opsiyonel)</Label>
                    <Input
                      id="code"
                      value={currentCoupon.code || ""}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="Örn: HOSGELDIN10"
                      className="uppercase"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={currentCoupon.description || ""}
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, description: e.target.value })}
                      placeholder="Kupon hakkında detaylı bilgi"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ore_points_required">Gereken Puan</Label>
                    <Input
                      id="ore_points_required"
                      type="number"
                      value={currentCoupon.ore_points_required || 0}
                      onChange={(e) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          ore_points_required: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={currentCoupon.category || "general"}
                      onValueChange={(value) => setCurrentCoupon({ ...currentCoupon, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Genel</SelectItem>
                        <SelectItem value="game-codes">Oyun Kodları</SelectItem>
                        <SelectItem value="subscriptions">Abonelikler</SelectItem>
                        <SelectItem value="gift-cards">Hediye Kartları</SelectItem>
                        <SelectItem value="in-game-items">Oyun İçi Öğeler</SelectItem>
                        <SelectItem value="equipment">Ekipmanlar</SelectItem>
                        <SelectItem value="digital-games">Dijital Oyunlar</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stock_quantity">Stok Miktarı</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={currentCoupon.stock_quantity || 0}
                      onChange={(e) =>
                        setCurrentCoupon({ ...currentCoupon, stock_quantity: Number.parseInt(e.target.value) || 0 })
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="expires_at">Son Kullanma Tarihi (Opsiyonel)</Label>
                    <Input
                      id="expires_at"
                      type="date"
                      value={
                        currentCoupon.expires_at
                          ? typeof currentCoupon.expires_at === "string"
                            ? currentCoupon.expires_at.split("T")[0]
                            : isValid(new Date(currentCoupon.expires_at))
                              ? format(new Date(currentCoupon.expires_at), "yyyy-MM-dd")
                              : ""
                          : ""
                      }
                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, expires_at: e.target.value || null })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="is_active"
                      checked={currentCoupon.is_active === undefined ? true : currentCoupon.is_active}
                      onCheckedChange={(checked) => setCurrentCoupon({ ...currentCoupon, is_active: !!checked })}
                    />
                    <Label htmlFor="is_active">Aktif Kupon</Label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Kupon Görseli (URL veya Yükleme)</Label>
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    defaultImageUrl={currentCoupon.image_url || ""}
                    title="Kupon Görseli"
                    description="Kupon için bir görsel URL'i girin veya yeni bir görsel yükleyin."
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setActiveTab("coupons")
                  }}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isEditing ? "Güncelle" : "Kaydet"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
