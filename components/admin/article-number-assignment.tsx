"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, AlertCircle, CheckCircle, FileText, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { useApi } from "@/hooks/use-api"
import { Article, articleService } from "@/lib/api"
import { toast } from "sonner"

interface ArticleNumberAssignmentProps {
  onClose?: () => void
}

export function ArticleNumberAssignment({ onClose }: ArticleNumberAssignmentProps) {
  const [selectedVolume, setSelectedVolume] = useState<string>("")
  const [selectedArticle, setSelectedArticle] = useState<string>("")
  const [articleNumber, setArticleNumber] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch volumes
  const { data: volumes, isLoading: volumesLoading } = useApi<any[]>("/volumes")
  
  // Fetch articles for selected volume
  const { data: articles, isLoading: articlesLoading, refetch: refetchArticles } = useApi<Article[]>(
    selectedVolume ? `/articles/volume/${selectedVolume}` : ""
  )

  // Get current article details
  const currentArticle = articles?.find(article => article._id === selectedArticle)

  // Generate suggested article number
  const generateSuggestedNumber = () => {
    if (!articles) return "001"
    
    const existingNumbers = articles
      .filter(article => article.articleNumber)
      .map(article => {
        const num = article.articleNumber
        return num ? parseInt(num, 10) : 0
      })
      .filter(num => num > 0)
      .sort((a, b) => a - b)
    
    let nextNumber = 1
    for (const num of existingNumbers) {
      if (num === nextNumber) {
        nextNumber++
      } else {
        break
      }
    }
    
    return String(nextNumber).padStart(3, '0')
  }

  const handleVolumeChange = (volumeNumber: string) => {
    setSelectedVolume(volumeNumber)
    setSelectedArticle("")
    setArticleNumber("")
  }

  const handleArticleChange = (articleId: string) => {
    setSelectedArticle(articleId)
    const article = articles?.find(article => article._id === articleId)
    if (article?.articleNumber) {
      setArticleNumber(article.articleNumber)
    } else {
      setArticleNumber(generateSuggestedNumber())
    }
  }

  const handleAssignNumber = async () => {
    if (!selectedArticle || !articleNumber) {
      toast.error("Please select an article and enter an article number")
      return
    }

    // Validate article number format
    if (!/^\d{3}$/.test(articleNumber)) {
      toast.error("Article number must be a 3-digit number (e.g., 001, 015, 042)")
      return
    }

    setIsUpdating(true)
    try {
      await articleService.updateArticleNumber(selectedArticle, articleNumber)
      toast.success(`Article number ${articleNumber} assigned successfully!`)
      
      // Refresh articles list
      refetchArticles()
      
      // Reset form
      setSelectedArticle("")
      setArticleNumber("")
      
      if (onClose) {
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign article number')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGenerateNumber = () => {
    setArticleNumber(generateSuggestedNumber())
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Assign Article Numbers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Volume Selection */}
        <div className="space-y-2">
          <Label htmlFor="volume">Select Volume</Label>
          <Select value={selectedVolume} onValueChange={handleVolumeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a volume" />
            </SelectTrigger>
            <SelectContent>
              {volumesLoading ? (
                <SelectItem value="loading" disabled>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading volumes...
                </SelectItem>
              ) : (
                volumes?.map((volume) => (
                  <SelectItem key={volume._id} value={volume.volume.toString()}>
                    Volume {volume.volume} - {volume.title} ({volume.year})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Article Selection */}
        {selectedVolume && (
          <div className="space-y-2">
            <Label htmlFor="article">Select Article</Label>
            <Select value={selectedArticle} onValueChange={handleArticleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an article" />
              </SelectTrigger>
              <SelectContent>
                {articlesLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading articles...
                  </SelectItem>
                ) : (
                  articles?.map((article) => (
                    <SelectItem key={article._id} value={article._id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{article.title}</span>
                        <div className="flex items-center gap-2 ml-2">
                          {article.articleNumber ? (
                            <Badge variant="secondary" className="text-xs">
                              #{article.articleNumber}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No number
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {article.status}
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Article Details */}
        {currentArticle && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Article Details</h4>
                  <p className="text-sm text-muted-foreground">{currentArticle.title}</p>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>
                      {currentArticle.authors?.map((author: any) => 
                        `${author.firstName} ${author.lastName}`
                      ).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                       {currentArticle.submissionDate ?
                         format(new Date(currentArticle.submissionDate), 'MMMM d, yyyy') :
                         'N/A'}
                      </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={currentArticle.status === 'published' ? 'default' : 'secondary'}>
                    {currentArticle.status}
                  </Badge>
                  {currentArticle.articleNumber && (
                    <Badge variant="outline">
                      Current: #{currentArticle.articleNumber}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Article Number Assignment */}
        {selectedArticle && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="articleNumber">Article Number</Label>
              <div className="flex gap-2">
                <Input
                  id="articleNumber"
                  value={articleNumber}
                  onChange={(e) => setArticleNumber(e.target.value)}
                  placeholder="e.g., 001, 015, 042"
                  maxLength={3}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleGenerateNumber}
                  disabled={!articles}
                >
                  Auto
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a 3-digit number. This will create the URL: /vol{selectedVolume}/article{articleNumber}
              </p>
            </div>

            {/* Preview */}
            {articleNumber && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Preview:</strong> Article will be accessible at{' '}
                  <code className="bg-muted px-1 rounded text-sm">
                    /vol{selectedVolume}/article{articleNumber}
                  </code>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleAssignNumber}
                disabled={!articleNumber || isUpdating}
                className="gap-2"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Assign Number
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedArticle("")
                  setArticleNumber("")
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Instructions:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Select a volume to see all articles in that volume</li>
              <li>Choose an article that needs an article number assigned</li>
              <li>Enter a 3-digit number (001-999) or use the Auto button for the next available number</li>
              <li>Article numbers must be unique within each volume</li>
              <li>This will create SEO-friendly URLs like /vol/1/article001</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
