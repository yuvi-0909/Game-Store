"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-sm text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Order Successful!</h1>

        <p className="text-muted-foreground mb-6">
          Your order has been received and is being processed. We will deliver your purchase as soon as your payment is
          confirmed.
        </p>

        <div className="bg-muted p-4 rounded-md mb-6">
          <p className="font-medium">Order ID: {orderId || "N/A"}</p>
          <p className="text-sm text-muted-foreground">Please save this order ID for future reference.</p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

