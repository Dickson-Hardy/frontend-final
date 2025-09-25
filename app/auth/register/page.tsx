"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building, 
  AlertCircle, 
  CheckCircle, 
  Shield,
  GraduationCap,
  FileText,
  UserCheck,
  ArrowLeft,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  affiliation: string
  role: string
  orcidId: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  affiliation?: string
  role?: string
  orcidId?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
}

// Registration is only for authors
const DEFAULT_ROLE = "author"

export default function RegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    affiliation: "",
    role: DEFAULT_ROLE,
    orcidId: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof RegistrationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        affiliation: formData.affiliation,
        role: formData.role,
        orcidId: formData.orcidId,
        password: formData.password,
      }

      const response = await authService.register(registrationData)
      
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification instructions.",
      })
      
      // Redirect to verification page or login
      router.push("/auth/login?message=registration-success")
      
    } catch (error: any) {
      console.error("Registration error:", error)
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message })
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: "Registration failed. Please try again." })
      }
      
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    const strength = [
      { score: 0, label: "Very Weak", color: "bg-red-500" },
      { score: 1, label: "Weak", color: "bg-red-400" },
      { score: 2, label: "Fair", color: "bg-yellow-500" },
      { score: 3, label: "Good", color: "bg-blue-500" },
      { score: 4, label: "Strong", color: "bg-green-500" },
      { score: 5, label: "Very Strong", color: "bg-green-600" },
    ]

    return strength[score] || strength[0]
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">AMHSJ</h1>
          </Link>
          <p className="text-gray-600 text-lg">Advances in Medicine & Health Sciences Journal</p>
          <p className="text-gray-500 mt-2">Register as an author to submit your research</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Create Author Account</CardTitle>
                <CardDescription>Step {currentStep} of 2 - Register to submit research</CardDescription>
              </div>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
            
            <Progress value={(currentStep / 2) * 100} className="h-2" />
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                        className={errors.firstName ? "border-red-500" : ""}
                        required
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                        className={errors.lastName ? "border-red-500" : ""}
                        required
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address"
                      className={errors.email ? "border-red-500" : ""}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliation" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Institution/Affiliation
                    </Label>
                    <Input
                      id="affiliation"
                      value={formData.affiliation}
                      onChange={(e) => handleInputChange("affiliation", e.target.value)}
                      placeholder="Your institution or organization"
                      className={errors.affiliation ? "border-red-500" : ""}
                    />
                    {errors.affiliation && (
                      <p className="text-sm text-red-600">{errors.affiliation}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Account Type
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-blue-900">Author Account</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        You will be able to submit and publish research articles
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orcidId" className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      ORCID ID
                    </Label>
                    <Input
                      id="orcidId"
                      value={formData.orcidId}
                      onChange={(e) => handleInputChange("orcidId", e.target.value)}
                      placeholder="0000-0000-0000-0000 (optional)"
                      className={errors.orcidId ? "border-red-500" : ""}
                    />
                    {errors.orcidId && (
                      <p className="text-sm text-red-600">{errors.orcidId}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      ORCID provides a persistent digital identifier that distinguishes you from other researchers.
                    </p>
                  </div>

                  <Button type="button" onClick={handleNext} className="w-full">
                    Continue to Security
                  </Button>
                </div>
              )}

              {/* Step 2: Password and Terms */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Create a strong password"
                        className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress value={(passwordStrength.score / 5) * 100} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{passwordStrength.label}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Password must be at least 8 characters with uppercase, lowercase, and numbers
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Confirm your password"
                        className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className={errors.agreeToTerms ? "border-red-500" : ""}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="agreeToTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                        <p className="text-xs text-gray-500">
                          By creating an account, you agree to our terms and acknowledge our privacy policy.
                        </p>
                      </div>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                    )}
                  </div>

                  {errors.general && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Author Account...
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Create Author Account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
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