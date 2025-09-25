"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Step1Props {
  data: any
  onUpdate: (data: any) => void
}

export function Step1PaperInfo({ data, onUpdate }: Step1Props) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Manuscript Title *</Label>
        <Input
          id="title"
          placeholder="Enter your manuscript title (minimum 10 characters)"
          value={data.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          className="text-base"
        />
        <p className="text-xs text-muted-foreground">
          Provide a clear, descriptive title that accurately reflects your research
        </p>
      </div>

      {/* Abstract */}
      <div className="space-y-2">
        <Label htmlFor="abstract">Abstract *</Label>
        <Textarea
          id="abstract"
          placeholder="Enter your abstract (minimum 100 characters)"
          value={data.abstract || ""}
          onChange={(e) => handleChange("abstract", e.target.value)}
          rows={8}
          className="text-base"
        />
        <p className="text-xs text-muted-foreground">
          Provide a comprehensive summary including background, methods, results, and conclusions
        </p>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords *</Label>
        <Input
          id="keywords"
          placeholder="Enter keywords separated by commas (minimum 3 keywords)"
          value={data.keywords || ""}
          onChange={(e) => handleChange("keywords", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Use relevant keywords that will help readers find your research</p>
      </div>

      {/* Category and Research Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={data.category || ""} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select manuscript category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clinical-research">Clinical Research</SelectItem>
              <SelectItem value="basic-science">Basic Science Research</SelectItem>
              <SelectItem value="public-health">Public Health</SelectItem>
              <SelectItem value="medical-education">Medical Education</SelectItem>
              <SelectItem value="case-studies">Case Studies</SelectItem>
              <SelectItem value="review-articles">Review Articles</SelectItem>
              <SelectItem value="editorial">Editorial</SelectItem>
              <SelectItem value="commentary">Commentary</SelectItem>
              <SelectItem value="letter-to-editor">Letter to Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="researchType">Research Type *</Label>
          <Select value={data.researchType || ""} onValueChange={(value) => handleChange("researchType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select research type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original-research">Original Research</SelectItem>
              <SelectItem value="systematic-review">Systematic Review</SelectItem>
              <SelectItem value="meta-analysis">Meta-Analysis</SelectItem>
              <SelectItem value="case-study">Case Study</SelectItem>
              <SelectItem value="case-series">Case Series</SelectItem>
              <SelectItem value="narrative-review">Narrative Review</SelectItem>
              <SelectItem value="opinion-piece">Opinion Piece</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Guidelines</CardTitle>
          <CardDescription>Please ensure your manuscript meets these requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Title must be descriptive and contain at least 10 characters</li>
            <li>• Abstract must be comprehensive and contain at least 100 characters</li>
            <li>• Provide at least 3 relevant keywords</li>
            <li>• Select the most appropriate category for your research</li>
            <li>• Ensure your research type matches your manuscript content</li>
            <li>• All fields marked with * are required</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
