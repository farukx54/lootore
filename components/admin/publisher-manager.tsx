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
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Plus, Trash2, Edit } from "lucide-react"
import ImageUploader from "./image-uploader"
import StreamCard from "../stream-card"

// Define publisher/streamer type
interface Publisher {
  id: string
  name: string
  platform: "twitch" | "kick"
  image: string
  viewerCount: number
  pointMultiplier: number
  streamUrl: string
  isActive: boolean
  isSubscribed?: boolean
}

export default function PublisherManager() {
  // In a real app, this would fetch from an API
  const [publishers, setPublishers] = useState<Publisher[]>([
    {
      id: "pub-1",
      name: "GameMaster",
      platform: "twitch",
      image: "/neon-city-stream.png",
      viewerCount: 12500,
      pointMultiplier: 2,
      streamUrl: "https://twitch.tv/gamemaster",
      isActive: true,
    },
    {
      id: "pub-2",
      name: "ProGamer",
      platform: "kick",
      image: "/intense-fps-action.png",
      viewerCount: 8700,
      pointMultiplier: 1.5,
      streamUrl: "https://kick.com/progamer",
      isActive: true,
    },
    {
      id: "pub-3",
      name: "StreamQueen",
      platform: "twitch",
      image: "/epic-moba-battle.png",
      viewerCount: 15300,
      pointMultiplier: 2.5,
      streamUrl: "https://twitch.tv/streamqueen",
      isActive: true,
    },
  ])

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("publishers")

  const [currentPublisher, setCurrentPublisher] = useState<Publisher>({
    id: "",
    name: "",
    platform: "twitch",
    image: "",
    viewerCount: 0,
    pointMultiplier: 1,
    streamUrl: "",
    isActive: true,
  })

  const { toast } = useToast()

  const handleImageSelect = (imageData: { url: string; file?: File }) => {
    setCurrentPublisher({
      ...currentPublisher,
      image: imageData.url,
    })

    // In a real app, you would upload the file to your server or cloud storage
    // and then update the image URL with the uploaded file URL
    if (imageData.file) {
      console.log("File selected:", imageData.file)
      // uploadImageToServer(imageData.file).then(url => {
      //   setCurrentPublisher(prev => ({ ...prev, image: url }))
      // })
    }
  }

  const resetForm = () => {
    setCurrentPublisher({
      id: "",
      name: "",
      platform: "twitch",
      image: "",
      viewerCount: 0,
      pointMultiplier: 1,
      streamUrl: "",
      isActive: true,
    })
    setIsEditing(false)
  }

  const handleEditPublisher = (publisher: Publisher) => {
    setCurrentPublisher(publisher)
    setIsEditing(true)
    setActiveTab("edit")
  }

  const handleDeletePublisher = (id: string) => {
    // In a real app, you would make an API call to delete the publisher
    setPublishers(publishers.filter((pub) => pub.id !== id))

    toast({
      title: "Başarılı",
      description: "Yayıncı silindi.",
      variant: "default",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!currentPublisher.name.trim()) {
      toast({
        title: "Hata",
        description: "Yayıncı adı boş olamaz.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!currentPublisher.image) {
      toast({
        title: "Hata",
        description: "Lütfen bir görsel seçin.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!currentPublisher.streamUrl) {
      toast({
        title: "Hata",
        description: "Yayın URL'si boş olamaz.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (isEditing) {
        // Update existing publisher
        setPublishers(publishers.map((pub) => (pub.id === currentPublisher.id ? currentPublisher : pub)))

        toast({
          title: "Başarılı",
          description: "Yayıncı güncellendi.",
          variant: "default",
        })
      } else {
        // Add new publisher
        const newPublisher = {
          ...currentPublisher,
          id: `pub-${Date.now()}`, // Generate a unique ID
        }

        setPublishers([...publishers, newPublisher])

        toast({
          title: "Başarılı",
          description: "Yeni yayıncı eklendi.",
          variant: "default",
        })
      }

      resetForm()
      setIsLoading(false)
      setActiveTab("publishers")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="publishers">Yayıncılar</TabsTrigger>
          <TabsTrigger value="edit">{isEditing ? "Düzenle" : "Yeni Ekle"}</TabsTrigger>
        </TabsList>

        <TabsContent value="publishers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Yayıncı Listesi</h2>
            <Button
              onClick={() => {
                resetForm()
                setActiveTab("edit")
              }}
              className="bg-[#9146FF] hover:bg-[#7a38d5]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Yayıncı
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishers.map((publisher) => (
              <Card key={publisher.id} className="overflow-hidden">
                <div className="relative">
                  <StreamCard
                    platform={publisher.platform}
                    image={publisher.image}
                    streamerName={publisher.name}
                    viewerCount={publisher.viewerCount}
                    pointMultiplier={publisher.pointMultiplier}
                    streamUrl={publisher.streamUrl}
                    isSubscribed={false}
                  />

                  <div className="absolute top-2 left-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-gray-900/80 backdrop-blur-sm"
                      onClick={() => handleEditPublisher(publisher)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-red-900/80 backdrop-blur-sm"
                      onClick={() => handleDeletePublisher(publisher.id)}
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Yayıncı Adı</Label>
                    <Input
                      id="name"
                      value={currentPublisher.name}
                      onChange={(e) =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          name: e.target.value,
                        })
                      }
                      placeholder="Yayıncı adı"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={currentPublisher.platform}
                      onValueChange={(value: "twitch" | "kick") =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          platform: value,
                        })
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

                  <div className="space-y-2">
                    <Label htmlFor="viewerCount">İzleyici Sayısı</Label>
                    <Input
                      id="viewerCount"
                      type="number"
                      value={currentPublisher.viewerCount}
                      onChange={(e) =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          viewerCount: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="İzleyici sayısı"
                      min="0"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pointMultiplier">Puan Çarpanı</Label>
                    <Input
                      id="pointMultiplier"
                      type="number"
                      value={currentPublisher.pointMultiplier}
                      onChange={(e) =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          pointMultiplier: Number.parseFloat(e.target.value) || 1,
                        })
                      }
                      placeholder="Puan çarpanı"
                      min="0.1"
                      step="0.1"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="streamUrl">Yayın URL'si</Label>
                    <Input
                      id="streamUrl"
                      value={currentPublisher.streamUrl}
                      onChange={(e) =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          streamUrl: e.target.value,
                        })
                      }
                      placeholder="https://twitch.tv/username veya https://kick.com/username"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Checkbox
                      id="isActive"
                      checked={currentPublisher.isActive}
                      onCheckedChange={(checked) =>
                        setCurrentPublisher({
                          ...currentPublisher,
                          isActive: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="isActive">Aktif</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Yayıncı Görseli</Label>
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    defaultImageUrl={currentPublisher.image}
                    title="Yayıncı Görseli"
                    description="Yayıncı için bir görsel yükleyin veya platform profilinden alın."
                  />
                </div>

                {currentPublisher.image && (
                  <div className="space-y-2">
                    <Label>Önizleme</Label>
                    <div className="max-w-sm mx-auto">
                      <StreamCard
                        platform={currentPublisher.platform}
                        image={currentPublisher.image}
                        streamerName={currentPublisher.name || "Yayıncı Adı"}
                        viewerCount={currentPublisher.viewerCount}
                        pointMultiplier={currentPublisher.pointMultiplier}
                        streamUrl={currentPublisher.streamUrl || "#"}
                        size="sm"
                      />
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
