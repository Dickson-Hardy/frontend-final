import { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap for AMHSJ Journal
 * Automatically includes all articles, volumes, and static pages
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amhsj.org'
const _rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')
const API_URL = _rawApiUrl.endsWith('/api/v1') ? _rawApiUrl.replace(/\/api\/v1$/, '') : _rawApiUrl

interface Article {
  _id: string
  volume: any
  articleNumber: string
  updatedAt?: string
  publishedDate?: string
}

interface Volume {
  _id: string
  volume: number
  updatedAt?: string
  publishDate?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []
  
  try {
    // Static pages
    const staticPages = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/articles`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/volumes`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/guidelines`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/editorial-board`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/masthead`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
    ]
    
    sitemap.push(...staticPages)
    
    // Fetch all published articles
    try {
      const articlesResponse = await fetch(`${API_URL}/api/v1/articles/published?limit=1000`, {
        next: { revalidate: 3600 } // Revalidate every hour
      })
      
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json()
        const articles: Article[] = articlesData.articles || []
        
        articles.forEach((article) => {
          const volumeNumber = typeof article.volume === 'object' 
            ? article.volume.volume 
            : article.volume
          
          sitemap.push({
            url: `${BASE_URL}/vol/${volumeNumber}/article${article.articleNumber}`,
            lastModified: article.updatedAt 
              ? new Date(article.updatedAt)
              : article.publishedDate
              ? new Date(article.publishedDate)
              : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
          })
        })
      }
    } catch (error) {
      console.error('Error fetching articles for sitemap:', error)
    }
    
    // Fetch all volumes
    try {
      const volumesResponse = await fetch(`${API_URL}/api/v1/volumes`, {
        next: { revalidate: 3600 }
      })
      
      if (volumesResponse.ok) {
        const volumes: Volume[] = await volumesResponse.json()
        
        volumes.forEach((volume) => {
          sitemap.push({
            url: `${BASE_URL}/vol/${volume.volume}`,
            lastModified: volume.updatedAt 
              ? new Date(volume.updatedAt)
              : volume.publishDate
              ? new Date(volume.publishDate)
              : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          })
        })
      }
    } catch (error) {
      console.error('Error fetching volumes for sitemap:', error)
    }
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }
  
  return sitemap
}
