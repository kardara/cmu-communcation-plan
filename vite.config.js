import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Link previews need an absolute image URL. On Vercel this resolves to the
// production domain automatically; set SITE_URL to override (e.g. a custom domain).
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const siteUrl = (process.env.SITE_URL || (host ? `https://${host}` : '')).replace(/\/$/, '')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
  ],
})
