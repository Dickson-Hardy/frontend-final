"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Filter, Calendar, FileText, Eye, EyeOff } from "lucide-react"

export default function AdminNewsPage() {
  const newsItems = [
    {
      id: "NEWS-001",
      title: "AMHSJ Announces New Editorial Board Members",
      content: "We are pleased to announce the appointment of three new members to our editorial board. Dr. Sarah Johnson, Dr. Michael Chen, and Dr. Emily Rodriguez bring extensive experience in medical research and will contribute to the journal's continued growth.",
      status: "published",
      publishedDate: "2024-01-20",
      author: "Dr. John Davis",
      category: "Announcement",
      views: 245,
      featured: true,
    },
    {
      id: "NEWS-002",
      title: "Call for Papers: Special Issue on AI in Healthcare",
      content: "We are inviting submissions for a special issue focusing on artificial intelligence applications in healthcare. This issue will cover topics including machine learning in diagnosis, AI-powered treatment planning, and ethical considerations in AI healthcare applications.",
      status: "published",
      publishedDate: "2024-01-18",
      author: "Dr. Lisa Wang",
      category: "Call for Papers",
      views: 189,
      featured: false,
    },
    {
      id: "NEWS-003",
      title: "Upcoming Conference: Medical Research Symposium 2024",
      content: "AMHSJ is proud to sponsor the Medical Research Symposium 2024, scheduled for March 15-17, 2024. The conference will feature presentations from leading researchers and provide networking opportunities for the medical research community.",
      status: "draft",
      publishedDate: null,
      author: "Dr. Sarah Johnson",
      category: "Event",
      views: 0,
      featured: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Announcement":
        return "bg-blue-100 text-blue-800"
      case "Call for Papers":
        return "bg-purple-100 text-purple-800"
      case "Achievement":
        return "bg-green-100 text-green-800"
      case "Event":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground mt-2">Manage news articles and announcements</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create News
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search News</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, content, or author..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category-filter">Filter by Category</Label>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="call-for-papers">Call for Papers</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        {newsItems.map((news) => (
          <Card key={news.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{news.title}</h3>
                    <Badge className={getStatusColor(news.status)}>
                      {news.status}
                    </Badge>
                    <Badge className={getCategoryColor(news.category)}>
                      {news.category}
                    </Badge>
                    {news.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">{news.content}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Author:</span>
                      <p>{news.author}</p>
                    </div>
                    <div>
                      <span className="font-medium">Published:</span>
                      <p>{news.publishedDate ? new Date(news.publishedDate).toLocaleDateString() : "Not published"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Views:</span>
                      <p>{news.views}</p>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{news.category}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}