"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, X, Plus, Upload, FileText, Trash2, Download, Save, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { adminArticleService } from "@/lib/api"

interface Author {
  title?: string
  firstName: string
  lastName: string
  email: string
  affiliation: string
}

interface ArticleEditDialogProps {
  articleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ArticleEditDialog({ articleId, open, onOpenChange, onSuccess }: ArticleEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [article, setArticle] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    content: "",
    keywords: [] as string[],
    type: "research",
    status: "submitted",
    authors: [] as Author[],
    doi: "",
    pages: "",
    articleNumber: "",
    featured: false,
    conflictOfInterest: "",
    funding: "",
    acknowledgments: "",
    categories: [] as string[],
  })
  const [newKeyword, setNewKeyword] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newAuthor, setNewAuthor] = useState<Author>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    affiliation: ""
  })
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null)
  const [supplementaryFiles, setSupplementaryFiles] = useState<File[]>([])

  useEffect(() => {
    if (open && articleId) {
      fetchArticle()
    }
  }, [open, articleId])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const response = await adminArticleService.getById(articleId)
      const data = response.data
      setArticle(data)
      setFormData({
        title: data.title || "",
        abstract: data.abstract || "",
        content: data.content || "",
        keywords: data.keywords || [],
        type: data.type || "research",
        status: data.status || "submitted",
        authors: data.authors || [],
        doi: data.doi || "",
        pages: data.pages || "",
        articleNumber: data.articleNumber || "",
        featured: data.featured || false,
        conflictOfInterest: data.conflictOfInterest || "",
        funding: data.funding || "",
        acknowledgments: data.acknowledgments || "",
        categories: data.categories || [],
      })
    } catch (error) {
      console.error("Failed to fetch article:", error)
      toast({ title: "Failed to load article", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formDataToSend = new FormData()
      
      // Add text fields
      formDataToSend.append("title", formData.title)
      formDataToSend.append("abstract", formData.abstract)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("type", formData.type)
      formDataToSend.append("status", formData.status)
      formDataToSend.append("featured", formData.featured.toString())
      
      if (formData.doi) formDataToSend.append("doi", formData.doi)
      if (formData.pages) formDataToSend.append("pages", formData.pages)
      if (formData.articleNumber) formDataToSend.append("articleNumber", formData.articleNumber)
      if (formData.conflictOfInterest) formDataToSend.append("conflictOfInterest", formData.conflictOfInterest)
      if (formData.funding) formDataToSend.append("funding", formData.funding)
      if (formData.acknowledgments) formDataToSend.append("acknowledgments", formData.acknowledgments)
      
      // Add array fields as JSON strings
      formDataToSend.append("keywords", JSON.stringify(formData.keywords))
      formDataToSend.append("authors", JSON.stringify(formData.authors))
      formDataToSend.append("categories", JSON.stringify(formData.categories))
      
      // Add files
      if (manuscriptFile) {
        formDataToSend.append("manuscript", manuscriptFile)
      }
      supplementaryFiles.forEach(file => {
        formDataToSend.append("supplementary", file)
      })

      await adminArticleService.update(articleId, formDataToSend)
      toast({ title: "Article updated successfully" })
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to save article:", error)
      toast({ 
        title: "Failed to save article", 
        description: error.response?.data?.message || error.message,
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }))
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }))
  }

  const addAuthor = () => {
    if (newAuthor.firstName && newAuthor.lastName && newAuthor.email && newAuthor.affiliation) {
      setFormData(prev => ({
        ...prev,
        authors: [...prev.authors, newAuthor]
      }))
      setNewAuthor({ title: "", firstName: "", lastName: "", email: "", affiliation: "" })
    }
  }

  const removeAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
    }))
  }

  const removeSupplementaryFile = async (fileIndex: number) => {
    try {
      await adminArticleService.removeSupplementaryFile(articleId, fileIndex)
      toast({ title: "Supplementary file removed" })
      fetchArticle() // Refresh article data
    } catch (error) {
      toast({ title: "Failed to remove file", variant: "destructive" })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-3xl w-full overflow-hidden p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b bg-muted/30">
          <SheetTitle className="text-2xl">Edit Article</SheetTitle>
          <SheetDescription>Make changes to the article details, metadata, and files</SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 py-6">
              {/* Status and Type Quick Access */}
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="revision_requested">Revision Requested</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Article Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="case_study">Case Study</SelectItem>
                      <SelectItem value="editorial">Editorial</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="commentary">Commentary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Accordion Sections */}
              <Accordion type="multiple" defaultValue={["basic", "authors", "files", "metadata"]} className="w-full space-y-4">
                {/* Basic Information */}
                <AccordionItem value="basic" className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Basic Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4 pt-2">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter article title"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="abstract" className="text-sm font-medium">Abstract *</Label>
                      <Textarea
                        id="abstract"
                        value={formData.abstract}
                        onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                        placeholder="Enter article abstract"
                        rows={5}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-sm font-medium">Full Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter full article content (optional)"
                        rows={8}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Keywords</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Add keyword and press Enter"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        />
                        <Button type="button" onClick={addKeyword} variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.keywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="gap-1 px-3 py-1">
                              {keyword}
                              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeKeyword(keyword)} />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Categories</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Add category and press Enter"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                        />
                        <Button type="button" onClick={addCategory} variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.categories.map((category, i) => (
                            <Badge key={i} variant="secondary" className="gap-1 px-3 py-1">
                              {category}
                              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeCategory(category)} />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked as boolean }))}
                      />
                      <Label htmlFor="featured" className="cursor-pointer text-sm font-medium">
                        Mark as Featured Article
                      </Label>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Authors Section */}
                <AccordionItem value="authors" className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Authors ({formData.authors.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4 pt-2">
                    {/* Add new author form */}
                    <div className="p-4 border-2 border-dashed rounded-lg bg-muted/30">
                      <Label className="text-sm font-medium mb-3 block">Add New Author</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Title (Dr., Prof., etc.)"
                          value={newAuthor.title}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, title: e.target.value }))}
                          className="col-span-2 sm:col-span-1"
                        />
                        <Input
                          placeholder="First Name *"
                          value={newAuthor.firstName}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                        <Input
                          placeholder="Last Name *"
                          value={newAuthor.lastName}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                        <Input
                          placeholder="Email *"
                          type="email"
                          value={newAuthor.email}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))}
                        />
                        <Input
                          placeholder="Affiliation *"
                          value={newAuthor.affiliation}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, affiliation: e.target.value }))}
                          className="col-span-2"
                        />
                      </div>
                      <Button type="button" onClick={addAuthor} variant="default" className="mt-3 w-full" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Author
                      </Button>
                    </div>

                    {/* Current authors list */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Current Authors</Label>
                      <div className="space-y-2">
                        {formData.authors.map((author, index) => (
                          <div key={index} className="flex items-start justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors bg-background">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {author.title && <span className="text-muted-foreground">{author.title} </span>}
                                {author.firstName} {author.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground mt-0.5">{author.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">{author.affiliation}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAuthor(index)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.authors.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                            No authors added yet. Add at least one author above.
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Files Section */}
                <AccordionItem value="files" className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Files & Attachments</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pb-4 pt-2">
                    {/* Current Manuscript */}
                    <div>
                      <Label className="text-sm font-medium">Current Manuscript</Label>
                      {article?.manuscriptFile ? (
                        <div className="flex items-center justify-between p-3 border rounded-lg mt-2 bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{article.manuscriptFile.originalName}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {article.manuscriptFile.format?.toUpperCase()} • {formatFileSize(article.manuscriptFile.bytes)}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={article.manuscriptFile.secureUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2 p-3 border-2 border-dashed rounded-lg text-center">
                          No manuscript uploaded
                        </p>
                      )}
                    </div>

                    {/* Replace Manuscript */}
                    <div>
                      <Label htmlFor="manuscript" className="text-sm font-medium">
                        {article?.manuscriptFile ? 'Replace Manuscript' : 'Upload Manuscript'}
                      </Label>
                      <Input
                        id="manuscript"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                        className="mt-1.5"
                      />
                      {manuscriptFile && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-primary/5 border border-primary/20 rounded">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <p className="text-sm text-primary">
                            New file selected: {manuscriptFile.name}
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Current Supplementary Files */}
                    <div>
                      <Label className="text-sm font-medium">Supplementary Files</Label>
                      <div className="space-y-2 mt-2">
                        {article?.supplementaryFiles?.map((file: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-muted rounded">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{file.originalName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {file.format?.toUpperCase()} • {formatFileSize(file.bytes)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                                <a href={file.secureUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                onClick={() => removeSupplementaryFile(index)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {(!article?.supplementaryFiles || article.supplementaryFiles.length === 0) && (
                          <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                            No supplementary files
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Add Supplementary Files */}
                    <div>
                      <Label htmlFor="supplementary" className="text-sm font-medium">Add Supplementary Files</Label>
                      <Input
                        id="supplementary"
                        type="file"
                        accept=".pdf,.zip,.csv,.xls,.xlsx"
                        multiple
                        onChange={(e) => setSupplementaryFiles(Array.from(e.target.files || []))}
                        className="mt-1.5"
                      />
                      {supplementaryFiles.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-primary/5 border border-primary/20 rounded">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <p className="text-sm text-primary">
                            {supplementaryFiles.length} new file(s) will be uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Metadata Section */}
                <AccordionItem value="metadata" className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Publication Metadata</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="articleNumber" className="text-sm font-medium">Article Number</Label>
                        <Input
                          id="articleNumber"
                          value={formData.articleNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, articleNumber: e.target.value }))}
                          placeholder="001"
                          maxLength={3}
                          className="mt-1.5"
                        />
                        <p className="text-xs text-muted-foreground mt-1">3-digit number</p>
                      </div>

                      <div>
                        <Label htmlFor="pages" className="text-sm font-medium">Pages</Label>
                        <Input
                          id="pages"
                          value={formData.pages}
                          onChange={(e) => setFormData(prev => ({ ...prev, pages: e.target.value }))}
                          placeholder="1-15"
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="doi" className="text-sm font-medium">DOI</Label>
                      <Input
                        id="doi"
                        value={formData.doi}
                        onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                        placeholder="10.1234/example"
                        className="mt-1.5"
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="funding" className="text-sm font-medium">Funding Information</Label>
                      <Textarea
                        id="funding"
                        value={formData.funding}
                        onChange={(e) => setFormData(prev => ({ ...prev, funding: e.target.value }))}
                        placeholder="Enter funding information"
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="acknowledgments" className="text-sm font-medium">Acknowledgments</Label>
                      <Textarea
                        id="acknowledgments"
                        value={formData.acknowledgments}
                        onChange={(e) => setFormData(prev => ({ ...prev, acknowledgments: e.target.value }))}
                        placeholder="Enter acknowledgments"
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="conflictOfInterest" className="text-sm font-medium">Conflict of Interest</Label>
                      <Textarea
                        id="conflictOfInterest"
                        value={formData.conflictOfInterest}
                        onChange={(e) => setFormData(prev => ({ ...prev, conflictOfInterest: e.target.value }))}
                        placeholder="Enter conflict of interest statement"
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollArea>
        )}

        <SheetFooter className="px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between w-full gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving} size="lg">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || loading} size="lg" className="min-w-[140px]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
