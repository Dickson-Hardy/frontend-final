"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Search, Users, Loader2, AlertCircle, X } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { User, userService } from "@/lib/api"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const limit = 50
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Build API query parameters
  const apiParams = {
    page,
    limit,
    ...(roleFilter !== "all" && { role: roleFilter }),
    ...(searchQuery && { search: searchQuery }),
  }

  // Fetch users from API
  const { data: usersResponse, isLoading, error, refetch } = useApi<any>(
    `/users?${new URLSearchParams(Object.entries(apiParams).map(([k, v]) => [k, String(v)])).toString()}`
  )

  // Debug logging
  console.log('👥 Users Response:', usersResponse)
  console.log('👥 Users Data:', usersResponse?.data)
  console.log('👥 Is Array?:', Array.isArray(usersResponse?.data))

  const users = usersResponse?.data || []
  const totalUsers = usersResponse?.total || 0

  // Filter by status on client side (if needed)
  const filteredUsers = statusFilter === "all" 
    ? users 
    : users.filter((user: User) => user.status === statusFilter)

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await userService.delete(userId)
      toast({
        title: "User deleted",
        description: `${userName} has been successfully deleted.`
      })
      refetch() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive"
      })
    }
  }

  const getRoleColor = (role: string) => {
    const roleNormalized = role.toLowerCase().replace(/_/g, ' ')
    switch (roleNormalized) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "editor in chief":
      case "editor-in-chief":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "associate editor":
      case "associate-editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "editorial assistant":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
      case "editorial board":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      case "reviewer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "author":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const formatRoleDisplay = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage system users and their permissions</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or role..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="editorial_assistant">Editorial Assistant</SelectItem>
                  <SelectItem value="associate_editor">Associate Editor</SelectItem>
                  <SelectItem value="editorial_board">Editorial Board</SelectItem>
                  <SelectItem value="editor_in_chief">Editor-in-Chief</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({totalUsers})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to Load Users</h3>
              <p className="text-muted-foreground mb-4">
                {error.message || "An error occurred while fetching users"}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No users have been added yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user: User) => (
                <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge className={getRoleColor(user.role)}>
                        {formatRoleDisplay(user.role)}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      {user.emailVerified && (
                        <Badge variant="outline" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Email:</span>
                        <p className="truncate">{user.email}</p>
                      </div>
                      {user.affiliation && (
                        <div>
                          <span className="font-medium">Affiliation:</span>
                          <p className="truncate">{user.affiliation}</p>
                        </div>
                      )}
                      {user.lastLogin && (
                        <div>
                          <span className="font-medium">Last Login:</span>
                          <p>{format(new Date(user.lastLogin), "MMM dd, yyyy HH:mm")}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Joined:</span>
                        <p>{format(new Date(user.createdAt), "MMM dd, yyyy")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
          refetch() // Refresh user list
        }}
      />
    </div>
  )
}

// Create User Modal Component
function CreateUserModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "author",
    status: "active",
    affiliation: "",
    department: "",
    orcidId: "",
    bio: "",
    specializations: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format"
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Prepare user data
      const userData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        status: formData.status,
      }

      // Add optional fields if provided
      if (formData.affiliation.trim()) userData.affiliation = formData.affiliation.trim()
      if (formData.department.trim()) userData.department = formData.department.trim()
      if (formData.orcidId.trim()) userData.orcidId = formData.orcidId.trim()
      if (formData.bio.trim()) userData.bio = formData.bio.trim()
      if (formData.specializations.trim()) {
        userData.specializations = formData.specializations.split(",").map(s => s.trim()).filter(Boolean)
      }

      await userService.create(userData)
      
      toast({
        title: "User created successfully",
        description: `${formData.firstName} ${formData.lastName} has been added to the system.`
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "author",
        status: "active",
        affiliation: "",
        department: "",
        orcidId: "",
        bio: "",
        specializations: ""
      })

      onSuccess()
    } catch (error: any) {
      console.error("Error creating user:", error)
      toast({
        title: "Failed to create user",
        description: error.response?.data?.message || "An error occurred while creating the user",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Add a new user to the system. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john.doe@university.edu"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Minimum 6 characters"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
            <p className="text-xs text-muted-foreground">
              User will be able to change their password after first login
            </p>
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="editorial_assistant">Editorial Assistant</SelectItem>
                  <SelectItem value="associate_editor">Associate Editor</SelectItem>
                  <SelectItem value="editorial_board">Editorial Board</SelectItem>
                  <SelectItem value="editor_in_chief">Editor-in-Chief</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="affiliation">Affiliation</Label>
            <Input
              id="affiliation"
              value={formData.affiliation}
              onChange={(e) => handleInputChange("affiliation", e.target.value)}
              placeholder="University or Institution"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="e.g., Department of Medicine"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orcidId">ORCID iD</Label>
            <Input
              id="orcidId"
              value={formData.orcidId}
              onChange={(e) => handleInputChange("orcidId", e.target.value)}
              placeholder="0000-0000-0000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specializations">Specializations</Label>
            <Input
              id="specializations"
              value={formData.specializations}
              onChange={(e) => handleInputChange("specializations", e.target.value)}
              placeholder="Separate with commas: Cardiology, Surgery, Oncology"
            />
            <p className="text-xs text-muted-foreground">
              Enter specializations separated by commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Brief professional biography..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
