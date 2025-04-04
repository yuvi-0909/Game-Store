"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check, Loader2 } from "lucide-react"

interface PaymentUploadProps {
  productId: string
  optionId: string
  uid: string
  method: string
  amount: number
}

export default function PaymentUpload({ productId, optionId, uid, method, amount }: PaymentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

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
      // For this demo, we'll simulate a successful upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page
      router.push(`/success?orderId=${Date.now()}`)
    } catch (err) {
      setError("Failed to upload payment proof. Please try again.")
      setIsUploading(false)
    }
  }

  return (
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
  )
}

