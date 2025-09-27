"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Building, Download, Eye, FileText, ExternalLink, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"
import { Article } from "@/lib/api"
import { format } from "date-fns"
import { parseArticleUrl } from "@/lib/url-utils"

export default function ArticleDetailPage() {
  const params = useParams()
  const urlPath = params.slug as string[]
  
  // Debug logging
  console.log('params:', params)
  console.log('urlPath:', urlPath)
  
  // Parse the URL to extract volume and article number
  // For route /vol/1/article002, params.slug = ["1", "article002"]
  // We need to reconstruct it as /vol/1/article002
  const fullPath = `/vol/${urlPath.join('/')}`
  console.log('fullPath:', fullPath)
  const parsedUrl = parseArticleUrl(fullPath)
  console.log('parsedUrl:', parsedUrl)
  
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

  const { volumeNumber, articleNumber } = parsedUrl
  
  // Find article by volume and article number using the new API endpoint
  const { data: finalArticle, isLoading } = useApi<Article>(
    `/articles/volume/${volumeNumber}/article/${articleNumber}`
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article vol{volumeNumber}/article{articleNumber} doesn't exist or has been removed.
            </p>
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

  const handleDownload = () => {
    if (finalArticle.manuscriptFile?.url) {
      window.open(finalArticle.manuscriptFile.url, '_blank')
    }
  }

  const handleViewPDF = () => {
    if (finalArticle.manuscriptFile?.url) {
      window.open(finalArticle.manuscriptFile.url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/articles">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="text-sm">
              Volume {volumeNumber}, Article {articleNumber}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Research Article
            </Badge>
            {finalArticle.doi && (
              <Badge variant="outline" className="text-sm">
                DOI: {finalArticle.doi}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
            {finalArticle.title}
          </h1>

          {/* Authors */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Authors</h2>
            <div className="flex flex-wrap gap-4">
              {finalArticle.authors?.map((author: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{author.firstName} {author.lastName}</span>
                  {author.affiliation && (
                    <>
                      <Building className="w-4 h-4" />
                      <span className="text-sm">{author.affiliation}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Published: {finalArticle.publishedDate ? format(new Date(finalArticle.publishedDate), 'MMMM d, yyyy') : 'Not published'}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Volume: {typeof finalArticle.volume === 'object' ? finalArticle.volume?.volume || volumeNumber : volumeNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{finalArticle.viewCount || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{finalArticle.downloadCount || 0} downloads</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button onClick={handleViewPDF} className="gap-2">
              <FileText className="w-4 h-4" />
              View PDF
            </Button>
            <Button variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            {finalArticle.doi && (
              <Button variant="outline" asChild className="gap-2">
                <a href={`https://doi.org/${finalArticle.doi}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  View on DOI
                </a>
              </Button>
            )}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Abstract */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Abstract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{finalArticle.abstract}</p>
          </CardContent>
        </Card>

        {/* Keywords */}
        {finalArticle.keywords && finalArticle.keywords.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {finalArticle.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Full Article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: finalArticle.content || 'Content not available.' }} />
            </div>
          </CardContent>
        </Card>

        {/* References */}
        {finalArticle.references && finalArticle.references.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>References</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {finalArticle.references.map((reference: string, index: number) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {index + 1}. {reference}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        {(finalArticle.funding || finalArticle.acknowledgments || finalArticle.conflictOfInterest) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {finalArticle.funding && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Funding</h4>
                  <p className="text-sm text-muted-foreground">{finalArticle.funding}</p>
                </div>
              )}
              {finalArticle.acknowledgments && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Acknowledgments</h4>
                  <p className="text-sm text-muted-foreground">{finalArticle.acknowledgments}</p>
                </div>
              )}
              {finalArticle.conflictOfInterest && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Conflict of Interest</h4>
                  <p className="text-sm text-muted-foreground">{finalArticle.conflictOfInterest}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Back to Articles */}
        <div className="text-center pt-8">
          <Link href="/articles">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
