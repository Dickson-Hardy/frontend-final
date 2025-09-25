"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "./auth-provider"
import { canAccessDashboard } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredDashboard?: string
  fallbackRoute?: string
}

export function ProtectedRoute({ children, requiredDashboard, fallbackRoute = "/auth/login" }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute check:', { 
      isLoading, 
      isAuthenticated, 
      user: user?.email, 
      role: user?.role, 
      requiredDashboard 
    })
    
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('🛡️ Not authenticated, redirecting to:', fallbackRoute)
        router.push(fallbackRoute)
        return
      }

      if (requiredDashboard && !canAccessDashboard(user, requiredDashboard)) {
        console.log('🛡️ No access to dashboard:', requiredDashboard, 'user role:', user?.role)
        // Redirect to appropriate dashboard for user's role
        const userDashboard = getDashboardRoute(user)
        console.log('🛡️ Redirecting to user dashboard:', userDashboard)
        router.push(userDashboard)
        return
      }
      
      console.log('🛡️ Access granted')
    }
  }, [isAuthenticated, isLoading, user, requiredDashboard, router, fallbackRoute])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredDashboard && !canAccessDashboard(user, requiredDashboard)) {
    return null
  }

  return <>{children}</>
}

function getDashboardRoute(user: any) {
  // Implementation moved to auth.ts
  return "/dashboard"
}
