"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard
      const roleRoutes: Record<string, string> = {
        admin: "/dashboard/admin",
        editor_in_chief: "/dashboard/editor-in-chief",
        associate_editor: "/dashboard/associate-editor",
        editorial_assistant: "/dashboard/editorial",
        reviewer: "/dashboard/reviewer",
        author: "/dashboard/author"
      }

      const redirectPath = roleRoutes[user.role] || "/dashboard/author"
      router.replace(redirectPath)
    }
  }, [user, isLoading, router])

  // Show loading while determining user role and redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
        <p className="text-gray-600">Redirecting to your personalized dashboard...</p>
      </div>
    </div>
  )
}
