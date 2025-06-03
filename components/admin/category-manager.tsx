"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define a category type
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  displayOrder: number
}

export default function CategoryManager() {
  // In a real app, this would fetch from an API
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "Tüm Ödüller", slug: "all", isActive: true, displayOrder: 0 },
    { id: "limited-time", name: "Sınırlı Süre", slug: "limited-time", isActive: true, displayOrder: 1 },
    { id: "game-codes", name: "Oyun Kodları", slug: "game-codes", isActive: true, displayOrder: 2 },
    { id: "subscriptions", name: "Abonelikler", slug: "subscriptions", isActive: true, displayOrder: 3 },
    { id: "gift-cards", name: "Hediye Kartları", slug: "gift-cards", isActive: true, displayOrder: 4 },
    { id: "in-game-items", name: "Oyun İçi Öğeler", slug: "in-game-items", isActive: true, displayOrder: 5 },
    { id: "equipment", name: "Ekipmanlar", slug: "equipment", isActive: true, displayOrder: 6 },
    { id: "digital-games", name: "Dijital Oyunlar", slug: "digital-games", isActive: true, displayOrder: 7 },
  ])

  const [newCategory, setNewCategory] = useState<Omit<Category, "id" | "displayOrder">>({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  })

  const { toast } = useToast()

  // Function to generate a slug from a name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  }

  // Function to handle name change and auto-generate slug
  const handleNameChange = (name: string) => {
    setNewCategory({
      ...newCategory,
      name,
      slug: generateSlug(name),
    })
  }

  // Function to add a new category
  const addCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Hata",
        description: "Kategori adı boş olamaz.",
        variant: "destructive",
      })
      return
    }

    // Check if slug already exists
    if (categories.some((cat) => cat.slug === newCategory.slug)) {
      toast({
        title: "Hata",
        description: "Bu slug zaten kullanılıyor. Lütfen farklı bir kategori adı girin.",
        variant: "destructive",
      })
      return
    }

    // Generate a unique ID (in a real app, this would be handled by the backend)
    const newId = `cat-${Date.now()}`

    // Add the new category
    const updatedCategories = [
      ...categories,
      {
        ...newCategory,
        id: newId,
        displayOrder: categories.length,
      },
    ]

    setCategories(updatedCategories)

    // Reset the form
    setNewCategory({
      name: "",
      slug: "",
      description: "",
      isActive: true,
    })

    // Show success message
    toast({
      title: "Başarılı",
      description: "Yeni kategori eklendi.",
      variant: "default",
    })

    // In a real app, this would make an API call to save the changes
    console.log("Categories updated:", updatedCategories)
  }

  // Function to toggle category active state
  const toggleCategoryActive = (id: string) => {
    const updatedCategories = categories.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat))
    setCategories(updatedCategories)

    // In a real app, this would make an API call to save the changes
    console.log("Categories updated:", updatedCategories)
  }

  // Function to delete a category
  const deleteCategory = (id: string) => {
    // Don't allow deleting "all" category
    if (id === "all") {
      toast({
        title: "Hata",
        description: "'Tüm Ödüller' kategorisi silinemez.",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = categories.filter((cat) => cat.id !== id)

    // Update display order
    const reorderedCategories = updatedCategories.map((cat, index) => ({
      ...cat,
      displayOrder: index,
    }))

    setCategories(reorderedCategories)

    // Show success message
    toast({
      title: "Başarılı",
      description: "Kategori silindi.",
      variant: "default",
    })

    // In a real app, this would make an API call to save the changes
    console.log("Categories updated:", reorderedCategories)
  }

  // Function to handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update display order
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index,
    }))

    setCategories(updatedItems)

    // In a real app, this would make an API call to save the changes
    console.log("Categories reordered:", updatedItems)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kategori Yönetimi</CardTitle>
          <CardDescription>
            Ödül kategorilerini ekleyin, düzenleyin veya silin. Kategoriler, kullanıcıların ödülleri filtrelemesine
            yardımcı olur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Kategori Adı
                </label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Örn: Oyun Kodları"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="slug" className="text-sm font-medium text-gray-300">
                  Slug (URL)
                </label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="Örn: oyun-kodlari"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Otomatik oluşturulur. Özel bir slug kullanmak isterseniz değiştirebilirsiniz.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-300">
                Açıklama (İsteğe bağlı)
              </label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Kategori hakkında kısa bir açıklama"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={newCategory.isActive}
                onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked === true })}
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aktif
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addCategory} className="bg-[#9146FF] hover:bg-[#7a38d5]">
            <Plus className="mr-2 h-4 w-4" />
            Kategori Ekle
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Kategoriler</CardTitle>
          <CardDescription>
            Kategorileri sürükleyip bırakarak sıralayabilir, aktif/pasif durumunu değiştirebilir veya silebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {categories.map((category, index) => (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between rounded-md border p-3 ${
                            category.isActive ? "border-gray-700 bg-gray-800" : "border-gray-800 bg-gray-900 opacity-60"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div {...provided.dragHandleProps} className="cursor-move text-gray-500">
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{category.name}</p>
                              <p className="text-xs text-gray-400">Slug: {category.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`active-${category.id}`}
                              checked={category.isActive}
                              onCheckedChange={() => toggleCategoryActive(category.id)}
                              disabled={category.id === "all"} // Don't allow disabling "all" category
                            />
                            <label htmlFor={`active-${category.id}`} className="text-sm text-gray-400">
                              Aktif
                            </label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                              disabled={category.id === "all"} // Don't allow deleting "all" category
                              className="text-red-500 hover:bg-red-900/20 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  )
}
