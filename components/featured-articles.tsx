"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { useFeaturedArticles } from "@/hooks/use-api"
import { format } from "date-fns"
import { getArticleUrl } from "@/lib/url-utils"
import Link from "next/link"

export function FeaturedArticles() {
  const { data: featuredArticles, isLoading, error } = useFeaturedArticles(3)

  if (isLoading) {
    return (
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !featuredArticles) {
    return (
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load featured articles at this time.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
            Featured Research Articles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover the latest breakthroughs in medical research from leading healthcare professionals and researchers
            worldwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {featuredArticles.map((article) => (
            <Card
              key={article._id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 h-full flex flex-col"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.keywords?.[0] || "Research"}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {Math.ceil(article.abstract.split(" ").length / 200)} min read
                  </span>
                </div>
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors text-balance">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty line-clamp-4 flex-1">{article.abstract}</p>

                <div className="space-y-3 pt-4 border-t border-border/50 mt-auto">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="w-3 h-3 mr-2" />
                    {article.authors.map((author) => {
                      const nameParts = [author.title, author.firstName, author.lastName].filter(Boolean)
                      return nameParts.join(' ')
                    }).join(", ")}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-2" />
                      {format(new Date(article.publishedDate || article.submissionDate), "MMMM d, yyyy")}
                    </div>
                    <Link href={getArticleUrl(article)}>
                      <Button variant="ghost" size="sm" className="group/btn text-xs">
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/articles">
            <Button variant="outline" size="lg">
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
