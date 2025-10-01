"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Quote, BookOpen, FileText, Code } from "lucide-react"
import { citationFormats } from "@/lib/citation-utils"
import { Article as ApiArticle } from "@/lib/api"

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ApiArticle;
}

export function CitationModal({ isOpen, onClose, article }: CitationModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Convert API Article to citation format
  const convertToCitationFormat = (apiArticle: ApiArticle) => {
    return {
      title: apiArticle.title,
      authors: apiArticle.authors.map(author => ({
        title: author.title,
        firstName: author.firstName,
        lastName: author.lastName,
        affiliation: author.affiliation
      })),
      publishedDate: apiArticle.publishedDate
        ? (apiArticle.publishedDate instanceof Date
            ? apiArticle.publishedDate.toISOString().split('T')[0]
            : (typeof apiArticle.publishedDate === 'string'
                ? new Date(apiArticle.publishedDate).toISOString().split('T')[0]
                : undefined))
        : undefined,
      doi: apiArticle.doi,
      volume: typeof apiArticle.volume === 'object' ? {
        number: apiArticle.volume.volume?.toString(),
        volume: apiArticle.volume.volume?.toString()
      } : { volume: apiArticle.volume },
      issue: apiArticle.issue?.toString(),
      pages: apiArticle.pages,
      url: apiArticle.doi ? `https://doi.org/${apiArticle.doi}` : undefined,
      articleNumber: apiArticle.articleNumber
    };
  };

  const citationArticle = convertToCitationFormat(article);

  const handleCopy = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatIcons = {
    custom: Quote,
    apa: Quote,
    mla: BookOpen,
    chicago: FileText,
    vancouver: FileText,
    bibtex: Code
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Quote className="w-4 h-4 sm:w-5 sm:h-5" />
            Cite This Article
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader className="pb-3 p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg leading-tight">{article.title}</CardTitle>
              <CardDescription>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <span className="break-words">
                    {article.authors.map((author, index) => (
                      <span key={index}>
                        {[author.title, author.firstName, author.lastName].filter(Boolean).join(' ')}
                        {index < article.authors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                  {article.publishedDate && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="sm:inline block w-full sm:w-auto">{article.publishedDate instanceof Date ? 
                        article.publishedDate.getFullYear() : 
                        new Date(article.publishedDate).getFullYear()}</span>
                    </>
                  )}
                  {article.doi && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <Badge variant="outline" className="text-[10px] sm:text-xs">
                        DOI: {article.doi}
                      </Badge>
                    </>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Citation Formats */}
          <Tabs defaultValue="custom" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1 h-auto">
              {Object.entries(citationFormats).map(([key, format]) => {
                const Icon = formatIcons[key as keyof typeof formatIcons];
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
                    <Icon className="w-3 h-3 shrink-0" />
                    <span className="hidden md:inline">{format.name.split(' ')[0]}</span>
                    <span className="md:hidden uppercase">{key.slice(0, 3)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(citationFormats).map(([key, format]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-base sm:text-lg">{format.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">{format.description}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(format.generate(citationArticle), key)}
                        className="gap-2 shrink-0 w-full sm:w-auto"
                      >
                        {copiedFormat === key ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-xs sm:text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className={`p-3 sm:p-4 rounded-lg border bg-muted/50 ${key === 'bibtex' ? 'font-mono text-xs sm:text-sm' : 'text-xs sm:text-sm'}`}>
                      <div className="whitespace-pre-wrap break-words overflow-x-auto">
                        {format.generate(citationArticle)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Citation Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-blue-900">Citation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 space-y-1.5 sm:space-y-2 p-3 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm">
                • Always verify citation requirements with your target journal or institution
              </p>
              <p className="text-xs sm:text-sm">
                • Include the DOI when available for better accessibility and tracking
              </p>
              <p className="text-xs sm:text-sm">
                • For online-only articles, include the access date if required by your style guide
              </p>
              <p className="text-xs sm:text-sm">
                • Check for any specific formatting requirements for medical journals
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}