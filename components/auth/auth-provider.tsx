"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, getCurrentUser, getAuthToken, getProfile, clearAuthData } from "@/lib/auth"

const AuthContext = createContext<
  AuthState & {
    setUser: (user: User | null) => void
  }
>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing auth...')
        
        // Wait for localStorage to be available
        let attempts = 0
        while (attempts < 10 && typeof window === 'undefined') {
          await new Promise(resolve => setTimeout(resolve, 50))
          attempts++
        }
        
        const token = getAuthToken()
        const storedUser = getCurrentUser()
        
        console.log('🔑 Token exists:', !!token)
        console.log('🔑 Token preview:', token ? token.substring(0, 50) + '...' : 'null')
        console.log('👤 Stored user exists:', !!storedUser)
        console.log('👤 Stored user:', storedUser)

        if (!isMounted) return

        if (token && storedUser) {
          // Optimistically set user from storage to prevent flicker/bounce
          setUser(storedUser)
          console.log('🔍 Validating token with backend...')
          // Verify token is still valid by fetching profile
          try {
            const currentUser = await getProfile()
            console.log('✅ Token validation successful:', currentUser)
            if (isMounted) {
              setUser(currentUser)
            }
          } catch (error) {
            console.log('❌ Token validation failed:', error)
            console.log('❌ Error details:', error)
            // Token is invalid, clear auth data
            clearAuthData()
            if (isMounted) {
              setUser(null)
            }
          }
        } else {
          console.log('ℹ️ No token or user found, setting user to null')
          if (!token) console.log('ℹ️ Reason: No token')
          if (!storedUser) console.log('ℹ️ Reason: No stored user')
          if (isMounted) {
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        clearAuthData()
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          console.log('🏁 Auth initialization complete')
          setIsLoading(false)
        }
      }
    }

    initializeAuth()
    
    return () => {
      isMounted = false
    }
  }, [])

  // Listen for global unauthorized events from the API layer
  useEffect(() => {
    const onUnauthorized = () => {
      clearAuthData()
      setUser(null)
    }
    
    const onLoginSuccess = () => {
      refreshAuth()
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('auth-unauthorized', onUnauthorized)
      window.addEventListener('auth-login-success', onLoginSuccess)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-unauthorized', onUnauthorized)
        window.removeEventListener('auth-login-success', onLoginSuccess)
      }
    }
  }, [])

  const refreshAuth = () => {
    const token = getAuthToken()
    const storedUser = getCurrentUser()
    if (token && storedUser) {
      setUser(storedUser)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
