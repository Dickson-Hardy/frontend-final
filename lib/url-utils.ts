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
 * Handles both populated volume objects and direct volume numbers
 */
export function getVolumeNumber(volume: any): number {
  // If volume is a populated object with 'volume' field (from volumes collection)
  if (volume?.volume) return volume.volume
  // If volume is a populated object with 'number' field (alternative field name)
  if (volume?.number) return volume.number
  // If volume is just a number
  if (typeof volume === 'number') return volume
  // Default fallback
  return 1
}

/**
 * Generate full article URL from article object
 * If volumeNumberOverride is provided, use it instead of article.volume
 */
export function getArticleUrl(article: any, volumeNumberOverride?: number): string {
  const volumeNumber = volumeNumberOverride || getVolumeNumber(article.volume)
  const articleNumber = article.articleNumber || generateArticleNumber(0)
  return generateArticleUrl(volumeNumber, articleNumber)
}
