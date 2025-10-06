"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Loader2,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Notification {
  _id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  relatedArticleId?: string
  relatedArticleTitle?: string
  relatedMessageId?: string
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "submission_received":
    case "revision_submitted":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "review_assigned":
    case "review_submitted":
      return <FileText className="h-5 w-5 text-purple-500" />
    case "decision_made":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "revision_requested":
      return <AlertCircle className="h-5 w-5 text-orange-500" />
    case "accepted":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "published":
      return <CheckCircle className="h-5 w-5 text-indigo-500" />
    case "message_received":
      return <MessageSquare className="h-5 w-5 text-blue-500" />
    case "deadline_approaching":
      return <Clock className="h-5 w-5 text-amber-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}) => {
  const content = (
    <Card className={`mb-3 ${!notification.isRead ? "border-l-4 border-l-blue-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`font-semibold ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                {notification.title}
              </h3>
              <div className="flex items-center gap-2">
                {!notification.isRead && (
                  <Badge variant="default" className="h-5 px-2 text-xs">
                    New
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className={`text-sm mb-2 ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
              {notification.message}
            </p>
            {notification.relatedArticleTitle && (
              <p className="text-xs text-muted-foreground italic mb-2">
                Re: {notification.relatedArticleTitle}
              </p>
            )}
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.preventDefault()
                    onMarkAsRead(notification._id)
                  }}
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(notification._id)
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (notification.actionUrl) {
    return <Link href={notification.actionUrl}>{content}</Link>
  }

  return content
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"all" | "unread">("all")
  const { get, patch, del, post } = useApiClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [tab])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const unreadOnly = tab === "unread" ? "?unreadOnly=true" : ""
      const data = await get(`/notifications${unreadOnly}`)
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await patch(`/notifications/${id}/read`, {})
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
      toast({
        title: "Marked as read",
        description: "Notification marked as read.",
      })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await post("/notifications/mark-all-read", {})
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast({
        title: "All marked as read",
        description: "All notifications marked as read.",
      })
    } catch (error) {
      console.error("Failed to mark all as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await del(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      toast({
        title: "Deleted",
        description: "Notification deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification.",
        variant: "destructive",
      })
    }
  }

  const handleClearAll = async () => {
    try {
      await del("/notifications")
      setNotifications([])
      toast({
        title: "Cleared",
        description: "All notifications cleared successfully.",
      })
    } catch (error) {
      console.error("Failed to clear notifications:", error)
      toast({
        title: "Error",
        description: "Failed to clear notifications.",
        variant: "destructive",
      })
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with your manuscript submissions and reviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={handleClearAll} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread")} className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All Notifications
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BellOff className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {tab === "unread"
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
