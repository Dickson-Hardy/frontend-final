// URL utility functions for generating SEO-friendly article URLs

export interface ArticleUrlParams {
  volumeNumber: number
  articleNumber: string
}

export interface ParsedArticleUrl {
  volumeNumber: number
  articleNumber: string
}

/**
 * Generate SEO-friendly article URL
 * Format: /vol/{volumeNumber}/article{articleNumber}
 * Example: /vol/1/article001
 */
export function generateArticleUrl(volumeNumber: number, articleNumber: string): string {
  return `/vol/${volumeNumber}/article${articleNumber}`
}

/**
 * Parse article URL to extract volume and article numbers
 * Input: /vol/1/article001
 * Output: { volumeNumber: 1, articleNumber: "001" }
 */
export function parseArticleUrl(url: string): ParsedArticleUrl | null {
  const match = url.match(/^\/vol\/(\d+)\/article(.+)$/)
  if (!match) {
    return null
  }
  
  return {
    volumeNumber: parseInt(match[1], 10),
    articleNumber: match[2]
  }
}

/**
 * Generate article number from index
 * Converts 0, 1, 2... to "001", "002", "003"...
 */
export function generateArticleNumber(index: number): string {
  return String(index + 1).padStart(3, '0')
}

/**
 * Extract volume number from volume object
 */
export function getVolumeNumber(volume: any): number {
  return volume?.volume || volume?.number || 1
}

/**
 * Generate full article URL from article object
 */
export function getArticleUrl(article: any): string {
  const volumeNumber = getVolumeNumber(article.volume)
  const articleNumber = article.articleNumber || generateArticleNumber(0)
  return generateArticleUrl(volumeNumber, articleNumber)
}
