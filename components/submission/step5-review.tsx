"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, User, Users, Upload, CheckCircle, AlertCircle } from "lucide-react"

interface Step5Props {
  data: any
  onUpdate: (data: any) => void
}

export function Step5Review({ data, onUpdate }: Step5Props) {
  const handleCheckboxChange = (field: string, checked: boolean) => {
    onUpdate({ [field]: checked })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isFormValid = () => {
    return (
      data.termsAccepted &&
      data.guidelinesAcknowledged &&
      data.conflictDeclared &&
      data.ethicsConfirmed &&
      data.title &&
      data.abstract &&
      data.keywords &&
      data.category &&
      data.correspondingAuthor?.name &&
      data.correspondingAuthor?.email &&
      data.files?.manuscript
    )
  }

  return (
    <div className="space-y-6">
      {/* Submission Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submission Summary
          </CardTitle>
          <CardDescription>Review your submission details before submitting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paper Information */}
          <div>
            <h4 className="font-medium mb-3">Paper Information</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Title:</span>
                <p className="text-muted-foreground mt-1">{data.title || "Not provided"}</p>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <Badge variant="outline" className="ml-2">
                  {data.category?.replace(/-/g, " ") || "Not selected"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Research Type:</span>
                <Badge variant="outline" className="ml-2">
                  {data.researchType?.replace(/-/g, " ") || "Not selected"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Keywords:</span>
                <p className="text-muted-foreground mt-1">{data.keywords || "Not provided"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Authors */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Authors
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Corresponding Author</p>
                <p className="text-sm text-muted-foreground">
                  {data.correspondingAuthor?.name || "Not provided"} ({data.correspondingAuthor?.email || "No email"})
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.correspondingAuthor?.affiliation || "No affiliation"}
                </p>
              </div>
              {data.coAuthors?.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Co-Authors ({data.coAuthors.length})</p>
                  {data.coAuthors.map((author: any, index: number) => (
                    <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                      {author.name} ({author.email}) - {author.affiliation}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Reviewers */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recommended Reviewers
            </h4>
            {data.recommendedReviewers?.length > 0 ? (
              <div className="space-y-2">
                {data.recommendedReviewers.map((reviewer: any, index: number) => (
                  <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium">{reviewer.name}</p>
                    <p className="text-muted-foreground">
                      {reviewer.email} - {reviewer.affiliation}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Expertise: {reviewer.expertise}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviewers suggested</p>
            )}
          </div>

          <Separator />

          {/* Files */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Uploaded Files
            </h4>
            <div className="space-y-2">
              {data.files?.manuscript ? (
                <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="text-sm">
                    <p className="font-medium">Manuscript: {data.files.manuscript.name}</p>
                    <p className="text-muted-foreground">{formatFileSize(data.files.manuscript.size)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-2 bg-red-50 border border-red-200 rounded">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800">Manuscript file is required</p>
                </div>
              )}

              {/* Optional files */}
              {Object.entries(data.files || {}).map(([fileType, files]) => {
                if (fileType === "manuscript" || !files) return null
                const fileArray = Array.isArray(files) ? files : [files]
                return fileArray.map((file: any, index: number) => (
                  <div key={`${fileType}-${index}`} className="flex items-center gap-3 p-2 bg-muted rounded text-sm">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="font-medium">
                        {fileType.charAt(0).toUpperCase() + fileType.slice(1)}: {file.name}
                      </p>
                      <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declarations and Confirmations */}
      <Card>
        <CardHeader>
          <CardTitle>Declarations and Confirmations</CardTitle>
          <CardDescription>Please confirm the following before submitting your manuscript</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={data.termsAccepted || false}
              onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              I accept the <span className="text-primary cursor-pointer hover:underline">Terms and Conditions</span> of
              the African Medical and Health Sciences Journal and agree to the submission guidelines.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="guidelines"
              checked={data.guidelinesAcknowledged || false}
              onCheckedChange={(checked) => handleCheckboxChange("guidelinesAcknowledged", checked as boolean)}
            />
            <Label htmlFor="guidelines" className="text-sm leading-relaxed">
              I acknowledge that I have read and followed the
              <span className="text-primary cursor-pointer hover:underline"> Author Guidelines</span> and that my
              manuscript meets all formatting and content requirements.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="conflict"
              checked={data.conflictDeclared || false}
              onCheckedChange={(checked) => handleCheckboxChange("conflictDeclared", checked as boolean)}
            />
            <Label htmlFor="conflict" className="text-sm leading-relaxed">
              I declare any potential conflicts of interest and confirm that all authors have approved this submission
              and agree to be accountable for all aspects of the work.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="ethics"
              checked={data.ethicsConfirmed || false}
              onCheckedChange={(checked) => handleCheckboxChange("ethicsConfirmed", checked as boolean)}
            />
            <Label htmlFor="ethics" className="text-sm leading-relaxed">
              I confirm that this research has been conducted ethically and, where applicable, has received appropriate
              ethical approval from relevant institutional review boards or ethics committees.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submission Status */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`flex items-center gap-3 p-4 rounded-lg ${
              isFormValid() ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            {isFormValid() ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Ready to Submit</p>
                  <p className="text-sm text-green-700">
                    All required information has been provided. You can now submit your manuscript.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Incomplete Submission</p>
                  <p className="text-sm text-yellow-700">
                    Please complete all required fields and confirmations before submitting.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
