import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login',
        '/dashboard',
        '/profile',
        '/api/'
      ],
    },
    sitemap: 'https://greencollective.ca/sitemap.xml',
  }
}
