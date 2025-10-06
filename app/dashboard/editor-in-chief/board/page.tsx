"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Mail,
  Edit,
  Trash2,
  Shield,
  Award,
  Loader2,
  Search,
  Star,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface BoardMember {
  _id: string
  name: string
  email: string
  role: "editor_in_chief" | "associate_editor" | "editorial_assistant" | "reviewer"
  affiliation: string
  expertise: string[]
  status: "active" | "inactive" | "on_leave"
  joinedDate: string
  bio?: string
  publications?: number
  hIndex?: number
}

export default function EditorialBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "reviewer" as BoardMember["role"],
    affiliation: "",
    expertise: "",
    bio: "",
    publications: "",
    hIndex: "",
  })
  const { get, post, patch, del } = useApiClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const data = await get("/editorial/board")
      setMembers(data)
    } catch (error) {
      console.error("Failed to fetch board members:", error)
      toast({
        title: "Error",
        description: "Failed to load editorial board.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        expertise: formData.expertise.split(",").map((e) => e.trim()),
        publications: formData.publications ? parseInt(formData.publications) : undefined,
        hIndex: formData.hIndex ? parseInt(formData.hIndex) : undefined,
      }

      if (editingId) {
        await patch(`/editorial/board/${editingId}`, payload)
        toast({
          title: "Updated",
          description: "Board member updated successfully.",
        })
      } else {
        await post("/editorial/board", payload)
        toast({
          title: "Added",
          description: "New board member added successfully.",
        })
      }
      setDialogOpen(false)
      resetForm()
      fetchMembers()
    } catch (error) {
      console.error("Failed to save board member:", error)
      toast({
        title: "Error",
        description: "Failed to save board member.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (member: BoardMember) => {
    setEditingId(member._id)
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      affiliation: member.affiliation,
      expertise: member.expertise.join(", "),
      bio: member.bio || "",
      publications: member.publications?.toString() || "",
      hIndex: member.hIndex?.toString() || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this board member?")) return

    try {
      await del(`/editorial/board/${id}`)
      toast({
        title: "Removed",
        description: "Board member removed successfully.",
      })
      fetchMembers()
    } catch (error) {
      console.error("Failed to delete board member:", error)
      toast({
        title: "Error",
        description: "Failed to remove board member.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: "",
      email: "",
      role: "reviewer",
      affiliation: "",
      expertise: "",
      bio: "",
      publications: "",
      hIndex: "",
    })
  }

  const getRoleBadge = (role: BoardMember["role"]) => {
    const variants = {
      editor_in_chief: { icon: Shield, className: "bg-purple-100 text-purple-800" },
      associate_editor: { icon: Award, className: "bg-blue-100 text-blue-800" },
      editorial_assistant: { icon: Users, className: "bg-green-100 text-green-800" },
      reviewer: { icon: Star, className: "bg-gray-100 text-gray-800" },
    }
    const { icon: Icon, className } = variants[role]
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {role.replace(/_/g, " ")}
      </Badge>
    )
  }

  const getStatusBadge = (status: BoardMember["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      on_leave: "bg-yellow-100 text-yellow-800",
    }
    return (
      <Badge className={styles[status]}>
        {status.replace(/_/g, " ")}
      </Badge>
    )
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.affiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const groupedMembers = {
    editor_in_chief: filteredMembers.filter((m) => m.role === "editor_in_chief"),
    associate_editor: filteredMembers.filter((m) => m.role === "associate_editor"),
    editorial_assistant: filteredMembers.filter((m) => m.role === "editorial_assistant"),
    reviewer: filteredMembers.filter((m) => m.role === "reviewer"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editorial Board</h1>
          <p className="text-muted-foreground mt-2">
            Manage editorial board members and their roles
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Board Member" : "Add Board Member"}
              </DialogTitle>
              <DialogDescription>
                Add or update editorial board member information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor_in_chief">Editor-in-Chief</SelectItem>
                      <SelectItem value="associate_editor">Associate Editor</SelectItem>
                      <SelectItem value="editorial_assistant">Editorial Assistant</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="affiliation">Affiliation *</Label>
                  <Input
                    id="affiliation"
                    value={formData.affiliation}
                    onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                    placeholder="Institution"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expertise">Areas of Expertise *</Label>
                <Input
                  id="expertise"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="Separate with commas"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publications">Publications</Label>
                  <Input
                    id="publications"
                    type="number"
                    value={formData.publications}
                    onChange={(e) => setFormData({ ...formData, publications: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hIndex">H-Index</Label>
                  <Input
                    id="hIndex"
                    type="number"
                    value={formData.hIndex}
                    onChange={(e) => setFormData({ ...formData, hIndex: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Brief professional biography..."
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Add"} Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Members</p>
              <p className="text-3xl font-bold">{members.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Associate Editors</p>
              <p className="text-3xl font-bold">{groupedMembers.associate_editor.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Active Reviewers</p>
              <p className="text-3xl font-bold">
                {members.filter((m) => m.role === "reviewer" && m.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">On Leave</p>
              <p className="text-3xl font-bold">
                {members.filter((m) => m.status === "on_leave").length}
              </p>
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

      {/* Grouped Members */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMembers).map(([role, roleMembers]) => (
            roleMembers.length > 0 && (
              <div key={role}>
                <h2 className="text-xl font-semibold mb-4 capitalize">
                  {role.replace(/_/g, " ")}s ({roleMembers.length})
                </h2>
                <div className="space-y-4">
                  {roleMembers.map((member) => (
                    <Card key={member._id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{member.name}</h3>
                              {getRoleBadge(member.role)}
                              {getStatusBadge(member.status)}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </span>
                              <span>{member.affiliation}</span>
                              {member.publications && (
                                <span>{member.publications} publications</span>
                              )}
                              {member.hIndex && <span>h-index: {member.hIndex}</span>}
                            </div>

                            {member.expertise.length > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                {member.expertise.map((exp, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {exp}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {member.bio && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {member.bio}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(member)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDelete(member._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}
