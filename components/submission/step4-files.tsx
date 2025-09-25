"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, ImageIcon, Trash2, CheckCircle } from "lucide-react"

interface Step4Props {
  data: any
  onUpdate: (data: any) => void
}

export function Step4Files({ data, onUpdate }: Step4Props) {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [dragOver, setDragOver] = useState<string | null>(null)

  const handleFileUpload = useCallback(
    (fileType: string, files: FileList | null) => {
      if (!files) return

      // Simulate file upload with progress
      Array.from(files).forEach((file, index) => {
        const fileId = `${fileType}-${Date.now()}-${index}`
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[fileId] || 0
            if (currentProgress >= 100) {
              clearInterval(interval)
              return prev
            }
            return { ...prev, [fileId]: currentProgress + 10 }
          })
        }, 200)

        // Update form data after "upload" completes
        setTimeout(() => {
          const updatedFiles = { ...data.files }
          if (fileType === "manuscript") {
            updatedFiles.manuscript = { name: file.name, size: file.size, type: file.type, id: fileId }
          } else {
            if (!updatedFiles[fileType]) updatedFiles[fileType] = []
            updatedFiles[fileType].push({ name: file.name, size: file.size, type: file.type, id: fileId })
          }
          onUpdate({ files: updatedFiles })
        }, 2000)
      })
    },
    [data.files, onUpdate],
  )

  const removeFile = (fileType: string, fileId?: string) => {
    const updatedFiles = { ...data.files }
    if (fileType === "manuscript") {
      updatedFiles.manuscript = null
    } else if (fileId) {
      updatedFiles[fileType] = updatedFiles[fileType].filter((file: any) => file.id !== fileId)
    }
    onUpdate({ files: updatedFiles })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const FileUploadArea = ({
    fileType,
    title,
    description,
    acceptedTypes,
    maxSize,
    required = false,
    multiple = false,
  }: {
    fileType: string
    title: string
    description: string
    acceptedTypes: string
    maxSize: string
    required?: boolean
    multiple?: boolean
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {fileType === "manuscript" ? <File className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
          {title} {required && <span className="text-red-500">*</span>}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver === fileType ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(fileType)
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(null)
            handleFileUpload(fileType, e.dataTransfer.files)
          }}
        >
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-2">
            Drag and drop your {multiple ? "files" : "file"} here, or{" "}
            <label className="text-primary cursor-pointer hover:underline">
              browse
              <input
                type="file"
                className="hidden"
                accept={acceptedTypes}
                multiple={multiple}
                onChange={(e) => handleFileUpload(fileType, e.target.files)}
              />
            </label>
          </p>
          <p className="text-xs text-muted-foreground">
            Accepted formats: {acceptedTypes} • Max size: {maxSize}
          </p>
        </div>

        {/* Show uploaded files */}
        <div className="mt-4 space-y-2">
          {fileType === "manuscript" && data.files?.manuscript && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <File className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">{data.files.manuscript.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(data.files.manuscript.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <Button variant="outline" size="sm" onClick={() => removeFile("manuscript")} className="gap-1">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {fileType !== "manuscript" &&
            data.files?.[fileType]?.map((file: any) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 ? (
                    <div className="flex items-center gap-2">
                      <Progress value={uploadProgress[file.id]} className="w-16 h-2" />
                      <span className="text-xs">{uploadProgress[file.id]}%</span>
                    </div>
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <Button variant="outline" size="sm" onClick={() => removeFile(fileType, file.id)} className="gap-1">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Required Files */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Required Files</h3>

        <FileUploadArea
          fileType="manuscript"
          title="Manuscript"
          description="Upload your complete manuscript including all text, figures, and tables"
          acceptedTypes=".doc,.docx"
          maxSize="10MB"
          required={true}
        />
      </div>

      {/* Optional Files */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Optional Files</h3>

        <FileUploadArea
          fileType="figures"
          title="Figures"
          description="Upload high-resolution figures separately if needed"
          acceptedTypes=".png,.jpg,.jpeg,.tiff"
          maxSize="5MB each"
          multiple={true}
        />

        <FileUploadArea
          fileType="tables"
          title="Tables"
          description="Upload tables in Excel or Word format"
          acceptedTypes=".xlsx,.xls,.doc,.docx"
          maxSize="5MB each"
          multiple={true}
        />

        <FileUploadArea
          fileType="supplementary"
          title="Supplementary Materials"
          description="Additional data, videos, or supporting documents"
          acceptedTypes=".pdf,.doc,.docx,.xlsx,.mp4,.avi"
          maxSize="20MB each"
          multiple={true}
        />

        <FileUploadArea
          fileType="coverLetter"
          title="Cover Letter"
          description="Letter addressed to the Editor-in-Chief"
          acceptedTypes=".pdf,.doc,.docx"
          maxSize="2MB"
        />

        <FileUploadArea
          fileType="ethicsApproval"
          title="Ethics Approval"
          description="IRB or ethics committee approval documentation"
          acceptedTypes=".pdf,.doc,.docx"
          maxSize="5MB"
        />

        <FileUploadArea
          fileType="copyrightForm"
          title="Copyright Transfer Agreement"
          description="Signed copyright transfer form"
          acceptedTypes=".pdf"
          maxSize="2MB"
        />
      </div>

      {/* File Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">File Upload Guidelines</CardTitle>
          <CardDescription>Important information about file requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">File Format Requirements:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Manuscript: DOC/DOCX format only</li>
                <li>• Figures: PNG, JPG, TIFF (high resolution)</li>
                <li>• Tables: Excel or Word format</li>
                <li>• Cover Letter: PDF or Word format</li>
                <li>• Ethics Approval: PDF format preferred</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">File Size Limits:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Manuscript: Maximum 10MB</li>
                <li>• Individual figures: Maximum 5MB each</li>
                <li>• Supplementary materials: Maximum 20MB each</li>
                <li>• Other documents: Maximum 5MB each</li>
                <li>• Total submission: Maximum 100MB</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
