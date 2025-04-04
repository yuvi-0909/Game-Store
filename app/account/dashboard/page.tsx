"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, LogOut } from "lucide-react"

interface UserData {
  name?: string
  email: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")

    if (!userData) {
      router.push("/account")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (err) {
      router.push("/account")
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/account")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Account</h1>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-bold mb-4">Account Information</h2>

          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {user?.name || "N/A"}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
          </div>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">Recent Orders</h2>

              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>

                <Button asChild>
                  <Link href="/">Start Shopping</Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">Profile Settings</h2>

              <p className="text-muted-foreground">Profile settings will be available soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

