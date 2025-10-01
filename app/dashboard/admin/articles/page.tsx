"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, FileText, User, Calendar, Eye, Loader2, Download } from "lucide-react"
import { format } from "date-fns"
import { useApi } from "@/hooks/use-api"
import { adminArticleService } from "@/lib/api"
import { ArticleEditDialog } from "@/components/admin/article-edit-dialog"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"

export default function AdminArticlesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null)

  const { data: articlesData, isLoading, refetch } = useApi("/admin/articles")

  // Check access
  if (!canAccessDashboard(user, 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Filter articles
  const articles = articlesData?.filter((article: any) => {
    const matchesSearch = !searchTerm || 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.keywords?.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article? This will also delete all associated files.')) return
    
    setDeletingArticleId(articleId)
    try {
      await adminArticleService.delete(articleId)
      toast({ title: "Article deleted successfully" })
      refetch()
    } catch (error: any) {
      toast({ 
        title: "Failed to delete article",
        description: error.response?.data?.message || error.message,
        variant: "destructive" 
      })
    } finally {
      setDeletingArticleId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "revision_requested":
        return "bg-orange-100 text-orange-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "N/A"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Article Management</h1>
        <p className="text-muted-foreground mt-2">View and edit all articles in the system</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Articles</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, abstract, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="revision_requested">Revision Requested</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Articles</CardDescription>
            <CardTitle className="text-3xl">{articlesData?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-3xl">
              {articlesData?.filter((a: any) => a.status === 'published').length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-3xl">
              {articlesData?.filter((a: any) => a.status === 'under_review').length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Submitted</CardDescription>
            <CardTitle className="text-3xl">
              {articlesData?.filter((a: any) => a.status === 'submitted').length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>
            Showing {articles.length} of {articlesData?.length || 0} articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No articles found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article: any) => (
                <div key={article._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{article.title}</h3>
                        <Badge className={getStatusColor(article.status)}>
                          {article.status?.replace("_", " ")}
                        </Badge>
                        {article.featured && (
                          <Badge variant="outline" className="bg-yellow-50">Featured</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.abstract}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Authors:</span>
                          <p className="text-foreground">
                            {Array.isArray(article.authors) && article.authors.length > 0
                              ? article.authors.map((a: any) => `${a.firstName} ${a.lastName}`).join(', ')
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Submitted:</span>
                          <p className="text-foreground">
                            {article.submissionDate 
                              ? format(new Date(article.submissionDate), 'MMM d, yyyy')
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Article #:</span>
                          <p className="text-foreground">{article.articleNumber || 'Not set'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Views:</span>
                          <p className="text-foreground">{article.viewCount || 0}</p>
                        </div>
                      </div>

                      {/* File Info */}
                      {article.manuscriptFile && (
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Manuscript:</span>
                            <Badge variant="outline" className="uppercase">
                              {article.manuscriptFile.format || 'Unknown'}
                            </Badge>
                            <span className="text-muted-foreground">
                              {formatFileSize(article.manuscriptFile.bytes)}
                            </span>
                          </div>
                          {article.supplementaryFiles?.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                + {article.supplementaryFiles.length} supplementary file(s)
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingArticleId(article._id)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article._id)}
                        disabled={deletingArticleId === article._id}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        {deletingArticleId === article._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingArticleId && (
        <ArticleEditDialog
          articleId={editingArticleId}
          open={!!editingArticleId}
          onOpenChange={(open) => !open && setEditingArticleId(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}
