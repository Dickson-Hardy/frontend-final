import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/auth-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { LayoutWrapper } from "@/components/layout-wrapper"
import "./globals.css"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://amhsj.org'),
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "AMHSJ - Advances in Medical & Health Sciences Journal",
    description: "Peer-reviewed medical journal advancing healthcare through research, innovation, and global collaboration.",
    url: "https://amhsj.org",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "AMHSJ Logo"
      },
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
    images: ["/logo.png", "/medical-journal-cover-ai-healthcare.jpg"]
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
            <LayoutWrapper>
              <Suspense fallback={null}>{children}</Suspense>
            </LayoutWrapper>
          </AuthProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
