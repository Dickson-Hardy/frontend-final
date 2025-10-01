"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Minus, FileText, User, Calendar, Eye, Loader2, Edit } from "lucide-react"
import { format } from "date-fns"
import { useApi, useAssignArticles } from "@/hooks/use-api"
import { volumeService } from "@/lib/api"
import { ArticleEditDialog } from "@/components/admin/article-edit-dialog"

interface ArticleAssignmentProps {
  volumeId: string
  onAssignmentComplete?: () => void
}

export function ArticleAssignment({ volumeId, onAssignmentComplete }: ArticleAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)

  const { data: volumeData, isLoading: volumeLoading } = useApi(`/volumes/${volumeId}`)
  const { data: availableArticlesData, isLoading: articlesLoading } = useApi(`/articles/available-for-volume?volumeId=${volumeId}&search=${searchTerm}&category=${selectedCategory}&status=${selectedStatus}`)
  const { data: assignedArticlesData, isLoading: assignedLoading } = useApi(`/volumes/${volumeId}/articles`)
  const { data: categoriesData } = useApi('/articles/categories')

  const assignArticlesMutation = useAssignArticles()

  // Default values and type safety
  const volume = volumeData || {} as any
  const availableArticles = availableArticlesData?.articles || []
  const assignedArticles = Array.isArray(assignedArticlesData) ? assignedArticlesData : []
  const categories = Array.isArray(categoriesData) ? categoriesData : []

  // Debug logging
  console.log('📝 Available articles:', availableArticles)
  console.log('📝 Assigned articles:', assignedArticles)
  console.log('📝 Assigned articles length:', assignedArticles.length)
  console.log('📝 First assigned article:', assignedArticles[0])
  console.log('📝 Volume data:', volume)

  const handleArticleSelect = (articleId: string, selected: boolean) => {
    if (selected) {
      setSelectedArticles(prev => [...prev, articleId])
    } else {
      setSelectedArticles(prev => prev.filter(id => id !== articleId))
    }
  }

  const handleSelectAll = (articles: any[], selected: boolean) => {
    if (selected) {
      setSelectedArticles(articles.map(article => article._id || article.id))
    } else {
      setSelectedArticles([])
    }
  }

  const handleAssignArticles = async () => {
    if (selectedArticles.length === 0) return

    try {
      console.log('🔄 Assigning articles:', { volumeId, articleIds: selectedArticles })
      await assignArticlesMutation.mutateAsync({ volumeId, articleIds: selectedArticles })
      setSelectedArticles([])
      onAssignmentComplete?.()
    } catch (error: any) {
      console.error('Error assigning articles:', error)
      console.error('Error response:', error.response?.data)
    }
  }

  const handleRemoveArticle = async (articleId: string) => {
    try {
      await volumeService.removeArticle(volumeId, articleId)
      onAssignmentComplete?.()
    } catch (error) {
      console.error('Error removing article:', error)
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Review Articles":
        return "bg-blue-100 text-blue-800"
      case "Clinical Research":
        return "bg-green-100 text-green-800"
      case "Public Health":
        return "bg-purple-100 text-purple-800"
      case "Case Studies":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (volumeLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Volume Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Volume {volume?.volume || 'N/A'} {volume?.issue ? `Issue ${volume.issue}` : ''}
          </CardTitle>
          <CardDescription>{volume?.title || 'No title available'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(volume?.status || 'unknown')}>
                {(volume?.status || 'unknown').replace("_", " ")}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Year:</span>
              <p>{volume?.year || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium">Assigned Articles:</span>
              <p>{assignedArticles.length}</p>
            </div>
            <div>
              <span className="font-medium">Publication Date:</span>
              <p>{volume?.publishDate ? new Date(volume.publishDate).toLocaleDateString() : "TBD"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="assign" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assign">Assign Articles</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles by title, author, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Articles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available Articles</CardTitle>
                  <CardDescription>Select articles to assign to this volume</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(availableArticles, true)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedArticles([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {articlesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : availableArticles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No available articles found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableArticles.map((article: any) => (
                    <div key={article._id || article.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <Checkbox
                        checked={selectedArticles.includes(article._id || article.id)}
                        onCheckedChange={(checked) => handleArticleSelect(article._id || article.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{article.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(article.category)}>
                              {article.category}
                            </Badge>
                            <Badge className={getStatusColor(article.status || 'unknown')}>
                              {(article.status || 'unknown').replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{Array.isArray(article.authors) && article.authors.length > 0 ? article.authors.map((author: any) => [author.title, author.firstName, author.lastName].filter(Boolean).join(' ')).join(', ') : 'Unknown Author'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{article.submissionDate ? format(new Date(article.submissionDate), 'MMMM d, yyyy') : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.viewCount || 0} views</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.abstract}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Actions */}
          {selectedArticles.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedArticles.length} article(s) selected</p>
                    <p className="text-sm text-muted-foreground">Ready to assign to volume</p>
                  </div>
                  <Button onClick={handleAssignArticles} disabled={assignArticlesMutation.isPending}>
                    {assignArticlesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Assign Selected Articles
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Articles</CardTitle>
              <CardDescription>Articles currently assigned to this volume</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : assignedArticles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No articles assigned to this volume yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedArticles.map((article: any) => (
                    <div key={article._id || article.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{article.title || 'Untitled Article'}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(article.category)}>
                              {article.category}
                            </Badge>
                            <Badge className={getStatusColor(article.status || 'unknown')}>
                              {(article.status || 'unknown').replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{Array.isArray(article.authors) && article.authors.length > 0 ? article.authors.map((author: any) => [author.title, author.firstName, author.lastName].filter(Boolean).join(' ')).join(', ') : 'Unknown Author'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted: {article.submissionDate ? format(new Date(article.submissionDate), 'MMMM d, yyyy') : 'N/A'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.abstract || 'No abstract available'}</p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingArticleId(article._id || article.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveArticle(article._id || article.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Article Edit Dialog */}
      {editingArticleId && (
        <ArticleEditDialog
          articleId={editingArticleId}
          open={!!editingArticleId}
          onOpenChange={(open) => !open && setEditingArticleId(null)}
          onSuccess={onAssignmentComplete}
        />
      )}
    </div>
  )
}
