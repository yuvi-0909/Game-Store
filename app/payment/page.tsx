"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check, Loader2 } from "lucide-react"
import { type Product, type ProductOption, createOrder, getProductById, initializeDb } from "@/lib/db"
import { useSiteConfig } from "@/components/site-config-provider"

export default function PaymentPage() {
  const { config } = useSiteConfig()
  const searchParams = useSearchParams()
  const router = useRouter()

  const productId = searchParams.get("product")
  const optionId = searchParams.get("option")
  const uid = searchParams.get("uid")
  const method = searchParams.get("method")

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize the mock database
    initializeDb()

    if (!productId || !optionId || !uid || !method) {
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
  }, [productId, optionId, uid, method, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      return
    }

    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setFile(selectedFile)
    setError("")

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload a payment screenshot")
      return
    }

    setIsUploading(true)

    try {
      // In a real app, this would upload the file to a server
      // For this demo, we'll use the data URL as the payment proof

      // Create order
      if (product && selectedOption && uid) {
        createOrder({
          customerName: "Guest User",
          customerEmail: "guest@example.com",
          customerPhone: "",
          productId: product.id,
          productTitle: product.title,
          optionId: selectedOption.id,
          optionName: selectedOption.name,
          price: selectedOption.price,
          uid: uid || "",
          paymentMethod: method || "esewa",
          paymentProof: previewUrl,
        })
      }

      // Redirect to success page
      router.push(`/success?orderId=${Date.now()}`)
    } catch (err) {
      setError("Failed to upload payment proof. Please try again.")
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading payment page...</p>
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
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">Payment Instructions</h2>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 flex flex-col items-center">
              <div className="w-48 h-48 relative mb-4">
                <Image
                  src={config.qrCodeUrl || "/placeholder.svg?height=192&width=192"}
                  alt="Payment QR Code"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="text-center">
                <p className="font-medium">Scan QR Code to Pay</p>
                <p className="text-sm text-muted-foreground">Amount: {selectedOption.price}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Payment Details:</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">Method:</span> {method === "bank-transfer" ? "Bank Transfer" : method}
                </li>
                {method === "bank-transfer" && (
                  <>
                    <li>
                      <span className="font-medium">Bank Name:</span> Nepal Bank Ltd
                    </li>
                    <li>
                      <span className="font-medium">Account Name:</span> Digital Store
                    </li>
                    <li>
                      <span className="font-medium">Account Number:</span> 123456789012345
                    </li>
                  </>
                )}
                {method === "esewa" && (
                  <li>
                    <span className="font-medium">eSewa ID:</span> 9801234567
                  </li>
                )}
                {method === "khalti" && (
                  <li>
                    <span className="font-medium">Khalti ID:</span> 9801234567
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium">Important:</p>
              <p>After making the payment, please upload a screenshot of your payment confirmation below.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
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

              <div className="flex justify-between">
                <span>UID:</span>
                <span>{uid}</span>
              </div>

              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>{method === "bank-transfer" ? "Bank Transfer" : method}</span>
              </div>

              <div className="border-t border-border my-3 pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{selectedOption.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Upload Payment Proof</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Label htmlFor="payment-proof" className="flex flex-col items-center cursor-pointer">
                  {previewUrl ? (
                    <div className="relative w-full h-48 mb-2">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Payment proof preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  )}

                  <span className="text-sm font-medium">
                    {previewUrl ? "Change screenshot" : "Upload payment screenshot"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 5MB.</span>
                </Label>

                <Input id="payment-proof" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button type="submit" className="w-full" disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    {file ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Confirm Payment
                      </>
                    ) : (
                      "Upload Screenshot"
                    )}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

