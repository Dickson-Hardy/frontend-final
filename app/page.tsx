import { HeroSection } from "@/components/hero-section"
import { FeaturedArticles } from "@/components/featured-articles"
import { CurrentVolume } from "@/components/current-volume"
import { NewsAnnouncements } from "@/components/news-announcements"
import { JournalInfo } from "@/components/journal-info"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedArticles />
       <CurrentVolume />
      <NewsAnnouncements />
      <JournalInfo />
    </>
  )
}
