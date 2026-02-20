import { Metadata } from 'next'
import { generateArticleMetadata, generateMetaTags, getBaseUrl } from '@/lib/seo-utils'

/**
 * Generate metadata for article pages
 * This is used by Next.js for static generation
 */
export async function generateArticlePageMetadata(
  volumeNumber: number,
  articleNumber: string
): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  
  try {
    // Fetch article data from API
    const _rawApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')
    const apiUrl = _rawApi.endsWith('/api/v1') ? _rawApi.replace(/\/api\/v1$/, '') : _rawApi
    const response = await fetch(
      `${apiUrl}/api/v1/articles/volume/${volumeNumber}/article/${articleNumber}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      return generateDefaultMetadata(volumeNumber, articleNumber)
    }
    
    const article = await response.json()
    const seoMetadata = generateArticleMetadata(article, baseUrl)
    
    return {
      title: seoMetadata.title,
      description: seoMetadata.description,
      keywords: seoMetadata.keywords,
      authors: seoMetadata.openGraph.authors?.map(name => ({ name })),
      openGraph: {
        title: seoMetadata.openGraph.title,
        description: seoMetadata.openGraph.description,
        url: seoMetadata.openGraph.url,
        type: 'article',
        images: seoMetadata.openGraph.images,
        publishedTime: seoMetadata.openGraph.publishedTime,
        modifiedTime: seoMetadata.openGraph.modifiedTime,
        siteName: 'AMHSJ'
      },
      twitter: {
        card: 'summary_large_image',
        title: seoMetadata.twitter.title,
        description: seoMetadata.twitter.description,
        images: seoMetadata.twitter.images
      },
      alternates: {
        canonical: seoMetadata.canonicalUrl
      },
      other: {
        ...seoMetadata.dublinCore,
        ...seoMetadata.highwirePress
      }
    }
  } catch (error) {
    console.error('Error generating article metadata:', error)
    return generateDefaultMetadata(volumeNumber, articleNumber)
  }
}

/**
 * Generate default metadata when article data is not available
 */
function generateDefaultMetadata(volumeNumber: number, articleNumber: string): Metadata {
  const baseUrl = getBaseUrl()
  const title = `Article ${articleNumber} - Volume ${volumeNumber} | AMHSJ`
  const description = `Read this research article from Volume ${volumeNumber} of Advances in Medical & Health Sciences Journal (AMHSJ).`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/vol/${volumeNumber}/article${articleNumber}`,
      type: 'article',
      siteName: 'AMHSJ'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

/**
 * Generate metadata for volume listing pages
 */
export async function generateVolumePageMetadata(volumeNumber: number): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  
  try {
    // Fetch volume data from API
    const _rawApi2 = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')
    const apiUrl = _rawApi2.endsWith('/api/v1') ? _rawApi2.replace(/\/api\/v1$/, '') : _rawApi2
    const response = await fetch(
      `${apiUrl}/api/v1/volumes/number/${volumeNumber}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      return generateDefaultVolumeMetadata(volumeNumber)
    }
    
    const volume = await response.json()
    const title = `${volume.title || `Volume ${volumeNumber}`} | AMHSJ`
    const description = volume.description || 
      `Browse all articles published in Volume ${volumeNumber} of Advances in Medical & Health Sciences Journal (AMHSJ).`
    
    return {
      title,
      description,
      keywords: ['medical journal', 'healthcare research', 'AMHSJ', `Volume ${volumeNumber}`, 'peer-reviewed articles'],
      openGraph: {
        title: volume.title || `Volume ${volumeNumber}`,
        description,
        url: `${baseUrl}/vol/${volumeNumber}`,
        type: 'website',
        siteName: 'AMHSJ'
      },
      twitter: {
        card: 'summary_large_image',
        title: volume.title || `Volume ${volumeNumber}`,
        description
      },
      alternates: {
        canonical: `${baseUrl}/vol/${volumeNumber}`
      }
    }
  } catch (error) {
    console.error('Error generating volume metadata:', error)
    return generateDefaultVolumeMetadata(volumeNumber)
  }
}

/**
 * Generate default metadata for volume pages
 */
function generateDefaultVolumeMetadata(volumeNumber: number): Metadata {
  const baseUrl = getBaseUrl()
  const title = `Volume ${volumeNumber} | AMHSJ`
  const description = `Browse all articles published in Volume ${volumeNumber} of Advances in Medical & Health Sciences Journal (AMHSJ).`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/vol/${volumeNumber}`,
      type: 'website',
      siteName: 'AMHSJ'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}
