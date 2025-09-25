"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, User, Building } from "lucide-react"

interface Step2Props {
  data: any
  onUpdate: (data: any) => void
}

export function Step2Authors({ data, onUpdate }: Step2Props) {
  const [coAuthors, setCoAuthors] = useState(data.coAuthors || [])

  const handleCorrespondingAuthorChange = (field: string, value: string) => {
    const updatedAuthor = { ...data.correspondingAuthor, [field]: value }
    onUpdate({ correspondingAuthor: updatedAuthor })
  }

  const addCoAuthor = () => {
    const newAuthor = {
      id: Date.now(),
      name: "",
      email: "",
      affiliation: "",
      department: "",
      country: "",
      orcid: "",
    }
    const updatedCoAuthors = [...coAuthors, newAuthor]
    setCoAuthors(updatedCoAuthors)
    onUpdate({ coAuthors: updatedCoAuthors })
  }

  const removeCoAuthor = (id: number) => {
    const updatedCoAuthors = coAuthors.filter((author: any) => author.id !== id)
    setCoAuthors(updatedCoAuthors)
    onUpdate({ coAuthors: updatedCoAuthors })
  }

  const updateCoAuthor = (id: number, field: string, value: string) => {
    const updatedCoAuthors = coAuthors.map((author: any) => (author.id === id ? { ...author, [field]: value } : author))
    setCoAuthors(updatedCoAuthors)
    onUpdate({ coAuthors: updatedCoAuthors })
  }

  return (
    <div className="space-y-6">
      {/* Corresponding Author */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Corresponding Author
          </CardTitle>
          <CardDescription>
            The corresponding author will receive all communications regarding this submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="corr-name">Full Name *</Label>
              <Input
                id="corr-name"
                placeholder="Dr. John Smith"
                value={data.correspondingAuthor?.name || ""}
                onChange={(e) => handleCorrespondingAuthorChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corr-email">Email Address *</Label>
              <Input
                id="corr-email"
                type="email"
                placeholder="john.smith@university.edu"
                value={data.correspondingAuthor?.email || ""}
                onChange={(e) => handleCorrespondingAuthorChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="corr-affiliation">Institutional Affiliation *</Label>
              <Input
                id="corr-affiliation"
                placeholder="University of Medicine"
                value={data.correspondingAuthor?.affiliation || ""}
                onChange={(e) => handleCorrespondingAuthorChange("affiliation", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corr-department">Department/Unit *</Label>
              <Input
                id="corr-department"
                placeholder="Department of Internal Medicine"
                value={data.correspondingAuthor?.department || ""}
                onChange={(e) => handleCorrespondingAuthorChange("department", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="corr-country">Country *</Label>
              <Select
                value={data.correspondingAuthor?.country || ""}
                onValueChange={(value) => handleCorrespondingAuthorChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="corr-orcid">ORCID ID (Optional)</Label>
              <Input
                id="corr-orcid"
                placeholder="0000-0000-0000-0000"
                value={data.correspondingAuthor?.orcid || ""}
                onChange={(e) => handleCorrespondingAuthorChange("orcid", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Co-Authors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Co-Authors
              </CardTitle>
              <CardDescription>Add all co-authors who contributed to this research</CardDescription>
            </div>
            <Button onClick={addCoAuthor} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Add Co-Author
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coAuthors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No co-authors added yet</p>
              <p className="text-sm">Click "Add Co-Author" to include additional authors</p>
            </div>
          ) : (
            <div className="space-y-6">
              {coAuthors.map((author: any, index: number) => (
                <div key={author.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Co-Author {index + 1}</h4>
                    <Button
                      onClick={() => removeCoAuthor(author.id)}
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
                      <Label>Full Name *</Label>
                      <Input
                        placeholder="Dr. Jane Doe"
                        value={author.name}
                        onChange={(e) => updateCoAuthor(author.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="jane.doe@university.edu"
                        value={author.email}
                        onChange={(e) => updateCoAuthor(author.id, "email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institutional Affiliation *</Label>
                      <Input
                        placeholder="University of Science"
                        value={author.affiliation}
                        onChange={(e) => updateCoAuthor(author.id, "affiliation", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department/Unit *</Label>
                      <Input
                        placeholder="Department of Research"
                        value={author.department}
                        onChange={(e) => updateCoAuthor(author.id, "department", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country *</Label>
                      <Select
                        value={author.country}
                        onValueChange={(value) => updateCoAuthor(author.id, "country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>ORCID ID (Optional)</Label>
                      <Input
                        placeholder="0000-0000-0000-0000"
                        value={author.orcid}
                        onChange={(e) => updateCoAuthor(author.id, "orcid", e.target.value)}
                      />
                    </div>
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
          <CardTitle className="text-base">Author Guidelines</CardTitle>
          <CardDescription>Important information about author requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• At least one author (corresponding author) must be specified</li>
            <li>• All email addresses must be valid institutional addresses</li>
            <li>• Institutional affiliations are required for all authors</li>
            <li>• ORCID IDs are recommended but not required</li>
            <li>• Author order can be changed later if needed</li>
            <li>• All authors will receive submission confirmations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
