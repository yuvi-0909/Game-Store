"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import { adminLogin, checkAdminAuth, getAdminCredentials, initializeDb } from "@/lib/db"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize the mock database
    initializeDb()

    // Check if admin is already logged in
    if (checkAdminAuth()) {
      router.push("/admin/dashboard")
    }

    // Get admin credentials
    const credentials = getAdminCredentials()
    setUsername(credentials.username)
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    setError("")

    // Check if credentials match
    const success = adminLogin(username, password)

    if (success) {
      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } else {
      setError("Invalid username or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Default credentials: admin / admin</p>
          </div>
        </form>
      </div>
    </div>
  )
}

