import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SubmissionsPage() {
  const submissions = [
    {
      id: "SUB-2024-001",
      title: "Impact of AI in Medical Diagnosis: A Systematic Review",
      status: "under_review",
      submittedDate: "2024-01-15",
      lastUpdate: "2024-01-20",
      category: "Review Articles",
      reviewers: 3,
      daysInReview: 12,
    },
    {
      id: "SUB-2024-002",
      title: "Novel Biomarkers for Early Cancer Detection",
      status: "revision_requested",
      submittedDate: "2024-01-10",
      lastUpdate: "2024-01-18",
      category: "Clinical Research",
      reviewers: 2,
      daysInReview: 18,
    },
    {
      id: "SUB-2024-003",
      title: "Telemedicine Adoption in Rural Healthcare Settings",
      status: "accepted",
      submittedDate: "2023-12-20",
      lastUpdate: "2024-01-22",
      category: "Public Health",
      reviewers: 3,
      daysInReview: 25,
    },
  ]

  const drafts = [
    {
      id: "DRAFT-001",
      title: "Machine Learning Applications in Radiology",
      lastModified: "2024-01-22",
      progress: 75,
      category: "Clinical Research",
    },
    {
      id: "DRAFT-002",
      title: "COVID-19 Long-term Effects Study",
      lastModified: "2024-01-20",
      progress: 45,
      category: "Public Health",
    },
  ]

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
              <Input placeholder="Search submissions..." className="pl-10" />
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
          {submissions.map((submission) => (
            <Card key={submission.id}>
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
                        <p>{submission.id}</p>
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
                        <span className="font-medium">Days in Review:</span>
                        <p>{submission.daysInReview} days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Last updated: {new Date(submission.lastUpdate).toLocaleDateString()}
                      </span>
                      <span className="text-muted-foreground">Reviewers assigned: {submission.reviewers}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    {submission.status === "revision_requested" && (
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit className="h-4 w-4" />
                        Revise
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {drafts.map((draft) => (
            <Card key={draft.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{draft.title}</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">Draft ID:</span>
                        <p>{draft.id}</p>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{draft.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Last Modified:</span>
                        <p>{new Date(draft.lastModified).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{draft.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${draft.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Edit className="h-4 w-4" />
                      Continue
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
