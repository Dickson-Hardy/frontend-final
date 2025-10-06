"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Edit,
  Trash2,
  Send,
  Search,
  Loader2,
  Calendar,
  FileCheck,
  Plus,
} from "lucide-react"
import { useApiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Draft {
  _id: string
  title: string
  manuscriptType: string
  keywords: string[]
  lastModified: string
  completionPercentage: number
  sections: {
    metadata: boolean
    authors: boolean
    abstract: boolean
    manuscript: boolean
    references: boolean
  }
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { get, del, post } = useApiClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      setLoading(true)
      const data = await get("/submissions/drafts")
      setDrafts(data)
    } catch (error) {
      console.error("Failed to fetch drafts:", error)
      toast({
        title: "Error",
        description: "Failed to load drafts.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft? This action cannot be undone."))
      return

    try {
      setDeletingId(id)
      await del(`/submissions/drafts/${id}`)
      setDrafts(drafts.filter((d) => d._id !== id))
      toast({
        title: "Draft deleted",
        description: "Your draft has been permanently deleted.",
      })
    } catch (error) {
      console.error("Failed to delete draft:", error)
      toast({
        title: "Error",
        description: "Failed to delete draft.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleContinue = (id: string) => {
    router.push(`/dashboard/submissions/new?draftId=${id}`)
  }

  const handleSubmit = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to submit this manuscript? Make sure all sections are complete."
      )
    )
      return

    try {
      await post(`/submissions/drafts/${id}/submit`, {})
      toast({
        title: "Submission successful",
        description: "Your manuscript has been submitted for review.",
      })
      router.push("/dashboard/submissions")
    } catch (error: any) {
      console.error("Failed to submit draft:", error)
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit manuscript.",
        variant: "destructive",
      })
    }
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredDrafts = drafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.manuscriptType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Draft Submissions</h1>
          <p className="text-muted-foreground mt-2">
            Continue working on your incomplete submissions
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/submissions/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Submission
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search drafts by title, type, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drafts</p>
                <p className="text-2xl font-bold">{drafts.length}</p>
              </div>
              <FileText className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nearly Complete</p>
                <p className="text-2xl font-bold">
                  {drafts.filter((d) => d.completionPercentage >= 80).length}
                </p>
              </div>
              <FileCheck className="h-10 w-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recently Modified</p>
                <p className="text-2xl font-bold">
                  {
                    drafts.filter((d) => {
                      const daysDiff =
                        (Date.now() - new Date(d.lastModified).getTime()) /
                        (1000 * 60 * 60 * 24)
                      return daysDiff <= 7
                    }).length
                  }
                </p>
              </div>
              <Calendar className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drafts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDrafts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No drafts found" : "No drafts yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start a new submission to create your first draft"}
            </p>
            {!searchQuery && (
              <Button onClick={() => router.push("/dashboard/submissions/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New Submission
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => (
            <Card key={draft._id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{draft.title || "Untitled Draft"}</h3>
                      <Badge variant="outline">{draft.manuscriptType}</Badge>
                    </div>

                    {draft.keywords.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        {draft.keywords.slice(0, 5).map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {draft.keywords.length > 5 && (
                          <span className="text-xs text-muted-foreground">
                            +{draft.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last modified: {new Date(draft.lastModified).toLocaleDateString()}
                      </span>
                      <span className={`font-semibold ${getCompletionColor(draft.completionPercentage)}`}>
                        {draft.completionPercentage}% complete
                      </span>
                    </div>

                    {/* Completion Checklist */}
                    <div className="flex items-center gap-4 text-xs">
                      {Object.entries(draft.sections).map(([section, completed]) => (
                        <div
                          key={section}
                          className={`flex items-center gap-1 ${completed ? "text-green-600" : "text-gray-400"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${completed ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <span className="capitalize">{section}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          draft.completionPercentage >= 80
                            ? "bg-green-500"
                            : draft.completionPercentage >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${draft.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {draft.completionPercentage >= 90 && (
                      <Button size="sm" onClick={() => handleSubmit(draft._id)}>
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContinue(draft._id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(draft._id)}
                      disabled={deletingId === draft._id}
                    >
                      {deletingId === draft._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
