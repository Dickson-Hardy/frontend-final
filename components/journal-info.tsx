import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Globe, Award, TrendingUp, Users, Clock } from "lucide-react"
import Link from "next/link"

const journalStats = [
  {
    icon: BookOpen,
    title: "Open Access",
    description: "All articles freely available to the global research community",
  },
  {
    icon: Globe,
    title: "International Reach",
    description: "Contributors and readers from over 150 countries worldwide",
  },
  {
    icon: Award,
    title: "Peer Review",
    description: "Rigorous double-blind peer review process ensuring quality",
  },
  {
    icon: TrendingUp,
    title: "Impact Factor 4.2",
    description: "Recognized for high-quality research and citation impact",
  },
  {
    icon: Users,
    title: "Expert Editorial Board",
    description: "Leading medical professionals and researchers guide our standards",
  },
  {
    icon: Clock,
    title: "Fast Publication",
    description: "Average review time of 6-8 weeks with rapid online publication",
  },
]

export function JournalInfo() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-sm">
                About AMHSJ
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
                International Peer-Reviewed Research Excellence
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Advances in Medicine & Health Sciences publishes international peer-reviewed research by volumes 
                across all medical specialties and science, advancing healthcare knowledge and innovation worldwide.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Medical Specialties & Science</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "All Medical Specialties",
                    "Clinical Research",
                    "Basic Science",
                    "Public Health",
                    "Medical Technology",
                    "Pharmacology",
                    "Surgery",
                    "And More",
                  ].map((area) => (
                    <Badge key={area} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg">Submit Your Research</Button>
                </Link>
                <Link href="/articles">
                  <Button variant="outline" size="lg">
                    Browse Articles
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {journalStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{stat.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
