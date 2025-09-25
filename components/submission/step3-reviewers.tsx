"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, UserCheck, AlertTriangle } from "lucide-react"

interface Step3Props {
  data: any
  onUpdate: (data: any) => void
}

export function Step3Reviewers({ data, onUpdate }: Step3Props) {
  const [reviewers, setReviewers] = useState(data.recommendedReviewers || [])

  const addReviewer = () => {
    const newReviewer = {
      id: Date.now(),
      name: "",
      email: "",
      affiliation: "",
      expertise: "",
      reason: "",
      conflictOfInterest: false,
    }
    const updatedReviewers = [...reviewers, newReviewer]
    setReviewers(updatedReviewers)
    onUpdate({ recommendedReviewers: updatedReviewers })
  }

  const removeReviewer = (id: number) => {
    const updatedReviewers = reviewers.filter((reviewer: any) => reviewer.id !== id)
    setReviewers(updatedReviewers)
    onUpdate({ recommendedReviewers: updatedReviewers })
  }

  const updateReviewer = (id: number, field: string, value: string | boolean) => {
    const updatedReviewers = reviewers.map((reviewer: any) =>
      reviewer.id === id ? { ...reviewer, [field]: value } : reviewer,
    )
    setReviewers(updatedReviewers)
    onUpdate({ recommendedReviewers: updatedReviewers })
  }

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Recommended Reviewers
          </CardTitle>
          <CardDescription>
            Suggest 3-5 qualified reviewers who have expertise in your research area. This helps expedite the review
            process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Reviewer Selection Guidelines:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Suggest reviewers with relevant expertise in your field</li>
                  <li>• Avoid reviewers from your own institution</li>
                  <li>• Do not suggest reviewers with personal relationships</li>
                  <li>• Ensure reviewers have recent publications in the area</li>
                  <li>• Provide clear reasons for each recommendation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviewers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Suggested Reviewers</CardTitle>
              <CardDescription>Add 3-5 potential reviewers for your manuscript</CardDescription>
            </div>
            <Button onClick={addReviewer} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Add Reviewer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reviewers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reviewers suggested yet</p>
              <p className="text-sm">Click "Add Reviewer" to suggest potential reviewers</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviewers.map((reviewer: any, index: number) => (
                <div key={reviewer.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Suggested Reviewer {index + 1}</h4>
                    <Button
                      onClick={() => removeReviewer(reviewer.id)}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name & Title *</Label>
                      <Input
                        placeholder="Dr. Sarah Johnson, PhD"
                        value={reviewer.name}
                        onChange={(e) => updateReviewer(reviewer.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="sarah.johnson@university.edu"
                        value={reviewer.email}
                        onChange={(e) => updateReviewer(reviewer.id, "email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Institutional Affiliation *</Label>
                    <Input
                      placeholder="Harvard Medical School, Department of Medicine"
                      value={reviewer.affiliation}
                      onChange={(e) => updateReviewer(reviewer.id, "affiliation", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Expertise Areas *</Label>
                    <Input
                      placeholder="Cardiology, Clinical Research, Biomarkers"
                      value={reviewer.expertise}
                      onChange={(e) => updateReviewer(reviewer.id, "expertise", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reason for Recommendation *</Label>
                    <Textarea
                      placeholder="Explain why this reviewer is suitable for your manuscript (expertise, recent publications, etc.)"
                      value={reviewer.reason}
                      onChange={(e) => updateReviewer(reviewer.id, "reason", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`conflict-${reviewer.id}`}
                      checked={reviewer.conflictOfInterest}
                      onCheckedChange={(checked) => updateReviewer(reviewer.id, "conflictOfInterest", checked)}
                    />
                    <Label htmlFor={`conflict-${reviewer.id}`} className="text-sm">
                      I declare no conflict of interest with this reviewer
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reviewer Guidelines</CardTitle>
          <CardDescription>Important considerations for reviewer suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-2">✓ Good Reviewer Suggestions:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Experts in your research field</li>
                <li>• Recent publications in relevant areas</li>
                <li>• Different institutions from authors</li>
                <li>• International diversity</li>
                <li>• Active researchers in the field</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-800 mb-2">✗ Avoid These Reviewers:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Colleagues from same institution</li>
                <li>• Personal friends or collaborators</li>
                <li>• Recent co-authors</li>
                <li>• Supervisors or students</li>
                <li>• Competitors with conflicts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
