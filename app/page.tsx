import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedArticles } from "@/components/featured-articles"
import { CurrentVolume } from "@/components/current-volume"
import { NewsAnnouncements } from "@/components/news-announcements"
import { JournalInfo } from "@/components/journal-info"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedArticles />
      <CurrentVolume />
      <NewsAnnouncements />
      <JournalInfo />
      <Footer />
    </main>
  )
}
