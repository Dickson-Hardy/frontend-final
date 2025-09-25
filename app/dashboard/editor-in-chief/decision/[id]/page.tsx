"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Crown, FileText, Users, CheckCircle, ThumbsUp, ThumbsDown, Flag, Eye, Download } from "lucide-react"
import Link from "next/link"

export default function EICDecisionPage({ params }: { params: { id: string } }) {
  const [decision, setDecision] = useState("")
  const [assignedEditor, setAssignedEditor] = useState("")
  const [comments, setComments] = useState("")
  const [priority, setPriority] = useState("")

  // Mock submission data
  const submission = {
    id: params.id,
    title: "Impact of AI in Medical Diagnosis: A Systematic Review",
    author: "Dr. Sarah Johnson",
    coAuthors: ["Dr. Michael Chen", "Dr. Emily Rodriguez"],
    submittedDate: "2024-01-20",
    category: "Review Articles",
    eaRecommendation: "approved",
    eaComments:
      "Manuscript meets technical requirements. Plagiarism score: 8%. Format compliance verified. Scope fits journal well.",
    abstract:
      "This systematic review examines the current state and future potential of artificial intelligence applications in medical diagnosis. We analyzed 150 peer-reviewed studies published between 2020-2024 to assess the effectiveness, accuracy, and clinical implementation of AI diagnostic tools across various medical specialties. Our findings indicate significant improvements in diagnostic accuracy (average 15% increase) and reduced time to diagnosis (average 30% reduction) when AI tools are integrated into clinical workflows. However, challenges remain in terms of regulatory approval, clinical integration, and physician acceptance. This review provides comprehensive insights into the transformative potential of AI in medical diagnosis and offers recommendations for future research and implementation strategies.",
    keywords: [
      "Artificial Intelligence",
      "Medical Diagnosis",
      "Machine Learning",
      "Healthcare Technology",
      "Clinical Decision Support",
      "Systematic Review",
    ],
    significance: "high",
    novelty: "high",
    methodology: "excellent",
    clinicalRelevance: "high",
    writingQuality: "good",
  }

  const associateEditors = [
    { id: "ae1", name: "Dr. James Wilson", specialty: "AI in Healthcare", workload: 8, availability: "available" },
    { id: "ae2", name: "Dr. Lisa Park", specialty: "Medical Technology", workload: 12, availability: "busy" },
    { id: "ae3", name: "Dr. Robert Kim", specialty: "Clinical Research", workload: 6, availability: "available" },
    {
      id: "ae4",
      name: "Dr. Maria Garcia",
      specialty: "Healthcare Innovation",
      workload: 10,
      availability: "available",
    },
  ]

  const handleDecision = (decisionType: string) => {
    setDecision(decisionType)
    console.log("EIC Decision:", decisionType, "Editor:", assignedEditor, "Comments:", comments)
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/editor-in-chief">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-yellow-600" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editor-in-Chief Decision</h1>
            <p className="text-muted-foreground">Submission ID: {submission.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submission Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submission Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{submission.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>by {submission.author}</span>
                  <Badge variant="outline">{submission.category}</Badge>
                  <span>Submitted: {new Date(submission.submittedDate).toLocaleDateString()}</span>
                  <Badge className="bg-green-100 text-green-800">EA: {submission.eaRecommendation}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Abstract</Label>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{submission.abstract}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Keywords</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {submission.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Co-Authors</Label>
                <p className="text-sm text-muted-foreground mt-1">{submission.coAuthors.join(", ")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quality Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Editorial Assessment</CardTitle>
              <CardDescription>Quality evaluation for editorial decision</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="quality" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
                  <TabsTrigger value="ea-review">EA Review</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>

                <TabsContent value="quality" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm font-medium">Scientific Significance</span>
                        <Badge className={getQualityColor(submission.significance)}>{submission.significance}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm font-medium">Novelty</span>
                        <Badge className={getQualityColor(submission.novelty)}>{submission.novelty}</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm font-medium">Methodology</span>
                        <Badge className={getQualityColor(submission.methodology)}>{submission.methodology}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm font-medium">Clinical Relevance</span>
                        <Badge className={getQualityColor(submission.clinicalRelevance)}>
                          {submission.clinicalRelevance}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Editorial Recommendation</p>
                        <p className="text-sm text-blue-700 mt-1">
                          This manuscript demonstrates high scientific merit and clinical relevance. The systematic
                          review methodology is robust and the findings are significant for the field of AI in medical
                          diagnosis. Recommend approval for peer review.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ea-review" className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Editorial Assistant Review</p>
                        <p className="text-sm text-green-700 mt-1">{submission.eaComments}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">Plagiarism Check</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm text-green-700">8% - Low Risk</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">Format Compliance</p>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Verified</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "manuscript.docx", size: "2.4 MB", type: "Manuscript" },
                      { name: "figures.zip", size: "8.1 MB", type: "Figures" },
                      { name: "supplementary_data.xlsx", size: "1.2 MB", type: "Supplementary" },
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.size} • {file.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Decision Panel */}
        <div className="space-y-6">
          {/* Associate Editor Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Associate Editor Assignment
              </CardTitle>
              <CardDescription>Select an associate editor for peer review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editor">Select Associate Editor</Label>
                <Select value={assignedEditor} onValueChange={setAssignedEditor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an associate editor" />
                  </SelectTrigger>
                  <SelectContent>
                    {associateEditors.map((editor) => (
                      <SelectItem key={editor.id} value={editor.id} disabled={editor.availability === "busy"}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="font-medium">{editor.name}</p>
                            <p className="text-xs text-muted-foreground">{editor.specialty}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={editor.availability === "available" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {editor.workload} manuscripts
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {assignedEditor && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Selected Editor</p>
                  <p className="text-xs text-blue-700">
                    {associateEditors.find((e) => e.id === assignedEditor)?.name} -{" "}
                    {associateEditors.find((e) => e.id === assignedEditor)?.specialty}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority Setting */}
          <Card>
            <CardHeader>
              <CardTitle>Review Priority</CardTitle>
              <CardDescription>Set review timeline priority</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (30 days)</SelectItem>
                  <SelectItem value="expedited">Expedited (21 days)</SelectItem>
                  <SelectItem value="urgent">Urgent (14 days)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* EIC Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Editorial Comments</CardTitle>
              <CardDescription>Comments for the associate editor</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your editorial guidance and comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Decision Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Editorial Decision</CardTitle>
              <CardDescription>Make your final decision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleDecision("approve")}
                disabled={!assignedEditor}
                className="w-full gap-2 bg-green-600 hover:bg-green-700"
              >
                <ThumbsUp className="h-4 w-4" />
                Approve for Peer Review
              </Button>

              <Button
                onClick={() => handleDecision("desk-reject")}
                variant="outline"
                className="w-full gap-2 text-red-700 hover:text-red-700 bg-transparent"
              >
                <ThumbsDown className="h-4 w-4" />
                Desk Reject
              </Button>

              <Button
                onClick={() => handleDecision("special-review")}
                variant="outline"
                className="w-full gap-2 text-yellow-700 hover:text-yellow-700 bg-transparent"
              >
                <Flag className="h-4 w-4" />
                Special Editorial Review
              </Button>

              {!assignedEditor && (
                <p className="text-xs text-muted-foreground text-center">
                  Select an associate editor to enable approval
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
