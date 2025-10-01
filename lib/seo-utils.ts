/**
 * SEO Utilities for AMHSJ Journal
 * Handles metadata generation, structured data, and academic citation tags
 */

import { Article } from './api'

export interface Author {
  firstName: string
  lastName: string
  title?: string
  email?: string
  affiliation?: string
  orcid?: string
  isCorresponding?: boolean
}

export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  openGraph: {
    title: string
    description: string
    url: string
    type: string
    images: Array<{
      url: string
      width: number
      height: number
      alt: string
    }>
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
  }
  twitter: {
    card: string
    title: string
    description: string
    images: string[]
  }
  dublinCore?: Record<string, string>
  highwirePress?: Record<string, string>
}

/**
 * Generate SEO-optimized metadata for an article
 */
export function generateArticleMetadata(article: Article, baseUrl: string = 'https://amhsj.org'): SEOMetadata {
  const volumeNumber = typeof article.volume === 'object' ? article.volume.volume : article.volume
  const articleUrl = `${baseUrl}/vol/${volumeNumber}/article${article.articleNumber}`
  
  // Generate title (under 60 characters for Google)
  const title = article.title.length > 55 
    ? `${article.title.substring(0, 55)}... | AMHSJ`
    : `${article.title} | AMHSJ`
  
  // Generate description (under 160 characters)
  const description = article.abstract 
    ? article.abstract.length > 155
      ? `${article.abstract.substring(0, 155)}...`
      : article.abstract
    : `Read this research article published in Advances in Medical & Health Sciences Journal (AMHSJ), Volume ${volumeNumber}.`
  
  // Extract author names
  const authorNames = article.authors?.map((author: Author) => 
    `${author.firstName} ${author.lastName}`
  ) || []
  
  // Generate keywords (combine article keywords with defaults)
  const keywords = [
    ...(article.keywords || []),
    'medical research',
    'healthcare',
    'peer-reviewed',
    'AMHSJ',
    `Volume ${volumeNumber}`
  ]
  
  // Generate Open Graph image
  const ogImage = article.manuscriptFile?.url 
    ? `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}&authors=${encodeURIComponent(authorNames.join(', '))}`
    : `${baseUrl}/og-article-default.jpg`
  
  const publishedDate = article.publishedDate 
    ? new Date(article.publishedDate).toISOString()
    : undefined
  
  return {
    title,
    description,
    keywords,
    canonicalUrl: articleUrl,
    openGraph: {
      title: article.title,
      description,
      url: articleUrl,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ],
      publishedTime: publishedDate,
      modifiedTime: publishedDate,
      authors: authorNames
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [ogImage]
    },
    dublinCore: generateDublinCore(article),
    highwirePress: generateHighwirePress(article, baseUrl)
  }
}

/**
 * Generate Dublin Core metadata for academic indexing
 * Used by Google Scholar and other academic search engines
 */
export function generateDublinCore(article: Article): Record<string, string> {
  const volumeNumber = typeof article.volume === 'object' ? article.volume.volume : article.volume
  const authors = article.authors?.map((author: Author) => 
    `${author.lastName}, ${author.firstName}`
  ) || []
  
  return {
    'DC.title': article.title,
    'DC.creator': authors.join('; '),
    'DC.subject': article.keywords?.join('; ') || '',
    'DC.description': article.abstract || '',
    'DC.publisher': 'Advances in Medical & Health Sciences Journal',
    'DC.date': article.publishedDate ? new Date(article.publishedDate).toISOString().split('T')[0] : '',
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.identifier': article.doi || `AMHSJ.${volumeNumber}.${article.articleNumber}`,
    'DC.language': 'en',
    'DC.rights': 'Copyright © Advances in Medical & Health Sciences Journal'
  }
}

/**
 * Generate Highwire Press metadata for PubMed and other databases
 */
export function generateHighwirePress(article: Article, baseUrl: string = 'https://amhsj.org'): Record<string, string> {
  const volumeNumber = typeof article.volume === 'object' ? article.volume.volume : article.volume
  const year = article.publishedDate 
    ? new Date(article.publishedDate).getFullYear().toString()
    : new Date().getFullYear().toString()
  
  const metadata: Record<string, string> = {
    'citation_title': article.title,
    'citation_journal_title': 'Advances in Medical & Health Sciences Journal',
    'citation_journal_abbrev': 'AMHSJ',
    'citation_publisher': 'Advances in Medical & Health Sciences Journal',
    'citation_volume': volumeNumber?.toString() || '',
    'citation_publication_date': article.publishedDate 
      ? new Date(article.publishedDate).toISOString().split('T')[0]
      : '',
    'citation_online_date': article.publishedDate 
      ? new Date(article.publishedDate).toISOString().split('T')[0]
      : '',
    'citation_year': year,
    'citation_language': 'en',
    'citation_abstract': article.abstract || ''
  }
  
  // Add DOI if available
  if (article.doi) {
    metadata['citation_doi'] = article.doi
  }
  
  // Add article number as issue or first page
  if (article.articleNumber) {
    metadata['citation_firstpage'] = article.articleNumber.toString()
  }
  
  // Add PDF URL if available
  if (article.manuscriptFile?.url) {
    metadata['citation_pdf_url'] = article.manuscriptFile.url
  }
  
  // Add authors (Highwire Press format)
  article.authors?.forEach((author: Author, index: number) => {
    metadata[`citation_author_${index}`] = `${author.lastName}, ${author.firstName}`
    if (author.affiliation) {
      metadata[`citation_author_institution_${index}`] = author.affiliation
    }
    if (author.orcid) {
      metadata[`citation_author_orcid_${index}`] = author.orcid
    }
  })
  
  // Add keywords
  article.keywords?.forEach((keyword: string, index: number) => {
    metadata[`citation_keyword_${index}`] = keyword
  })
  
  return metadata
}

