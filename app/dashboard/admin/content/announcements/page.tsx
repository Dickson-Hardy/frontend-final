"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Edit, Trash2, Eye, Calendar, AlertCircle, Loader2 } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  content: string
  type: 'general' | 'urgent' | 'maintenance' | 'update'
  status: 'draft' | 'published' | 'archived'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  publishedAt?: string
  expiresAt?: string
  author: string
}

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general" as Announcement['type'],
    priority: "medium" as Announcement['priority'],
    expiresAt: ""
  })

  // Check if user has admin access
  if (!canAccessDashboard(user, 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Mock data - in real app, this would come from API
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "ann-1",
      title: "System Maintenance Scheduled",
      content: "We will be performing scheduled maintenance on our servers this weekend. The system will be unavailable from 2 AM to 6 AM EST on Sunday.",
      type: "maintenance",
      status: "published",
      priority: "high",
      createdAt: "2024-01-15T10:00:00Z",
      publishedAt: "2024-01-15T10:00:00Z",
      expiresAt: "2024-01-22T10:00:00Z",
      author: "System Admin"
    },
    {
      id: "ann-2",
      title: "New Submission Guidelines",
      content: "Please review the updated submission guidelines before submitting your articles. Key changes include new formatting requirements and updated review criteria.",
      type: "update",
      status: "published",
      priority: "medium",
      createdAt: "2024-01-10T14:30:00Z",
      publishedAt: "2024-01-10T14:30:00Z",
      author: "Editorial Team"
    },
    {
      id: "ann-3",
      title: "Holiday Schedule Notice",
      content: "The editorial office will be closed during the holiday period from December 24th to January 2nd. Submissions will be processed after our return.",
      type: "general",
      status: "draft",
      priority: "low",
      createdAt: "2024-01-05T09:00:00Z",
      author: "Admin"
    }
  ])

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'update':
        return 'bg-blue-100 text-blue-800'
      case 'general':
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
    }
  }

  const getStatusColor = (status: Announcement['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-blue-100 text-blue-800'
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)

    try {
      const newAnnouncement: Announcement = {
        id: `ann-${Date.now()}`,
        title: formData.title,
        content: formData.content,
        type: formData.type,
        priority: formData.priority,
        status: 'draft',
        createdAt: new Date().toISOString(),
        author: user ? `${user.firstName} ${user.lastName}` : 'Admin',
        expiresAt: formData.expiresAt || undefined
      }

      setAnnouncements(prev => [newAnnouncement, ...prev])
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        type: "general",
        priority: "medium",
        expiresAt: ""
      })

      toast({
        title: "Announcement Created",
        description: "The announcement has been created successfully."
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handlePublish = (id: string) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id 
          ? { ...ann, status: 'published' as const, publishedAt: new Date().toISOString() }
          : ann
      )
    )
    
    toast({
      title: "Announcement Published",
      description: "The announcement has been published successfully."
    })
  }

  const handleArchive = (id: string) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id 
          ? { ...ann, status: 'archived' as const }
          : ann
      )
    )
    
    toast({
      title: "Announcement Archived",
      description: "The announcement has been archived."
    })
  }

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id))
    
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been deleted."
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          Announcements
        </h1>
        <p className="text-muted-foreground mt-2">Manage system announcements and notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Announcement */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Announcement
            </CardTitle>
            <CardDescription>
              Create a new system announcement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Announcement title..."
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiresAt">Expires At (Optional)</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Announcement content..."
                rows={4}
              />
            </div>

            <Button 
              onClick={handleCreateAnnouncement}
              disabled={isCreating || !formData.title || !formData.content}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Announcement
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
            <CardDescription>
              {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <Badge className={getTypeColor(announcement.type)}>
                          {announcement.type}
                        </Badge>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        <Badge className={getStatusColor(announcement.status)}>
                          {announcement.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created: {new Date(announcement.createdAt).toLocaleDateString()}
                        </div>
                        {announcement.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Published: {new Date(announcement.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                        <div>By: {announcement.author}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {announcement.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handlePublish(announcement.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Publish
                      </Button>
                    )}
                    {announcement.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchive(announcement.id)}
                      >
                        Archive
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(announcement.id)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}

              {announcements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No announcements yet</p>
                  <p className="text-sm">Create your first announcement to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
