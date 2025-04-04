"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSiteConfig } from "./site-config-provider"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { config } = useSiteConfig()

  // Don't show header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <header className="bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <div className="w-24 h-24 bg-muted relative">
              <Image src={config.logoUrl || "/placeholder.svg"} alt={config.siteName} fill className="object-contain" />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`${pathname === "/" ? "text-primary" : ""}`}>
              Home
            </Link>
            <Link href="/account" className={`${pathname === "/account" ? "text-primary" : ""}`}>
              My account
            </Link>
            <Link href="/contact" className={`${pathname === "/contact" ? "text-primary" : ""}`}>
              Contact Us
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 space-y-4 bg-secondary">
          <Link href="/" className="block py-2">
            Home
          </Link>
          <Link href="/account" className="block py-2">
            My account
          </Link>
          <Link href="/contact" className="block py-2">
            Contact Us
          </Link>
        </div>
      )}
    </header>
  )
}

