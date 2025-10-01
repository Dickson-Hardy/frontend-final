"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Article } from "@/lib/api"
import { format } from "date-fns"
import { Calendar, Eye, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"
import { getArticleUrl } from "@/lib/url-utils"

interface RelatedArticlesProps {
  articles: Article[]
  title?: string
  emptyMessage?: string
}

export function RelatedArticles({ 
  articles, 
  title = "Related Articles",
  emptyMessage = "No related articles found"
}: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <Link 
              key={article._id} 
              href={getArticleUrl(article)}
              className="block group"
            >
              <div className="p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Article {article.articleNumber || 'N/A'}
                      </Badge>
                      {article.featured && (
                        <Badge className="text-xs">Featured</Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {article.type || 'Research'}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>

                    {/* Authors */}
                    {article.authors && article.authors.length > 0 && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {article.authors.slice(0, 3).map((author: any, index: number) => (
                          <span key={index}>
                            {author.firstName} {author.lastName}
                            {index < Math.min(article.authors.length - 1, 2) ? ', ' : ''}
                          </span>
                        ))}
                        {article.authors.length > 3 && ', et al.'}
                      </p>
                    )}

                    {/* Abstract Preview */}
                    {article.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {article.abstract}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {article.publishedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(article.publishedDate), "MMM dd, yyyy")}
                        </div>
                      )}
                      {article.viewCount !== undefined && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.viewCount} views
                          </div>
                        </>
                      )}
                      {article.pages && (
                        <>
                          <span>•</span>
                          <span>Pages {article.pages}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 mt-2">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length > 3 && (
          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(3, articles.length)} of {articles.length} related articles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
