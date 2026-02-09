"use client"

import { useState, useEffect } from "react"
import { newsService } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Calendar, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface NewsItem {
  _id: string
  title: string
  content: string
  type: 'announcement' | 'news' | 'update'
  priority: 'low' | 'medium' | 'high'
  publishedDate: Date
  author: string
  featured: boolean
}

export default function AdminNewsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: newsData, isLoading, refetch } = useApi('/news')

  // Check access
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

  const newsItems = Array.isArray(newsData) ? newsData : []

  // Filter news
  const filteredNews = newsItems.filter((news: NewsItem) => {
    const matchesSearch = !searchTerm || 
      news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || news.type === typeFilter
    
    return matchesSearch && matchesType
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return
    
    setDeletingId(id)
    try {
      await newsService.delete(id)
      toast({ title: "News deleted successfully" })
      refetch()
    } catch (error: any) {
      toast({ 
        title: "Failed to delete news",
        description: error.response?.data?.message || error.message,
        variant: "destructive" 
      })
    } finally {
      setDeletingId(null)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-800"
      case "news":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground mt-2">Manage news articles and announcements</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Create News
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search News</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or content..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Filter by Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredNews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No news items found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((news: NewsItem) => (
            <Card key={news._id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold">{news.title}</h3>
                      <Badge className={getTypeColor(news.type)}>
                        {news.type}
                      </Badge>
                      <Badge className={getPriorityColor(news.priority)}>
                        {news.priority}
                      </Badge>
                      {news.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">{news.content}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Author:</span>
                        <p>{news.author}</p>
                      </div>
                      <div>
                        <span className="font-medium">Published:</span>
                        <p>{format(new Date(news.publishedDate), "MMM dd, yyyy")}</p>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>
                        <p className="capitalize">{news.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setEditingNews(news)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(news._id)}
                      disabled={deletingId === news._id}
                    >
                      {deletingId === news._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <NewsFormModal
        isOpen={showCreateModal || !!editingNews}
        onClose={() => {
          setShowCreateModal(false)
          setEditingNews(null)
        }}
        onSuccess={() => {
          setShowCreateModal(false)
          setEditingNews(null)
          refetch()
        }}
        editingNews={editingNews}
        currentUser={user}
      />
    </div>
  )
}

// News Form Modal Component
function NewsFormModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  editingNews,
  currentUser
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingNews: NewsItem | null
  currentUser: any
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "news" as 'announcement' | 'news' | 'update',
    priority: "medium" as 'low' | 'medium' | 'high',
    featured: false
  })

  useEffect(() => {
    if (editingNews) {
      setFormData({
        title: editingNews.title,
        content: editingNews.content,
        type: editingNews.type,
        priority: editingNews.priority,
        featured: editingNews.featured
      })
    } else {
      setFormData({
        title: "",
        content: "",
        type: "news",
        priority: "medium",
        featured: false
      })
    }
  }, [editingNews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newsData = {
        ...formData,
        author: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin',
        publishedDate: new Date()
      }

      if (editingNews) {
        await newsService.update(editingNews._id, newsData)
        toast({ title: "News updated successfully" })
      } else {
        await newsService.create(newsData)
        toast({ title: "News created successfully" })
      }

      onSuccess()
    } catch (error: any) {
      toast({
        title: editingNews ? "Failed to update news" : "Failed to create news",
        description: error.response?.data?.message || error.message,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingNews ? "Edit News" : "Create News"}
          </DialogTitle>
          <DialogDescription>
            {editingNews ? "Update the news item details" : "Add a new news item to the system"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter news title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter news content..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Feature this news item
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingNews ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingNews ? "Update News" : "Create News"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}