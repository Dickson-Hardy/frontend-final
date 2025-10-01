import { Metadata } from 'next'
import { HeroSection } from "@/components/hero-section"
import { FeaturedArticles } from "@/components/featured-articles"
import { CurrentVolume } from "@/components/current-volume"
import { NewsAnnouncements } from "@/components/news-announcements"
import { JournalInfo } from "@/components/journal-info"

export const metadata: Metadata = {
  title: 'AMHSJ - Advances in Medical & Health Sciences Journal | Peer-Reviewed Research',
  description: 'Leading peer-reviewed medical journal publishing cutting-edge research in healthcare, clinical studies, and medical innovation. Discover the latest advancements in medical and health sciences.',
  keywords: [
    'medical journal',
    'healthcare research',
    'peer-reviewed articles',
    'clinical research',
    'health sciences',
    'medical innovation',
    'AMHSJ',
    'evidence-based medicine',
    'medical publications',
    'research articles'
  ],
  openGraph: {
    title: 'AMHSJ - Advances in Medical & Health Sciences Journal',
    description: 'Leading peer-reviewed medical journal publishing cutting-edge research in healthcare, clinical studies, and medical innovation.',
    url: 'https://amhsj.org',
    type: 'website',
    siteName: 'AMHSJ',
    images: [
      {
        url: 'https://amhsj.org/medical-journal-cover-ai-healthcare.jpg',
        width: 1200,
        height: 630,
        alt: 'AMHSJ Journal Cover'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMHSJ - Advances in Medical & Health Sciences Journal',
    description: 'Leading peer-reviewed medical journal publishing cutting-edge research in healthcare.',
    images: ['https://amhsj.org/medical-journal-cover-ai-healthcare.jpg']
  },
  alternates: {
    canonical: 'https://amhsj.org'
  }
}

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
