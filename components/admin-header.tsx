"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="font-bold text-lg">Olla Store Admin</div>

          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

