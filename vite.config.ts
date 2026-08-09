/// <reference types="vitest/config" />
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import svgr from 'vite-plugin-svgr'
import metadata from './public/oauth-client-metadata.json' with { type: 'json' }

const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 5790

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: [
          'babel-plugin-react-compiler',
        ],
      },
    }),
    tailwindcss(),
    svgr(),
    {
      name: 'oauth-envs',
      config(_conf, { command }) {
        if (command === 'build') {
          process.env.VITE_OAUTH_CLIENT_ID = metadata.client_id
          process.env.VITE_OAUTH_REDIRECT_URI = metadata.redirect_uris[0]
        } else {
          const redirectUri = `http://${SERVER_HOST}:${SERVER_PORT}${new URL(metadata.redirect_uris[0]).pathname}`
          process.env.VITE_OAUTH_CLIENT_ID =
            `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(metadata.scope)}`
          process.env.VITE_OAUTH_REDIRECT_URI = redirectUri
        }
        process.env.VITE_OAUTH_SCOPE = metadata.scope
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: SERVER_HOST,
    port: SERVER_PORT,
  },
  build: {
    target: 'es2023',
  },
  test: {
    environment: 'happy-dom',
  },
})
