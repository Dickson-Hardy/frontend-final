"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Calendar, FileText, User, Building, Download, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"
import { Article } from "@/lib/api"
import { getArticleUrl } from "@/lib/url-utils"

interface PaginatedArticlesResponse {
  articles: Article[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVolume, setSelectedVolume] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: articlesData, isLoading, error } = useApi<PaginatedArticlesResponse>(`/articles?page=${currentPage}&limit=10&search=${searchTerm}&category=${selectedCategory}&volume=${selectedVolume}`)
  const { data: categories } = useApi<string[]>('/articles/categories')
  const { data: volumes } = useApi<string[]>('/volumes/titles')

  const articles: Article[] = (articlesData as PaginatedArticlesResponse)?.articles || []
  const totalPages: number = (articlesData as PaginatedArticlesResponse)?.totalPages || 1
  const categoriesList: string[] = (categories as string[]) || []
  const volumesList: string[] = (volumes as string[]) || []


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
      case "Editorials":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Published Articles</h1>
        <p className="text-muted-foreground mt-2">Browse our collection of peer-reviewed research articles</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles by title, author, or keywords..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesList.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Volumes" />
                </SelectTrigger>
                <SelectContent>
                  {volumesList.map((volume) => (
                    <SelectItem key={volume} value={volume.toLowerCase().replace(" ", "-")}>
                      {volume}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error loading articles</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No articles found</p>
          </div>
        ) : (
          articles.map((article: any) => (
            <Card key={article.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Article Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-foreground">{article.title}</h2>
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{article.authors?.map((author: any) => `${author.firstName} ${author.lastName}`).join(', ') || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{article.publishDate ? new Date(article.publishDate).toLocaleDateString() : 'Not published'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{article.volume?.number || 'No volume'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Abstract */}
                  <div>
                    <h3 className="font-medium mb-2">Abstract</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{article.abstract}</p>
                  </div>

                  {/* Keywords */}
                  {article.keywords && article.keywords.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Keywords</h3>
                      <div className="flex flex-wrap gap-1">
                        {article.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article Stats */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.viewCount || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{article.downloadCount || 0} downloads</span>
                      </div>
                      {article.doi && (
                        <div>
                          <span>DOI: {article.doi}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={getArticleUrl(article)}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Article
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          if (article.manuscriptFile?.url) {
                            window.open(article.manuscriptFile.url, '_blank')
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          )
        })}
        <Button 
          variant="outline" 
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
