"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, Download, Calendar, FileText, Quote, Share2, 
  Mail, Twitter, Linkedin, Facebook, Link2, BookmarkPlus,
  Printer, ExternalLink
} from "lucide-react"
import { Article } from "@/lib/api"
import { format } from "date-fns"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface ArticleSidebarProps {
  article: Article
  onCiteClick: () => void
  onDownload: () => void
  onViewPDF: () => void
}

export function ArticleSidebar({ article, onCiteClick, onDownload, onViewPDF }: ArticleSidebarProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = article.title

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl)
    const title = encodeURIComponent(shareTitle)
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${title}&body=Check out this article: ${url}`
    }

    if (platform in urls) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "Article URL copied to clipboard"
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link",
        variant: "destructive"
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Bookmark removed" : "Article bookmarked",
      description: isBookmarked ? "Removed from your reading list" : "Added to your reading list"
    })
  }

  return (
    <div className="space-y-4 sticky top-4">
      {/* Article Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Article Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onViewPDF} className="w-full" size="lg">
            <Eye className="w-4 h-4 mr-2" />
            View Full Article
          </Button>
          
          <Button onClick={onDownload} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          
          <Button onClick={onCiteClick} variant="outline" className="w-full">
            <Quote className="w-4 h-4 mr-2" />
            Cite This Article
          </Button>

          <Separator />

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleBookmark} variant="ghost" size="sm" className="w-full">
              <BookmarkPlus className={`w-4 h-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
              Save
            </Button>
            <Button onClick={handlePrint} variant="ghost" size="sm" className="w-full">
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Article Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>Views</span>
            </div>
            <Badge variant="secondary" className="text-lg font-semibold">
              {article.viewCount?.toLocaleString() || 0}
            </Badge>
          </div>

          {article.manuscriptFile && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="w-4 h-4" />
                <span>Downloads</span>
              </div>
              <Badge variant="secondary" className="text-lg font-semibold">
                {article.downloadCount?.toLocaleString() || 0}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publication Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Publication Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {article.publishedDate && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Published</span>
              </div>
              <p className="ml-6">{format(new Date(article.publishedDate), "MMMM dd, yyyy")}</p>
            </div>
          )}

          {article.submissionDate && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Received</span>
              </div>
              <p className="ml-6">{format(new Date(article.submissionDate), "MMMM dd, yyyy")}</p>
            </div>
          )}

          {article.pages && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Pages</span>
              </div>
              <p className="ml-6">{article.pages}</p>
            </div>
          )}

          {article.doi && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">DOI</span>
              </div>
              <a 
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-6 text-primary hover:underline font-mono text-xs break-all"
              >
                {article.doi}
              </a>
            </div>
          )}

          {article.manuscriptFile && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="w-4 h-4" />
                <span className="font-medium">File Format</span>
              </div>
              <div className="ml-6">
                <Badge variant="outline" className="uppercase">
                  {article.manuscriptFile.format || 'PDF'}
                </Badge>
                {article.manuscriptFile.bytes && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ({(article.manuscriptFile.bytes / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share This Article
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => handleShare('twitter')} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Twitter className="w-4 h-4 mr-1" />
              Twitter
            </Button>
            <Button 
              onClick={() => handleShare('linkedin')} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Linkedin className="w-4 h-4 mr-1" />
              LinkedIn
            </Button>
            <Button 
              onClick={() => handleShare('facebook')} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Facebook className="w-4 h-4 mr-1" />
              Facebook
            </Button>
            <Button 
              onClick={() => handleShare('email')} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
          </div>
          <Button 
            onClick={handleCopyLink} 
            variant="ghost" 
            size="sm"
            className="w-full mt-2"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
