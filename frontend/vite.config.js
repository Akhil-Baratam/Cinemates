import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// Load environment variables from .env file
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_REACT_APP_BACKEND_BASEURL,
        changeOrigin: true,
      },
    }
  },
})
