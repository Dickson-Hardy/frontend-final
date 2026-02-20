"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Upload, FileText, Loader2, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const authorSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
})

const submissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(100, "Abstract must be at least 100 characters"),
  content: z.string().min(500, "Content must be at least 500 characters"),
  keywords: z.array(z.string()).min(3, "At least 3 keywords required"),
  type: z.enum(["research", "review", "case_study", "editorial", "letter", "commentary"]),
  authors: z.array(authorSchema).min(1, "At least one author is required"),
  categories: z.array(z.string()).optional(),
  conflictOfInterest: z.string().optional(),
  funding: z.string().optional(),
  acknowledgments: z.string().optional(),
  references: z.array(z.string()).optional(),
})

type SubmissionFormData = z.infer<typeof submissionSchema>

interface SubmissionFormProps {
  initialData?: Partial<SubmissionFormData>
  draftId?: string
  onSubmit: (data: SubmissionFormData, files: FileList[]) => Promise<void>
  onSaveDraft?: (data: Partial<SubmissionFormData>) => Promise<void>
  isSubmitting?: boolean
  mode?: 'create' | 'edit' | 'revision'
}

export function SubmissionForm({
  initialData,
  draftId,
  onSubmit,
  onSaveDraft,
  isSubmitting = false,
  mode = 'create'
}: SubmissionFormProps) {
  const [manuscriptFiles, setManuscriptFiles] = useState<FileList | null>(null)
  const [supplementaryFiles, setSupplementaryFiles] = useState<FileList | null>(null)
  const [keywordInput, setKeywordInput] = useState("")
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: initialData?.title || "",
      abstract: initialData?.abstract || "",
      content: initialData?.content || "",
      keywords: initialData?.keywords || [],
      type: initialData?.type || "research",
      authors: initialData?.authors || [{ firstName: "", lastName: "", email: "", affiliation: "" }],
      categories: initialData?.categories || [],
      conflictOfInterest: initialData?.conflictOfInterest || "",
      funding: initialData?.funding || "",
      acknowledgments: initialData?.acknowledgments || "",
      references: initialData?.references || [],
    },
  })

  const { fields: authorFields, append: appendAuthor, remove: removeAuthor } = useFieldArray({
    control: form.control,
    name: "authors",
  })

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control: form.control,
    name: "references",
  })

  const handleSubmit = async (data: SubmissionFormData) => {
    if (!manuscriptFiles || manuscriptFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload a manuscript file",
        variant: "destructive"
      })
      return
    }

    const files = [manuscriptFiles]
    if (supplementaryFiles) {
      files.push(supplementaryFiles)
    }

    await onSubmit(data, files)
  }

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return

    setIsSavingDraft(true)
    try {
      const data = form.getValues()
      await onSaveDraft(data)
      toast({
        title: "Draft saved",
        description: "Your work has been saved as a draft"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      })
    } finally {
      setIsSavingDraft(false)
    }
  }

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = form.getValues("keywords")
      form.setValue("keywords", [...currentKeywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const removeKeyword = (index: number) => {
    const currentKeywords = form.getValues("keywords")
    form.setValue("keywords", currentKeywords.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide the essential details about your submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter the title of your article"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Article Type *</Label>
            <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select article type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="research">Research Article</SelectItem>
                <SelectItem value="review">Review Article</SelectItem>
                <SelectItem value="case_study">Case Study</SelectItem>
                <SelectItem value="editorial">Editorial</SelectItem>
                <SelectItem value="letter">Letter to Editor</SelectItem>
                <SelectItem value="commentary">Commentary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              {...form.register("abstract")}
              placeholder="Provide a comprehensive abstract (minimum 100 characters)"
              rows={6}
            />
            {form.formState.errors.abstract && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.abstract.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="keywords">Keywords *</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Enter a keyword and press Add"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button type="button" onClick={addKeyword} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.watch("keywords").map((keyword, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            {form.formState.errors.keywords && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.keywords.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Authors */}
      <Card>
        <CardHeader>
          <CardTitle>Authors</CardTitle>
          <CardDescription>
            Add all authors who contributed to this work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authorFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Author {index + 1}</h4>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAuthor(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Select
                    value={form.watch(`authors.${index}.title`) || ""}
                    onValueChange={(value) => form.setValue(`authors.${index}.title`, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                      <SelectItem value="Prof.">Prof.</SelectItem>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>First Name *</Label>
                  <Input {...form.register(`authors.${index}.firstName`)} />
                </div>
                
                <div>
                  <Label>Last Name *</Label>
                  <Input {...form.register(`authors.${index}.lastName`)} />
                </div>
                
                <div>
                  <Label>Email *</Label>
                  <Input type="email" {...form.register(`authors.${index}.email`)} />
                </div>
              </div>
              
              <div>
                <Label>Affiliation *</Label>
                <Input {...form.register(`authors.${index}.affiliation`)} />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => appendAuthor({ firstName: "", lastName: "", email: "", affiliation: "" })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Author
          </Button>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Provide the main content of your article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="content">Article Content *</Label>
            <Textarea
              id="content"
              {...form.register("content")}
              placeholder="Enter the main content of your article (minimum 500 characters)"
              rows={12}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>File Uploads</CardTitle>
          <CardDescription>
            Upload your manuscript and any supplementary files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="manuscript">Manuscript File *</Label>
            <Input
              id="manuscript"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setManuscriptFiles(e.target.files)}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Accepted formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>

          <div>
            <Label htmlFor="supplementary">Supplementary Files</Label>
            <Input
              id="supplementary"
              type="file"
              multiple
              onChange={(e) => setSupplementaryFiles(e.target.files)}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Optional: Additional files, figures, data sets, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Provide additional details about your submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="conflictOfInterest">Conflict of Interest Statement</Label>
            <Textarea
              id="conflictOfInterest"
              {...form.register("conflictOfInterest")}
              placeholder="Declare any conflicts of interest or state 'None'"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="funding">Funding Information</Label>
            <Textarea
              id="funding"
              {...form.register("funding")}
              placeholder="Provide funding sources and grant numbers"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="acknowledgments">Acknowledgments</Label>
            <Textarea
              id="acknowledgments"
              {...form.register("acknowledgments")}
              placeholder="Acknowledge contributors, institutions, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
          <CardDescription>
            Add references cited in your article
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {referenceFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1">
                <Input
                  {...form.register(`references.${index}`)}
                  placeholder={`Reference ${index + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeReference(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => appendReference("")}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Reference
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        {onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Draft
          </Button>
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {mode === 'revision' ? 'Submit Revision' : 'Submit Article'}
        </Button>
      </div>
    </form>
  )
}