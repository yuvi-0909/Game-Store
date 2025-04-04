"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, Search, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminSidebar from "@/components/admin-sidebar"
import { type Order, adminLogout, checkAdminAuth, getOrders, initializeDb, updateOrder } from "@/lib/db"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showProofDialog, setShowProofDialog] = useState(false)
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

    // Get orders
    loadOrders()
  }, [router])

  const loadOrders = () => {
    const allOrders = getOrders()
    setOrders(allOrders)
    setLoading(false)
  }

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleViewProof = (order: Order) => {
    setSelectedOrder(order)
    setShowProofDialog(true)
  }

  const handleUpdateStatus = (orderId: string, status: "pending" | "completed" | "cancelled") => {
    updateOrder(orderId, { status })
    loadOrders()

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status,
      })
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">UID</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-4 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-2">{order.id}</td>
                      <td className="px-4 py-2">{order.date}</td>
                      <td className="px-4 py-2">{order.customerName}</td>
                      <td className="px-4 py-2">
                        {order.productTitle} - {order.optionName}
                      </td>
                      <td className="px-4 py-2">{order.price}</td>
                      <td className="px-4 py-2">{order.uid}</td>
                      <td className="px-4 py-2">
                        {order.status === "completed" && (
                          <span className="inline-flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </span>
                        )}
                        {order.status === "pending" && (
                          <span className="inline-flex items-center text-yellow-600">
                            <Clock className="h-4 w-4 mr-1" />
                            Pending
                          </span>
                        )}
                        {order.status === "cancelled" && (
                          <span className="inline-flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          {order.paymentProof && (
                            <Button variant="outline" size="sm" onClick={() => handleViewProof(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          {order.status === "pending" && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, "completed")}>
                              Complete
                            </Button>
                          )}
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

      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
          </DialogHeader>

          {selectedOrder && selectedOrder.paymentProof && (
            <div className="space-y-4">
              <div className="relative w-full h-64">
                <Image
                  src={selectedOrder.paymentProof || "/placeholder.svg"}
                  alt="Payment proof"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Order ID:</span> {selectedOrder.id}
                </p>
                <p>
                  <span className="font-medium">Customer:</span> {selectedOrder.customerName}
                </p>
                <p>
                  <span className="font-medium">Product:</span> {selectedOrder.productTitle} -{" "}
                  {selectedOrder.optionName}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> {selectedOrder.price}
                </p>
                <p>
                  <span className="font-medium">UID:</span> {selectedOrder.uid}
                </p>
              </div>

              {selectedOrder.status === "pending" && (
                <DialogFooter>
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "completed")
                      setShowProofDialog(false)
                    }}
                  >
                    Mark as Completed
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

