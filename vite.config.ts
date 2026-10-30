import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE when the repo name differs from the GitHub Pages user site.
// e.g. for https://parisadghn.github.io/portfolio/ run: VITE_BASE=/portfolio/ npm run build
// For a user site (Parisadghn.github.io) build with: VITE_BASE=/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || '/portfolio/',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
  },
})
