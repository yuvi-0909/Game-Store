"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Star } from "lucide-react"
import { type Product, getProductById, initializeDb } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedOption, setSelectedOption] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize the mock database
    initializeDb()

    // Get product by ID
    const foundProduct = getProductById(params.id)
    setProduct(foundProduct)
    setLoading(false)
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedOption) {
      setError("Please select an option")
      return
    }

    // Redirect to checkout with the selected option
    router.push(`/checkout?product=${product?.id}&option=${selectedOption}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Product not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-80 md:h-96 bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=384&width=384"}
            alt={product.title}
            fill
            className="object-cover"
          />
          {product.onSale && <span className="sale-badge">Sale!</span>}
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

          <div className="flex items-center mb-4">
            <div className="product-rating mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400" : "fill-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">4.0 rating</span>
          </div>

          <p className="text-lg font-medium mb-4">
            {product.options.length > 0 && (
              <>
                {product.options.reduce((min, option) => Math.min(min, option.price), Number.POSITIVE_INFINITY)}
                {" - "}
                {product.options.reduce((max, option) => Math.max(max, option.price), 0)}
              </>
            )}
          </p>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Select Option</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  <div className="space-y-2">
                    {product.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between border border-border p-3 rounded-md"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value={option.id} id={option.id} disabled={!option.inStock} />
                          <Label htmlFor={option.id} className="ml-2">
                            {option.name}
                          </Label>
                        </div>
                        <div className="font-medium">{option.price}</div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Product Description</h2>
        <div className="prose max-w-none">
          <p>{product.description}</p>
          <ul className="list-disc pl-5 mt-4">
            <li>Instant delivery after payment confirmation</li>
            <li>100% secure transaction</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

