"use client"

import type React from "react"

import { useState, useRef } from "react"
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Dosya Yükle</TabsTrigger>
            <TabsTrigger value="url">URL Gir</TabsTrigger>
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
