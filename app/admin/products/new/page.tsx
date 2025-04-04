"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Upload } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import {
  type Category,
  type ProductOption,
  adminLogout,
  checkAdminAuth,
  createProduct,
  getCategories,
  initializeDb,
} from "@/lib/db"

export default function AdminNewProductPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=192&width=256")
  const [categoryId, setCategoryId] = useState("")
  const [inStock, setInStock] = useState(true)
  const [onSale, setOnSale] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [options, setOptions] = useState<ProductOption[]>([
    { id: `opt-${Date.now()}`, name: "", price: 0, inStock: true },
  ])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize the mock database
    initializeDb()

    // Check if admin is logged in
    if (!checkAdminAuth()) {
      router.push("/admin")
      return
    }

    // Get categories
    const allCategories = getCategories()
    setCategories(allCategories)

    if (allCategories.length > 0) {
      setCategoryId(allCategories[0].id)
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleAddOption = () => {
    setOptions([...options, { id: `opt-${Date.now()}`, name: "", price: 0, inStock: true }])
  }

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id))
  }

  const handleOptionChange = (id: string, field: keyof ProductOption, value: any) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, [field]: value } : option)))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // In a real app, this would upload the file to a server
      // For this demo, we'll use a FileReader to create a data URL
      const reader = new FileReader()
      reader.onload = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      setError("Product title is required")
      return
    }

    if (!categoryId) {
      setError("Please select a category")
      return
    }

    if (options.some((option) => !option.name)) {
      setError("All options must have a name")
      return
    }

    // Create product
    try {
      // Check if image is a data URL and it's very large
      let productImage = imageUrl
      if (imageUrl && imageUrl.startsWith("data:image") && imageUrl.length > 200000) {
        setError("Image is too large. Using a placeholder instead. Consider using a smaller image.")
        productImage = "/placeholder.svg?height=192&width=256"
      }

      createProduct({
        title,
        description,
        image: productImage,
        categoryId,
        inStock,
        onSale,
        featured,
        options: options.map((option) => ({
          id: option.id,
          name: option.name,
          price: option.price,
          inStock: option.inStock,
        })),
      })

      // Redirect to products page
      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      if (error instanceof Error) {
        setError(error.message || "Failed to create product. Please try again.")
      } else {
        setError("Failed to create product. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <p className="p-8">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />

      <div className="admin-content">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Product Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={inStock}
                    onCheckedChange={(checked) => setInStock(checked as boolean)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="onSale" checked={onSale} onCheckedChange={(checked) => setOnSale(checked as boolean)} />
                  <Label htmlFor="onSale">On Sale</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(checked as boolean)}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Product Image</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32 relative">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Product preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="image"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <p className="text-xs text-muted-foreground mt-1">Recommended size: 800x600 pixels</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Product Options</h2>

              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={option.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <Label htmlFor={`option-name-${index}`}>Option Name</Label>
                    <Input
                      id={`option-name-${index}`}
                      value={option.name}
                      onChange={(e) => handleOptionChange(option.id, "name", e.target.value)}
                      placeholder="e.g. 100 Diamonds"
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <Label htmlFor={`option-price-${index}`}>Price</Label>
                    <Input
                      id={`option-price-${index}`}
                      type="number"
                      value={option.price}
                      onChange={(e) => handleOptionChange(option.id, "price", Number(e.target.value))}
                      min="0"
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center h-full pt-6">
                      <Checkbox
                        id={`option-stock-${index}`}
                        checked={option.inStock}
                        onCheckedChange={(checked) => handleOptionChange(option.id, "inStock", checked as boolean)}
                      />
                      <Label htmlFor={`option-stock-${index}`} className="ml-2">
                        In Stock
                      </Label>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(option.id)}
                      disabled={options.length === 1}
                      className="h-10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>

            <Button type="submit">Create Product</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

