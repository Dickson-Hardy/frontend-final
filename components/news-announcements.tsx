"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Bell, ArrowRight, Megaphone, Loader2 } from "lucide-react"
import { useFeaturedNews } from "@/hooks/use-api"
import { format } from "date-fns"

export function NewsAnnouncements() {
  const { data: newsItems, isLoading, error } = useFeaturedNews(4)

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !newsItems) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">Unable to load news items at this time.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Bell className="w-4 h-4 mr-2" />
            Latest Updates
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">News & Announcements</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Stay informed about the latest developments, calls for papers, and important updates from AMHSJ.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {newsItems.map((item) => (
            <Card
              key={item._id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      {item.type === "announcement" && <Megaphone className="w-4 h-4 text-primary" />}
                      {item.type === "news" && <Bell className="w-4 h-4 text-primary" />}
                      {item.type === "update" && <ArrowRight className="w-4 h-4 text-primary" />}
                    </div>
                    <Badge
                      variant={
                        item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.priority} priority
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors text-balance">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{item.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-2" />
                    {format(new Date(item.publishedDate), "MMMM d, yyyy")}
                  </div>
                  <Button variant="ghost" size="sm" className="group/btn text-xs">
                    Read More
                    <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
