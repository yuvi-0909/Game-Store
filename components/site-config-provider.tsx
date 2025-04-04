"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface SiteConfig {
  siteName: string
  logoUrl: string
  contactEmail: string
  contactPhone: string
  qrCodeUrl?: string
}

interface SiteConfigContextType {
  config: SiteConfig
  updateConfig: (newConfig: Partial<SiteConfig>) => void
}

const defaultConfig: SiteConfig = {
  siteName: "Digital Store",
  logoUrl: "/placeholder.svg?height=96&width=96",
  contactEmail: "support@digitalstore.com",
  contactPhone: "+1 (123) 456-7890",
  qrCodeUrl: "/placeholder.svg?height=192&width=192",
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: defaultConfig,
  updateConfig: () => {},
})

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)

  // Also update the useEffect hook to properly load images:

  useEffect(() => {
    // Load config from localStorage if available
    const savedConfig = localStorage.getItem("siteConfig")
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)

        // Check if we have stored custom images separately
        if (parsedConfig.logoUrl && parsedConfig.logoUrl.startsWith("custom-logo-")) {
          const storedLogo = localStorage.getItem("siteLogoImage")
          if (storedLogo) {
            parsedConfig.logoUrl = storedLogo
          }
        }

        if (parsedConfig.qrCodeUrl && parsedConfig.qrCodeUrl.startsWith("custom-qr-")) {
          const storedQr = localStorage.getItem("siteQrCodeImage")
          if (storedQr) {
            parsedConfig.qrCodeUrl = storedQr
          }
        }

        setConfig(parsedConfig)
      } catch (error) {
        console.error("Failed to parse site config:", error)
      }
    }
  }, [])

  // Replace the entire updateConfig function with this improved version:

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    try {
      setConfig((prev) => {
        const updated = { ...prev, ...newConfig }

        // Store in localStorage with proper error handling
        try {
          // Convert any data URLs to a more manageable format
          const storableConfig = { ...updated }

          // Don't store full data URLs in localStorage - they're too large
          if (storableConfig.logoUrl && storableConfig.logoUrl.startsWith("data:image")) {
            // Just store a flag that we have a custom logo
            storableConfig.logoUrl = "custom-logo-" + Date.now()
          }

          if (storableConfig.qrCodeUrl && storableConfig.qrCodeUrl.startsWith("data:image")) {
            // Just store a flag that we have a custom QR code
            storableConfig.qrCodeUrl = "custom-qr-" + Date.now()
          }

          // Store the minimal config in localStorage
          localStorage.setItem("siteConfig", JSON.stringify(storableConfig))

          // If we have data URLs, store them separately
          if (updated.logoUrl && updated.logoUrl.startsWith("data:image")) {
            localStorage.setItem("siteLogoImage", updated.logoUrl)
          }

          if (updated.qrCodeUrl && updated.qrCodeUrl.startsWith("data:image")) {
            localStorage.setItem("siteQrCodeImage", updated.qrCodeUrl)
          }
        } catch (error) {
          console.error("Failed to save site config:", error)
          // If storage quota is exceeded, try with minimal data
          const minimalConfig = {
            siteName: updated.siteName,
            contactEmail: updated.contactEmail,
            contactPhone: updated.contactPhone,
          }
          localStorage.setItem("siteConfig", JSON.stringify(minimalConfig))
        }

        return updated
      })
    } catch (error) {
      console.error("Error updating config:", error)
    }
  }

  return <SiteConfigContext.Provider value={{ config, updateConfig }}>{children}</SiteConfigContext.Provider>
}

