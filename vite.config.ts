import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Makes Kova an installable app (PWA): manifest + service worker
    VitePWA({
      // A new version waits until the user taps "Update" (see UpdateBanner).
      // We don't auto-reload: that could wipe someone halfway through backing up their phrase.
      registerType: 'prompt',
      // We register the service worker ourselves via useRegisterSW()
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kova Wallet',
        short_name: 'Kova',
        description: 'A friendly crypto wallet demo with live prices. All funds are mocked.',
        // Opens full screen, without the browser's address bar
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        background_color: '#F4F6F5', // splash screen
        theme_color: '#0E6B52',
        categories: ['finance'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          // Full-bleed version Android can crop into a circle/squircle
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell (JS, CSS, HTML, icons) so Kova opens offline
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Any URL (e.g. /send) falls back to index.html, and React Router takes it from there
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Prices: try the network first, fall back to the last cached response when offline
            urlPattern: /^https:\/\/api\.coingecko\.com\/api\/v3\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'coingecko-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Coin logos rarely change, so serve them from cache
            urlPattern: /^https:\/\/coin-images\.coingecko\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'coin-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Google Fonts stylesheet + font files
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    // Lets us write `import x from '@/lib/x'` instead of '../../../lib/x'
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
