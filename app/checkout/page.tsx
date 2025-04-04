"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { type Product, type ProductOption, getProductById, initializeDb } from "@/lib/db"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const productId = searchParams.get("product")
  const optionId = searchParams.get("option")

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null)
  const [uid, setUid] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("esewa")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize the mock database
    initializeDb()

    if (!productId || !optionId) {
      router.push("/")
      return
    }

    // Get product by ID
    const foundProduct = getProductById(productId)

    if (!foundProduct) {
      router.push("/")
      return
    }

    // Find the selected option
    const option = foundProduct.options.find((opt) => opt.id === optionId)

    if (!option) {
      router.push("/")
      return
    }

    setProduct(foundProduct)
    setSelectedOption(option)
    setLoading(false)
  }, [productId, optionId, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!uid) {
      setError("Please enter your UID")
      return
    }

    // Redirect to payment page
    router.push(`/payment?product=${productId}&option=${optionId}&uid=${uid}&method=${paymentMethod}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading checkout...</p>
      </div>
    )
  }

  if (!product || !selectedOption) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Invalid product or option</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="uid">Your UID (Required)</Label>
                  <Input
                    id="uid"
                    placeholder="Enter your game UID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 border border-border p-3 rounded-md">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa">eSewa</Label>
                  </div>

                  <div className="flex items-center space-x-2 border border-border p-3 rounded-md">
                    <RadioGroupItem value="khalti" id="khalti" />
                    <Label htmlFor="khalti">Khalti</Label>
                  </div>

                  <div className="flex items-center space-x-2 border border-border p-3 rounded-md">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer">Bank Transfer</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {error && <div className="text-destructive text-sm">{error}</div>}

            <Button type="submit" className="w-full">
              Proceed to Payment
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Product:</span>
                <span>{product.title}</span>
              </div>

              <div className="flex justify-between">
                <span>Option:</span>
                <span>{selectedOption.name}</span>
              </div>

              <div className="border-t border-border my-3 pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{selectedOption.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

