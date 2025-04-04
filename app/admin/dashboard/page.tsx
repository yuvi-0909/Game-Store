"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, Tag, CheckCircle, Clock, Settings, Trash2 } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import {
  adminLogout,
  checkAdminAuth,
  clearStorageData,
  getCategories,
  getOrders,
  getProducts,
  initializeDb,
} from "@/lib/db"

export default function AdminDashboardPage() {
  const [products, setProducts] = useState(0)
  const [categories, setCategories] = useState(0)
  const [orders, setOrders] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [completedOrders, setCompletedOrders] = useState(0)
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

    // Get counts
    const allProducts = getProducts()
    const allCategories = getCategories()
    const allOrders = getOrders()

    setProducts(allProducts.length)
    setCategories(allCategories.length)
    setOrders(allOrders.length)
    setPendingOrders(allOrders.filter((order) => order.status === "pending").length)
    setCompletedOrders(allOrders.filter((order) => order.status === "completed").length)

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This will remove all products, orders, and categories but keep your admin login.",
      )
    ) {
      const success = clearStorageData(true)
      if (success) {
        // Reload data
        const allProducts = getProducts()
        const allCategories = getCategories()
        const allOrders = getOrders()

        setProducts(allProducts.length)
        setCategories(allCategories.length)
        setOrders(allOrders.length)
        setPendingOrders(allOrders.filter((order) => order.status === "pending").length)
        setCompletedOrders(allOrders.filter((order) => order.status === "completed").length)

        alert("Data cleared successfully!")
      } else {
        alert("Failed to clear data. Please try again.")
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
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow-sm flex items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Products</h3>
              <p className="text-3xl font-bold">{products}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm flex items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Categories</h3>
              <p className="text-3xl font-bold">{categories}</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm flex items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Orders</h3>
              <p className="text-3xl font-bold">{orders}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Status</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Pending Orders</h3>
                    <span>{pendingOrders}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${orders > 0 ? (pendingOrders / orders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Completed Orders</h3>
                    <span>{completedOrders}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${orders > 0 ? (completedOrders / orders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
                onClick={() => router.push("/admin/products/new")}
              >
                <Package className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">Add Product</span>
              </button>

              <button
                className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
                onClick={() => router.push("/admin/categories/new")}
              >
                <Tag className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">Add Category</span>
              </button>

              <button
                className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
                onClick={() => router.push("/admin/orders")}
              >
                <ShoppingCart className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">View Orders</span>
              </button>

              <button
                className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
                onClick={() => router.push("/admin/settings")}
              >
                <Settings className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">Settings</span>
              </button>

              <button
                className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
                onClick={handleClearData}
              >
                <Trash2 className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">Clear Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

