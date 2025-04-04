"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AdminSidebar from "@/components/admin-sidebar"
import { type Category, adminLogout, checkAdminAuth, getCategoryById, initializeDb, updateCategory } from "@/lib/db"

export default function AdminEditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const [category, setCategory] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
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

    // Get category by ID
    const foundCategory = getCategoryById(params.id)

    if (!foundCategory) {
      router.push("/admin/categories")
      return
    }

    setCategory(foundCategory)
    setName(foundCategory.name)
    setDescription(foundCategory.description)

    setLoading(false)
  }, [params.id, router])

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      setError("Category name is required")
      return
    }

    if (!category) {
      return
    }

    // Update category
    updateCategory(category.id, {
      name,
      description,
    })

    // Redirect to categories page
    router.push("/admin/categories")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <p className="p-8">Loading...</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <p className="p-8">Category not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />

      <div className="admin-content">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Category Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter category description"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
              Cancel
            </Button>

            <Button type="submit">Update Category</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

