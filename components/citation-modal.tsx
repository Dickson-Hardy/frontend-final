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
      } : undefined,
      issue: apiArticle.issue?.toString(),
      pages: apiArticle.pages,
      url: apiArticle.doi ? `https://doi.org/${apiArticle.doi}` : undefined
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5" />
            Cite This Article
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <CardDescription>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span>
                    {article.authors.map((author, index) => (
                      <span key={index}>
                        {[author.title, author.firstName, author.lastName].filter(Boolean).join(' ')}
                        {index < article.authors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                  {article.publishedDate && (
                    <>
                      <span>•</span>
                      <span>{article.publishedDate instanceof Date ? 
                        article.publishedDate.getFullYear() : 
                        new Date(article.publishedDate).getFullYear()}</span>
                    </>
                  )}
                  {article.doi && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
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
            <TabsList className="grid w-full grid-cols-6">
              {Object.entries(citationFormats).map(([key, format]) => {
                const Icon = formatIcons[key as keyof typeof formatIcons];
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{format.name.split(' ')[0]}</span>
                    <span className="sm:hidden">{key.toUpperCase()}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(citationFormats).map(([key, format]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{format.name}</CardTitle>
                        <CardDescription>{format.description}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(format.generate(citationArticle), key)}
                        className="gap-2"
                      >
                        {copiedFormat === key ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg border bg-muted/50 ${key === 'bibtex' ? 'font-mono text-sm' : ''}`}>
                      <div className="whitespace-pre-wrap break-words">
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
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Citation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 space-y-2">
              <p className="text-sm">
                • Always verify citation requirements with your target journal or institution
              </p>
              <p className="text-sm">
                • Include the DOI when available for better accessibility and tracking
              </p>
              <p className="text-sm">
                • For online-only articles, include the access date if required by your style guide
              </p>
              <p className="text-sm">
                • Check for any specific formatting requirements for medical journals
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}