'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { API_URL } from "@/lib/api"

interface Submission {
  _id: string
  title: string
  status: string
  submittedDate?: string
  createdAt?: string
  updatedAt?: string
  articleType?: string
  keywords?: string[]
  reviewers?: number
}

interface Draft {
  _id: string
  title: string
  lastModified: Date
  completionPercentage: number
  manuscriptType?: string
  status: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchSubmissions()
    fetchDrafts()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to view submissions",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${API_URL}/articles/my-articles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }

      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDrafts = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_URL}/submissions/drafts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch drafts')
      }

      const data = await response.json()
      setDrafts(data)
    } catch (error) {
      console.error('Error fetching drafts:', error)
    }
  }

  const calculateDaysInReview = (date: string) => {
    const submittedDate = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - submittedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredSubmissions = submissions.filter(sub =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDrafts = drafts.filter(draft =>
    draft.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
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
          <h1 className="text-3xl font-bold text-foreground">My Submissions</h1>
          <p className="text-muted-foreground mt-2">Manage your manuscript submissions and track their progress</p>
        </div>
        <Link href="/dashboard/submissions/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Submission
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search submissions..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Submissions</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ) : filteredSubmissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground mb-4">Start by creating a new submission</p>
                  <Link href="/dashboard/submissions/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Submission
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{submission.title}</h3>
                        <Badge className={getStatusColor(submission.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(submission.status)}
                            {submission.status.replace(/_/g, " ")}
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium">Submission ID:</span>
                          <p className="truncate">{submission._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <p>{submission.articleType || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>
                          <p>{new Date(submission.submittedDate || submission.createdAt || '').toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Days in Review:</span>
                          <p>{calculateDaysInReview(submission.submittedDate || submission.createdAt || '')} days</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Last updated: {new Date(submission.updatedAt || submission.createdAt || '').toLocaleDateString()}
                        </span>
                        {submission.keywords && submission.keywords.length > 0 && (
                          <span className="text-muted-foreground">
                            Keywords: {submission.keywords.slice(0, 3).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/dashboard/submissions/${submission._id}`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      {submission.status === "revision_requested" && (
                        <Link href={`/dashboard/submissions/${submission._id}/revise`}>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Edit className="h-4 w-4" />
                            Revise
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ) : filteredDrafts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drafts</h3>
                  <p className="text-muted-foreground mb-4">Create a draft to save your work in progress</p>
                  <Link href="/dashboard/submissions/drafts">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Draft
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredDrafts.map((draft) => (
              <Card key={draft._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{draft.title}</h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium">Draft ID:</span>
                          <p className="truncate">{draft._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>
                          <p>{draft.manuscriptType || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Modified:</span>
                          <p>{new Date(draft.lastModified).toLocaleDateString()}</p>
                        </div>
                      </div>

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
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/dashboard/submissions/drafts/${draft._id}`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Edit className="h-4 w-4" />
                          Continue
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 bg-transparent"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this draft?')) {
                            try {
                              const token = localStorage.getItem('token')
                              const response = await fetch(
                                `${API_URL}/submissions/drafts/${draft._id}`,
                                {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${token}`
                                  }
                                }
                              )
                              if (response.ok) {
                                toast({
                                  title: "Success",
                                  description: "Draft deleted successfully"
                                })
                                fetchDrafts()
                              }
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to delete draft",
                                variant: "destructive"
                              })
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No archived submissions</h3>
                <p className="text-muted-foreground">Your archived submissions will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
