"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { JournalStatistics } from "@/lib/api"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function HeroSection() {
  const { data: statistics, isLoading } = useApi<JournalStatistics>('/statistics/journal')
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`
    }
    return num.toString()
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Peer-Reviewed Excellence
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Advances in Medicine
                <span className="text-primary block">& Health Sciences</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl">
                International peer-reviewed research published by volumes across all medical specialties and science.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/articles">
                <Button size="lg" className="group">
                  Browse Latest Articles
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg">
                  Submit Your Research
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
                <div className="text-center sm:text-left space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <div className="text-sm text-muted-foreground">Published Articles</div>
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            ) : statistics ? (
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(statistics.totalArticles)}
                  </div>
                  <div className="text-sm text-muted-foreground">Published Articles</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-primary">
                    {statistics.totalCountries}+
                  </div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                  <BookOpen className="w-8 h-8 text-primary mb-2" />
                  <div className="text-sm font-medium">Research Papers</div>
                  <div className="text-xs text-muted-foreground">Peer-reviewed studies</div>
                </div>
                <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                  <Users className="w-8 h-8 text-accent mb-2" />
                  <div className="text-sm font-medium">Global Network</div>
                  <div className="text-xs text-muted-foreground">International collaboration</div>
                </div>
                <div className="bg-card rounded-lg p-4 shadow-sm border border-border col-span-2">
                  <Award className="w-8 h-8 text-primary mb-2" />
                  <div className="text-sm font-medium">Excellence in Medical Research</div>
                  <div className="text-xs text-muted-foreground">Advancing healthcare through innovation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
