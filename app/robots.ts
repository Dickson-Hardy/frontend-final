import { MetadataRoute } from 'next'

/**
 * Robots.txt configuration for AMHSJ Journal
 * Guides search engine crawlers on what to index
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amhsj.org'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/articles',
          '/vol/',
          '/volumes',
          '/about',
          '/contact',
          '/guidelines',
          '/editorial-board',
          '/masthead',
        ],
        disallow: [
          '/dashboard/*',
          '/auth/*',
          '/api/*',
          '/_next/*',
          '/admin/*',
        ],
      },
      // Special rules for Google Scholar
      {
        userAgent: 'Googlebot-Scholar',
        allow: [
          '/',
          '/vol/',
          '/articles',
        ],
        disallow: [
          '/dashboard/*',
          '/auth/*',
          '/api/*',
        ],
      },
      // Allow all major search engines
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp', // Yahoo
          'DuckDuckBot',
          'Baiduspider', // Baidu (Chinese)
        ],
        allow: '/',
        disallow: [
          '/dashboard/*',
          '/auth/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
