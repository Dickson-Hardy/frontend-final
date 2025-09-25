"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertCircle, FileText, Users, Calendar, TrendingUp, Crown, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"

export default function EditorInChiefDashboard() {
  const { data: pendingDecisionsData, isLoading: decisionsLoading, error: decisionsError } = useApi('/editor-in-chief/decisions')
  const { data: journalMetricsData, isLoading: metricsLoading } = useApi('/editor-in-chief/metrics')
  const { data: editorialBoardData, isLoading: boardLoading } = useApi('/editor-in-chief/board')

  // Default values for when data is not available
  const metrics = journalMetricsData || {
    monthlySubmissions: 0,
    submissionChange: '+0',
    acceptanceRate: '0%',
    acceptanceChange: '+0%',
    averageReviewTime: '0 days',
    reviewTimeChange: '+0 days',
    totalArticles: 0,
    articlesChange: '+0'
  } as any

  const pendingDecisions = Array.isArray(pendingDecisionsData) ? pendingDecisionsData : []
  const journalMetrics = Array.isArray(journalMetricsData) ? journalMetricsData : []
  const editorialBoard = Array.isArray(editorialBoardData) ? editorialBoardData : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "awaiting_final_decision":
        return "bg-orange-100 text-orange-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "decision_made":
        return "bg-green-100 text-green-800"
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
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Crown className="h-8 w-8 text-yellow-600" />
          Editor-in-Chief Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Oversee journal operations and make final editorial decisions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Decisions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {decisionsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{pendingDecisions.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting final decision</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Editorial Board</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {boardLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{editorialBoard.length}</div>
                <p className="text-xs text-muted-foreground">Active members</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics?.monthlySubmissions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={(metrics?.submissionChange || '+0').startsWith('+') ? "text-green-600" : "text-red-600"}>
                    {metrics?.submissionChange || '+0'}
                  </span> from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics?.acceptanceRate || '0%'}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={(metrics?.acceptanceChange || '+0%').startsWith('+') ? "text-green-600" : "text-red-600"}>
                    {metrics?.acceptanceChange || '+0%'}
                  </span> from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="decisions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="decisions">Final Decisions</TabsTrigger>
          <TabsTrigger value="metrics">Journal Metrics</TabsTrigger>
          <TabsTrigger value="board">Editorial Board</TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="space-y-4">
          {pendingDecisions.map((decision: any) => (
            <Card key={decision.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{decision.title}</h3>
                      <Badge className={getStatusColor(decision.status)}>
                        {decision.status.replace("_", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(decision.priority)}>
                        {decision.priority} priority
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Authors:</span>
                        <p>{decision.authors}</p>
                      </div>
                      <div>
                        <span className="font-medium">Associate Editor:</span>
                        <p>{decision.associateEditor}</p>
                      </div>
                      <div>
                        <span className="font-medium">Reviewers:</span>
                        <p>{decision.reviewerCount} completed</p>
                      </div>
                      <div>
                        <span className="font-medium">Avg Rating:</span>
                        <p>{decision.averageRating}/5.0</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className="text-muted-foreground">
                        Recommendation: <span className="font-medium">{decision.recommendation.replace("_", " ")}</span>
                      </span>
                      <Badge className={getRecommendationColor(decision.recommendation)}>
                        {decision.recommendation.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Days Pending: <span className="font-medium text-orange-600">{decision.daysPending}</span>
                      </span>
                      {decision.daysPending >= 3 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/editor-in-chief/decision/${decision.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        Review & Decide
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journalMetrics.map((metric: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{metric.value}</div>
                    <div className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {metric.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Journal Performance Trends
              </CardTitle>
              <CardDescription>Monthly performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Performance Charts</h3>
                <p className="text-muted-foreground">Detailed performance charts and analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board" className="space-y-4">
          {editorialBoard.map((member: any) => (
            <Card key={member.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <Badge variant="outline">{member.role}</Badge>
                      <Badge className="bg-green-100 text-green-800">{member.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Active Submissions:</span>
                        <p>{member.activeSubmissions}</p>
                      </div>
                      <div>
                        <span className="font-medium">Avg Decision Time:</span>
                        <p>{member.averageDecisionTime}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Expertise:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.expertise && Array.isArray(member.expertise) && member.expertise.map((skill: any, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Users className="h-4 w-4" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <BarChart3 className="h-4 w-4" />
                      Performance
                    </Button>
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