"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Gavel,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Loader2,
  Eye,
  Clock,
  Users,
  FileText,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Decision {
  _id: string
  articleId: string
  title: string
  authors: string[]
  submittedDate: string
  decision: "accept" | "minor_revision" | "major_revision" | "reject" | "pending"
  decisionDate?: string
  decisionBy?: string
  reviewsCompleted: number
  totalReviews: number
  recommendations: {
    accept: number
    minor_revision: number
    major_revision: number
    reject: number
  }
  priority: "normal" | "high" | "urgent"
  daysInReview: number
}

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [filterPriority, setFilterPriority] = useState("all")
  const { get, post } = useApiClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchDecisions()
  }, [])

  const fetchDecisions = async () => {
    try {
      setLoading(true)
      const data = await get("/editorial/decisions")
      setDecisions(data)
    } catch (error) {
      console.error("Failed to fetch decisions:", error)
      toast({
        title: "Error",
        description: "Failed to load editorial decisions.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMakeDecision = async (id: string, decision: Decision["decision"]) => {
    try {
      await post(`/editorial/decisions/${id}`, { decision })
      toast({
        title: "Decision recorded",
        description: `Article marked as ${decision.replace(/_/g, " ")}`,
      })
      fetchDecisions()
    } catch (error) {
      console.error("Failed to make decision:", error)
      toast({
        title: "Error",
        description: "Failed to record decision.",
        variant: "destructive",
      })
    }
  }

  const getDecisionBadge = (decision: Decision["decision"]) => {
    const variants = {
      accept: { icon: CheckCircle, className: "bg-green-100 text-green-800" },
      minor_revision: { icon: AlertCircle, className: "bg-blue-100 text-blue-800" },
      major_revision: { icon: AlertCircle, className: "bg-yellow-100 text-yellow-800" },
      reject: { icon: XCircle, className: "bg-red-100 text-red-800" },
      pending: { icon: Clock, className: "bg-gray-100 text-gray-800" },
    }
    const { icon: Icon, className } = variants[decision]
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {decision.replace(/_/g, " ")}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Decision["priority"]) => {
    const styles = {
      normal: "border-gray-300 text-gray-700",
      high: "border-orange-300 text-orange-700",
      urgent: "border-red-300 text-red-700 bg-red-50",
    }
    return (
      <Badge variant="outline" className={styles[priority]}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const getRecommendationSummary = (recommendations: Decision["recommendations"]) => {
    const total = Object.values(recommendations).reduce((sum, count) => sum + count, 0)
    if (total === 0) return "No recommendations yet"

    const highest = Object.entries(recommendations).reduce((a, b) => (a[1] > b[1] ? a : b))
    return `${highest[0].replace(/_/g, " ")} (${highest[1]}/${total})`
  }

  const filteredDecisions = decisions.filter((decision) => {
    const matchesSearch =
      decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && decision.decision === "pending") ||
      (activeTab === "decided" && decision.decision !== "pending")
    const matchesPriority = filterPriority === "all" || decision.priority === filterPriority
    return matchesSearch && matchesTab && matchesPriority
  })

  const stats = {
    total: decisions.length,
    pending: decisions.filter((d) => d.decision === "pending").length,
    accepted: decisions.filter((d) => d.decision === "accept").length,
    rejected: decisions.filter((d) => d.decision === "reject").length,
    revision: decisions.filter(
      (d) => d.decision === "minor_revision" || d.decision === "major_revision"
    ).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Editorial Decisions</h1>
        <p className="text-muted-foreground mt-2">
          Review peer feedback and make editorial decisions
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Accepted</p>
              <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Revision</p>
              <p className="text-3xl font-bold text-blue-600">{stats.revision}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({decisions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="decided">Decided ({decisions.length - stats.pending})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredDecisions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Gavel className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No decisions found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "All caught up!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDecisions.map((decision) => (
                <Card key={decision._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{decision.title}</h3>
                          {getDecisionBadge(decision.decision)}
                          {getPriorityBadge(decision.priority)}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {decision.authors.join(", ")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {decision.daysInReview} days in review
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {decision.reviewsCompleted}/{decision.totalReviews} reviews completed
                          </span>
                        </div>

                        {/* Recommendations Summary */}
                        <div className="flex items-center gap-4 text-xs mb-2">
                          <span className="font-semibold">Reviewer Recommendations:</span>
                          {decision.recommendations.accept > 0 && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Accept: {decision.recommendations.accept}
                            </Badge>
                          )}
                          {decision.recommendations.minor_revision > 0 && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Minor: {decision.recommendations.minor_revision}
                            </Badge>
                          )}
                          {decision.recommendations.major_revision > 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Major: {decision.recommendations.major_revision}
                            </Badge>
                          )}
                          {decision.recommendations.reject > 0 && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              Reject: {decision.recommendations.reject}
                            </Badge>
                          )}
                        </div>

                        {decision.decisionBy && (
                          <p className="text-xs text-muted-foreground">
                            Decision by {decision.decisionBy} on{" "}
                            {new Date(decision.decisionDate!).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/articles/${decision.articleId}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Article
                        </Button>
                        {decision.decision === "pending" && (
                          <Select
                            onValueChange={(value) =>
                              handleMakeDecision(decision._id, value as Decision["decision"])
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Make Decision" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="accept">Accept</SelectItem>
                              <SelectItem value="minor_revision">Minor Revision</SelectItem>
                              <SelectItem value="major_revision">Major Revision</SelectItem>
                              <SelectItem value="reject">Reject</SelectItem>
                            </SelectContent>
                          </Select>
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
