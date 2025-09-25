"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Calendar, FileText, Users, Building, Upload, Loader2 } from "lucide-react"
import { VolumeCreationForm } from "@/components/admin/volume-creation-form"
import { ArticleAssignment } from "@/components/admin/article-assignment"
import { ArticleUpload } from "@/components/admin/article-upload"
import { useApi } from "@/hooks/use-api"

export default function AdminVolumesPage() {
  const [activeTab, setActiveTab] = useState("volumes")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  const { data: volumes, isLoading: volumesLoading, refetch: refetchVolumes } = useApi(`/volumes?search=${searchTerm}&status=${statusFilter}&year=${yearFilter}`)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "planned":
        return "bg-blue-100 text-blue-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleVolumeCreated = () => {
    setShowCreateForm(false)
    refetchVolumes()
  }

  const handleAssignmentComplete = () => {
    refetchVolumes()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volume Management</h1>
          <p className="text-muted-foreground mt-2">Manage journal volumes and issues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setActiveTab("upload")}>
            <Upload className="h-4 w-4" />
            Upload Article
          </Button>
          <Button className="gap-2" onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4" />
            Create Volume
          </Button>
        </div>
      </div>

      {/* Volume Creation Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <VolumeCreationForm
              onSuccess={handleVolumeCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="upload">Upload Article</TabsTrigger>
          {selectedVolume && <TabsTrigger value="assign">Assign Articles</TabsTrigger>}
        </TabsList>

        <TabsContent value="volumes" className="space-y-6">

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Volumes</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by volume number, title, or editor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status-filter">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year-filter">Filter by Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volumes List */}
          <div className="space-y-4">
            {volumesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : volumes?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No volumes found</p>
              </div>
            ) : (
              volumes?.map((volume: any) => (
                <Card key={volume.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{volume.number}</h3>
                          <Badge className={getStatusColor(volume.status)}>
                            {volume.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <h4 className="text-lg font-medium text-foreground mb-2">{volume.title}</h4>
                        <p className="text-muted-foreground mb-4">{volume.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Editor:</span>
                            <p>{volume.editor}</p>
                          </div>
                          <div>
                            <span className="font-medium">Articles:</span>
                            <p>{volume.articles?.length || 0}</p>
                          </div>
                          <div>
                            <span className="font-medium">Pages:</span>
                            <p>{volume.pages || 0}</p>
                          </div>
                          <div>
                            <span className="font-medium">Published:</span>
                            <p>{volume.publishedDate ? new Date(volume.publishedDate).toLocaleDateString() : "Not yet published"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => {
                            setSelectedVolume(volume.id)
                            setActiveTab("assign")
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          Manage Articles
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <ArticleUpload onUploadComplete={() => refetchVolumes()} />
        </TabsContent>

        <TabsContent value="assign" className="space-y-6">
          {selectedVolume && (
            <ArticleAssignment 
              volumeId={selectedVolume} 
              onAssignmentComplete={handleAssignmentComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}