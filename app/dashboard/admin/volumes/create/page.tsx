"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Book, AlertCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import { VolumeCreationForm } from "@/components/admin/volume-creation-form"

export default function VolumeCreationPage() {
  const { user } = useAuth()

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

  const handleSuccess = () => {
    toast({
      title: "Volume Created Successfully",
      description: "The new volume has been created and is ready for content."
    })
    // In a real app, you might redirect or refresh the volumes list
  }

  const handleCancel = () => {
    // In a real app, you might navigate back or show a confirmation dialog
    toast({
      title: "Creation Cancelled",
      description: "Volume creation has been cancelled."
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Book className="h-8 w-8 text-blue-600" />
          Create New Volume
        </h1>
        <p className="text-muted-foreground mt-2">Create a new volume/issue for the journal</p>
      </div>

      {/* Volume Creation Form */}
      <VolumeCreationForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Volume Creation Guidelines</CardTitle>
          <CardDescription>Important information about creating volumes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Before Creating a Volume:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure all required fields are completed</li>
                <li>• Verify volume and issue numbers are unique</li>
                <li>• Assign an appropriate editor</li>
                <li>• Set realistic publication dates</li>
                <li>• Review special issue requirements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">After Volume Creation:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Volume will be available for article submissions</li>
                <li>• Assigned editor will receive notifications</li>
                <li>• Volume settings can be modified later</li>
                <li>• Articles can be assigned to this volume</li>
                <li>• Publication workflow will begin</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common volume management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Book className="h-6 w-6" />
              <span>View All Volumes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Duplicate Volume</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CalendarIcon className="h-6 w-6" />
              <span>Schedule Publication</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
