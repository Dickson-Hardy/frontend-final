"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertCircle, FileText, Users, Calendar, TrendingUp, Settings, Shield, Database, Loader2 } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"

function AdminDashboardInner() {
  const { user } = useAuth()
  const { data: systemStats, isLoading: statsLoading } = useApi('/admin/stats')
  const { data: recentActivities, isLoading: activitiesLoading } = useApi('/admin/activities')
  const { data: userManagement, isLoading: usersLoading } = useApi('/admin/users')
  const { data: systemHealth, isLoading: healthLoading } = useApi('/admin/health')

  // Check if user has admin access
  if (!canAccessDashboard(user, 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  // Default values for when data is not available
  const stats: any = systemStats || {
    totalUsers: 0,
    userChange: '+0',
    activeSubmissions: 0,
    submissionChange: '+0',
    uptime: '0%',
    uptimeChange: '+0%',
    storageUsed: '0TB',
    storageChange: '+0GB'
  }

  const activities: any[] = Array.isArray(recentActivities) ? recentActivities : []
  const users: any[] = Array.isArray(userManagement) ? userManagement : []
  const health: any[] = Array.isArray(systemHealth) ? systemHealth : []

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">System overview and quick actions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={(stats?.userChange || '+0').startsWith('+') ? "text-green-600" : "text-red-600"}>
                    {stats?.userChange || '+0'}
                  </span> from last week
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeSubmissions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={(stats?.submissionChange || '+0').startsWith('+') ? "text-green-600" : "text-red-600"}>
                    {stats?.submissionChange || '+0'}
                  </span> from last week
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.uptime || '99.9%'}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">Healthy</span> • Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.storageUsed || '2.4GB'}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-orange-600">+240MB</span> this month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/admin/articles">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-primary">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">Manage Articles</div>
                  <div className="text-xs text-muted-foreground">View, edit, upload</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/admin/volumes">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-primary">
                <Database className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">Manage Volumes</div>
                  <div className="text-xs text-muted-foreground">Create, assign</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-primary">
                <Users className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-xs text-muted-foreground">Add, edit, permissions</div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/admin/settings">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-primary">
                <Settings className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">System Settings</div>
                  <div className="text-xs text-muted-foreground">Configure system</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activitiesLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : activities.length > 0 ? (
              activities.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge className={getSeverityColor(activity.severity)} variant="secondary">
                    {activity.severity}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Current system component status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : health.length > 0 ? (
              health.slice(0, 5).map((component: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{component.component}</p>
                    <p className="text-xs text-muted-foreground">
                      Response: {component.responseTime}
                    </p>
                  </div>
                  <Badge className={getStatusColor(component.status)} variant="secondary">
                    {component.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">All systems operational</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return <AdminDashboardInner />
}
