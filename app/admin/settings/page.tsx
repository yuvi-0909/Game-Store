"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { adminLogout, checkAdminAuth, getAdminCredentials, initializeDb, adminLogin } from "@/lib/db"
import { useSiteConfig } from "@/components/site-config-provider"

export default function AdminSettingsPage() {
  const { config, updateConfig } = useSiteConfig()
  const [siteName, setSiteName] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("/placeholder.svg?height=192&width=192")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
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

    // Get admin credentials
    const credentials = getAdminCredentials()
    setUsername(credentials.username)

    // Get site config
    setSiteName(config.siteName)
    setLogoUrl(config.logoUrl)
    setContactEmail(config.contactEmail)
    setContactPhone(config.contactPhone)
    setQrCodeUrl(config.qrCodeUrl || "/placeholder.svg?height=192&width=192")

    setLoading(false)
  }, [config, router])

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // In a real app, this would upload the file to a server
      // For this demo, we'll use a FileReader to create a data URL
      const reader = new FileReader()
      reader.onload = () => {
        setLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // In a real app, this would upload the file to a server
      // For this demo, we'll use a FileReader to create a data URL
      const reader = new FileReader()
      reader.onload = () => {
        setQrCodeUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSiteSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!siteName) {
      setError("Site name is required")
      return
    }

    // Update site config
    updateConfig({
      siteName,
      logoUrl,
      contactEmail,
      contactPhone,
      qrCodeUrl,
    })

    setSuccess("Site settings updated successfully")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleAdminSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      setError("Username is required")
      return
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Update admin credentials
    const newPassword = password || getAdminCredentials().password

    // Update the admin login credentials in localStorage
    localStorage.setItem("adminUsername", username)
    localStorage.setItem("adminPassword", newPassword)

    // Also update the login function to use these values
    adminLogout() // Clear current session
    adminLogin(username, newPassword) // Log back in with new credentials

    setSuccess("Admin settings updated successfully")
    setTimeout(() => setSuccess(""), 3000)
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
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Site Settings</h2>

            <form onSubmit={handleSiteSettingsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Enter site name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="w-24 h-24 relative">
                    <Image src={logoUrl || "/placeholder.svg"} alt="Site logo" fill className="object-contain" />
                  </div>

                  <div>
                    <Label
                      htmlFor="logo-upload"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="qrCode">Payment QR Code</Label>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="w-24 h-24 relative">
                    <Image
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="Payment QR code"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="qr-upload"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload QR Code
                    </Label>
                    <Input
                      id="qr-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleQrCodeChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Enter contact phone"
                />
              </div>

              <Button type="submit">Save Site Settings</Button>
            </form>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Admin Settings</h2>

            <form onSubmit={handleAdminSettingsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Admin Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (leave blank to keep current)"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave blank to keep current password</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <Button type="submit">Save Admin Settings</Button>
            </form>
          </div>
        </div>

        {error && <div className="mt-4 p-3 bg-destructive/20 text-destructive rounded-md">{error}</div>}

        {success && <div className="mt-4 p-3 bg-green-500/20 text-green-600 rounded-md">{success}</div>}
      </div>
    </div>
  )
}

