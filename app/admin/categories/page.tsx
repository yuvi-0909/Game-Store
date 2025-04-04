"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminSidebar from "@/components/admin-sidebar"
import { type Category, adminLogout, checkAdminAuth, deleteCategory, getCategories, initializeDb } from "@/lib/db"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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
    loadCategories()
  }, [router])

  const loadCategories = () => {
    const allCategories = getCategories()
    setCategories(allCategories)
    setLoading(false)
  }

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleDeleteClick = (categoryId: string) => {
    setDeleteCategoryId(categoryId)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (deleteCategoryId) {
      deleteCategory(deleteCategoryId)
      loadCategories()
      setShowDeleteDialog(false)
      setDeleteCategoryId(null)
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>

          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Link>
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-4 py-2">{category.name}</td>
                      <td className="px-4 py-2">{category.description}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/categories/edit/${category.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => handleDeleteClick(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

