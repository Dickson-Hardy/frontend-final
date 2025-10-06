"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Archive,
  Trash2,
  CornerUpLeft,
  CornerUpRight,
  Send,
  Paperclip,
  Loader2,
  Mail,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Attachment {
  name: string
  size: string
  url?: string
}

interface Message {
  _id: string
  senderId: string
  senderName: string
  senderRole: string
  recipientId: string
  recipientName: string
  recipientRole: string
  subject: string
  body: string
  isRead: boolean
  isArchived: boolean
  attachments: Attachment[]
  relatedArticleId?: string
  relatedArticleTitle?: string
  parentMessageId?: string
  createdAt: string
  updatedAt: string
}

const MessageItem = ({
  message,
  onSelect,
  isSelected,
}: {
  message: Message
  onSelect: (message: Message) => void
  isSelected: boolean
}) => (
  <div
    className={`p-4 border-b cursor-pointer hover:bg-secondary transition-colors ${
      isSelected ? "bg-secondary" : ""
    } ${!message.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
    onClick={() => onSelect(message)}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className={`text-sm ${!message.isRead ? "font-semibold" : ""}`}>
            {message.senderName}
          </p>
          <p className="text-xs text-muted-foreground">{message.senderRole}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground">
          {new Date(message.createdAt).toLocaleDateString()}
        </span>
        {!message.isRead && (
          <Badge variant="default" className="h-5 px-1.5 text-xs">
            New
          </Badge>
        )}
      </div>
    </div>
    <p className={`text-sm truncate ${!message.isRead ? "font-semibold" : ""}`}>
      {message.subject}
    </p>
    {message.relatedArticleTitle && (
      <p className="text-xs text-muted-foreground mt-1 truncate">
        Re: {message.relatedArticleTitle}
      </p>
    )}
  </div>
)

const MessageDetail = ({
  message,
  onReply,
  onArchive,
  onDelete,
}: {
  message: Message | null
  onReply: () => void
  onArchive: () => void
  onDelete: () => void
}) => {
  const [replyText, setReplyText] = useState("")

  if (!message) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
        <Mail className="h-16 w-16 mb-4" />
        <h3 className="text-lg font-semibold">No message selected</h3>
        <p>Select a message from the list to view its content.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{message.senderName}</h2>
              <p className="text-sm text-muted-foreground">{message.senderRole}</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </div>
        <h1 className="text-xl font-bold">{message.subject}</h1>
        {message.relatedArticleTitle && (
          <p className="text-sm text-muted-foreground mt-2">
            Related to: {message.relatedArticleTitle}
          </p>
        )}
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={onReply}>
          <CornerUpLeft className="h-4 w-4" /> Reply
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={onArchive}>
          <Archive className="h-4 w-4" /> Archive
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-red-500 hover:text-red-600"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>

      {/* Body */}
      <div
        className="p-6 overflow-y-auto flex-1"
        dangerouslySetInnerHTML={{ __html: message.body }}
      />

      {/* Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="p-4 border-t">
          <h3 className="font-semibold mb-2">Attachments</h3>
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att, index) => (
              <Badge key={index} variant="secondary" className="p-2 cursor-pointer hover:bg-secondary/80">
                <Paperclip className="h-4 w-4 mr-2" />
                {att.name} ({att.size})
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Reply Box */}
      <div className="p-4 border-t bg-secondary/50">
        <Textarea
          placeholder="Type your reply..."
          className="mb-2 min-h-20"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <div>
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              onReply()
              setReplyText("")
            }}
            disabled={!replyText.trim()}
          >
            Send <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"inbox" | "sent">("inbox")
  const { get, patch, del } = useApiClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [tab])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const data = await get(`/messages?type=${tab}`)
      setMessages(data)
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message)
    
    // Mark as read if not already read
    if (!message.isRead && tab === "inbox") {
      try {
        await patch(`/messages/${message._id}/read`, {})
        setMessages((prev) =>
          prev.map((m) => (m._id === message._id ? { ...m, isRead: true } : m))
        )
      } catch (error) {
        console.error("Failed to mark message as read:", error)
      }
    }
  }

  const handleReply = () => {
    toast({
      title: "Reply feature",
      description: "Reply functionality will be implemented soon.",
    })
  }

  const handleArchive = async () => {
    if (!selectedMessage) return

    try {
      await patch(`/messages/${selectedMessage._id}/archive`, {})
      toast({
        title: "Message archived",
        description: "The message has been archived successfully.",
      })
      setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id))
      setSelectedMessage(null)
    } catch (error) {
      console.error("Failed to archive message:", error)
      toast({
        title: "Error",
        description: "Failed to archive message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedMessage) return

    try {
      await del(`/messages/${selectedMessage._id}`)
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully.",
      })
      setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id))
      setSelectedMessage(null)
    } catch (error) {
      console.error("Failed to delete message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Your communication hub for all submission-related correspondence
          </p>
        </div>
      </div>

      <Card className="h-[75vh] flex flex-col">
        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as "inbox" | "sent")} className="w-full">
          <div className="border-b px-4 pt-4">
            <TabsList>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Message List */}
            <div className="w-1/3 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
                    <Mail className="h-12 w-12 mb-4" />
                    <h3 className="font-semibold mb-2">No messages</h3>
                    <p className="text-sm">
                      {tab === "inbox"
                        ? "You don't have any messages in your inbox."
                        : "You haven't sent any messages yet."}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageItem
                      key={msg._id}
                      message={msg}
                      onSelect={handleSelectMessage}
                      isSelected={selectedMessage?._id === msg._id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Message Detail */}
            <div className="w-2/3">
              <MessageDetail
                message={selectedMessage}
                onReply={handleReply}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
