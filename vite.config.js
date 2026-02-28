import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/', // ← ZMIEŃ na '/ai-hub/' jeśli nazwa repo jest inna niż username.github.io
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'AI Hub Polska',
        short_name: 'AI Hub',
        description: 'Twój prywatny katalog najlepszych AI 2026',
        theme_color: '#1e2937',
        background_color: '#1e2937',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
