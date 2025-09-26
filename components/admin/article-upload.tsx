"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, Plus, Minus } from "lucide-react"
import { useApi } from "@/hooks/use-api"

interface ArticleUploadProps {
  volumeId?: string
  onUploadComplete?: () => void
}

export function ArticleUpload({ volumeId, onUploadComplete }: ArticleUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    category: "",
    authors: [{ title: "", firstName: "", lastName: "", email: "", affiliation: "" }],
    correspondingAuthor: "",
    volumeId: volumeId || "",
    researchType: "",
    funding: "",
    acknowledgments: "",
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: categories } = useApi('/articles/categories')
  const { data: volumes } = useApi('/volumes')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, { title: "", firstName: "", lastName: "", email: "", affiliation: "" }]
    }))
  }

  const removeAuthor = (index: number) => {
    if (formData.authors.length > 1) {
      setFormData(prev => ({
        ...prev,
        authors: prev.authors.filter((_, i) => i !== index)
      }))
    }
  }

  const updateAuthor = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) => 
        i === index ? { ...author, [field]: value } : author
      )
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })

    setUploadedFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      
      // Add article metadata with proper field mapping
      formDataToSend.append('title', formData.title)
      formDataToSend.append('abstract', formData.abstract)
      formDataToSend.append('content', formData.abstract) // Use abstract as content for now
      formDataToSend.append('type', formData.researchType || 'research')
      
      // Handle keywords - ensure it's an array
      const keywordsArray = formData.keywords 
        ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
        : []
      formDataToSend.append('keywords', JSON.stringify(keywordsArray))
      
      // Ensure corresponding author email is provided
      formDataToSend.append('correspondingAuthorEmail', formData.correspondingAuthor)
      
      // Send authors array directly
      formDataToSend.append('authors', JSON.stringify(formData.authors))
      
      if (formData.volumeId) formDataToSend.append('volume', formData.volumeId)
      if (formData.funding) formDataToSend.append('funding', formData.funding)
      if (formData.acknowledgments) formDataToSend.append('acknowledgments', formData.acknowledgments)

      // Add files
      uploadedFiles.forEach((file, index) => {
        if (index === 0) {
          formDataToSend.append('manuscript', file)
        } else {
          formDataToSend.append('supplementary', file)
        }
      })

      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setUploadedFiles([])
          setFormData({
            title: "",
            abstract: "",
            keywords: "",
            category: "",
            authors: [{ title: "", firstName: "", lastName: "", email: "", affiliation: "" }],
            correspondingAuthor: "",
            volumeId: volumeId || "",
            researchType: "",
            funding: "",
            acknowledgments: "",
          })
          onUploadComplete?.()
        } else {
          throw new Error('Upload failed')
        }
      })

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed')
      })

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      xhr.open('POST', `${API_BASE_URL}/api/v1/articles`)
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('auth_token')}`)
      xhr.send(formDataToSend)

    } catch (error) {
      console.error('Error uploading article:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const isFormValid = () => {
    return (
      formData.title?.trim() &&
      formData.abstract?.trim() &&
      formData.authors.length > 0 &&
      formData.authors.every(author => author.firstName.trim() && author.lastName.trim() && author.email.trim() && author.affiliation.trim()) &&
      formData.correspondingAuthor?.trim() &&
      uploadedFiles.length > 0
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Article
        </CardTitle>
        <CardDescription>
          Upload a new article to the journal system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Article Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Article Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter the article title"
                required
              />
            </div>

            <div>
              <Label htmlFor="abstract">Abstract *</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
                placeholder="Enter the article abstract"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: string) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="researchType">Research Type</Label>
                <Select value={formData.researchType} onValueChange={(value) => handleInputChange('researchType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select research type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Article</SelectItem>
                    <SelectItem value="review">Review Article</SelectItem>
                    <SelectItem value="case_study">Case Study</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                    <SelectItem value="letter">Letter to Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Authors Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Authors *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAuthor}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Author
                </Button>
              </div>
              
              {formData.authors.map((author, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Author {index + 1}</h4>
                    {formData.authors.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAuthor(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`author-title-${index}`}>Title (Optional)</Label>
                      <Input
                        id={`author-title-${index}`}
                        value={author.title}
                        onChange={(e) => updateAuthor(index, 'title', e.target.value)}
                        placeholder="Dr., Prof., etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`author-firstname-${index}`}>First Name *</Label>
                      <Input
                        id={`author-firstname-${index}`}
                        value={author.firstName}
                        onChange={(e) => updateAuthor(index, 'firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`author-lastname-${index}`}>Last Name *</Label>
                      <Input
                        id={`author-lastname-${index}`}
                        value={author.lastName}
                        onChange={(e) => updateAuthor(index, 'lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`author-email-${index}`}>Email *</Label>
                      <Input
                        id={`author-email-${index}`}
                        type="email"
                        value={author.email}
                        onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                        placeholder="author@university.edu"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`author-affiliation-${index}`}>Affiliation *</Label>
                      <Input
                        id={`author-affiliation-${index}`}
                        value={author.affiliation}
                        onChange={(e) => updateAuthor(index, 'affiliation', e.target.value)}
                        placeholder="University/Institution"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="correspondingAuthor">Corresponding Author Email *</Label>
              <Input
                id="correspondingAuthor"
                value={formData.correspondingAuthor}
                onChange={(e) => handleInputChange('correspondingAuthor', e.target.value)}
                placeholder="Enter corresponding author email"
                type="email"
                required
              />
            </div>

            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                placeholder="Enter keywords (comma separated)"
              />
            </div>

            {volumeId && (
              <div>
                <Label htmlFor="volumeId">Volume</Label>
                <Select value={formData.volumeId} onValueChange={(value) => handleInputChange('volumeId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select volume" />
                  </SelectTrigger>
                  <SelectContent>
                    {volumes?.map((volume: any) => (
                      <SelectItem key={volume.id} value={volume.id}>
                        {volume.number} - {volume.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="funding">Funding Information</Label>
              <Textarea
                id="funding"
                value={formData.funding}
                onChange={(e) => handleInputChange('funding', e.target.value)}
                placeholder="Enter funding information"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="acknowledgments">Acknowledgments</Label>
              <Textarea
                id="acknowledgments"
                value={formData.acknowledgments}
                onChange={(e) => handleInputChange('acknowledgments', e.target.value)}
                placeholder="Enter acknowledgments"
                rows={2}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label>Upload Files *</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB each)
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-6 border-t">
            <Button type="submit" disabled={!isFormValid() || isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Article
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
