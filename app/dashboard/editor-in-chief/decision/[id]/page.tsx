"use client"

import { useState, useEffect } from "react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { articleService, userService, editorialDecisionService } from "@/lib/api"
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
  const { toast } = useToast()
  const [decision, setDecision] = useState("")
  const [assignedEditor, setAssignedEditor] = useState("")
  const [comments, setComments] = useState("")
  const [priority, setPriority] = useState("")
  const [submission, setSubmission] = useState<any>(null)
  const [associateEditors, setAssociateEditors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissionData()
    fetchAssociateEditors()
  }, [params.id])

  const fetchSubmissionData = async () => {
    try {
      const response = await articleService.getById(params.id)
      setSubmission(response.data)
    } catch (error) {
      console.error('Failed to fetch submission:', error)
      toast({
        title: "Error",
        description: "Failed to load submission data.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAssociateEditors = async () => {
    try {
      const response = await userService.getAll({ role: 'associate_editor' })
      const users = response.data.data || response.data
      setAssociateEditors(users.map((user: any) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        specialty: user.specializations?.[0] || 'General',
        workload: 0, // TODO: Calculate from assigned articles
        availability: 'available'
      })))
    } catch (error) {
      console.error('Failed to fetch editors:', error)
    }
  }

  const handleDecision = async (decisionType: string) => {
    if (decisionType === 'approve' && !assignedEditor) {
      toast({
        title: "Validation Error",
        description: "Please select an associate editor.",
        variant: "destructive"
      })
      return
    }

    try {
      await editorialDecisionService.create({
        articleId: params.id,
        decision: decisionType,
        assignedEditor: assignedEditor || undefined,
        comments,
        priority: priority || 'standard'
      })

      toast({
        title: "Decision Submitted",
        description: `Editorial decision "${decisionType}" has been recorded.`
      })

      setDecision(decisionType)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit decision.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submission...</p>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Submission not found</p>
        </div>
      </div>
    )
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
                  <span>by {submission.authors?.[0]?.name || 'Unknown'}</span>
                  <Badge variant="outline">{submission.categories?.[0] || submission.type}</Badge>
                  <span>Submitted: {new Date(submission.submissionDate || submission.createdAt).toLocaleDateString()}</span>
                  <Badge className="bg-green-100 text-green-800">{submission.status}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Abstract</Label>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{submission.abstract}</p>
              </div>

              {submission.keywords && submission.keywords.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Keywords</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {submission.keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {submission.authors && submission.authors.length > 1 && (
                <div>
                  <Label className="text-sm font-medium">Co-Authors</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {submission.authors.slice(1).map((a: any) => a.name).join(", ")}
                  </p>
                </div>
              )}
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
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Submission Status</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Status: {submission.status}
                        </p>
                        <p className="text-sm text-blue-700">
                          Type: {submission.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ea-review" className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Submission Details</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Review the submission details and make your editorial decision.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                  <div className="space-y-3">
                    {submission.files && submission.files.length > 0 ? (
                      submission.files.map((file: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-sm">{file.filename || file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'} • {file.type || 'File'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                                Preview
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                              <a href={file.url} download>
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No files attached</p>
                      </div>
                    )}
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
