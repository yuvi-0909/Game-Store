"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ProductOptionsProps {
  product: Product
}

export default function ProductOptions({ product }: ProductOptionsProps) {
  const [selectedOption, setSelectedOption] = useState("")
  const [uid, setUid] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedOption) {
      setError("Please select an option")
      return
    }

    if (!uid) {
      setError("Please enter your UID")
      return
    }

    // Find the selected option
    const option = product.options?.find((opt) => opt.id === selectedOption)
    if (!option) {
      setError("Invalid option selected")
      return
    }

    // Redirect to checkout with the selected option and UID
    router.push(`/checkout?product=${product.id}&option=${selectedOption}&uid=${uid}`)
  }

  if (!product.options || product.options.length === 0) {
    return <p>No options available for this product.</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="space-y-2">
              {product.options.map((option) => (
                <div key={option.id} className="flex items-center justify-between border border-border p-3 rounded-md">
                  <div className="flex items-center">
                    <RadioGroupItem value={option.id} id={option.id} disabled={!option.inStock} />
                    <Label htmlFor={option.id} className="ml-2">
                      {option.name}
                    </Label>
                  </div>
                  <div className="font-medium">NPR {option.price}</div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="uid">Your UID (Required)</Label>
          <Input
            id="uid"
            placeholder="Enter your game UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="mt-1"
          />
        </div>

        {error && <div className="text-destructive text-sm">{error}</div>}

        <Button type="submit" className="w-full">
          Proceed to Checkout
        </Button>
      </div>
    </form>
  )
}

