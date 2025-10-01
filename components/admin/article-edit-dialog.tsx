"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, X, Plus, Upload, FileText, Trash2, Download } from "lucide-react"
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogDescription>Make changes to the article details, metadata, and files</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="authors">Authors</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Article title"
                />
              </div>

              <div>
                <Label htmlFor="abstract">Abstract *</Label>
                <Textarea
                  id="abstract"
                  value={formData.abstract}
                  onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                  placeholder="Article abstract"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Full article content"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Article Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
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

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
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
              </div>

              <div>
                <Label>Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {keyword}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Categories</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add category"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  />
                  <Button type="button" onClick={addCategory} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((category, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {category}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCategory(category)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked as boolean }))}
                />
                <Label htmlFor="featured" className="cursor-pointer">Featured Article</Label>
              </div>
            </TabsContent>

            <TabsContent value="authors" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Add Author</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input
                      placeholder="Title (Dr., Prof., etc.)"
                      value={newAuthor.title}
                      onChange={(e) => setNewAuthor(prev => ({ ...prev, title: e.target.value }))}
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
                  <Button type="button" onClick={addAuthor} variant="outline" className="mt-2 w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Author
                  </Button>
                </div>

                <div>
                  <Label>Current Authors</Label>
                  <div className="space-y-2 mt-2">
                    {formData.authors.map((author, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">
                            {author.title} {author.firstName} {author.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{author.email}</p>
                          <p className="text-sm text-muted-foreground">{author.affiliation}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAuthor(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                    {formData.authors.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No authors added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div>
                <Label>Current Manuscript</Label>
                {article?.manuscriptFile && (
                  <div className="flex items-center justify-between p-3 border rounded mt-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{article.manuscriptFile.originalName}</p>
                        <p className="text-sm text-muted-foreground">
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
                )}
              </div>

              <div>
                <Label htmlFor="manuscript">Replace Manuscript</Label>
                <Input
                  id="manuscript"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                  className="mt-2"
                />
                {manuscriptFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {manuscriptFile.name}
                  </p>
                )}
              </div>

              <div>
                <Label>Current Supplementary Files</Label>
                <div className="space-y-2 mt-2">
                  {article?.supplementaryFiles?.map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{file.originalName}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.format?.toUpperCase()} • {formatFileSize(file.bytes)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.secureUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSupplementaryFile(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!article?.supplementaryFiles || article.supplementaryFiles.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">No supplementary files</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="supplementary">Add Supplementary Files</Label>
                <Input
                  id="supplementary"
                  type="file"
                  accept=".pdf,.zip,.csv,.xls,.xlsx"
                  multiple
                  onChange={(e) => setSupplementaryFiles(Array.from(e.target.files || []))}
                  className="mt-2"
                />
                {supplementaryFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {supplementaryFiles.length} file(s) selected
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="articleNumber">Article Number</Label>
                  <Input
                    id="articleNumber"
                    value={formData.articleNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, articleNumber: e.target.value }))}
                    placeholder="001"
                    maxLength={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">3-digit number</p>
                </div>

                <div>
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                    placeholder="10.1234/example"
                  />
                </div>

                <div>
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    value={formData.pages}
                    onChange={(e) => setFormData(prev => ({ ...prev, pages: e.target.value }))}
                    placeholder="1-15"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="funding">Funding</Label>
                <Textarea
                  id="funding"
                  value={formData.funding}
                  onChange={(e) => setFormData(prev => ({ ...prev, funding: e.target.value }))}
                  placeholder="Funding information"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="acknowledgments">Acknowledgments</Label>
                <Textarea
                  id="acknowledgments"
                  value={formData.acknowledgments}
                  onChange={(e) => setFormData(prev => ({ ...prev, acknowledgments: e.target.value }))}
                  placeholder="Acknowledgments"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="conflictOfInterest">Conflict of Interest</Label>
                <Textarea
                  id="conflictOfInterest"
                  value={formData.conflictOfInterest}
                  onChange={(e) => setFormData(prev => ({ ...prev, conflictOfInterest: e.target.value }))}
                  placeholder="Conflict of interest statement"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
