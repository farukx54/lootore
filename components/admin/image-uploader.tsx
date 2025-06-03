"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Upload, LinkIcon, AlertCircle, X, Check } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  onImageSelect: (imageData: { url: string; file?: File }) => void
  defaultImageUrl?: string
  title?: string
  description?: string
  allowedTypes?: string[]
  maxSizeMB?: number
}

export default function ImageUploader({
  onImageSelect,
  defaultImageUrl = "",
  title = "Görsel Yükle",
  description = "Yüklemek istediğiniz görseli seçin veya bir URL girin.",
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [selectedTab, setSelectedTab] = useState<string>("upload")
  const [imageUrl, setImageUrl] = useState<string>(defaultImageUrl)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [platformUsername, setPlatformUsername] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxSizeBytes = maxSizeMB * 1024 * 1024 // Convert MB to bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Desteklenmeyen dosya türü. Lütfen ${allowedTypes.join(", ")} formatında bir dosya seçin.`)
      return
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`Dosya boyutu çok büyük. Maksimum ${maxSizeMB}MB yükleyebilirsiniz.`)
      return
    }

    setError(null)
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
    onImageSelect({ url: URL.createObjectURL(file), file })
    setSuccess(true)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      setError("Lütfen bir URL girin.")
      return
    }

    setIsLoading(true)
    setError(null)

    // Check if the URL is valid by trying to load the image
    const img = new Image()
    img.onload = () => {
      setIsLoading(false)
      onImageSelect({ url: imageUrl })
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }
    img.onerror = () => {
      setIsLoading(false)
      setError("Geçersiz görsel URL'si. Lütfen doğru bir URL girdiğinizden emin olun.")
    }
    img.src = imageUrl
  }

  const fetchPlatformImage = useCallback(
    async (platform: "twitch" | "kick") => {
      if (!platformUsername) {
        setError(`Lütfen bir ${platform === "twitch" ? "Twitch" : "Kick"} kullanıcı adı girin.`)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // In a real implementation, you would make an API call to fetch the profile image
        // For this example, we'll simulate the API call with a timeout

        // This is a placeholder. In a real app, you would call your backend API
        // which would then use the Twitch/Kick API to get the profile image
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate different profile images based on platform
        const mockImageUrl =
          platform === "twitch"
            ? `https://static-cdn.jtvnw.net/jtv_user_pictures/placeholder-profile_image-${platformUsername.toLowerCase()}.png`
            : `https://kick-profile-images.s3.amazonaws.com/${platformUsername.toLowerCase()}.png`

        // In a real app, you would use the actual URL returned from the API
        setImageUrl(mockImageUrl)
        onImageSelect({ url: mockImageUrl })
        setSuccess(true)

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } catch (err) {
        setError(
          `${platform === "twitch" ? "Twitch" : "Kick"} profil resmi alınamadı. Lütfen kullanıcı adını kontrol edin.`,
        )
      } finally {
        setIsLoading(false)
      }
    },
    [platformUsername, onImageSelect],
  )

  const clearImage = () => {
    setImageUrl("")
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Dosya Yükle</TabsTrigger>
            <TabsTrigger value="url">URL Gir</TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image-upload">Görsel Seç</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept={allowedTypes.join(",")}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 w-10"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Maksimum dosya boyutu: {maxSizeMB}MB. Desteklenen formatlar:{" "}
                {allowedTypes.map((type) => type.split("/")[1]).join(", ")}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="image-url">Görsel URL'si</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="flex-1"
                />
                <Button onClick={handleUrlSubmit} disabled={isLoading} className="bg-[#9146FF] hover:bg-[#7a38d5]">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4 mr-2" />}
                  {isLoading ? "Yükleniyor..." : "Ekle"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="platform" className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div>
                <Label htmlFor="platform-username">Platform Kullanıcı Adı</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    id="platform-username"
                    placeholder="örn: pokimane"
                    value={platformUsername}
                    onChange={(e) => setPlatformUsername(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => fetchPlatformImage("twitch")}
                  disabled={isLoading || !platformUsername}
                  className="flex-1 bg-[#9146FF] hover:bg-[#7a38d5]"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Twitch Profil Resmi Al
                </Button>
                <Button
                  onClick={() => fetchPlatformImage("kick")}
                  disabled={isLoading || !platformUsername}
                  className="flex-1 bg-[#00FF00] hover:bg-[#00cc00] text-black"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kick Profil Resmi Al
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 border-green-500 text-green-500">
            <Check className="h-4 w-4" />
            <AlertTitle>Başarılı</AlertTitle>
            <AlertDescription>Görsel başarıyla eklendi.</AlertDescription>
          </Alert>
        )}

        {imageUrl && (
          <div className="mt-4 relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Seçilen görsel"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
