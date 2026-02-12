"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Calendar, FileText, Users, Building, Upload, Loader2 } from "lucide-react"
import { VolumeCreationForm } from "@/components/admin/volume-creation-form"
import { ArticleAssignment } from "@/components/admin/article-assignment"
import { ArticleUpload } from "@/components/admin/article-upload"
import { useApi } from "@/hooks/use-api"
import { volumeService } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function AdminVolumesPage() {
  const [activeTab, setActiveTab] = useState("volumes")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null)
  const [editingVolume, setEditingVolume] = useState<any>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deletingVolume, setDeletingVolume] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  const { data: volumesData, isLoading: volumesLoading, refetch: refetchVolumes } = useApi(`/volumes`)

  // Filter volumes based on search and filters
  const volumes = volumesData?.filter((volume: any) => {
    const matchesSearch = !searchTerm || 
      volume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volume.volume?.toString().includes(searchTerm) ||
      volume.year?.toString().includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || volume.status === statusFilter
    const matchesYear = yearFilter === 'all' || volume.year?.toString() === yearFilter
    
    return matchesSearch && matchesStatus && matchesYear
  }) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
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

  const handleStatusUpdate = async (volumeId: string, newStatus: string) => {
    setUpdatingStatus(volumeId)
    try {
      await volumeService.updateStatus(volumeId, newStatus)
      toast({ title: "Status updated successfully" })
      refetchVolumes()
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeleteVolume = async (volumeId: string) => {
    if (!confirm('Are you sure you want to delete this volume?')) return
    setDeletingVolume(volumeId)
    try {
      await volumeService.delete(volumeId)
      toast({ title: "Volume deleted successfully" })
      refetchVolumes()
    } catch (error) {
      toast({ title: "Failed to delete volume", variant: "destructive" })
    } finally {
      setDeletingVolume(null)
    }
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
          <Button variant="outline" className="gap-2" onClick={() => setActiveTab("assign")}>
            <FileText className="h-4 w-4" />
            Assign Articles
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
          <TabsTrigger value="volumes">All Volumes</TabsTrigger>
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
                <Card key={volume._id || volume.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">Volume {volume.volume} {volume.issue ? `Issue ${volume.issue}` : ''}</h3>
                          <Badge className={getStatusColor(volume.status)}>
                            {volume.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <h4 className="text-lg font-medium text-foreground mb-2">{volume.title}</h4>
                        <p className="text-muted-foreground mb-4">{volume.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Year:</span>
                            <p>{volume.year}</p>
                          </div>
                          <div>
                            <span className="font-medium">Articles:</span>
                            <p>{volume.articles?.length || 0}</p>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <p>{volume.status?.replace('_', ' ') || 'Draft'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Published:</span>
                            <p>{volume.publishDate ? new Date(volume.publishDate).toLocaleDateString() : "Not yet published"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Select 
                          value={volume.status} 
                          onValueChange={(value) => handleStatusUpdate(volume._id, value)}
                          disabled={updatingStatus === volume._id}
                        >
                          <SelectTrigger className="w-32">
                            {updatingStatus === volume._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => {
                            setSelectedVolume(volume._id || volume.id)
                            setActiveTab("assign")
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          Manage Articles
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteVolume(volume._id)}
                          disabled={deletingVolume === volume._id}
                        >
                          {deletingVolume === volume._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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