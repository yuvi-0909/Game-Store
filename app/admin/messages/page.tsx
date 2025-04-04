"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye, Trash2, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminSidebar from "@/components/admin-sidebar"
import {
  type ContactSubmission,
  adminLogout,
  checkAdminAuth,
  deleteContactSubmission,
  getContactSubmissions,
  initializeDb,
  markContactSubmissionAsRead,
} from "@/lib/db"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize the mock database
    initializeDb()

    // Check if admin is logged in
    if (!checkAdminAuth()) {
      router.push("/admin")
      return
    }

    // Get messages
    loadMessages()
  }, [router])

  const loadMessages = () => {
    const allMessages = getContactSubmissions()
    setMessages(allMessages)
    setLoading(false)
  }

  const handleLogout = () => {
    adminLogout()
    router.push("/admin")
  }

  const handleViewMessage = (message: ContactSubmission) => {
    setSelectedMessage(message)
    setShowMessageDialog(true)

    // Mark as read if not already
    if (!message.isRead) {
      markContactSubmissionAsRead(message.id)
      loadMessages() // Reload to update UI
    }
  }

  const handleDeleteClick = (message: ContactSubmission) => {
    setSelectedMessage(message)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedMessage) {
      deleteContactSubmission(selectedMessage.id)
      loadMessages()
      setShowDeleteDialog(false)
      setSelectedMessage(null)
    }
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <p className="p-8">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar onLogout={handleLogout} />

      <div className="admin-content">
        <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                      No messages found
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((message) => (
                    <tr key={message.id} className={message.isRead ? "" : "font-medium"}>
                      <td className="px-4 py-2">
                        {message.isRead ? (
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-primary" />
                        )}
                      </td>
                      <td className="px-4 py-2">{new Date(message.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{message.name}</td>
                      <td className="px-4 py-2">{message.email}</td>
                      <td className="px-4 py-2">{message.subject}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewMessage(message)}>
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => handleDeleteClick(message)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">From:</p>
                <p>
                  {selectedMessage.name} ({selectedMessage.email})
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date:</p>
                <p>{new Date(selectedMessage.date).toLocaleString()}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Message:</p>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">{selectedMessage.message}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

