"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Calendar, FileText, User, Building, Download, Eye, Loader2, BookOpen, Users, Clock, Quote } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"
import { Article } from "@/lib/api"
import { getArticleUrl } from "@/lib/url-utils"
import { CitationModal } from "@/components/citation-modal"

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
  const [sortBy, setSortBy] = useState("date-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [citationModalOpen, setCitationModalOpen] = useState(false)
  const [selectedArticleForCitation, setSelectedArticleForCitation] = useState<Article | null>(null)

  const { data: articlesData, isLoading, error } = useApi<PaginatedArticlesResponse>(`/articles/published?page=${currentPage}&limit=10&search=${searchTerm}&category=${selectedCategory !== 'all' ? selectedCategory : ''}`)
  const { data: categories } = useApi<string[]>('/articles/categories')
  const { data: volumes } = useApi<string[]>('/volumes/titles')

  const articles: Article[] = (articlesData as PaginatedArticlesResponse)?.articles || []
  const totalPages: number = (articlesData as PaginatedArticlesResponse)?.totalPages || 1
  const totalCount: number = (articlesData as PaginatedArticlesResponse)?.totalCount || 0
  const categoriesList: string[] = (categories as string[]) || []
  const volumesList: string[] = (volumes as string[]) || []

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "review articles":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "clinical research":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "public health":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "case studies":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "editorials":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not published'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAuthors = (authors: any[]) => {
    if (!authors || authors.length === 0) return 'Unknown Author'
    return authors.map(author => 
      [author.title, author.firstName, author.lastName].filter(Boolean).join(' ')
    ).join(', ')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Professional Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-2">
            Published Articles
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            Explore our comprehensive collection of peer-reviewed research articles advancing medical science and healthcare innovation
          </p>
          {totalCount > 0 && (
            <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/5 rounded-full">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                {totalCount} articles published
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-6 sm:mb-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Search & Filter Articles
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Find specific articles using our advanced search and filtering options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <Input
                placeholder="Search by title, author, keywords..."
                className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-slate-200 focus:border-primary focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesList.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Volume</label>
                <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                  <SelectTrigger className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base">
                    <SelectValue placeholder="All Volumes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Volumes</SelectItem>
                    {volumesList.map((volume) => (
                      <SelectItem key={volume} value={volume.toLowerCase().replace(" ", "-")}>
                        {volume}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="text-xs sm:text-sm font-medium text-slate-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 sm:h-11 border-slate-200 text-sm sm:text-base">
                    <SelectValue placeholder="Sort by Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                    <SelectItem value="views-desc">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-slate-600">Loading articles...</p>
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6 text-center">
                <div className="text-red-600 mb-2">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Error loading articles</p>
                  <p className="text-sm mt-1">Please try refreshing the page</p>
                </div>
              </CardContent>
            </Card>
          ) : articles.length === 0 ? (
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="pt-6 text-center py-16">
                <FileText className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No articles found</h3>
                <p className="text-slate-600">Try adjusting your search criteria or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any, index: number) => (
                <Card 
                  key={article.id || index} 
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 h-full flex flex-col"
                >
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center justify-between gap-2">
                      {article.category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {Math.ceil((article.abstract?.split(" ").length || 0) / 200)} min read
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors text-balance line-clamp-3">
                      <Link href={getArticleUrl(article)}>
                        {article.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-1 flex flex-col pt-0">
                    <p className="text-muted-foreground text-sm leading-relaxed text-pretty line-clamp-4 flex-1">
                      {article.abstract}
                    </p>

                    {/* Keywords */}
                    {article.keywords && article.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.keywords.slice(0, 3).map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs font-normal bg-slate-50 text-slate-700 border-slate-200">
                            {keyword}
                          </Badge>
                        ))}
                        {article.keywords.length > 3 && (
                          <Badge variant="outline" className="text-xs font-normal bg-slate-50 text-slate-700 border-slate-200">
                            +{article.keywords.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="space-y-3 pt-4 border-t border-border/50 mt-auto">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{formatAuthors(article.authors)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-2" />
                          {formatDate(article.publishDate)}
                        </div>
                        {article.volume?.number && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Vol. {article.volume.number}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.viewCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{article.downloadCount || 0}</span>
                          </div>
                        </div>
                        {article.doi && (
                          <span className="font-mono text-xs truncate max-w-[100px]" title={article.doi}>
                            DOI: {article.doi}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 pt-2">
                        <Link href={getArticleUrl(article)} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => {
                            setSelectedArticleForCitation(article)
                            setCitationModalOpen(true)
                          }}
                        >
                          <Quote className="w-3 h-3 mr-1" />
                          Cite
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1 text-xs bg-primary hover:bg-primary/90"
                          onClick={() => {
                            if (article.manuscriptFile?.url) {
                              window.open(article.manuscriptFile.url, '_blank')
                            }
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-8 sm:mt-12">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-full sm:w-auto gap-2 text-sm"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1 order-first sm:order-none">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button 
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-full sm:w-auto gap-2 text-sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Citation Modal */}
      {selectedArticleForCitation && (
        <CitationModal
          isOpen={citationModalOpen}
          onClose={() => {
            setCitationModalOpen(false)
            setSelectedArticleForCitation(null)
          }}
          article={selectedArticleForCitation}
        />
      )}
    </div>
  )
}
