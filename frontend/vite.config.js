import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load environment variables from .env file
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  plugins: [react()],
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
