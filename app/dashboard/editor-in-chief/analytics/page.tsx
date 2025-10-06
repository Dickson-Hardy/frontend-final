"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  Globe,
  Download,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Analytics {
  overview: {
    totalSubmissions: number
    submissionsChange: number
    acceptanceRate: number
    acceptanceRateChange: number
    avgReviewTime: number
    reviewTimeChange: number
    activeReviewers: number
    reviewersChange: number
  }
  submissions: {
    labels: string[]
    data: number[]
  }
  decisions: {
    accepted: number
    rejected: number
    minorRevision: number
    majorRevision: number
  }
  reviewTimes: {
    labels: string[]
    data: number[]
  }
  topCountries: Array<{
    country: string
    count: number
    percentage: number
  }>
  topKeywords: Array<{
    keyword: string
    count: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("12months")
  const { get } = useApiClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const data = await get(`/editorial/analytics?range=${timeRange}`)
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      // For blob responses, use fetch directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/editorial/analytics/export?range=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      
      if (!response.ok) throw new Error("Export failed")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `journal-analytics-${timeRange}.pdf`
      a.click()
      toast({
        title: "Export successful",
        description: "Analytics report downloaded.",
      })
    } catch (error) {
      console.error("Failed to export:", error)
      toast({
        title: "Error",
        description: "Failed to export analytics.",
        variant: "destructive",
      })
    }
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journal Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Submissions</p>
                <p className="text-3xl font-bold">{analytics.overview.totalSubmissions}</p>
                <div className={`flex items-center gap-1 text-sm mt-2 ${getTrendColor(analytics.overview.submissionsChange)}`}>
                  {getTrendIcon(analytics.overview.submissionsChange)}
                  <span>{Math.abs(analytics.overview.submissionsChange)}% vs previous period</span>
                </div>
              </div>
              <FileText className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
                <p className="text-3xl font-bold">{analytics.overview.acceptanceRate}%</p>
                <div className={`flex items-center gap-1 text-sm mt-2 ${getTrendColor(analytics.overview.acceptanceRateChange)}`}>
                  {getTrendIcon(analytics.overview.acceptanceRateChange)}
                  <span>{Math.abs(analytics.overview.acceptanceRateChange)}% vs previous period</span>
                </div>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Review Time</p>
                <p className="text-3xl font-bold">{analytics.overview.avgReviewTime} days</p>
                <div className={`flex items-center gap-1 text-sm mt-2 ${getTrendColor(-analytics.overview.reviewTimeChange)}`}>
                  {getTrendIcon(-analytics.overview.reviewTimeChange)}
                  <span>{Math.abs(analytics.overview.reviewTimeChange)} days vs previous</span>
                </div>
              </div>
              <Clock className="h-10 w-10 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Reviewers</p>
                <p className="text-3xl font-bold">{analytics.overview.activeReviewers}</p>
                <div className={`flex items-center gap-1 text-sm mt-2 ${getTrendColor(analytics.overview.reviewersChange)}`}>
                  {getTrendIcon(analytics.overview.reviewersChange)}
                  <span>{Math.abs(analytics.overview.reviewersChange)}% vs previous period</span>
                </div>
              </div>
              <Users className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Submissions Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.submissions.labels.map((label, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span className="font-semibold">{analytics.submissions.data[idx]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(analytics.submissions.data[idx] / Math.max(...analytics.submissions.data)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Editorial Decisions */}
        <Card>
          <CardHeader>
            <CardTitle>Editorial Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-sm">Accepted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{analytics.decisions.accepted}</span>
                  <span className="text-sm text-muted-foreground">
                    ({((analytics.decisions.accepted / (analytics.decisions.accepted + analytics.decisions.rejected + analytics.decisions.minorRevision + analytics.decisions.majorRevision)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-sm">Minor Revision</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{analytics.decisions.minorRevision}</span>
                  <span className="text-sm text-muted-foreground">
                    ({((analytics.decisions.minorRevision / (analytics.decisions.accepted + analytics.decisions.rejected + analytics.decisions.minorRevision + analytics.decisions.majorRevision)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded" />
                  <span className="text-sm">Major Revision</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{analytics.decisions.majorRevision}</span>
                  <span className="text-sm text-muted-foreground">
                    ({((analytics.decisions.majorRevision / (analytics.decisions.accepted + analytics.decisions.rejected + analytics.decisions.minorRevision + analytics.decisions.majorRevision)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span className="text-sm">Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{analytics.decisions.rejected}</span>
                  <span className="text-sm text-muted-foreground">
                    ({((analytics.decisions.rejected / (analytics.decisions.accepted + analytics.decisions.rejected + analytics.decisions.minorRevision + analytics.decisions.majorRevision)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Submission Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCountries.map((country, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Badge variant="outline">{idx + 1}</Badge>
                      {country.country}
                    </span>
                    <span className="font-semibold">
                      {country.count} ({country.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Trending Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.topKeywords.map((keyword, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                  style={{
                    fontSize: `${Math.max(0.75, Math.min(1.25, keyword.count / 10))}rem`,
                  }}
                >
                  {keyword.keyword} ({keyword.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Time Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Average Review Time Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.reviewTimes.labels.map((label, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="font-semibold">{analytics.reviewTimes.data[idx]} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      analytics.reviewTimes.data[idx] <= 30
                        ? "bg-green-500"
                        : analytics.reviewTimes.data[idx] <= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${(analytics.reviewTimes.data[idx] / Math.max(...analytics.reviewTimes.data)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
