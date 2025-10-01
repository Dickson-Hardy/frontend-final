"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ExternalLink, Eye, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PDFViewerProps {
  fileUrl?: string
  fileName?: string
  fileFormat?: string
  fileSize?: number
  onDownload?: () => void
}

export function PDFViewer({ fileUrl, fileName, fileFormat, fileSize, onDownload }: PDFViewerProps) {
  if (!fileUrl) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Manuscript Available
            </h3>
            <p className="text-muted-foreground">
              The full text of this article is not yet available online.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  // Check if it's a PDF that can be embedded
  const isPDF = fileFormat?.toLowerCase() === 'pdf' || fileName?.toLowerCase().endsWith('.pdf')
  const canEmbed = isPDF

  return (
    <div className="space-y-4">
      {/* File Info Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {fileName || 'Full Article'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="uppercase">
                    {fileFormat || 'PDF'}
                  </Badge>
                  <span>•</span>
                  <span>{formatBytes(fileSize)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {onDownload && (
                <Button onClick={onDownload} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              <Button 
                onClick={() => window.open(fileUrl, '_blank')}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Embed or Preview */}
      {canEmbed ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Article Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full" style={{ height: '800px' }}>
              <iframe
                src={`${fileUrl}#view=FitH`}
                className="w-full h-full border-0"
                title="Article PDF"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This file format cannot be previewed in the browser. Please download the file to view it.
          </AlertDescription>
        </Alert>
      )}

      {/* Browser Compatibility Note */}
      <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
        <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
          💡 <strong>Tip:</strong> If the PDF doesn't display properly, try opening it in a new tab or downloading it. 
          Some browsers may block embedded PDFs from external sources.
        </AlertDescription>
      </Alert>
    </div>
  )
}
