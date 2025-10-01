/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: ['res.cloudinary.com'], // Add your image domains
  },
  
  // Security headers for both development and production
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Base headers for all environments
    const baseHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: blob:",
          "font-src 'self' data:",
          "connect-src 'self' https://octopus-app-3jhrw.ondigitalocean.app " + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'),
          "frame-src 'self' https://github.com https://raw.githubusercontent.com https://*.github.io https://octopus-app-3jhrw.ondigitalocean.app blob: data:",
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; '),
      },
    ]
    
    // Additional security headers for production only
    const productionHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
    ]
    
    return [
      {
        source: '/(.*)',
        headers: isProduction ? [...baseHeaders, ...productionHeaders] : baseHeaders,
      },
    ]
  },
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    poweredByHeader: false,
    compress: true,
    generateEtags: true,
  }),
}

export default nextConfig
