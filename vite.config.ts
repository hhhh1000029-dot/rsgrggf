import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isElectron = process.env.ELECTRON === 'true';

  return {
    base: './', // CRITICAL for electron so paths are relative like file:///dist/assets/...
    build: {
      sourcemap: false,
      minify: false, // Disable minification to save massive RAM
      cssCodeSplit: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        maxParallelFileOps: 1, // Only one file at a time
        output: {
          manualChunks: undefined, // Simplify chunking
        }
      },
    },
    plugins: [
      react(), 
      tailwindcss(),
      isElectron ? {
        name: 'virtual-pwa-register',
        resolveId(id) {
          if (id === 'virtual:pwa-register') return id;
        },
        load(id) {
          if (id === 'virtual:pwa-register') return 'export const registerSW = () => () => Promise.resolve();';
        }
      } : VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'intro_logo.png', 'morning_background.jpg', 'Evening_Background.png', 'Menu_Bgm.mp3', 'data/*.json'],
        manifest: {
          name: 'Rhythm Game Offline',
          short_name: 'RhythmGame',
          description: 'A high-performance rhythm game playable offline.',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          icons: [
            {
              src: 'intro_logo.png',
              sizes: '1024x1024',
              type: 'image/png'
            },
            {
              src: 'intro_logo.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'intro_logo.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'intro_logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB for larger songs
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,mp3,wav,jpg,jpeg}'],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|mp3|wav|ogg)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'media-assets',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 60 // 60 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'dicebear-avatars',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/picsum\.photos\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'picsum-images',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      // API key removed for security; using backend proxy.
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
