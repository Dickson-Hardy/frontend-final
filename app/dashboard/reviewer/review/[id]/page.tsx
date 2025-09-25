"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Star, Clock, User, Building, AlertCircle, CheckCircle } from "lucide-react"

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [reviewData, setReviewData] = useState({
    overallRating: "",
    originality: "",
    methodology: "",
    results: "",
    discussion: "",
    writingQuality: "",
    recommendation: "",
    comments: "",
    confidentialComments: "",
    strengths: "",
    weaknesses: "",
    suggestions: "",
  })

  const manuscript = {
    id: params.id,
    title: "Impact of AI in Medical Diagnosis: A Systematic Review",
    authors: "Dr. Sarah Johnson, Dr. Michael Chen",
    abstract: "This systematic review examines the current state of artificial intelligence applications in medical diagnosis, focusing on accuracy, implementation challenges, and clinical outcomes. We analyzed 150 studies from 2018-2023, covering various AI technologies including machine learning, deep learning, and natural language processing in diagnostic applications.",
    category: "Review Articles",
    submittedDate: "2024-01-10",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-29",
    files: [
      { name: "manuscript.docx", size: "2.5MB", type: "Manuscript" },
      { name: "figures.pdf", size: "1.2MB", type: "Figures" },
      { name: "supplementary_data.xlsx", size: "800KB", type: "Supplementary Data" },
    ],
  }

  const handleSubmit = () => {
    console.log("Submitting review:", reviewData)
    // Submit review logic
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", reviewData)
    // Save draft logic
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Manuscript</h1>
          <p className="text-muted-foreground mt-2">Review ID: {manuscript.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>
            Submit Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manuscript Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Manuscript Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Title</h4>
                <p className="text-sm text-muted-foreground">{manuscript.title}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Authors
                </h4>
                <p className="text-sm text-muted-foreground">{manuscript.authors}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <Badge variant="outline">{manuscript.category}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Abstract</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{manuscript.abstract}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span>{new Date(manuscript.submittedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned:</span>
                  <span>{new Date(manuscript.assignedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="text-orange-600 font-medium">
                    {new Date(manuscript.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {manuscript.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size} • {file.type}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Review Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
              <CardDescription>Rate the manuscript on various criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Overall Rating *</Label>
                  <Select value={reviewData.overallRating} onValueChange={(value) => setReviewData({ ...reviewData, overallRating: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Excellent (5)</SelectItem>
                      <SelectItem value="4">Good (4)</SelectItem>
                      <SelectItem value="3">Fair (3)</SelectItem>
                      <SelectItem value="2">Poor (2)</SelectItem>
                      <SelectItem value="1">Very Poor (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Originality *</Label>
                  <Select value={reviewData.originality} onValueChange={(value) => setReviewData({ ...reviewData, originality: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Excellent (5)</SelectItem>
                      <SelectItem value="4">Good (4)</SelectItem>
                      <SelectItem value="3">Fair (3)</SelectItem>
                      <SelectItem value="2">Poor (2)</SelectItem>
                      <SelectItem value="1">Very Poor (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Methodology *</Label>
                  <Select value={reviewData.methodology} onValueChange={(value) => setReviewData({ ...reviewData, methodology: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Excellent (5)</SelectItem>
                      <SelectItem value="4">Good (4)</SelectItem>
                      <SelectItem value="3">Fair (3)</SelectItem>
                      <SelectItem value="2">Poor (2)</SelectItem>
                      <SelectItem value="1">Very Poor (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Results *</Label>
                  <Select value={reviewData.results} onValueChange={(value) => setReviewData({ ...reviewData, results: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Excellent (5)</SelectItem>
                      <SelectItem value="4">Good (4)</SelectItem>
                      <SelectItem value="3">Fair (3)</SelectItem>
                      <SelectItem value="2">Poor (2)</SelectItem>
                      <SelectItem value="1">Very Poor (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Discussion *</Label>
                  <Select value={reviewData.discussion} onValueChange={(value) => setReviewData({ ...reviewData, discussion: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Excellent (5)</SelectItem>
                      <SelectItem value="4">Good (4)</SelectItem>
                      <SelectItem value="3">Fair (3)</SelectItem>
                      <SelectItem value="2">Poor (2)</SelectItem>
                      <SelectItem value="1">Very Poor (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Writing Quality *</Label>
                  <Select value={reviewData.writingQuality} onValueChange={(value) => setReviewData({ ...reviewData, writingQuality: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Excellent (5)</SelectItem>
                      <SelectItem value="4">Good (4)</SelectItem>
                      <SelectItem value="3">Fair (3)</SelectItem>
                      <SelectItem value="2">Poor (2)</SelectItem>
                      <SelectItem value="1">Very Poor (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendation *</CardTitle>
              <CardDescription>Your recommendation for this manuscript</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={reviewData.recommendation} onValueChange={(value) => setReviewData({ ...reviewData, recommendation: value })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accept" id="accept" />
                  <Label htmlFor="accept" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Accept
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accept_with_minor_revisions" id="minor" />
                  <Label htmlFor="minor" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Accept with Minor Revisions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accept_with_major_revisions" id="major" />
                  <Label htmlFor="major" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Accept with Major Revisions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Reject
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments for Authors *</CardTitle>
              <CardDescription>Provide detailed feedback for the authors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Strengths</Label>
                <Textarea
                  placeholder="What are the main strengths of this manuscript?"
                  value={reviewData.strengths}
                  onChange={(e) => setReviewData({ ...reviewData, strengths: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Weaknesses</Label>
                <Textarea
                  placeholder="What are the main weaknesses or areas for improvement?"
                  value={reviewData.weaknesses}
                  onChange={(e) => setReviewData({ ...reviewData, weaknesses: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Suggestions for Improvement</Label>
                <Textarea
                  placeholder="Specific suggestions for improving the manuscript"
                  value={reviewData.suggestions}
                  onChange={(e) => setReviewData({ ...reviewData, suggestions: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Overall Comments *</Label>
                <Textarea
                  placeholder="Provide your overall assessment and recommendation rationale"
                  value={reviewData.comments}
                  onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Confidential Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Confidential Comments to Editor</CardTitle>
              <CardDescription>These comments will not be shared with the authors</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any confidential comments or concerns for the editor"
                value={reviewData.confidentialComments}
                onChange={(e) => setReviewData({ ...reviewData, confidentialComments: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
