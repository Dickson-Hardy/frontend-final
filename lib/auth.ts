// Authentication utilities and types
import { authService } from './api'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  affiliation?: string
  bio?: string
  profileImage?: any
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type UserRole = "author" | "reviewer" | "editorial_assistant" | "associate_editor" | "editor_in_chief" | "admin"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginResponse {
  access_token: string
  user: User
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export const setAuthData = (token: string, user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export const clearAuthData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("currentUser")
  }
}

export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('🔐 Attempting login with:', email)
    const response = await authService.login(email, password)
    console.log('✅ Login response received:', response.data)
    
    const { access_token, user } = response.data as LoginResponse
    console.log('🎫 Access token received:', access_token.substring(0, 50) + '...')
    console.log('👤 User data received:', user)
    
    setAuthData(access_token, user)
    console.log('💾 Auth data stored in localStorage')
    
    // Trigger auth refresh event for immediate UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-login-success'))
    }
    
    return user
  } catch (error: any) {
    console.log('❌ Login failed:', error)
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

export const logout = (): void => {
  clearAuthData()
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login"
  }
}

export const register = async (userData: Omit<User, "id" | "createdAt" | "updatedAt" | "isActive">): Promise<User> => {
  try {
    const response = await authService.register(userData)
    return response.data.user
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

export const getProfile = async (): Promise<User> => {
  try {
    console.log('🔍 Fetching user profile...')
    const response = await authService.getProfile()
    console.log('✅ Profile response received:', response.data)
    return response.data
  } catch (error: any) {
    console.log('❌ Profile fetch failed:', error)
    throw new Error(error.response?.data?.message || "Failed to get profile")
  }
}

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  try {
    const response = await authService.updateProfile(data)
    const updatedUser = response.data
    setAuthData(getAuthToken() || "", updatedUser)
    return updatedUser
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile")
  }
}

// Role-based access control
export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  return user ? roles.includes(user.role) : false
}

export const canAccessDashboard = (user: User | null, dashboardType: string): boolean => {
  if (!user) return false

  const rolePermissions: Record<UserRole, string[]> = {
    author: ["submissions", "profile"],
    reviewer: ["reviewer", "profile"],
    editorial_assistant: ["editorial", "profile"],
    associate_editor: ["associate-editor", "profile"],
    editor_in_chief: ["editor-in-chief", "editorial", "associate-editor", "profile"],
    admin: ["admin", "editor-in-chief", "editorial", "associate-editor", "reviewer", "submissions", "profile"],
  }

  return rolePermissions[user.role]?.includes(dashboardType) || false
}

export const getDashboardRoute = (user: User | null): string => {
  if (!user) return "/auth/login"

  const dashboardRoutes: Record<UserRole, string> = {
    author: "/dashboard/submissions",
    reviewer: "/dashboard/reviewer",
    editorial_assistant: "/dashboard/editorial",
    associate_editor: "/dashboard/associate-editor",
    editor_in_chief: "/dashboard/editor-in-chief",
    admin: "/dashboard/admin",
  }

  return dashboardRoutes[user.role] || "/dashboard"
}
