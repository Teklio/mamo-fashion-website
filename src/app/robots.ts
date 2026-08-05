import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.mamofashion.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/cart/',
        '/checkout/',
        '/wishlist/',
        '/forgot-password/',
        '/reset-password/',
        '/verify-email/',
        '/register/',
        '/login/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}