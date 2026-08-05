import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/cart/', '/checkout/', '/wishlist/', '/forgot-password/', '/reset-password/', '/verify-email/', '/register/', '/login/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
