"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ReviewForm } from "@/components/reviews/review-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, FileText, User, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { format } from "date-fns"

interface Review {
  _id: string
  articleId: string
  articleTitle: string
  reviewerName: string
  status: string
  dueDate: string
  acceptedDate?: string
  submittedDate?: string
  isAnonymous: boolean
}

interface Article {
  _id: string
  title: string
  abstract: string
  authors: Array<{
    firstName: string
    lastName: string
    affiliation: string
  }>
  manuscriptFile?: {
    url: string
    filename: string
  }
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const reviewId = params.id as string
  
  const [review, setReview] = useState<Review | null>(null)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchReviewData()
  }, [reviewId])

  const fetchReviewData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive"
        })
        return
      }

      // Fetch review details
      const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!reviewResponse.ok) {
        throw new Error('Failed to fetch review')
      }

      const reviewData = await reviewResponse.json()
      setReview(reviewData)

      // Fetch article details
      const articleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${reviewData.articleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (articleResponse.ok) {
        const articleData = await articleResponse.json()
        setArticle(articleData)
      }

    } catch (error: any) {
      console.error('Error fetching review:', error)
      toast({
        title: "Error",
        description: "Failed to load review details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptReview = async () => {
    setActionLoading('accept')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review-workflow/reviews/${reviewId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to accept review')
      }

      toast({
        title: "Review accepted",
        description: "You have successfully accepted this review assignment"
      })

      fetchReviewData() // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept review",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeclineReview = async () => {
    const reason = prompt("Please provide a reason for declining this review:")
    if (!reason) return

    setActionLoading('decline')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review-workflow/reviews/${reviewId}/decline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        throw new Error('Failed to decline review')
      }

      toast({
        title: "Review declined",
        description: "You have declined this review assignment"
      })

      router.push('/dashboard/reviewer')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to decline review",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleSubmitReview = async (reviewData: any) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review-workflow/reviews/${reviewId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      toast({
        title: "Review submitted",
        description: "Your review has been successfully submitted"
      })

      router.push('/dashboard/reviewer')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading review details...</p>
        </div>
      </div>
    )
  }

  if (!review || !article) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Review not found</h3>
        <p className="text-muted-foreground mb-4">The review you're looking for doesn't exist or you don't have access to it.</p>
        <Button asChild>
          <Link href="/dashboard/reviewer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/reviewer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reviews
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Assignment</h1>
          <p className="text-muted-foreground mt-2">Review details and submission form</p>
        </div>
      </div>

      {/* Review Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Review Status</CardTitle>
            <Badge className={getStatusColor(review.status)}>
              {review.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(review.dueDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            
            {review.acceptedDate && (
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Accepted</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(review.acceptedDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}
            
            {review.submittedDate && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(review.submittedDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons for Pending Reviews */}
          {review.status === 'pending' && (
            <>
              <Separator className="my-4" />
              <div className="flex gap-3">
                <Button 
                  onClick={handleAcceptReview}
                  disabled={actionLoading === 'accept'}
                  className="flex-1"
                >
                  {actionLoading === 'accept' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Accept Review
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDeclineReview}
                  disabled={actionLoading === 'decline'}
                  className="flex-1"
                >
                  {actionLoading === 'decline' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Decline Review
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Article Information */}
      <Card>
        <CardHeader>
          <CardTitle>Article Information</CardTitle>
          <CardDescription>Details about the article you're reviewing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Title</Label>
            <p className="text-sm text-muted-foreground mt-1">{article.title}</p>
          </div>

          <div>
            <Label className="text-base font-medium">Authors</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {article.authors.map(author => 
                `${author.firstName} ${author.lastName} (${author.affiliation})`
              ).join(', ')}
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">Abstract</Label>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {article.abstract}
            </p>
          </div>

          {article.manuscriptFile && (
            <div>
              <Label className="text-base font-medium">Manuscript</Label>
              <div className="mt-2">
                <Button variant="outline" asChild>
                  <a href={article.manuscriptFile.url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Manuscript
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form - Only show if review is in progress */}
      {review.status === 'in_progress' && (
        <ReviewForm
          reviewId={reviewId}
          articleTitle={article.title}
          articleAbstract={article.abstract}
          manuscriptUrl={article.manuscriptFile?.url}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Completed Review Message */}
      {review.status === 'completed' && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Review Completed
            </CardTitle>
            <CardDescription>
              You have successfully submitted your review for this article.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Thank you for your contribution to the peer review process. Your review has been forwarded to the editorial team.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}