"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertCircle, FileText, Users, Calendar, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"

export default function EditorialDashboard() {
  const { data: editorialQueue, isLoading: queueLoading, error: queueError } = useApi('/editorial/queue')
  const { data: qualityIssues, isLoading: issuesLoading, error: issuesError } = useApi('/editorial/quality-issues')
  const { data: stats, isLoading: statsLoading } = useApi('/editorial/stats')

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initial_review":
        return "bg-blue-100 text-blue-800"
      case "quality_check":
        return "bg-yellow-100 text-yellow-800"
      case "formatting_review":
        return "bg-purple-100 text-purple-800"
      case "completed":
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Editorial Queue</h1>
        <p className="text-muted-foreground mt-2">Manage manuscript processing and quality control</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Queue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.inQueue || 0}</div>
                <p className="text-xs text-muted-foreground">Manuscripts pending</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.qualityIssues || 0}</div>
                <p className="text-xs text-muted-foreground">Pending resolution</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.completedToday || 0}</div>
                <p className="text-xs text-muted-foreground">Manuscripts processed</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.avgProcessingTime || 0}</div>
                <p className="text-xs text-muted-foreground">Days average</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="queue">Editorial Queue</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="assignments">Editor Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          {queueLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : queueError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Error loading editorial queue</p>
            </div>
          ) : editorialQueue?.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No manuscripts in queue</p>
            </div>
          ) : (
            editorialQueue?.map((manuscript: any) => (
              <Card key={manuscript.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{manuscript.title}</h3>
                        <Badge className={getStatusColor(manuscript.status)}>
                          {manuscript.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getPriorityColor(manuscript.priority)}>
                          {manuscript.priority} priority
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium">Authors:</span>
                          <p>{manuscript.authors}</p>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <p>{manuscript.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>
                          <p>{new Date(manuscript.submittedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Days in Queue:</span>
                          <p className="text-orange-600 font-medium">{manuscript.daysInQueue}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Assigned Editor: <span className="font-medium">{manuscript.assignedEditor}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/dashboard/editorial/review/${manuscript.id}`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <FileText className="h-4 w-4" />
                          Review
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Users className="h-4 w-4" />
                        Assign Editor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          {issuesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : issuesError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Error loading quality issues</p>
            </div>
          ) : qualityIssues?.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No quality issues found</p>
            </div>
          ) : (
            qualityIssues?.map((issue: any) => (
              <Card key={issue.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{issue.title}</h3>
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity} severity
                        </Badge>
                        <Badge variant={issue.status === "resolved" ? "default" : "secondary"}>
                          {issue.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium">Issue:</span>
                          <p>{issue.issue}</p>
                        </div>
                        <div>
                          <span className="font-medium">Manuscript ID:</span>
                          <p>{issue.manuscriptId}</p>
                        </div>
                        <div>
                          <span className="font-medium">Assigned To:</span>
                          <p>{issue.assignedTo}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        View Details
                      </Button>
                      {issue.status === "pending" && (
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <CheckCircle className="h-4 w-4" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Editor Assignments</CardTitle>
              <CardDescription>Manage editor workload and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Editor Assignments</h3>
                <p className="text-muted-foreground">Editor assignment management interface will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}