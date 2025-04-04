"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tag, ShoppingCart, Settings, LogOut, MessageSquare } from "lucide-react"

interface AdminSidebarProps {
  onLogout: () => void
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="admin-sidebar">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="p-4">
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className={`admin-nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>

          <Link href="/admin/products" className={`admin-nav-link ${isActive("/admin/products") ? "active" : ""}`}>
            <Package className="h-4 w-4 mr-2" />
            Products
          </Link>

          <Link href="/admin/categories" className={`admin-nav-link ${isActive("/admin/categories") ? "active" : ""}`}>
            <Tag className="h-4 w-4 mr-2" />
            Categories
          </Link>

          <Link href="/admin/orders" className={`admin-nav-link ${isActive("/admin/orders") ? "active" : ""}`}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </Link>

          <Link href="/admin/messages" className={`admin-nav-link ${isActive("/admin/messages") ? "active" : ""}`}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Link>

          <Link href="/admin/settings" className={`admin-nav-link ${isActive("/admin/settings") ? "active" : ""}`}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <button className="admin-nav-link w-full justify-center text-destructive" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  )
}

