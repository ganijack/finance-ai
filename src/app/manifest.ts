import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FinanceAI',
    short_name: 'FinanceAI',
    description: 'AI-Powered Personal Finance Platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b', // zinc-950
    theme_color: '#09090b',
    icons: [
      {
        src: '/logo/favicon.ico',
        sizes: '64x64',
        type: 'image/x-icon',
      },
      {
        src: '/logo/apple-touch-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/apple-touch-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
