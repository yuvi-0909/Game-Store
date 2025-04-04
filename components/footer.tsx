"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSiteConfig } from "./site-config-provider"

export default function Footer() {
  const pathname = usePathname()
  const { config } = useSiteConfig()

  // Don't show footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-secondary py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground">
              {config.siteName} is your one-stop shop for digital goods including game top-ups, gift cards, and more. We
              offer secure payment options and instant delivery.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-primary">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: {config.contactEmail}</li>
              <li>Phone: {config.contactPhone}</li>
              <li>Hours: 24/7 Customer Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

