"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Plus, Trash2, Edit, Calendar, Tag } from "lucide-react"
import ImageUploader from "./image-uploader"
import { format } from "date-fns"

// Define coupon type
interface Coupon {
  id: string
  code: string
  description: string
  image: string
  points: number
  expiryDate: string
  isActive: boolean
  isLimited: boolean
  maxUses?: number
  currentUses?: number
  category?: string
}

export default function CouponManager() {
  // In a real app, this would fetch from an API
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "coupon-1",
      code: "WELCOME500",
      description: "Yeni kullanıcılar için hoş geldin kuponu",
      image: "/digital-gift-explosion.png",
      points: 500,
      expiryDate: "2023-12-31",
      isActive: true,
      isLimited: false,
    },
    {
      id: "coupon-2",
      code: "SUMMER2023",
      description: "Yaz kampanyası özel kuponu",
      image: "/digital-currency-gift.png",
      points: 1000,
      expiryDate: "2023-09-30",
      isActive: true,
      isLimited: true,
      maxUses: 1000,
      currentUses: 450,
      category: "seasonal",
    },
    {
      id: "coupon-3",
      code: "TWITCH100",
      description: "Twitch yayıncılarına özel kupon",
      image: "/steam-gift-card-display.png",
      points: 100,
      expiryDate: "2023-12-31",
      isActive: true,
      isLimited: false,
      category: "platform",
    },
  ])

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("coupons")

  const [currentCoupon, setCurrentCoupon] = useState<Coupon>({
    id: "",
    code: "",
    description: "",
    image: "",
    points: 0,
    expiryDate: format(new Date().setMonth(new Date().getMonth() + 1), "yyyy-MM-dd"),
    isActive: true,
    isLimited: false,
  })

  const { toast } = useToast()

  const handleImageSelect = (imageData: { url: string; file?: File }) => {
    setCurrentCoupon({
      ...currentCoupon,
      image: imageData.url,
    })

    // In a real app, you would upload the file to your server or cloud storage
    if (imageData.file) {
      console.log("File selected:", imageData.file)
      // uploadImageToServer(imageData.file).then(url => {
      //   setCurrentCoupon(prev => ({ ...prev, image: url }))
      // })
    }
  }

  const resetForm = () => {
    setCurrentCoupon({
      id: "",
      code: "",
      description: "",
      image: "",
      points: 0,
      expiryDate: format(new Date().setMonth(new Date().getMonth() + 1), "yyyy-MM-dd"),
      isActive: true,
      isLimited: false,
    })
    setIsEditing(false)
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setCurrentCoupon(coupon)
    setIsEditing(true)
    setActiveTab("edit")
  }

  const handleDeleteCoupon = (id: string) => {
    // In a real app, you would make an API call to delete the coupon
    setCoupons(coupons.filter((coupon) => coupon.id !== id))

    toast({
      title: "Başarılı",
      description: "Kupon silindi.",
      variant: "default",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!currentCoupon.code.trim()) {
      toast({
        title: "Hata",
        description: "Kupon kodu boş olamaz.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!currentCoupon.image) {
      toast({
        title: "Hata",
        description: "Lütfen bir görsel seçin.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (currentCoupon.points <= 0) {
      toast({
        title: "Hata",
        description: "Puan değeri sıfırdan büyük olmalıdır.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (isEditing) {
        // Update existing coupon
        setCoupons(coupons.map((coupon) => (coupon.id === currentCoupon.id ? currentCoupon : coupon)))

        toast({
          title: "Başarılı",
          description: "Kupon güncellendi.",
          variant: "default",
        })
      } else {
        // Add new coupon
        const newCoupon = {
          ...currentCoupon,
          id: `coupon-${Date.now()}`, // Generate a unique ID
        }

        setCoupons([...coupons, newCoupon])

        toast({
          title: "Başarılı",
          description: "Yeni kupon eklendi.",
          variant: "default",
        })
      }

      resetForm()
      setIsLoading(false)
      setActiveTab("coupons")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="coupons">Kuponlar</TabsTrigger>
          <TabsTrigger value="edit">{isEditing ? "Düzenle" : "Yeni Ekle"}</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Kupon Listesi</h2>
            <Button
              onClick={() => {
                resetForm()
                setActiveTab("edit")
              }}
              className="bg-[#9146FF] hover:bg-[#7a38d5]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kupon
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <Card key={coupon.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={coupon.image || "/placeholder.svg"}
                    alt={coupon.code}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  <div className="absolute top-2 left-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-gray-900/80 backdrop-blur-sm"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-red-900/80 backdrop-blur-sm"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-white">{coupon.code}</h3>
                        <span className="text-sm font-medium bg-[#9146FF] text-white px-2 py-0.5 rounded-full">
                          {coupon.points} Puan
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">{coupon.description}</p>

                      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                        </div>

                        {coupon.isLimited && coupon.maxUses && (
                          <div className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>
                              {coupon.currentUses}/{coupon.maxUses}
                            </span>
                          </div>
                        )}
                      </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="code">Kupon Kodu</Label>
                    <Input
                      id="code"
                      value={currentCoupon.code}
                      onChange={(e) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="WELCOME500"
                      className="w-full uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Puan Değeri</Label>
                    <Input
                      id="points"
                      type="number"
                      value={currentCoupon.points}
                      onChange={(e) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          points: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Puan değeri"
                      min="1"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Son Kullanma Tarihi</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={currentCoupon.expiryDate}
                      onChange={(e) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori (İsteğe Bağlı)</Label>
                    <Select
                      value={currentCoupon.category}
                      onValueChange={(value) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          category: value,
                        })
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Genel</SelectItem>
                        <SelectItem value="seasonal">Mevsimsel</SelectItem>
                        <SelectItem value="platform">Platform</SelectItem>
                        <SelectItem value="special">Özel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={currentCoupon.description}
                      onChange={(e) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          description: e.target.value,
                        })
                      }
                      placeholder="Kupon açıklaması"
                      className="w-full"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={currentCoupon.isActive}
                      onCheckedChange={(checked) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          isActive: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="isActive">Aktif</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isLimited"
                      checked={currentCoupon.isLimited}
                      onCheckedChange={(checked) =>
                        setCurrentCoupon({
                          ...currentCoupon,
                          isLimited: checked === true,
                          maxUses: checked === true ? currentCoupon.maxUses || 1000 : undefined,
                          currentUses: checked === true ? currentCoupon.currentUses || 0 : undefined,
                        })
                      }
                    />
                    <Label htmlFor="isLimited">Sınırlı Kullanım</Label>
                  </div>

                  {currentCoupon.isLimited && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="maxUses">Maksimum Kullanım Sayısı</Label>
                      <Input
                        id="maxUses"
                        type="number"
                        value={currentCoupon.maxUses}
                        onChange={(e) =>
                          setCurrentCoupon({
                            ...currentCoupon,
                            maxUses: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Maksimum kullanım sayısı"
                        min="1"
                        className="w-full"
                      />

                      {isEditing && (
                        <div className="mt-2">
                          <Label htmlFor="currentUses">Mevcut Kullanım Sayısı</Label>
                          <Input
                            id="currentUses"
                            type="number"
                            value={currentCoupon.currentUses}
                            onChange={(e) =>
                              setCurrentCoupon({
                                ...currentCoupon,
                                currentUses: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Mevcut kullanım sayısı"
                            min="0"
                            max={currentCoupon.maxUses}
                            className="w-full mt-1"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Kupon Görseli</Label>
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    defaultImageUrl={currentCoupon.image}
                    title="Kupon Görseli"
                    description="Kupon için bir görsel yükleyin."
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
                <Button type="submit" disabled={isLoading} className="bg-[#9146FF] hover:bg-[#7a38d5]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Güncelleniyor..." : "Ekleniyor..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Güncelle" : "Ekle"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
