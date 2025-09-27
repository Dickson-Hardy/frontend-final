import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/auth-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "AMHSJ - Advances in Medical & Health Sciences Journal",
  description: "Peer-reviewed medical journal advancing healthcare through research, innovation, and global collaboration.",
  generator: "v0.app",
  keywords: [
    "medical journal",
    "healthcare",
    "research",
    "peer-reviewed",
    "AMHSJ"
  ],
  openGraph: {
    title: "AMHSJ - Advances in Medical & Health Sciences Journal",
    description: "Peer-reviewed medical journal advancing healthcare through research, innovation, and global collaboration.",
    url: "https://amhsj.org",
    images: [
      {
        url: "/medical-journal-cover-ai-healthcare.jpg",
        width: 1200,
        height: 630,
        alt: "AMHSJ Journal Cover"
      }
    ],
    siteName: "AMHSJ"
  },
  twitter: {
    card: "summary_large_image",
    title: "AMHSJ - Advances in Medical & Health Sciences Journal",
    description: "Peer-reviewed medical journal advancing healthcare through research, innovation, and global collaboration.",
    images: ["/medical-journal-cover-ai-healthcare.jpg"]
  },
  alternates: {
    canonical: "https://amhsj.org"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
