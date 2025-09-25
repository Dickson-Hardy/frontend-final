"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Filter, Calendar, FileText, Users } from "lucide-react"

export default function AdminUsersPage() {
  const users = [
    {
      id: "USER-001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      role: "Author",
      status: "active",
      lastLogin: "2024-01-20 14:30",
      submissions: 3,
      reviews: 0,
      createdAt: "2024-01-15",
    },
    {
      id: "USER-002",
      name: "Dr. Michael Chen",
      email: "michael.chen@hospital.edu",
      role: "Reviewer",
      status: "active",
      lastLogin: "2024-01-20 13:45",
      submissions: 0,
      reviews: 12,
      createdAt: "2024-01-10",
    },
    {
      id: "USER-003",
      name: "Dr. Lisa Wang",
      email: "lisa.wang@research.edu",
      role: "Associate Editor",
      status: "active",
      lastLogin: "2024-01-20 12:15",
      submissions: 0,
      reviews: 0,
      createdAt: "2024-01-05",
    },
    {
      id: "USER-004",
      name: "Dr. John Davis",
      email: "john.davis@university.edu",
      role: "Editor-in-Chief",
      status: "active",
      lastLogin: "2024-01-20 11:30",
      submissions: 0,
      reviews: 0,
      createdAt: "2024-01-01",
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800"
      case "Editor-in-Chief":
        return "bg-purple-100 text-purple-800"
      case "Associate Editor":
        return "bg-blue-100 text-blue-800"
      case "Reviewer":
        return "bg-green-100 text-green-800"
      case "Author":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage system users and their permissions</p>
        </div>
        <Button className="gap-2">
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
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="associate-editor">Associate Editor</SelectItem>
                  <SelectItem value="editor-in-chief">Editor-in-Chief</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select>
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
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Email:</span>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span>
                      <p>{user.lastLogin}</p>
                    </div>
                    <div>
                      <span className="font-medium">Submissions:</span>
                      <p>{user.submissions}</p>
                    </div>
                    <div>
                      <span className="font-medium">Reviews:</span>
                      <p>{user.reviews}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Permissions
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
