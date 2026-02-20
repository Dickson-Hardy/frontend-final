"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, FileText, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const reviewSchema = z.object({
  recommendation: z.enum(["accept", "minor_revision", "major_revision", "reject"]),
  comments: z.string().min(100, "Comments must be at least 100 characters"),
  confidentialComments: z.string().optional(),
  ratings: z.object({
    originality: z.number().min(1).max(5),
    methodology: z.number().min(1).max(5),
    significance: z.number().min(1).max(5),
    clarity: z.number().min(1).max(5),
    overall: z.number().min(1).max(5),
  }),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  reviewId: string
  articleTitle: string
  articleAbstract: string
  manuscriptUrl?: string
  onSubmit: (data: ReviewFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ReviewForm({
  reviewId,
  articleTitle,
  articleAbstract,
  manuscriptUrl,
  onSubmit,
  isSubmitting = false
}: ReviewFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      recommendation: "accept",
      comments: "",
      confidentialComments: "",
      ratings: {
        originality: 3,
        methodology: 3,
        significance: 3,
        clarity: 3,
        overall: 3,
      },
    },
  })

  const handleSubmit = async (data: ReviewFormData) => {
    try {
      await onSubmit(data)
      toast({
        title: "Review submitted",
        description: "Your review has been successfully submitted"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      })
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "accept":
        return "bg-green-100 text-green-800"
      case "minor_revision":
        return "bg-blue-100 text-blue-800"
      case "major_revision":
        return "bg-yellow-100 text-yellow-800"
      case "reject":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "accept":
        return <CheckCircle className="h-4 w-4" />
      case "minor_revision":
        return <AlertCircle className="h-4 w-4" />
      case "major_revision":
        return <AlertCircle className="h-4 w-4" />
      case "reject":
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return "Poor"
      case 2: return "Fair"
      case 3: return "Good"
      case 4: return "Very Good"
      case 5: return "Excellent"
      default: return "Good"
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  i + 1 < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Step 1: Article Review */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
              <CardDescription>
                Review the article details and download the manuscript
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Title</Label>
                <p className="text-sm text-muted-foreground mt-1">{articleTitle}</p>
              </div>

              <div>
                <Label className="text-base font-medium">Abstract</Label>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {articleAbstract}
                </p>
              </div>

              {manuscriptUrl && (
                <div>
                  <Label className="text-base font-medium">Manuscript</Label>
                  <div className="mt-2">
                    <Button variant="outline" asChild>
                      <a href={manuscriptUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Manuscript
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button onClick={() => setCurrentStep(2)} className="w-full">
                  Continue to Ratings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Ratings */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Quality Ratings</CardTitle>
              <CardDescription>
                Rate different aspects of the article on a scale of 1-5
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(form.watch("ratings")).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium capitalize">
                      {key === "methodology" ? "Methodology" : key}
                    </Label>
                    <Badge variant="outline">
                      {value} - {getRatingLabel(value)}
                    </Badge>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) =>
                      form.setValue(`ratings.${key}` as any, newValue[0])
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor (1)</span>
                    <span>Excellent (5)</span>
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="flex-1">
                  Continue to Comments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Comments */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Comments</CardTitle>
              <CardDescription>
                Provide detailed feedback for the authors and editors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="comments">Comments for Authors *</Label>
                <Textarea
                  id="comments"
                  {...form.register("comments")}
                  placeholder="Provide constructive feedback for the authors. This will be shared with them."
                  rows={8}
                  className="mt-1"
                />
                {form.formState.errors.comments && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.comments.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confidentialComments">Confidential Comments for Editors</Label>
                <Textarea
                  id="confidentialComments"
                  {...form.register("confidentialComments")}
                  placeholder="Optional: Comments that will only be visible to editors"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(4)} className="flex-1">
                  Continue to Recommendation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Recommendation */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Final Recommendation</CardTitle>
              <CardDescription>
                Make your recommendation for this article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Recommendation *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {[
                    { value: "accept", label: "Accept", description: "Article is ready for publication" },
                    { value: "minor_revision", label: "Minor Revision", description: "Small changes needed" },
                    { value: "major_revision", label: "Major Revision", description: "Significant changes required" },
                    { value: "reject", label: "Reject", description: "Article not suitable for publication" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        form.watch("recommendation") === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => form.setValue("recommendation", option.value as any)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getRecommendationIcon(option.value)}
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Summary */}
              <Separator />
              
              <div>
                <Label className="text-base font-medium">Review Summary</Label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Overall Rating:</span>
                    <Badge variant="outline">
                      {form.watch("ratings.overall")} - {getRatingLabel(form.watch("ratings.overall"))}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recommendation:</span>
                    <Badge className={getRecommendationColor(form.watch("recommendation"))}>
                      {form.watch("recommendation").replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Comments Length:</span>
                    <span className="text-sm text-muted-foreground">
                      {form.watch("comments").length} characters
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}