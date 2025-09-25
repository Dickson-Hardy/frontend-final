"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertCircle, FileText, Calendar, Star, MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"

export default function ReviewerDashboard() {
  const { data: assignedReviewsData, isLoading: assignedLoading, error: assignedError } = useApi('/reviews/assigned')
  const { data: completedReviewsData, isLoading: completedLoading, error: completedError } = useApi('/reviews/completed')
  const { data: statsData, isLoading: statsLoading } = useApi('/reviews/stats')

  // Default values for when data is not available
  const stats = statsData || {
    assignedReviews: 0,
    completedReviews: 0,
    averageRating: 0,
    responseTime: '0 days'
  } as any

  const assignedReviews = Array.isArray(assignedReviewsData) ? assignedReviewsData : []
  const completedReviews = Array.isArray(completedReviewsData) ? completedReviewsData : []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "not_started":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "accept":
        return "bg-green-100 text-green-800"
      case "accept_with_minor_revisions":
        return "bg-blue-100 text-blue-800"
      case "accept_with_major_revisions":
        return "bg-yellow-100 text-yellow-800"
      case "reject":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviewer Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your review assignments and track your review history</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.assignedReviews || 0}</div>
                <p className="text-xs text-muted-foreground">Currently assigned</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.completedReviews || 0}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.averageRating || 0}</div>
                <p className="text-xs text-muted-foreground">Out of 5.0</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.responseTime || 0}</div>
                <p className="text-xs text-muted-foreground">Days average</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assigned" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assigned">Assigned Reviews</TabsTrigger>
          <TabsTrigger value="completed">Completed Reviews</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {assignedLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : assignedError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Error loading assigned reviews</p>
            </div>
          ) : assignedReviews?.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No assigned reviews</p>
            </div>
          ) : (
            assignedReviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{review.title}</h3>
                      <Badge className={getPriorityColor(review.priority)}>
                        {review.priority} priority
                      </Badge>
                      <Badge className={getStatusColor(review.status)}>
                        {review.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Authors:</span>
                        <p>{review.authors}</p>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{review.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Assigned:</span>
                        <p>{new Date(review.assignedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p>{new Date(review.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Review Progress</span>
                        <span className="font-medium">{review.progress}%</span>
                      </div>
                      <Progress value={review.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 text-sm mt-4">
                      <span className="text-muted-foreground">
                        Days remaining: <span className="font-medium text-orange-600">{review.daysRemaining}</span>
                      </span>
                      {review.daysRemaining <= 3 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/reviewer/review/${review.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        Start Review
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <MessageSquare className="h-4 w-4" />
                      Contact Editor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : completedError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Error loading completed reviews</p>
            </div>
          ) : completedReviews?.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No completed reviews</p>
            </div>
          ) : (
            completedReviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{review.title}</h3>
                      <Badge className={getRecommendationColor(review.recommendation)}>
                        {review.recommendation.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Authors:</span>
                        <p>{review.authors}</p>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{review.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Completed:</span>
                        <p>{new Date(review.completedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="ml-1">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <FileText className="h-4 w-4" />
                      View Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
              <CardDescription>Complete history of all your reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Review History</h3>
                <p className="text-muted-foreground">Your complete review history will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}