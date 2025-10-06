"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  UserPlus,
  Mail,
  Star,
  TrendingUp,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Reviewer {
  _id: string
  name: string
  email: string
  affiliation: string
  expertise: string[]
  status: "active" | "inactive" | "suspended"
  performance: {
    totalReviews: number
    completedReviews: number
    avgCompletionTime: number
    avgRating: number
    onTimeRate: number
  }
  currentLoad: number
  maxLoad: number
  joinedDate: string
  lastActive?: string
}

export default function ReviewersPage() {
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    affiliation: "",
    expertise: "",
    message: "",
  })
  const { get, post, patch } = useApiClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchReviewers()
  }, [])

  const fetchReviewers = async () => {
    try {
      setLoading(true)
      const data = await get("/editorial/reviewers")
      setReviewers(data)
    } catch (error) {
      console.error("Failed to fetch reviewers:", error)
      toast({
        title: "Error",
        description: "Failed to load reviewers.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInviteReviewer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await post("/editorial/reviewers/invite", {
        ...inviteForm,
        expertise: inviteForm.expertise.split(",").map((e) => e.trim()),
      })
      toast({
        title: "Invitation sent",
        description: `Invitation email sent to ${inviteForm.email}`,
      })
      setInviteDialogOpen(false)
      setInviteForm({
        name: "",
        email: "",
        affiliation: "",
        expertise: "",
        message: "",
      })
      fetchReviewers()
    } catch (error) {
      console.error("Failed to invite reviewer:", error)
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: string, newStatus: Reviewer["status"]) => {
    try {
      await patch(`/editorial/reviewers/${id}/status`, { status: newStatus })
      toast({
        title: "Status updated",
        description: `Reviewer status changed to ${newStatus}`,
      })
      fetchReviewers()
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      })
    }
  }

  const handleRemindReviewer = async (id: string) => {
    try {
      await post(`/editorial/reviewers/${id}/remind`, {})
      toast({
        title: "Reminder sent",
        description: "Reminder email sent to reviewer",
      })
    } catch (error) {
      console.error("Failed to send reminder:", error)
      toast({
        title: "Error",
        description: "Failed to send reminder.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: Reviewer["status"]) => {
    const variants = {
      active: { icon: CheckCircle, className: "bg-green-100 text-green-800" },
      inactive: { icon: XCircle, className: "bg-gray-100 text-gray-800" },
      suspended: { icon: AlertTriangle, className: "bg-red-100 text-red-800" },
    }
    const { icon: Icon, className } = variants[status]
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getPerformanceRating = (avgRating: number) => {
    if (avgRating >= 4.5) return { color: "text-green-600", label: "Excellent" }
    if (avgRating >= 3.5) return { color: "text-blue-600", label: "Good" }
    if (avgRating >= 2.5) return { color: "text-yellow-600", label: "Average" }
    return { color: "text-red-600", label: "Poor" }
  }

  const filteredReviewers = reviewers.filter((reviewer) => {
    const matchesSearch =
      reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reviewer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reviewer.affiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reviewer.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && reviewer.status === "active") ||
      (activeTab === "inactive" && reviewer.status === "inactive") ||
      (activeTab === "high_performers" &&
        reviewer.performance.avgRating >= 4.0 &&
        reviewer.performance.onTimeRate >= 80)
    return matchesSearch && matchesTab
  })

  const stats = {
    total: reviewers.length,
    active: reviewers.filter((r) => r.status === "active").length,
    inactive: reviewers.filter((r) => r.status === "inactive").length,
    avgRating:
      reviewers.reduce((sum, r) => sum + r.performance.avgRating, 0) / reviewers.length || 0,
    avgOnTime:
      reviewers.reduce((sum, r) => sum + r.performance.onTimeRate, 0) / reviewers.length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviewer Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage peer reviewers and their assignments
          </p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Reviewer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invite New Reviewer</DialogTitle>
              <DialogDescription>
                Send an invitation to join the peer review panel
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInviteReviewer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="affiliation">Affiliation *</Label>
                <Input
                  id="affiliation"
                  value={inviteForm.affiliation}
                  onChange={(e) => setInviteForm({ ...inviteForm, affiliation: e.target.value })}
                  placeholder="University or Institution"
                  required
                />
              </div>

              <div>
                <Label htmlFor="expertise">Areas of Expertise *</Label>
                <Input
                  id="expertise"
                  value={inviteForm.expertise}
                  onChange={(e) => setInviteForm({ ...inviteForm, expertise: e.target.value })}
                  placeholder="Separate keywords with commas"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  rows={4}
                  placeholder="Add a personal note to the invitation email..."
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviewers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-10 w-10 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold">{stats.avgOnTime.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, affiliation, or expertise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({reviewers.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
          <TabsTrigger value="high_performers">
            <Award className="h-3 w-3 mr-1" />
            Top Performers
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredReviewers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviewers found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start building your reviewer panel by inviting experts"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviewers.map((reviewer) => {
                const performanceRating = getPerformanceRating(reviewer.performance.avgRating)
                return (
                  <Card key={reviewer._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{reviewer.name}</h3>
                            {getStatusBadge(reviewer.status)}
                            {reviewer.performance.avgRating >= 4.5 && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Award className="h-3 w-3 mr-1" />
                                Top Performer
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {reviewer.email}
                            </span>
                            <span>{reviewer.affiliation}</span>
                          </div>

                          {/* Expertise */}
                          <div className="flex items-center gap-2 mb-3">
                            {reviewer.expertise.slice(0, 5).map((exp, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                            {reviewer.expertise.length > 5 && (
                              <span className="text-xs text-muted-foreground">
                                +{reviewer.expertise.length - 5} more
                              </span>
                            )}
                          </div>

                          {/* Performance Metrics */}
                          <div className="grid grid-cols-5 gap-4 text-xs">
                            <div>
                              <p className="text-muted-foreground">Reviews</p>
                              <p className="font-semibold">
                                {reviewer.performance.completedReviews}/{reviewer.performance.totalReviews}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Rating</p>
                              <p className={`font-semibold ${performanceRating.color}`}>
                                {reviewer.performance.avgRating.toFixed(1)} ★
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Avg Time</p>
                              <p className="font-semibold">
                                {reviewer.performance.avgCompletionTime} days
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">On-Time</p>
                              <p className="font-semibold">{reviewer.performance.onTimeRate}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Current Load</p>
                              <p className="font-semibold">
                                {reviewer.currentLoad}/{reviewer.maxLoad}
                              </p>
                            </div>
                          </div>

                          {/* Load Bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                reviewer.currentLoad >= reviewer.maxLoad
                                  ? "bg-red-500"
                                  : reviewer.currentLoad >= reviewer.maxLoad * 0.7
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${(reviewer.currentLoad / reviewer.maxLoad) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {reviewer.status === "active" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemindReviewer(reviewer._id)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Remind
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-orange-600"
                                onClick={() => handleStatusChange(reviewer._id, "inactive")}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Deactivate
                              </Button>
                            </>
                          )}
                          {reviewer.status === "inactive" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(reviewer._id, "active")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
