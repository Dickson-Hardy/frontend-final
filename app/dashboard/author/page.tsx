'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Eye,
  Download,
  Plus,
  Edit,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Stats {
  totalSubmissions: number
  underReview: number
  accepted: number
  published: number
  totalViews: number
  totalDownloads: number
  drafts: number
  revisionRequested: number
}

interface RecentSubmission {
  _id: string
  title: string
  status: string
  submittedDate?: string
  createdAt?: string
  updatedAt?: string
  articleType?: string
}

interface RecentDraft {
  _id: string
  title: string
  lastModified: Date
  completionPercentage: number
  manuscriptType?: string
}

export default function AuthorDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSubmissions: 0,
    underReview: 0,
    accepted: 0,
    published: 0,
    totalViews: 0,
    totalDownloads: 0,
    drafts: 0,
    revisionRequested: 0
  })
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([])
  const [recentDrafts, setRecentDrafts] = useState<RecentDraft[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
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

      // Fetch submissions
      const submissionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/my-articles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      // Fetch drafts
      const draftsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/drafts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (submissionsRes.ok && draftsRes.ok) {
        const submissions = await submissionsRes.json()
        const drafts = await draftsRes.json()

        // Calculate stats
        const calculatedStats: Stats = {
          totalSubmissions: submissions.length,
          underReview: submissions.filter((s: RecentSubmission) => s.status === 'under_review').length,
          accepted: submissions.filter((s: RecentSubmission) => s.status === 'accepted').length,
          published: submissions.filter((s: RecentSubmission) => s.status === 'published').length,
          totalViews: 0, // Would come from article views API
          totalDownloads: 0, // Would come from article downloads API
          drafts: drafts.length,
          revisionRequested: submissions.filter((s: RecentSubmission) => s.status === 'revision_requested').length
        }

        setStats(calculatedStats)
        setRecentSubmissions(submissions.slice(0, 5))
        setRecentDrafts(drafts.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "revision_requested":
        return "bg-orange-100 text-orange-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "published":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "under_review":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "revision_requested":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Author Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your submissions and research activity</p>
        </div>
        <Link href="/dashboard/submissions/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Submission
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.published} published
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.underReview}</div>
                <p className="text-xs text-muted-foreground">
                  Currently being reviewed
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.drafts}</div>
                <p className="text-xs text-muted-foreground">
                  In progress
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.revisionRequested}</div>
                <p className="text-xs text-muted-foreground">
                  Revisions requested
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/dashboard/submissions/new">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Submit Manuscript</span>
              </Button>
            </Link>
            <Link href="/dashboard/submissions/drafts">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Edit className="h-6 w-6" />
                <span>Continue Draft</span>
              </Button>
            </Link>
            <Link href="/dashboard/submissions">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>View Submissions</span>
              </Button>
            </Link>
            <Link href="/guidelines">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Author Guidelines</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="drafts">Recent Drafts</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Your latest manuscript submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : recentSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground mb-4">Start by submitting your first manuscript</p>
                  <Link href="/dashboard/submissions/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Submission
                    </Button>
                  </Link>
                </div>
              ) : (
                recentSubmissions.map((submission) => (
                  <div key={submission._id} className="flex items-start justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{submission.title}</h3>
                        <Badge className={getStatusColor(submission.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(submission.status)}
                            {submission.status.replace(/_/g, " ")}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Type: {submission.articleType || 'N/A'}</span>
                        <span>
                          Submitted: {new Date(submission.submittedDate || submission.createdAt || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/dashboard/submissions/${submission._id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Drafts</CardTitle>
              <CardDescription>Continue working on your manuscripts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : recentDrafts.length === 0 ? (
                <div className="text-center py-8">
                  <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drafts</h3>
                  <p className="text-muted-foreground mb-4">Save your work in progress as drafts</p>
                  <Link href="/dashboard/submissions/drafts">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Draft
                    </Button>
                  </Link>
                </div>
              ) : (
                recentDrafts.map((draft) => (
                  <div key={draft._id} className="flex items-start justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{draft.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.round(draft.completionPercentage || 0)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${draft.completionPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Last modified: {new Date(draft.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/dashboard/submissions/drafts/${draft._id}`}>
                      <Button variant="outline" size="sm" className="gap-2 ml-4">
                        <Edit className="h-4 w-4" />
                        Continue
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication Statistics</CardTitle>
                <CardDescription>Your research impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Accepted</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.accepted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Published</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.published}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Total Views</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.totalViews}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Total Downloads</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.totalDownloads}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
                <CardDescription>Current manuscript status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Under Review</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.underReview}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Revision Requested</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.revisionRequested}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Edit className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Drafts</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.drafts}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Total Submissions</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.totalSubmissions}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
