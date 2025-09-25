"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, Plus } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessDashboard } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export default function ContentUploadPage() {
  const { user } = useAuth()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    volume: "",
    articleType: "research",
    description: "",
    authorName: "",
    authorEmail: "",
    title: "",
    abstract: "",
    keywords: [] as string[],
    newKeyword: ""
  })

  const { data: volumesData } = useApi('/volumes')
  const { data: editorsData } = useApi('/admin/editors')

  const volumes = Array.isArray(volumesData) ? volumesData : []
  const editors = Array.isArray(editorsData) ? editorsData : []

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

  // Check if user has admin access
  if (!canAccessDashboard(user, 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = `file-${Date.now()}-${i}`
      
      // Add file to state with uploading status
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      }
      
      setUploadedFiles(prev => [...prev, newFile])

      try {
        // Simulate file upload progress
        const uploadPromise = new Promise<void>((resolve, reject) => {
          const interval = setInterval(() => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === fileId 
                  ? { ...f, progress: Math.min(f.progress + 10, 100) }
                  : f
              )
            )
          }, 200)

          setTimeout(() => {
            clearInterval(interval)
            resolve()
          }, 2000)
        })

        await uploadPromise

        // Mark as successful
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        )

        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded.`
        })

      } catch (error) {
        // Mark as error
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        )

        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}.`,
          variant: "destructive"
        })
      }
    }

    setIsUploading(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Upload className="h-8 w-8 text-blue-600" />
          Content Upload
        </h1>
        <p className="text-muted-foreground mt-2">Upload articles and manage content for the journal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Articles
            </CardTitle>
            <CardDescription>
              Upload article files and provide metadata for processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Volume Selection */}
            <div>
              <Label htmlFor="volume">Target Volume</Label>
              <Select value={formData.volume} onValueChange={(value) => setFormData(prev => ({ ...prev, volume: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a volume" />
                </SelectTrigger>
                <SelectContent>
                  {volumes.map((volume: any) => (
                    <SelectItem key={volume.id} value={volume.id}>
                      {volume.title || volume.number} ({volume.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Abstract */}
            <div>
              <Label htmlFor="abstract">Abstract *</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                placeholder="Enter the article abstract..."
                rows={4}
                required
              />
            </div>

            {/* Article Type */}
            <div>
              <Label htmlFor="articleType">Article Type</Label>
              <Select value={formData.articleType} onValueChange={(value) => setFormData(prev => ({ ...prev, articleType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Research Article</SelectItem>
                  <SelectItem value="review">Review Article</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="editorial">Editorial</SelectItem>
                  <SelectItem value="letter">Letter to Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Article Title */}
            <div>
              <Label htmlFor="title">Article Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter the article title..."
                required
              />
            </div>

            {/* Author Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="e.g., Dr. Sarah Johnson"
                  required
                />
              </div>
              <div>
                <Label htmlFor="authorEmail">Author Email *</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
                  placeholder="e.g., sarah.johnson@university.edu"
                  required
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-4">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.newKeyword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newKeyword: e.target.value }))}
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

            {/* File Upload */}
            <div>
              <Label htmlFor="file-upload">Upload Files</Label>
              <div className="mt-2">
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 10MB per file)
                </p>
              </div>
            </div>

            <Button 
              className="w-full" 
              disabled={!formData.volume || !formData.title || !formData.abstract || !formData.authorName || !formData.authorEmail || uploadedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Process Uploads
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Upload Status */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Status</CardTitle>
            <CardDescription>Track the progress of your file uploads</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files uploaded yet</p>
                <p className="text-sm">Select files to see upload progress</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                        {file.status === 'uploading' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                        {file.error && (
                          <p className="text-xs text-red-600 mt-1">{file.error}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Bulk Upload</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>Review Queue</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span>Template Download</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
