"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Edit, Trash2, FileText, User, Calendar, Eye, Loader2, Download, Upload, Hash, Plus } from "lucide-react"
import { format } from "date-fns"
import { useApi } from "@/hooks/use-api"
import { adminArticleService } from "@/lib/api"
import { ArticleEditDialog } from "@/components/admin/article-edit-dialog"
import { ArticleUpload } from "@/components/admin/article-upload"
import { ArticleNumberAssignment } from "@/components/admin/article-number-assignment"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"

export default function AdminArticlesPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("list")
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Article Management</h1>
          <p className="text-muted-foreground mt-2">Complete article lifecycle management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "upload" ? "default" : "outline"} 
            className="gap-2"
            onClick={() => setActiveTab("upload")}
          >
            <Upload className="h-4 w-4" />
            Upload New
          </Button>
          <Button 
            variant={activeTab === "numbers" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setActiveTab("numbers")}
          >
            <Hash className="h-4 w-4" />
            Article Numbers
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <FileText className="h-4 w-4" />
            All Articles
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New
          </TabsTrigger>
          <TabsTrigger value="numbers" className="gap-2">
            <Hash className="h-4 w-4" />
            Article Numbers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6"

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="search" className="text-sm font-medium">Search Articles</Label>
              <div className="relative mt-1.5">
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
            <div className="w-full md:w-64">
              <Label htmlFor="status-filter" className="text-sm font-medium">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1.5">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Published</CardDescription>
            <CardTitle className="text-2xl">{articlesData?.filter((a: any) => a.status === 'published').length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Under Review</CardDescription>
            <CardTitle className="text-2xl">{articlesData?.filter((a: any) => a.status === 'under_review').length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Submitted</CardDescription>
            <CardTitle className="text-2xl">{articlesData?.filter((a: any) => a.status === 'submitted').length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Revision Needed</CardDescription>
            <CardTitle className="text-2xl">{articlesData?.filter((a: any) => a.status === 'revision_requested').length || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Articles</CardTitle>
              <CardDescription>
                Showing {articles.length} of {articlesData?.length || 0} articles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article: any) => (
                <div key={article._id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card">
                  <div className="flex items-start gap-4">
                    {/* Left Section - Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-base font-semibold flex-1 line-clamp-2">{article.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getStatusColor(article.status)}>
                            {article.status?.replace("_", " ")}
                          </Badge>
                          {article.featured && (
                            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.abstract}
                      </p>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground truncate">
                            {Array.isArray(article.authors) && article.authors.length > 0
                              ? article.authors.length === 1
                                ? `${article.authors[0].firstName} ${article.authors[0].lastName}`
                                : `${article.authors[0].firstName} ${article.authors[0].lastName} +${article.authors.length - 1}`
                              : 'No authors'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {article.submissionDate 
                              ? format(new Date(article.submissionDate), 'MMM d, yyyy')
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">
                            #{article.articleNumber || 'Not set'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {article.viewCount || 0} views
                          </span>
                        </div>
                      </div>

                      {/* Files Info */}
                      {(article.manuscriptFile || article.supplementaryFiles?.length > 0) && (
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs">
                          {article.manuscriptFile && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <FileText className="h-3.5 w-3.5" />
                              <span className="uppercase font-medium">{article.manuscriptFile.format || 'PDF'}</span>
                              <span>•</span>
                              <span>{formatFileSize(article.manuscriptFile.bytes)}</span>
                            </div>
                          )}
                          {article.supplementaryFiles?.length > 0 && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Download className="h-3.5 w-3.5" />
                              <span>+{article.supplementaryFiles.length} supplementary</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Section - Actions */}
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <ArticleUpload onUploadComplete={() => {
            refetch()
            toast({ title: "Article uploaded successfully" })
          }} />
        </TabsContent>

        <TabsContent value="numbers" className="space-y-6">
          <ArticleNumberAssignment onClose={() => setActiveTab("list")} />
        </TabsContent>
      </Tabs>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setEditingArticleId(article._id)}
                        className="gap-2 min-w-[90px]"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article._id)}
                        disabled={deletingArticleId === article._id}
                        className="gap-2 min-w-[90px] hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                      >
                        {deletingArticleId === article._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
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
