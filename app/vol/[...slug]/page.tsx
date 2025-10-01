"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Building, Download, Eye, FileText, ExternalLink, Loader2, ArrowLeft, Book, Archive } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"
import { Article } from "@/lib/api"
import { format } from "date-fns"
import { parseArticleUrl, getArticleUrl } from "@/lib/url-utils"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import JSZip from "jszip"
import { CitationModal } from "@/components/citation-modal"
import { ArticleSidebar } from "@/components/article/article-sidebar"
import { AuthorCards } from "@/components/article/author-cards"
import { PDFViewer } from "@/components/article/pdf-viewer"
import { RelatedArticles } from "@/components/article/related-articles"
import { ArticleMetaTags, VolumeMetaTags } from "@/components/seo/article-meta-tags"

export default function VolumeOrArticlePage() {
  const params = useParams()
  const urlPath = params.slug as string[]
  const [downloadingZip, setDownloadingZip] = useState(false)
  
  // Debug logging
  console.log('params:', params)
  console.log('urlPath:', urlPath)
  
  // Determine if this is a volume listing or individual article
  const isVolumeListing = urlPath.length === 1 && !urlPath[0].startsWith('article')
  const volumeNumber = parseInt(urlPath[0], 10)
  
  if (isVolumeListing) {
    // Volume listing page
    return <VolumeListingPage volumeNumber={volumeNumber} />
  } else {
    // Individual article page
    const fullPath = `/vol/${urlPath.join('/')}`
    const parsedUrl = parseArticleUrl(fullPath)
    
    if (!parsedUrl) {
      return (
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Article URL</h1>
              <p className="text-muted-foreground mb-6">The article URL format is incorrect.</p>
              <Link href="/articles">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )
    }
    
    return <ArticleDetailPage parsedUrl={parsedUrl} />
  }
}

