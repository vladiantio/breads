import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import svgr from 'vite-plugin-svgr'
import { lingui } from "@lingui/vite-plugin";

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
          '@lingui/babel-plugin-lingui-macro',
        ],
      },
    }),
    lingui(),
    tailwindcss(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5790,
  },
  build: {
    target: 'es2023',
    rollupOptions: {
      output: {
        manualChunks: {
          atp: ['@atproto/api'],
        },
      },
    },
  },
})
