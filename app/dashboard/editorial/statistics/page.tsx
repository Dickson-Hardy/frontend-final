import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, FileText } from "lucide-react"

export default function EditorialStatisticsPage() {
  const monthlyStats = [
    { month: "Jan", reviewed: 45, approved: 35, rejected: 8, flagged: 2 },
    { month: "Feb", reviewed: 52, approved: 41, rejected: 9, flagged: 2 },
    { month: "Mar", reviewed: 48, approved: 38, rejected: 7, flagged: 3 },
    { month: "Apr", reviewed: 56, approved: 44, rejected: 10, flagged: 2 },
  ]

  const categoryStats = [
    { category: "Clinical Research", count: 28, percentage: 35, trend: "up" },
    { category: "Review Articles", count: 22, percentage: 27, trend: "up" },
    { category: "Public Health", count: 18, percentage: 22, trend: "down" },
    { category: "Basic Science", count: 13, percentage: 16, trend: "stable" },
  ]

  const performanceMetrics = [
    { metric: "Average Review Time", value: "2.3 days", target: "3.0 days", status: "good" },
    { metric: "Approval Rate", value: "78%", target: "75%", status: "good" },
    { metric: "Reviews This Month", value: "56", target: "50", status: "excellent" },
    { metric: "Plagiarism Detection", value: "100%", target: "100%", status: "excellent" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Editorial Statistics</h1>
        <p className="text-muted-foreground mt-2">Review performance metrics and submission analytics</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              {metric.status === "excellent" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : metric.status === "good" ? (
                <CheckCircle className="h-4 w-4 text-blue-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Review Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Review Trends
            </CardTitle>
            <CardDescription>Review activity over the past 4 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stat.month} 2024</span>
                    <span className="text-muted-foreground">{stat.reviewed} total</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Approved: {stat.approved}</span>
                      <span>Rejected: {stat.rejected}</span>
                      <span>Flagged: {stat.flagged}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div
                        className="bg-green-500 rounded-sm"
                        style={{ width: `${(stat.approved / stat.reviewed) * 100}%` }}
                      />
                      <div
                        className="bg-red-500 rounded-sm"
                        style={{ width: `${(stat.rejected / stat.reviewed) * 100}%` }}
                      />
                      <div
                        className="bg-yellow-500 rounded-sm"
                        style={{ width: `${(stat.flagged / stat.reviewed) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submission Categories
            </CardTitle>
            <CardDescription>Distribution by manuscript category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{category.count}</span>
                      {category.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : category.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      )}
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">{category.percentage}% of total submissions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>In-depth review and performance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reviews">Review Performance</TabsTrigger>
              <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
              <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">78%</div>
                      <p className="text-sm text-muted-foreground">Approval Rate</p>
                      <Badge variant="secondary" className="mt-2">
                        +5% vs last month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2.3</div>
                      <p className="text-sm text-muted-foreground">Avg Review Days</p>
                      <Badge variant="secondary" className="mt-2">
                        -0.5 vs target
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">56</div>
                      <p className="text-sm text-muted-foreground">Reviews This Month</p>
                      <Badge variant="secondary" className="mt-2">
                        +12% vs last month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Plagiarism Detection</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Low Risk (&lt;10%)</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Moderate Risk (10-20%)</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>High Risk (&gt;20%)</span>
                        <span>7%</span>
                      </div>
                      <Progress value={7} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Technical Issues</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Format Issues</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>File Problems</span>
                        <span>8%</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ethics Issues</span>
                        <span>3%</span>
                      </div>
                      <Progress value={3} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Review Timeline Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Same Day</span>
                        <div className="flex items-center gap-2">
                          <Progress value={12} className="w-20 h-2" />
                          <span>12%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>1-2 Days</span>
                        <div className="flex items-center gap-2">
                          <Progress value={45} className="w-20 h-2" />
                          <span>45%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>3-5 Days</span>
                        <div className="flex items-center gap-2">
                          <Progress value={35} className="w-20 h-2" />
                          <span>35%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>&gt;5 Days</span>
                        <div className="flex items-center gap-2">
                          <Progress value={8} className="w-20 h-2" />
                          <span>8%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Peak Review Hours</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Most active review periods:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>9:00 AM - 11:00 AM</span>
                          <span>32%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2:00 PM - 4:00 PM</span>
                          <span>28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>10:00 AM - 12:00 PM</span>
                          <span>25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other hours</span>
                          <span>15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
