"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Review {
  _id: string
  articleTitle: string
  status: string
  recommendation?: string
  assignedByName: string
  dueDate: string
  submittedDate?: string
  acceptedDate?: string
  declinedDate?: string
  createdAt: string
}

interface ReviewStats {
  total: number
  completed: number
  pending: number
  inProgress: number
  declined: number
  overdue: number
  averageCompletionTime: number
  completionRate: number
}

export default function ReviewHistoryPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const { get } = useApiClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
    fetchStatistics()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await get("/reviews/my-reviews")
      setReviews(data)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load review history.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const data = await get("/reviews/statistics")
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch statistics:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      declined: "bg-red-100 text-red-800",
      overdue: "bg-orange-100 text-orange-800",
    }
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
  }

  const getRecommendationBadge = (recommendation: string) => {
    const styles = {
      accept: "bg-green-100 text-green-800",
      minor_revision: "bg-blue-100 text-blue-800",
      major_revision: "bg-orange-100 text-orange-800",
      reject: "bg-red-100 text-red-800",
    }
    return styles[recommendation as keyof typeof styles] || "bg-gray-100 text-gray-800"
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true
    return review.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review History</h1>
          <p className="text-muted-foreground mt-2">
            Complete history of your review assignments
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold">{stats.completed}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Completion Time</p>
                  <h3 className="text-2xl font-bold">{stats.averageCompletionTime}d</h3>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <h3 className="text-2xl font-bold">{stats.completionRate}%</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reviews..." className="pl-10" />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any reviews matching the selected filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{review.articleTitle}</h3>
                      <Badge className={getStatusBadge(review.status)}>
                        {review.status.replace(/_/g, " ")}
                      </Badge>
                      {review.recommendation && (
                        <Badge className={getRecommendationBadge(review.recommendation)}>
                          {review.recommendation.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Assigned By:</span>
                        <p>{review.assignedByName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p>{new Date(review.dueDate).toLocaleDateString()}</p>
                      </div>
                      {review.submittedDate && (
                        <div>
                          <span className="font-medium">Submitted:</span>
                          <p>{new Date(review.submittedDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Assigned:</span>
                        <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
