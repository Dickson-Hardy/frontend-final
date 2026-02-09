"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Book, Calendar, FileText, ArrowRight, Download, Eye, Loader2 } from "lucide-react"
import { useCurrentVolume, useRecentVolumes } from "@/hooks/use-api"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function CurrentVolume() {
  const { data: currentVolume, isLoading: currentLoading, error: currentError } = useCurrentVolume()
  const { data: recentVolumes, isLoading: recentLoading, error: recentError } = useRecentVolumes(3)
  const router = useRouter()
  const [downloadingVolume, setDownloadingVolume] = useState<string | null>(null)

  // Handle navigation to volume articles
  const handleViewArticles = (volumeId: string, volumeNumber: number) => {
    router.push(`/vol/${volumeNumber}`)
  }

  // Handle volume download
  const handleDownloadVolume = async (volumeId: string, volumeTitle: string) => {
    try {
      setDownloadingVolume(volumeId)
      
      // Increment download count
      await api.post(`/volumes/${volumeId}/download`)
      
      // Get all articles in the volume
      const response = await api.get(`/volumes/${volumeId}/articles`)
      const articles = response.data
      
      if (!articles || articles.length === 0) {
        toast({
          title: "No articles available",
          description: "This volume doesn't contain any articles to download.",
          variant: "destructive"
        })
        return
      }

      // Create a downloadable content with all articles
      const volumeContent = {
        title: volumeTitle,
        articles: articles.map((article: any) => ({
          title: article.title,
          authors: article.authors?.map((author: any) => 
            `${author.firstName} ${author.lastName}`
          ).join(", ") || "Unknown Authors",
          abstract: article.abstract,
          content: article.content || "Content not available",
          keywords: article.keywords?.join(", ") || "",
          doi: article.doi || "",
          pages: article.pages || ""
        }))
      }

      // Create and download a JSON file with all articles
      const dataStr = JSON.stringify(volumeContent, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${volumeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_articles.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Download started",
        description: `All articles from "${volumeTitle}" are being downloaded.`
      })

    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download failed",
        description: "Unable to download the volume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDownloadingVolume(null)
    }
  }

  if (currentLoading || recentLoading) {
    return (
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-32 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-10 w-3/4 max-w-lg mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          
          {/* Current Volume Skeleton */}
          <div className="mb-16 border rounded-lg overflow-hidden shadow-lg bg-card">
            <div className="grid lg:grid-cols-3 gap-0">
              <div className="lg:col-span-1 p-8 flex items-center justify-center bg-muted/20">
                <Skeleton className="w-full max-w-xs aspect-[3/4] rounded-lg" />
              </div>
              <div className="lg:col-span-2 p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-40" />
                  <Skeleton className="h-12 w-48" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Volumes Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4 bg-card">
                <Skeleton className="w-full aspect-[3/4] rounded" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (currentError) {
    return (
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-destructive">Unable to load volume information at this time.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // If no current volume, show a message instead of crashing
  if (!currentVolume) {
    return (
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Book className="w-4 h-4 mr-2" />
              Current Issue
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">Latest Journal Volume</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              No published volumes are currently available. Check back soon for our latest publications.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Book className="w-4 h-4 mr-2" />
            Current Issue
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">Latest Journal Volume</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore our most recent publication featuring groundbreaking research and clinical insights from leading
            medical professionals.
          </p>
        </div>

        {/* Current Volume Feature */}
        <Card className="mb-16 overflow-hidden border-primary/20 shadow-lg">
          <div className="grid lg:grid-cols-3 gap-0">
            {/* Cover Image */}
            <div className="lg:col-span-1 bg-gradient-to-br from-primary/10 to-accent/10 p-8 flex items-center justify-center">
              <div className="relative">
                <img
                  src={currentVolume.coverImage || "/placeholder.svg?height=400&width=300&query=medical journal cover"}
                  alt={`Volume ${currentVolume.volume} Cover`}
                  className="w-full max-w-xs rounded-lg shadow-xl border border-border"
                />
                <Badge className="absolute -top-2 -right-2 bg-primary">Featured</Badge>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline" className="text-sm">
                    Volume {currentVolume.volume}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {currentVolume.year}
                  </Badge>
                </div>
                <CardTitle className="text-2xl lg:text-3xl text-balance mb-4">{currentVolume.title}</CardTitle>
                <p className="text-muted-foreground leading-relaxed text-pretty">{currentVolume.description}</p>
              </CardHeader>

              <CardContent className="p-0 space-y-6">
                {/* Volume Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg border border-border/50">
                    <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">{currentVolume.totalArticles}</div>
                    <div className="text-xs text-muted-foreground">Articles</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border border-border/50">
                    <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">{currentVolume.publishDate ? format(new Date(currentVolume.publishDate), "MMM yyyy") : 'TBD'}</div>
                    <div className="text-xs text-muted-foreground">Published</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border border-border/50">
                    <Book className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">{currentVolume.totalPages}</div>
                    <div className="text-xs text-muted-foreground">Pages</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border border-border/50">
                    <div className="w-6 h-6 text-primary mx-auto mb-2 text-sm font-bold">DOI</div>
                    <div className="text-xs font-mono truncate">
                      10.1234/amhsj.{currentVolume.year}.{currentVolume.volume}
                    </div>
                    <div className="text-xs text-muted-foreground">Identifier</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="group"
                    onClick={() => handleViewArticles(currentVolume._id, currentVolume.volume)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Articles
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => handleDownloadVolume(currentVolume._id, currentVolume.title)}
                    disabled={downloadingVolume === currentVolume._id}
                  >
                    {downloadingVolume === currentVolume._id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {downloadingVolume === currentVolume._id ? "Downloading..." : "Download All Articles"}
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Recent Volumes Grid */}
        {recentVolumes && recentVolumes.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Recent Volumes</h3>
              <p className="text-muted-foreground">Browse our latest publications and archived issues</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVolumes.map((volume) => (
                <Card
                  key={volume._id}
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-secondary/20 to-accent/10 p-4 flex items-center justify-center">
                    <img
                      src={volume.coverImage || "/placeholder.svg?height=400&width=300&query=medical journal cover"}
                      alt={`Volume ${volume.volume} Cover`}
                      className="w-full h-full object-cover rounded border border-border/50 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Vol {volume.volume}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {volume.year}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors text-balance">
                      {volume.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {volume.totalArticles} articles
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {volume.publishDate ? format(new Date(volume.publishDate), "MMM yyyy") : 'TBD'}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground truncate">
                      DOI: 10.1234/amhsj.{volume.year}.{volume.volume}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 group/btn"
                        onClick={() => handleViewArticles(volume._id, volume.volume)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadVolume(volume._id, volume.title)}
                        disabled={downloadingVolume === volume._id}
                      >
                        {downloadingVolume === volume._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/volumes')}
              >
                Browse All Volumes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
