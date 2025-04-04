"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, Search, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminSidebar from "@/components/admin-sidebar"
import { type Product, adminLogout, checkAdminAuth, deleteProduct, getProducts, initializeDb } from "@/lib/db"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
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

    // Get products
    loadProducts()
  }, [router])

  const loadProducts = () => {
    const allProducts = getProducts()
    setProducts(allProducts)
    setLoading(false)
  }

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleDeleteClick = (productId: string) => {
    setDeleteProductId(productId)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (deleteProductId) {
      deleteProduct(deleteProductId)
      loadProducts()
      setShowDeleteDialog(false)
      setDeleteProductId(null)
    }
  }

  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))

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
          <h1 className="text-2xl font-bold">Products</h1>

          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Price Range</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Featured</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-2">
                        <div className="w-12 h-12 relative">
                          <Image
                            src={product.image || "/placeholder.svg?height=48&width=48"}
                            alt={product.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">{product.title}</td>
                      <td className="px-4 py-2">
                        {product.options.length > 0 ? (
                          <>
                            {product.options.reduce(
                              (min, option) => Math.min(min, option.price),
                              Number.POSITIVE_INFINITY,
                            )}
                            {" - "}
                            {product.options.reduce((max, option) => Math.max(max, option.price), 0)}
                          </>
                        ) : (
                          "No options"
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {product.inStock ? (
                          <span className="inline-flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {product.featured ? (
                          <span className="inline-flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-muted-foreground">
                            <XCircle className="h-4 w-4 mr-1" />
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/product/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => handleDeleteClick(product.id)}>
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
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
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

