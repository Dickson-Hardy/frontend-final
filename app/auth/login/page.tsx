"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, Building, AlertCircle, Shield, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { login, getDashboardRoute } from "@/lib/auth"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const user = await login(email, password)
      setSuccess("Login successful!")
      
      // Redirect to appropriate dashboard
      const dashboardRoute = getDashboardRoute(user)
      router.push(dashboardRoute)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center space-y-3">
            <Image
              src="/logo.png"
              alt="AMHSJ Logo"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-900 mb-1">AMHSJ</h1>
              <p className="text-gray-600 text-sm">Advances in Medicine & Health Sciences Journal</p>
            </div>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input id="email" name="email" type="email" placeholder="Enter your email" className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="text-center">
                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Create Your Account</h3>
                    <p className="text-sm text-gray-600">
                      Join our community of medical researchers and healthcare professionals
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <User className="w-5 h-5 text-blue-600 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Complete Registration Form</div>
                          <div className="text-sm text-gray-500">Full name, email, affiliation, and role</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Shield className="w-5 h-5 text-green-600 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Secure Password Setup</div>
                          <div className="text-sm text-gray-500">Strong password with confirmation</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Mail className="w-5 h-5 text-purple-600 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Email Verification</div>
                          <div className="text-sm text-gray-500">Verify your email address</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href="/auth/register">
                    <Button className="w-full" size="lg">
                      Start Registration
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-600">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