// Volume listing component
function VolumeListingPage({ volumeNumber }: { volumeNumber: number }) {
  const [downloadingZip, setDownloadingZip] = useState(false)
  
  // Fetch volume details
  const { data: volume, isLoading: volumeLoading } = useApi<any>(`/volumes/number/${volumeNumber}`)
  
  // Fetch articles in this volume - only when we have a valid volume ID
  const { data: articles, isLoading: articlesLoading } = useApi<Article[]>(
    volume?._id ? `/volumes/${volume._id}/articles` : '',
    { enabled: !!volume?._id }
  )
  
  const handleDownloadAllArticles = async () => {
    if (!articles || articles.length === 0) {
      toast({
        title: "No articles available",
        description: "This volume doesn't contain any articles to download.",
        variant: "destructive"
      })
      return
    }

    try {
      setDownloadingZip(true)
      
      // Increment download count for the volume
      if (volume?._id) {
        await api.post(`/volumes/${volume._id}/download`)
      }

      const zip = new JSZip()
      const volumeFolder = zip.folder(`Volume_${volumeNumber}_Articles`)

      // Add each article to the ZIP
      for (const article of articles) {
        const articleContent = {
          title: article.title,
          authors: article.authors?.map((author: any) => 
            `${author.firstName} ${author.lastName}`
          ).join(", ") || "Unknown Authors",
          abstract: article.abstract,
          content: article.content || "Content not available",
          keywords: article.keywords?.join(", ") || "",
          doi: article.doi || "",
          pages: article.pages || "",
          publishDate: article.publishedDate ? format(new Date(article.publishedDate), "MMMM dd, yyyy") : "Not published",
          articleNumber: article.articleNumber || "N/A"
        }

        // Create a formatted text file for each article
        const articleText = `
TITLE: ${articleContent.title}

AUTHORS: ${articleContent.authors}

ARTICLE NUMBER: ${articleContent.articleNumber}

DOI: ${articleContent.doi}

PAGES: ${articleContent.pages}

PUBLISH DATE: ${articleContent.publishDate}

KEYWORDS: ${articleContent.keywords}

ABSTRACT:
${articleContent.abstract}

CONTENT:
${articleContent.content}
        `.trim()

        const fileName = `Article_${article.articleNumber || 'Unknown'}_${article.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.txt`
        volumeFolder?.file(fileName, articleText)
      }

      // Generate and download the ZIP file
      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `Volume_${volumeNumber}_All_Articles.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Download completed",
        description: `All ${articles.length} articles from Volume ${volumeNumber} have been downloaded as a ZIP file.`
      })

    } catch (error) {
      console.error('ZIP download error:', error)
      toast({
        title: "Download failed",
        description: "Unable to create ZIP file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDownloadingZip(false)
    }
  }

  if (volumeLoading || articlesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (!volume) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Volume Not Found</h1>
            <p className="text-muted-foreground mb-6">Volume {volumeNumber} doesn't exist.</p>
            <Link href="/volumes">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Volumes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Structured Data */}
      {volume && articles && (
        <VolumeMetaTags volume={volume} articles={articles} />
      )}
      
      {/* Navigation */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Volume Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="text-sm">
              <Book className="w-4 h-4 mr-1" />
              Volume {volume.volume}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {volume.year}
            </Badge>
            {volume.publishDate && (
              <Badge variant="outline" className="text-sm">
                Published {format(new Date(volume.publishDate), "MMMM yyyy")}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
            {volume.title}
          </h1>
          
          {volume.description && (
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {volume.description}
            </p>
          )}

          {/* Volume Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={handleDownloadAllArticles}
              disabled={downloadingZip || !articles || articles.length === 0}
              size="lg"
            >
              {downloadingZip ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Archive className="w-4 h-4 mr-2" />
              )}
              {downloadingZip ? "Creating ZIP..." : `Download All Articles (${articles?.length || 0})`}
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {articles?.length || 0} articles
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {volume.totalPages} pages
              </div>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {articles && articles.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Articles in this Volume</h2>
            
            <div className="grid gap-6">
              {articles.map((article) => (
                <Card key={article._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Article {article.articleNumber || 'N/A'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Research Article
                          </Badge>
                          {article.featured && (
                            <Badge className="text-xs">Featured</Badge>
                          )}
                        </div>
                        
                        <CardTitle className="text-xl mb-2 leading-tight">
                          <Link 
                            href={getArticleUrl(article)}
                            className="hover:text-primary transition-colors"
                          >
                            {article.title}
                          </Link>
                        </CardTitle>
                        
                        {/* Authors */}
                        {article.authors && article.authors.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {article.authors.map((author: any, index: number) => (
                              <span key={index} className="text-sm text-muted-foreground">
                                {author.firstName} {author.lastName}
                                {index < article.authors.length - 1 && ","}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Abstract */}
                        {article.abstract && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                            {article.abstract}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {article.publishedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(article.publishedDate), "MMM dd, yyyy")}
                          </div>
                        )}
                        {article.pages && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Pages {article.pages}
                          </div>
                        )}
                        {article.doi && (
                          <div className="font-mono">
                            DOI: {article.doi}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={getArticleUrl(article)}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Read
                          </Button>
                        </Link>
                        {article.manuscriptFile?.url && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(article.manuscriptFile?.url, '_blank')}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Articles Yet</h3>
            <p className="text-muted-foreground">This volume doesn't contain any published articles.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Individual article component (REDESIGNED with professional layout)
function ArticleDetailPage({ parsedUrl }: { parsedUrl: { volumeNumber: number; articleNumber: string } }) {
  const { volumeNumber, articleNumber } = parsedUrl
  const [showCitationModal, setShowCitationModal] = useState(false)
  
  // Find article by volume and article number using the new API endpoint
  const { data: finalArticle, isLoading } = useApi<Article>(
    `/articles/volume/${volumeNumber}/article/${articleNumber}`
  )

  // Fetch other articles from the same volume for related articles
  const volumeId = typeof finalArticle?.volume === 'object' ? finalArticle.volume._id : null
  const { data: volumeArticles } = useApi<Article[]>(
    volumeId ? `/volumes/${volumeId}/articles` : ''
  )

  // Filter out current article and get up to 3 related articles
  const relatedArticles = volumeArticles
    ?.filter(article => article._id !== finalArticle?._id)
    .slice(0, 3) || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (!finalArticle) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article vol{volumeNumber}/article{articleNumber} doesn't exist or has been removed.
            </p>
            <Link href={`/vol/${volumeNumber}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Volume {volumeNumber}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDownload = async () => {
    if (finalArticle.manuscriptFile?.secureUrl || finalArticle.manuscriptFile?.url) {
      const downloadUrl = finalArticle.manuscriptFile.secureUrl || finalArticle.manuscriptFile.url
      // Track download
      try {
        await api.post(`/articles/${finalArticle._id}/download`)
      } catch (error) {
        console.error('Failed to track download:', error)
      }
      window.open(downloadUrl, '_blank')
    }
  }

  const handleViewPDF = async () => {
    if (finalArticle.manuscriptFile?.secureUrl || finalArticle.manuscriptFile?.url) {
      const viewUrl = finalArticle.manuscriptFile.secureUrl || finalArticle.manuscriptFile.url
      // Track view
      try {
        await api.post(`/articles/${finalArticle._id}/view`)
      } catch (error) {
        console.error('Failed to track view:', error)
      }
      window.open(viewUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* SEO: Structured Data & Meta Tags */}
      <ArticleMetaTags article={finalArticle} />
      
      {/* Navigation Bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href={`/vol/${volumeNumber}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Volume {volumeNumber}</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Vol. {volumeNumber}</Badge>
              <Badge variant="outline">Article {articleNumber}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Article Header */}
            <div className="space-y-4">
              {/* Type Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="text-sm">
                  {finalArticle.type || 'Research Article'}
                </Badge>
                {finalArticle.featured && (
                  <Badge variant="secondary" className="text-sm">
                    ⭐ Featured
                  </Badge>
                )}
                {finalArticle.status === 'published' && (
                  <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200">
                    Published
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
                {finalArticle.title}
              </h1>
            </div>

            {/* Authors Section */}
            <AuthorCards 
              authors={finalArticle.authors}
            />

            {/* Abstract - Highlighted */}
            {finalArticle.abstract && (
              <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-100 dark:border-amber-900">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    Abstract
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed text-lg">
                    {finalArticle.abstract}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Keywords */}
            {finalArticle.keywords && finalArticle.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {finalArticle.keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDF Viewer - Intelligent Rendering */}
            <PDFViewer 
              fileUrl={finalArticle.manuscriptFile?.secureUrl || finalArticle.manuscriptFile?.url}
              fileName={finalArticle.manuscriptFile?.originalName}
              fileFormat={finalArticle.manuscriptFile?.format}
              fileSize={finalArticle.manuscriptFile?.bytes}
              onDownload={handleDownload}
            />

            {/* Supplementary Files */}
            {finalArticle.supplementaryFiles && finalArticle.supplementaryFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Supplementary Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {finalArticle.supplementaryFiles.map((file: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{file.originalName}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.format?.toUpperCase()} • {(file.bytes / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(file.secureUrl || file.url, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <RelatedArticles 
                articles={relatedArticles}
                title={`More from Volume ${volumeNumber}`}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20 h-fit">
            <ArticleSidebar 
              article={finalArticle}
              onCiteClick={() => setShowCitationModal(true)}
              onDownload={handleDownload}
              onViewPDF={handleViewPDF}
            />
          </div>
        </div>
      </div>

      {/* Citation Modal */}
      {showCitationModal && (
        <CitationModal 
          isOpen={showCitationModal}
          onClose={() => setShowCitationModal(false)}
          article={finalArticle}
        />
      )}
    </div>
  )
}
