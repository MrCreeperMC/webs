import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change BASE to '/REPOSITORY_NAME/' for GitHub Pages
// Use '/' for custom domain or local development
const base = process.env.GITHUB_REPOSITORY
  ? '/' + process.env.GITHUB_REPOSITORY.split('/')[1] + '/'
  : '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
