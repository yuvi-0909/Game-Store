"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product, ProductOption } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CheckoutFormProps {
  product: Product
  selectedOption: ProductOption
  uid: string
}

export default function CheckoutForm({ product, selectedOption, uid }: CheckoutFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("esewa")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !phone) {
      setError("Please fill in all required fields")
      return
    }

    // Create order and redirect to payment page
    router.push(`/payment?product=${product.id}&option=${selectedOption.id}&uid=${uid}&method=${paymentMethod}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4">Customer Information</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for your order"
              rows={3}
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
  )
}

