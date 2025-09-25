"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, CheckCircle, AlertCircle, Clock, User, Building } from "lucide-react"

export default function EditorialReviewPage({ params }: { params: { id: string } }) {
  const [reviewData, setReviewData] = useState({
    formattingCheck: false,
    ethicsApproval: false,
    plagiarismCheck: false,
    referencesCheck: false,
    figuresCheck: false,
    qualityScore: "",
    issues: "",
    recommendations: "",
    editorNotes: "",
    readyForReview: false,
  })

  const manuscript = {
    id: params.id,
    title: "Impact of AI in Medical Diagnosis: A Systematic Review",
    authors: "Dr. Sarah Johnson, Dr. Michael Chen",
    abstract: "This systematic review examines the current state of artificial intelligence applications in medical diagnosis, focusing on accuracy, implementation challenges, and clinical outcomes. We analyzed 150 studies from 2018-2023, covering various AI technologies including machine learning, deep learning, and natural language processing in diagnostic applications.",
    category: "Review Articles",
    submittedDate: "2024-01-10",
    status: "initial_review",
    files: [
      { name: "manuscript.docx", size: "2.5MB", type: "Manuscript" },
      { name: "figures.pdf", size: "1.2MB", type: "Figures" },
      { name: "supplementary_data.xlsx", size: "800KB", type: "Supplementary Data" },
    ],
    qualityChecks: {
      plagiarism: { status: "passed", score: "2%" },
      formatting: { status: "failed", issues: ["Missing page numbers", "Inconsistent citation format"] },
      ethics: { status: "pending", note: "Ethics approval statement required" },
      references: { status: "passed", count: 150 },
    },
  }

  const handleSubmit = () => {
    console.log("Submitting editorial review:", reviewData)
    // Submit review logic
  }

  const handleAssignEditor = () => {
    console.log("Assigning editor")
    // Assign editor logic
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editorial Review</h1>
          <p className="text-muted-foreground mt-2">Manuscript ID: {manuscript.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAssignEditor}>
            Assign Editor
          </Button>
          <Button onClick={handleSubmit}>
            Complete Review
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
                <h4 className="font-medium mb-2">Status</h4>
                <Badge className="bg-blue-100 text-blue-800">{manuscript.status.replace("_", " ")}</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span>{new Date(manuscript.submittedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quality Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Plagiarism Check</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Passed ({manuscript.qualityChecks.plagiarism.score})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Formatting</span>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Issues Found</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ethics Approval</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">Pending</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">References</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Passed ({manuscript.qualityChecks.references.count})</span>
                  </div>
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
          {/* Quality Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Checklist</CardTitle>
              <CardDescription>Verify manuscript meets quality standards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="formatting"
                    checked={reviewData.formattingCheck}
                    onCheckedChange={(checked) => setReviewData({ ...reviewData, formattingCheck: checked as boolean })}
                  />
                  <Label htmlFor="formatting" className="text-sm">
                    Formatting meets journal standards
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ethics"
                    checked={reviewData.ethicsApproval}
                    onCheckedChange={(checked) => setReviewData({ ...reviewData, ethicsApproval: checked as boolean })}
                  />
                  <Label htmlFor="ethics" className="text-sm">
                    Ethics approval statement included
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="plagiarism"
                    checked={reviewData.plagiarismCheck}
                    onCheckedChange={(checked) => setReviewData({ ...reviewData, plagiarismCheck: checked as boolean })}
                  />
                  <Label htmlFor="plagiarism" className="text-sm">
                    Plagiarism check passed
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="references"
                    checked={reviewData.referencesCheck}
                    onCheckedChange={(checked) => setReviewData({ ...reviewData, referencesCheck: checked as boolean })}
                  />
                  <Label htmlFor="references" className="text-sm">
                    References properly formatted
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="figures"
                    checked={reviewData.figuresCheck}
                    onCheckedChange={(checked) => setReviewData({ ...reviewData, figuresCheck: checked as boolean })}
                  />
                  <Label htmlFor="figures" className="text-sm">
                    Figures meet quality standards
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Assessment</CardTitle>
              <CardDescription>Rate the overall quality of the manuscript</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quality Score *</Label>
                  <Select value={reviewData.qualityScore} onValueChange={(value) => setReviewData({ ...reviewData, qualityScore: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (5/5)</SelectItem>
                      <SelectItem value="good">Good (4/5)</SelectItem>
                      <SelectItem value="fair">Fair (3/5)</SelectItem>
                      <SelectItem value="poor">Poor (2/5)</SelectItem>
                      <SelectItem value="very_poor">Very Poor (1/5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Issues Identified</Label>
                  <Textarea
                    placeholder="List any issues found during quality review"
                    value={reviewData.issues}
                    onChange={(e) => setReviewData({ ...reviewData, issues: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Recommendations</Label>
                  <Textarea
                    placeholder="Provide recommendations for improvement"
                    value={reviewData.recommendations}
                    onChange={(e) => setReviewData({ ...reviewData, recommendations: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Editor Notes</CardTitle>
              <CardDescription>Internal notes for editorial team</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any internal notes or observations"
                value={reviewData.editorNotes}
                onChange={(e) => setReviewData({ ...reviewData, editorNotes: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Final Decision */}
          <Card>
            <CardHeader>
              <CardTitle>Final Decision</CardTitle>
              <CardDescription>Determine if manuscript is ready for peer review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ready"
                  checked={reviewData.readyForReview}
                  onCheckedChange={(checked) => setReviewData({ ...reviewData, readyForReview: checked as boolean })}
                />
                <Label htmlFor="ready" className="text-sm">
                  Manuscript is ready for peer review
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}