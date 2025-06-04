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
import { Loader2, Save, Plus, Trash2, Edit, ImageIcon } from "lucide-react"
import ImageUploader from "./image-uploader"
import { useAdminStore } from "@/lib/stores/admin-store"
import type { AdminPublisher } from "@/lib/types/admin"

const INITIAL_PUBLISHER_STATE: Omit<AdminPublisher, "id" | "created_at" | "updated_at"> = {
  name: "",
  platform: "twitch",
  channel_url: "",
  username: "",
  avatar_url: "",
  is_active: true,
  points_per_minute: 1,
  follower_count: 0,
  description: "",
  category: "",
}

export default function PublisherManager() {
  const {
    publishers,
    isLoading: isListLoading, // Renamed for clarity
    isSubmitting, // New state for form operations
    error: adminError,
    fetchAdminPublishers,
    addPublisher,
    updatePublisher,
    deletePublisher,
  } = useAdminStore()

  const [activeTab, setActiveTab] = useState<string>("publishers")
  const [currentPublisher, setCurrentPublisher] = useState<Partial<AdminPublisher>>(INITIAL_PUBLISHER_STATE)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchAdminPublishers()
  }, [fetchAdminPublishers])

  useEffect(() => {
    if (adminError) {
      toast({
        title: "Hata Oluştu",
        description: adminError,
        variant: "destructive",
      })
    }
  }, [adminError, toast])

  const handleImageSelect = (imageData: { url: string; file?: File }) => {
    setCurrentPublisher((prev) => ({
      ...prev,
      avatar_url: imageData.url,
    }))
    if (imageData.file) {
      console.log("Selected image file:", imageData.file)
    }
  }

  const resetForm = () => {
    setCurrentPublisher(INITIAL_PUBLISHER_STATE)
    setIsEditing(false)
  }

  const handleEditPublisher = (publisher: AdminPublisher) => {
    setCurrentPublisher(publisher)
    setIsEditing(true)
    setActiveTab("edit")
  }

  const handleDeletePublisher = async (id: string) => {
    if (!id) {
      toast({ title: "Hata", description: "Geçersiz yayıncı ID.", variant: "destructive" })
      return
    }
    if (window.confirm("Bu yayıncıyı silmek istediğinizden emin misiniz?")) {
      const success = await deletePublisher(id)
      if (success) {
        toast({
          title: "Başarılı",
          description: "Yayıncı silindi.",
        })
        // fetchAdminPublishers(); // Re-fetch is now handled in the store
      } else {
        // Error toast is handled by the store's error state
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const publisherDataToSubmit: Omit<AdminPublisher, "id" | "created_at" | "updated_at"> = {
      name: currentPublisher.name || "",
      platform: currentPublisher.platform || "twitch",
      channel_url: currentPublisher.channel_url || "",
      username: currentPublisher.username || "",
      avatar_url: currentPublisher.avatar_url || undefined,
      is_active: currentPublisher.is_active === undefined ? true : currentPublisher.is_active,
      points_per_minute: Number(currentPublisher.points_per_minute) || 1,
      follower_count: Number(currentPublisher.follower_count) || 0,
      description: currentPublisher.description || undefined,
      category: currentPublisher.category || undefined,
    }

    if (!publisherDataToSubmit.name || !publisherDataToSubmit.username || !publisherDataToSubmit.channel_url) {
      toast({
        title: "Hata",
        description: "Yayıncı adı, kullanıcı adı ve kanal URL'si zorunludur.",
        variant: "destructive",
      })
      return
    }

    let success = false
    if (isEditing && currentPublisher.id) {
      const result = await updatePublisher(currentPublisher.id, publisherDataToSubmit)
      if (result) success = true
    } else {
      const result = await addPublisher(publisherDataToSubmit)
      if (result) success = true
    }

    if (success) {
      toast({
        title: "Başarılı",
        description: isEditing ? "Yayıncı güncellendi." : "Yeni yayıncı eklendi.",
      })
      resetForm()
      setActiveTab("publishers")
      // fetchAdminPublishers(); // Re-fetch is now handled in the store
    } else {
      // Error toast is handled by the store's error state
    }
  }

  if (isListLoading && publishers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Yayıncılar yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="publishers">Yayıncılar ({publishers.length})</TabsTrigger>
          <TabsTrigger value="edit">{isEditing ? "Yayıncı Düzenle" : "Yeni Yayıncı Ekle"}</TabsTrigger>
        </TabsList>

        <TabsContent value="publishers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Yayıncı Listesi</h2>
            <Button
              onClick={() => {
                resetForm()
                setActiveTab("edit")
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Yayıncı
            </Button>
          </div>

          {publishers.length === 0 && !isListLoading && (
            <p className="text-center text-muted-foreground py-4">Henüz yayıncı bulunmuyor.</p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishers.map((publisher) => (
              <Card key={publisher.id} className="overflow-hidden shadow-lg">
                <div className="relative">
                  <div className="relative aspect-video bg-muted">
                    {publisher.avatar_url ? (
                      <img
                        src={publisher.avatar_url || "/placeholder.svg"}
                        alt={publisher.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg truncate" title={publisher.name}>
                      {publisher.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {publisher.platform} - @{publisher.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate" title={publisher.channel_url || ""}>
                      {publisher.channel_url}
                    </p>
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <span>Takipçi: {publisher.follower_count}</span>
                      <span>Puan/dk: {publisher.points_per_minute}</span>
                    </div>
                    <Badge
                      variant={publisher.is_active ? "default" : "outline"}
                      className={`mt-2 ${publisher.is_active ? "bg-green-600 text-white" : "border-yellow-500 text-yellow-500"}`}
                    >
                      {publisher.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted"
                      onClick={() => handleEditPublisher(publisher)}
                      aria-label="Yayıncıyı düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-red-600/80 text-white backdrop-blur-sm hover:bg-red-700/80"
                      onClick={() => publisher.id && handleDeletePublisher(publisher.id)}
                      disabled={isSubmitting}
                      aria-label="Yayıncıyı sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Yayıncı Düzenle" : "Yeni Yayıncı Ekle"}</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Yayıncı bilgilerini güncelleyin."
                  : "Yeni bir yayıncı eklemek için aşağıdaki formu doldurun."}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Yayıncı Adı</Label>
                    <Input
                      id="name"
                      value={currentPublisher.name || ""}
                      onChange={(e) => setCurrentPublisher({ ...currentPublisher, name: e.target.value })}
                      placeholder="Örn: Ninja"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Platform Kullanıcı Adı</Label>
                    <Input
                      id="username"
                      value={currentPublisher.username || ""}
                      onChange={(e) => setCurrentPublisher({ ...currentPublisher, username: e.target.value })}
                      placeholder="Örn: ninja (Twitch/Kick kullanıcı adı)"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={currentPublisher.platform || "twitch"}
                      onValueChange={(value: "twitch" | "kick") =>
                        setCurrentPublisher({ ...currentPublisher, platform: value })
                      }
                    >
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Platform seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitch">Twitch</SelectItem>
                        <SelectItem value="kick">Kick</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="channel_url">Kanal URL'si</Label>
                    <Input
                      id="channel_url"
                      type="url"
                      value={currentPublisher.channel_url || ""}
                      onChange={(e) => setCurrentPublisher({ ...currentPublisher, channel_url: e.target.value })}
                      placeholder="https://twitch.tv/kullaniciadi"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="points_per_minute">Dakika Başına Puan</Label>
                    <Input
                      id="points_per_minute"
                      type="number"
                      value={currentPublisher.points_per_minute || 1}
                      onChange={(e) =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          points_per_minute: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="follower_count">Takipçi Sayısı (Opsiyonel)</Label>
                    <Input
                      id="follower_count"
                      type="number"
                      value={currentPublisher.follower_count || 0}
                      onChange={(e) =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          follower_count: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="category">Kategori (Opsiyonel)</Label>
                    <Input
                      id="category"
                      value={currentPublisher.category || ""}
                      onChange={(e) => setCurrentPublisher({ ...currentPublisher, category: e.target.value })}
                      placeholder="Örn: FPS, MOBA, Just Chatting"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                    <Textarea
                      id="description"
                      value={currentPublisher.description || ""}
                      onChange={(e) => setCurrentPublisher({ ...currentPublisher, description: e.target.value })}
                      placeholder="Yayıncı hakkında kısa bilgi"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="is_active_publisher"
                      checked={currentPublisher.is_active === undefined ? true : currentPublisher.is_active}
                      onCheckedChange={(checked) => setCurrentPublisher({ ...currentPublisher, is_active: !!checked })}
                    />
                    <Label htmlFor="is_active_publisher">Aktif Yayıncı</Label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Yayıncı Avatarı (URL veya Yükleme)</Label>
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    defaultImageUrl={currentPublisher.avatar_url || ""}
                    title="Yayıncı Avatarı"
                    description="Yayıncı için bir avatar URL'i girin veya yeni bir görsel yükleyin."
                  />
                </div>

                {(currentPublisher.name || currentPublisher.avatar_url) && (
                  <div className="space-y-2">
                    <Label>Önizleme</Label>
                    <div className="max-w-xs mx-auto border rounded-lg p-4 bg-muted/50">
                      {currentPublisher.avatar_url && (
                        <img
                          src={currentPublisher.avatar_url || "/placeholder.svg"}
                          alt="avatar"
                          className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                        />
                      )}
                      <p className="text-center font-semibold">{currentPublisher.name || "Yayıncı Adı"}</p>
                      <p className="text-center text-sm text-muted-foreground">
                        @{currentPublisher.username || "kullaniciadi"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setActiveTab("publishers")
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