/**
 * Generate structured data (JSON-LD) for an article
 * Used by Google and other search engines for rich snippets
 */
export function generateArticleStructuredData(article: Article, baseUrl: string = 'https://amhsj.org') {
  const volumeNumber = typeof article.volume === 'object' ? article.volume.volume : article.volume
  const articleUrl = `${baseUrl}/vol/${volumeNumber}/article${article.articleNumber}`
  
  // Generate author schema
  const authors = article.authors?.map((author: Author) => ({
    '@type': 'Person',
    name: `${author.firstName} ${author.lastName}`,
    givenName: author.firstName,
    familyName: author.lastName,
    email: author.email,
    affiliation: author.affiliation ? {
      '@type': 'Organization',
      name: author.affiliation
    } : undefined,
    identifier: author.orcid ? `https://orcid.org/${author.orcid}` : undefined
  })) || []
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: article.title,
    abstract: article.abstract,
    author: authors,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    publisher: {
      '@type': 'Organization',
      name: 'Advances in Medical & Health Sciences Journal',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    isPartOf: {
      '@type': 'PublicationVolume',
      volumeNumber: volumeNumber?.toString(),
      datePublished: article.publishedDate
    },
    keywords: article.keywords?.join(', '),
    url: articleUrl,
    identifier: article.doi || `AMHSJ.${volumeNumber}.${article.articleNumber}`,
    inLanguage: 'en',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    articleSection: article.type || 'Research Article',
    wordCount: article.abstract ? article.abstract.split(' ').length : undefined,
    image: article.manuscriptFile?.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  }
}

/**
 * Generate structured data for the journal organization
 */
export function generateOrganizationStructuredData(baseUrl: string = 'https://amhsj.org') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Advances in Medical & Health Sciences Journal',
    alternateName: 'AMHSJ',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Peer-reviewed medical journal advancing healthcare through research, innovation, and global collaboration.',
    foundingDate: '2020',
    sameAs: [
      // Add social media links when available
      // 'https://twitter.com/amhsj',
      // 'https://linkedin.com/company/amhsj'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Editorial Office',
      email: 'editor@amhsj.org'
    },
    publishingPrinciples: `${baseUrl}/guidelines`
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>,
  baseUrl: string = 'https://amhsj.org'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`
    }))
  }
}

/**
 * Generate volume structured data
 */
export function generateVolumeStructuredData(
  volume: any,
  articles: Article[],
  baseUrl: string = 'https://amhsj.org'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PublicationVolume',
    volumeNumber: volume.volume?.toString(),
    datePublished: volume.publishDate,
    publisher: {
      '@type': 'Organization',
      name: 'Advances in Medical & Health Sciences Journal'
    },
    hasPart: articles.map(article => ({
      '@type': 'ScholarlyArticle',
      headline: article.title,
      url: `${baseUrl}/vol/${volume.volume}/article${article.articleNumber}`,
      datePublished: article.publishedDate
    })),
    url: `${baseUrl}/vol/${volume.volume}`,
    name: volume.title,
    description: volume.description
  }
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Generate meta tags array for Next.js metadata
 */
export function generateMetaTags(metadata: SEOMetadata) {
  const tags: Array<{ name?: string; property?: string; content: string }> = []
  
  // Basic meta tags
  tags.push({ name: 'description', content: metadata.description })
  tags.push({ name: 'keywords', content: metadata.keywords.join(', ') })
  
  // Open Graph tags
  tags.push({ property: 'og:title', content: metadata.openGraph.title })
  tags.push({ property: 'og:description', content: metadata.openGraph.description })
  tags.push({ property: 'og:url', content: metadata.openGraph.url })
  tags.push({ property: 'og:type', content: metadata.openGraph.type })
  
  if (metadata.openGraph.publishedTime) {
    tags.push({ property: 'article:published_time', content: metadata.openGraph.publishedTime })
  }
  
  if (metadata.openGraph.modifiedTime) {
    tags.push({ property: 'article:modified_time', content: metadata.openGraph.modifiedTime })
  }
  
  metadata.openGraph.images.forEach(image => {
    tags.push({ property: 'og:image', content: image.url })
    tags.push({ property: 'og:image:width', content: image.width.toString() })
    tags.push({ property: 'og:image:height', content: image.height.toString() })
    tags.push({ property: 'og:image:alt', content: image.alt })
  })
  
  // Twitter tags
  tags.push({ name: 'twitter:card', content: metadata.twitter.card })
  tags.push({ name: 'twitter:title', content: metadata.twitter.title })
  tags.push({ name: 'twitter:description', content: metadata.twitter.description })
  
  metadata.twitter.images.forEach(image => {
    tags.push({ name: 'twitter:image', content: image })
  })
  
  // Dublin Core tags
  if (metadata.dublinCore) {
    Object.entries(metadata.dublinCore).forEach(([key, value]) => {
      if (value) tags.push({ name: key, content: value })
    })
  }
  
  // Highwire Press tags
  if (metadata.highwirePress) {
    Object.entries(metadata.highwirePress).forEach(([key, value]) => {
      if (value) tags.push({ name: key, content: value })
    })
  }
  
  return tags
}

/**
 * Get base URL from environment or default
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://amhsj.org'
}
