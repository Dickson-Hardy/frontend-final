"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useApi } from "@/hooks/use-api"

interface VolumeCreationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function VolumeCreationForm({ onSuccess, onCancel }: VolumeCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    volumeNumber: "",
    issueNumber: "",
    year: new Date().getFullYear(),
    title: "",
    description: "",
    editor: "",
    plannedPublicationDate: undefined as Date | undefined,
    status: "planned" as "planned" | "in_progress" | "published",
    specialIssue: false,
    specialIssueTheme: "",
    keywords: [] as string[],
    newKeyword: "",
  })

  const { data: editorsData } = useApi('/admin/editors')
  const { data: existingVolumesData } = useApi('/volumes')

  // Default values and type safety
  const editors = Array.isArray(editorsData) ? editorsData : [] as any[]
  const existingVolumes = Array.isArray(existingVolumesData) ? existingVolumesData : [] as any[]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addKeyword = () => {
    if (formData.newKeyword.trim() && !formData.keywords.includes(formData.newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, prev.newKeyword.trim()],
        newKeyword: ""
      }))
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const volumeData = {
        ...formData,
        plannedPublicationDate: formData.plannedPublicationDate?.toISOString(),
        volumeId: `VOL-${formData.year}-${formData.issueNumber}`,
        number: `Volume ${formData.volumeNumber}, Issue ${formData.issueNumber}`,
      }

      const response = await fetch('/api/v1/volumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(volumeData)
      })

      if (response.ok) {
        onSuccess?.()
      } else {
        throw new Error('Failed to create volume')
      }
    } catch (error) {
      console.error('Error creating volume:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.volumeNumber &&
      formData.issueNumber &&
      formData.title &&
      formData.description &&
      formData.editor &&
      formData.plannedPublicationDate
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Volume
        </CardTitle>
        <CardDescription>
          Create a new volume/issue for the journal with all necessary details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="volumeNumber">Volume Number *</Label>
              <Input
                id="volumeNumber"
                value={formData.volumeNumber}
                onChange={(e) => handleInputChange('volumeNumber', e.target.value)}
                placeholder="e.g., 15"
                required
              />
            </div>
            <div>
              <Label htmlFor="issueNumber">Issue Number *</Label>
              <Input
                id="issueNumber"
                value={formData.issueNumber}
                onChange={(e) => handleInputChange('issueNumber', e.target.value)}
                placeholder="e.g., 3"
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Volume Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Advances in Medical Technology"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the focus and scope of this volume..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Editor and Publication Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editor">Assigned Editor *</Label>
              <Select value={formData.editor} onValueChange={(value) => handleInputChange('editor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an editor" />
                </SelectTrigger>
                <SelectContent>
                  {editors.map((editor: any) => (
                    <SelectItem key={editor.id} value={editor.id}>
                      {editor.name} ({editor.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Planned Publication Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.plannedPublicationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.plannedPublicationDate ? (
                      format(formData.plannedPublicationDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.plannedPublicationDate}
                    onSelect={(date) => handleInputChange('plannedPublicationDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Initial Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special Issue */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="specialIssue"
                checked={formData.specialIssue}
                onChange={(e) => handleInputChange('specialIssue', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="specialIssue">This is a special issue</Label>
            </div>
            {formData.specialIssue && (
              <div>
                <Label htmlFor="specialIssueTheme">Special Issue Theme</Label>
                <Input
                  id="specialIssueTheme"
                  value={formData.specialIssueTheme}
                  onChange={(e) => handleInputChange('specialIssueTheme', e.target.value)}
                  placeholder="e.g., COVID-19 Research and Response"
                />
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-4">
            <Label>Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={formData.newKeyword}
                onChange={(e) => handleInputChange('newKeyword', e.target.value)}
                placeholder="Add a keyword..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button type="button" onClick={addKeyword} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <span className="text-sm">{keyword}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeKeyword(keyword)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid() || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Volume
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
`   `