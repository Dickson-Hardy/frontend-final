"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen, Plus, Edit, Trash2, Eye, Calendar, AlertCircle, Loader2, Search } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

interface VolumeIssue {
  id: string
  volumeId: string
  issueNumber: string
  title: string
  status: 'planned' | 'in_progress' | 'published' | 'archived'
  publicationDate?: string
  articleCount: number
  editor: string
  specialIssue: boolean
  specialTheme?: string
}

export default function VolumeIssuesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  // Check if user has admin access
  if (!canAccessDashboard(user, 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Mock data - in real app, this would come from API
  const [issues, setIssues] = useState<VolumeIssue[]>([
    {
      id: "issue-1",
      volumeId: "vol-15",
      issueNumber: "1",
      title: "Advances in Medical Technology",
      status: "published",
      publicationDate: "2024-01-15",
      articleCount: 8,
      editor: "Dr. Sarah Johnson",
      specialIssue: false
    },
    {
      id: "issue-2",
      volumeId: "vol-15",
      issueNumber: "2",
      title: "Cardiovascular Research",
      status: "in_progress",
      publicationDate: "2024-04-15",
      articleCount: 5,
      editor: "Dr. Michael Chen",
      specialIssue: true,
      specialTheme: "COVID-19 Research"
    },
    {
      id: "issue-3",
      volumeId: "vol-15",
      issueNumber: "3",
      title: "Global Health Initiatives",
      status: "planned",
      publicationDate: "2024-07-15",
      articleCount: 0,
      editor: "Dr. Emily Rodriguez",
      specialIssue: false
    },
    {
      id: "issue-4",
      volumeId: "vol-16",
      issueNumber: "1",
      title: "Digital Health Solutions",
      status: "planned",
      publicationDate: "2024-10-15",
      articleCount: 0,
      editor: "Dr. David Kim",
      specialIssue: true,
      specialTheme: "AI in Healthcare"
    }
  ])

  const getStatusColor = (status: VolumeIssue['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.volumeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.issueNumber.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (issueId: string, newStatus: VolumeIssue['status']) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIssues(prev => 
        prev.map(issue => 
          issue.id === issueId 
            ? { ...issue, status: newStatus }
            : issue
        )
      )
      
      toast({
        title: "Status Updated",
        description: `Issue status has been updated to ${newStatus}.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update issue status.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteIssue = (issueId: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId))
    toast({
      title: "Issue Deleted",
      description: "The issue has been deleted successfully."
    })
  }

  const getStatusOptions = (currentStatus: VolumeIssue['status']) => {
    const allStatuses: VolumeIssue['status'][] = ['planned', 'in_progress', 'published', 'archived']
    return allStatuses.filter(status => status !== currentStatus)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-blue-600" />
          Manage Issues
        </h1>
        <p className="text-muted-foreground mt-2">Manage volume issues and their publication status</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues by title, volume, or issue number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Issue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIssues.map((issue) => (
          <Card key={issue.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{issue.title}</CardTitle>
                  <CardDescription>
                    Volume {issue.volumeId} • Issue {issue.issueNumber}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Editor:</span>
                  <p className="font-medium">{issue.editor}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Articles:</span>
                  <p className="font-medium">{issue.articleCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Publication Date:</span>
                  <p className="font-medium">
                    {issue.publicationDate 
                      ? new Date(issue.publicationDate).toLocaleDateString()
                      : 'Not set'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">
                    {issue.specialIssue ? 'Special Issue' : 'Regular Issue'}
                  </p>
                </div>
              </div>

              {issue.specialIssue && issue.specialTheme && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Special Theme:</p>
                  <p className="text-sm text-blue-700">{issue.specialTheme}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t">
                <Select 
                  value={issue.status} 
                  onValueChange={(value: VolumeIssue['status']) => handleStatusChange(issue.id, value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions(issue.status).map(status => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteIssue(issue.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No issues found</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first issue to get started"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Statistics</CardTitle>
          <CardDescription>Overview of issue status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {issues.filter(i => i.status === 'planned').length}
              </div>
              <p className="text-sm text-muted-foreground">Planned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {issues.filter(i => i.status === 'in_progress').length}
              </div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {issues.filter(i => i.status === 'published').length}
              </div>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {issues.filter(i => i.status === 'archived').length}
              </div>
              <p className="text-sm text-muted-foreground">Archived</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
