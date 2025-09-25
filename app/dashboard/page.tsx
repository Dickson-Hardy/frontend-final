import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Users, Clock, CheckCircle, TrendingUp, Calendar, BookOpen } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Dr. Smith</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your submissions and reviews today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">+2% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest manuscript submissions requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Impact of AI in Medical Diagnosis: A Systematic Review",
                  author: "Dr. Sarah Johnson",
                  status: "under_review",
                  date: "2 hours ago",
                  category: "Review Articles",
                },
                {
                  title: "Novel Biomarkers for Early Cancer Detection",
                  author: "Dr. Michael Chen",
                  status: "revision_requested",
                  date: "1 day ago",
                  category: "Clinical Research",
                },
                {
                  title: "Telemedicine Adoption in Rural Healthcare Settings",
                  author: "Dr. Emily Rodriguez",
                  status: "editor_in_chief_review",
                  date: "3 days ago",
                  category: "Public Health",
                },
              ].map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{submission.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {submission.author} • {submission.date}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {submission.category}
                      </Badge>
                      <Badge
                        variant={
                          submission.status === "under_review"
                            ? "default"
                            : submission.status === "revision_requested"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {submission.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                New Submission
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Assign Reviewers
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Editorial Board
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Review: Cardiovascular Research",
                    deadline: "2 days",
                    progress: 75,
                  },
                  {
                    title: "Editorial Decision: AI in Healthcare",
                    deadline: "5 days",
                    progress: 40,
                  },
                  {
                    title: "Reviewer Assignment: Public Health Study",
                    deadline: "1 week",
                    progress: 20,
                  },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {item.deadline}
                      </Badge>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
