"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"
import { useSiteConfig } from "@/components/site-config-provider"

// Dummy function to simulate storing contact submission
const createContactSubmission = async (data: any) => {
  // In a real application, you would send this data to your backend
  console.log("Contact submission data:", data)
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
}

export default function ContactPage() {
  const { config } = useSiteConfig()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Update the handleSubmit function to store the contact submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !subject || !message) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Store the contact submission
      await createContactSubmission({
        name,
        email,
        subject,
        message,
      })

      // Simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Get in Touch</h2>

            <p className="text-muted-foreground mb-6">
              Have questions or need assistance? Fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Email</h3>
                <p className="text-muted-foreground">{config.contactEmail}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Phone</h3>
                <p className="text-muted-foreground">{config.contactPhone}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Hours</h3>
                <p className="text-muted-foreground">24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-lg font-bold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground mb-4">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>

                <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    rows={5}
                    required
                  />
                </div>

                {error && <div className="text-destructive text-sm">{error}</div>}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

