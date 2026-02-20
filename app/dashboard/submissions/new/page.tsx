"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SubmissionForm } from "@/components/submissions/submission-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Upload } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

export default function NewSubmissionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any, files: FileList[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an article",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      
      // Add submission data
      Object.keys(data).forEach(key => {
        if (key === 'authors' || key === 'keywords' || key === 'references') {
          formData.append(key, JSON.stringify(data[key]))
        } else {
          formData.append(key, data[key])
        }
      })

      // Add files
      if (files[0]) {
        Array.from(files[0]).forEach(file => {
          formData.append('manuscript', file)
        })
      }
      
      if (files[1]) {
        Array.from(files[1]).forEach(file => {
          formData.append('supplementary', file)
        })
      }

      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit article')
      }

      const result = await response.json()
      
      toast({
        title: "Submission successful",
        description: "Your article has been successfully submitted for review"
      })

      router.push(`/dashboard/submissions/${result._id}`)
      
    } catch (error: any) {
      console.error('Submission error:', error)
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit article. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async (data: any) => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/drafts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save draft')
      }

      return await response.json()
    } catch (error) {
      console.error('Draft save error:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/submissions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submissions
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Submission</h1>
          <p className="text-muted-foreground mt-2">Submit your article for peer review</p>
        </div>
      </div>

      {/* Guidelines Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submission Guidelines
          </CardTitle>
          <CardDescription>
            Please review these guidelines before submitting your article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Manuscripts should be original work not published elsewhere</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>All authors must have contributed significantly to the work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Provide a comprehensive abstract (100+ words)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Include at least 3 relevant keywords</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Declare any conflicts of interest</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Manuscript files should be in PDF, DOC, or DOCX format</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Submission Form */}
      <SubmissionForm
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
        mode="create"
      />
    </div>
  )
}