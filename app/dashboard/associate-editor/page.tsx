"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertCircle, FileText, Users, Calendar, TrendingUp, UserCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"

export default function AssociateEditorDashboard() {
  const { data: assignedSubmissionsData, isLoading: submissionsLoading, error: submissionsError } = useApi('/associate-editor/submissions')
  const { data: reviewerManagementData, isLoading: reviewersLoading, error: reviewersError } = useApi('/associate-editor/reviewers')
  const { data: editorialDecisionsData, isLoading: decisionsLoading, error: decisionsError } = useApi('/associate-editor/decisions')
  const { data: statsData, isLoading: statsLoading } = useApi('/associate-editor/stats')

  // Default values and type safety
  const stats: any = statsData || {
    assignedSubmissions: 0,
    pendingDecisions: 0,
    activeReviewers: 0,
    avgResponseTime: 0
  }

  const assignedSubmissions: any[] = Array.isArray(assignedSubmissionsData) ? assignedSubmissionsData : []
  const reviewerManagement: any[] = Array.isArray(reviewerManagementData) ? reviewerManagementData : []
  const editorialDecisions: any[] = Array.isArray(editorialDecisionsData) ? editorialDecisionsData : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "awaiting_reviewers":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "review_complete":
        return "bg-green-100 text-green-800"
      case "pending_decision":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const getReviewerStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Associate Editor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage assigned submissions and reviewer coordination</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.assignedSubmissions}</div>
                <p className="text-xs text-muted-foreground">Currently assigned</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Decisions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pendingDecisions}</div>
                <p className="text-xs text-muted-foreground">Awaiting decision</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviewers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeReviewers}</div>
                <p className="text-xs text-muted-foreground">Available reviewers</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">Days average</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="submissions">Assigned Submissions</TabsTrigger>
          <TabsTrigger value="reviewers">Reviewer Management</TabsTrigger>
          <TabsTrigger value="decisions">Editorial Decisions</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          {assignedSubmissions.map((submission: any) => (
            <Card key={submission.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{submission.title}</h3>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status.replace("_", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(submission.priority)}>
                        {submission.priority} priority
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Authors:</span>
                        <p>{submission.authors}</p>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{submission.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p>{new Date(submission.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Days Assigned:</span>
                        <p className="text-orange-600 font-medium">{submission.daysAssigned}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Reviewers: <span className="font-medium">{submission.reviewersAssigned}/{submission.reviewersNeeded}</span>
                      </span>
                      {submission.reviewersAssigned < submission.reviewersNeeded && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Need More Reviewers
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/associate-editor/submission/${submission.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        Review
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Users className="h-4 w-4" />
                      Assign Reviewers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviewers" className="space-y-4">
          {reviewerManagement.map((reviewer: any) => (
            <Card key={reviewer.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{reviewer.name}</h3>
                      <Badge className={getReviewerStatusColor(reviewer.status)}>
                        {reviewer.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Email:</span>
                        <p>{reviewer.email}</p>
                      </div>
                      <div>
                        <span className="font-medium">Active Reviews:</span>
                        <p>{reviewer.activeReviews}</p>
                      </div>
                      <div>
                        <span className="font-medium">Avg Rating:</span>
                        <p>{reviewer.averageRating}/5.0</p>
                      </div>
                      <div>
                        <span className="font-medium">Response Time:</span>
                        <p>{reviewer.responseTime}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Expertise:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {reviewer.expertise && Array.isArray(reviewer.expertise) && reviewer.expertise.map((skill: any, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <UserCheck className="h-4 w-4" />
                      Assign Review
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Users className="h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          {editorialDecisions.map((decision: any) => (
            <Card key={decision.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{decision.title}</h3>
                      <Badge className={getStatusColor(decision.status)}>
                        {decision.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Authors:</span>
                        <p>{decision.authors}</p>
                      </div>
                      <div>
                        <span className="font-medium">Reviewers:</span>
                        <p>{decision.reviewerCount} completed</p>
                      </div>
                      <div>
                        <span className="font-medium">Avg Rating:</span>
                        <p>{decision.averageRating}/5.0</p>
                      </div>
                      <div>
                        <span className="font-medium">Decision Due:</span>
                        <p className="text-orange-600 font-medium">
                          {new Date(decision.decisionDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Recommendation: <span className="font-medium">{decision.recommendation.replace("_", " ")}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/associate-editor/decision/${decision.manuscriptId}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        Make Decision
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}