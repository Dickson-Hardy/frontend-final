"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  ClipboardCheck,
  FileSearch,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Loader2,
  Eye,
  XCircle,
  Flag,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface QualityReview {
  _id: string
  articleId: string
  title: string
  submittedBy: string
  submittedDate: string
  status: "pending" | "in_review" | "approved" | "rejected" | "requires_revision"
  priority: "low" | "normal" | "high" | "urgent"
  issues: {
    formatting: number
    plagiarism: number
    language: number
    references: number
  }
  assignedTo?: string
  lastReviewed?: string
  notes?: string
}

export default function QualityReviewPage() {
  const [reviews, setReviews] = useState<QualityReview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const { get, patch } = useApiClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await get("/editorial/quality-reviews")
      setReviews(data)
    } catch (error) {
      console.error("Failed to fetch quality reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load quality reviews.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartReview = async (id: string) => {
    try {
      await patch(`/editorial/quality-reviews/${id}/start`, {})
      fetchReviews()
      router.push(`/dashboard/editorial/quality/${id}`)
    } catch (error) {
      console.error("Failed to start review:", error)
      toast({
        title: "Error",
        description: "Failed to start review.",
        variant: "destructive",
      })
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await patch(`/editorial/quality-reviews/${id}/approve`, {})
      toast({
        title: "Approved",
        description: "Article approved and forwarded to editorial board.",
      })
      fetchReviews()
    } catch (error) {
      console.error("Failed to approve:", error)
      toast({
        title: "Error",
        description: "Failed to approve article.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string, reason: string) => {
    try {
      await patch(`/editorial/quality-reviews/${id}/reject`, { reason })
      toast({
        title: "Rejected",
        description: "Article rejected and author notified.",
      })
      fetchReviews()
    } catch (error) {
      console.error("Failed to reject:", error)
      toast({
        title: "Error",
        description: "Failed to reject article.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: QualityReview["status"]) => {
    const variants = {
      pending: { icon: Clock, className: "bg-yellow-100 text-yellow-800" },
      in_review: { icon: FileSearch, className: "bg-blue-100 text-blue-800" },
      approved: { icon: CheckCircle, className: "bg-green-100 text-green-800" },
      rejected: { icon: XCircle, className: "bg-red-100 text-red-800" },
      requires_revision: { icon: AlertCircle, className: "bg-orange-100 text-orange-800" },
    }
    const { icon: Icon, className } = variants[status]
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, " ")}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: QualityReview["priority"]) => {
    const styles = {
      low: "border-gray-300 text-gray-700",
      normal: "border-blue-300 text-blue-700",
      high: "border-orange-300 text-orange-700",
      urgent: "border-red-300 text-red-700 bg-red-50",
    }
    return (
      <Badge variant="outline" className={styles[priority]}>
        {priority === "urgent" && <Flag className="h-3 w-3 mr-1" />}
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const getTotalIssues = (issues: QualityReview["issues"]) => {
    return Object.values(issues).reduce((sum, count) => sum + count, 0)
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && review.status === "pending") ||
      (activeTab === "in_review" && review.status === "in_review") ||
      (activeTab === "completed" &&
        (review.status === "approved" ||
          review.status === "rejected" ||
          review.status === "requires_revision"))
    return matchesSearch && matchesTab
  })

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    inReview: reviews.filter((r) => r.status === "in_review").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    urgent: reviews.filter((r) => r.priority === "urgent").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quality Review Queue</h1>
        <p className="text-muted-foreground mt-2">
          Review submitted manuscripts for quality and completeness
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Queue</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">In Review</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inReview}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Urgent</p>
              <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="in_review">In Review ({stats.inReview})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.total - stats.pending - stats.inReview})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardCheck className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "All caught up! No pending quality reviews at this time."}
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
                          <h3 className="font-semibold text-lg">{review.title}</h3>
                          {getStatusBadge(review.status)}
                          {getPriorityBadge(review.priority)}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                          <span>Submitted by: {review.submittedBy}</span>
                          <span>
                            Submitted: {new Date(review.submittedDate).toLocaleDateString()}
                          </span>
                          {review.assignedTo && <span>Assigned to: {review.assignedTo}</span>}
                        </div>

                        {/* Issues Summary */}
                        {getTotalIssues(review.issues) > 0 && (
                          <div className="flex items-center gap-4 text-xs mb-3">
                            <span className="font-semibold text-red-600">
                              {getTotalIssues(review.issues)} issues detected:
                            </span>
                            {review.issues.formatting > 0 && (
                              <span>Formatting: {review.issues.formatting}</span>
                            )}
                            {review.issues.plagiarism > 0 && (
                              <span className="text-red-600">
                                Plagiarism: {review.issues.plagiarism}
                              </span>
                            )}
                            {review.issues.language > 0 && (
                              <span>Language: {review.issues.language}</span>
                            )}
                            {review.issues.references > 0 && (
                              <span>References: {review.issues.references}</span>
                            )}
                          </div>
                        )}

                        {review.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            Notes: {review.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {review.status === "pending" && (
                          <Button size="sm" onClick={() => handleStartReview(review._id)}>
                            <FileSearch className="h-4 w-4 mr-2" />
                            Start Review
                          </Button>
                        )}
                        {review.status === "in_review" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/dashboard/editorial/quality/${review._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Continue
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(review._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </>
                        )}
                        {review.status === "approved" && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
