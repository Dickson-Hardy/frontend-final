/**
 * ArticleMetaTags Component
 * Injects SEO meta tags and structured data into the document head
 */

'use client'

import { useEffect } from 'react'
import { Article } from '@/lib/api'
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData,
  getBaseUrl
} from '@/lib/seo-utils'

interface ArticleMetaTagsProps {
  article: Article
}

export function ArticleMetaTags({ article }: ArticleMetaTagsProps) {
  const baseUrl = getBaseUrl()
  const volumeNumber = typeof article.volume === 'object' ? article.volume.volume : article.volume
  
  useEffect(() => {
    // Generate structured data
    const articleStructuredData = generateArticleStructuredData(article, baseUrl)
    const organizationStructuredData = generateOrganizationStructuredData(baseUrl)
    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: 'Home', url: '/' },
      { name: `Volume ${volumeNumber}`, url: `/vol/${volumeNumber}` },
      { name: article.title, url: `/vol/${volumeNumber}/article${article.articleNumber}` }
    ], baseUrl)
    
    // Inject structured data scripts
    const scripts = [
      { id: 'article-structured-data', data: articleStructuredData },
      { id: 'organization-structured-data', data: organizationStructuredData },
      { id: 'breadcrumb-structured-data', data: breadcrumbStructuredData }
    ]
    
    const scriptElements: HTMLScriptElement[] = []
    
    scripts.forEach(({ id, data }) => {
      // Remove existing script if present
      const existingScript = document.getElementById(id)
      if (existingScript) {
        existingScript.remove()
      }
      
      // Create new script
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.text = JSON.stringify(data)
      document.head.appendChild(script)
      scriptElements.push(script)
    })
    
    // Update document title dynamically
    const originalTitle = document.title
    document.title = article.title.length > 55 
      ? `${article.title.substring(0, 55)}... | AMHSJ`
      : `${article.title} | AMHSJ`
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    const description = article.abstract 
      ? article.abstract.length > 155
        ? `${article.abstract.substring(0, 155)}...`
        : article.abstract
      : `Read this research article published in AMHSJ, Volume ${volumeNumber}.`
    
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }
    
    // Cleanup on unmount
    return () => {
      scriptElements.forEach(script => script.remove())
      document.title = originalTitle
    }
  }, [article, baseUrl, volumeNumber])
  
  return null
}

interface VolumeMetaTagsProps {
  volume: any
  articles: Article[]
}

export function VolumeMetaTags({ volume, articles }: VolumeMetaTagsProps) {
  const baseUrl = getBaseUrl()
  
  useEffect(() => {
    // Generate structured data for volume
    const volumeStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'PublicationVolume',
      volumeNumber: volume.volume?.toString(),
      datePublished: volume.publishDate,
      publisher: {
        '@type': 'Organization',
        name: 'Advances in Medical & Health Sciences Journal'
      },
      hasPart: articles.slice(0, 10).map(article => ({
        '@type': 'ScholarlyArticle',
        headline: article.title,
        url: `${baseUrl}/vol/${volume.volume}/article${article.articleNumber}`,
        datePublished: article.publishedDate
      })),
      url: `${baseUrl}/vol/${volume.volume}`,
      name: volume.title,
      description: volume.description
    }
    
    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: 'Home', url: '/' },
      { name: `Volume ${volume.volume}`, url: `/vol/${volume.volume}` }
    ], baseUrl)
    
    // Inject structured data scripts
    const scripts = [
      { id: 'volume-structured-data', data: volumeStructuredData },
      { id: 'breadcrumb-structured-data', data: breadcrumbStructuredData }
    ]
    
    const scriptElements: HTMLScriptElement[] = []
    
    scripts.forEach(({ id, data }) => {
      const existingScript = document.getElementById(id)
      if (existingScript) {
        existingScript.remove()
      }
      
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.text = JSON.stringify(data)
      document.head.appendChild(script)
      scriptElements.push(script)
    })
    
    // Update document title
    const originalTitle = document.title
    document.title = `${volume.title || `Volume ${volume.volume}`} | AMHSJ`
    
    // Cleanup
    return () => {
      scriptElements.forEach(script => script.remove())
      document.title = originalTitle
    }
  }, [volume, articles, baseUrl])
  
  return null
}



