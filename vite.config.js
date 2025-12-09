import { defineConfig } from 'vite'
import path from 'path'
import { glob } from 'glob'
import fs from 'fs'

export default defineConfig({
  root: '.',
  publicDir: 'img',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        ourchallenges: path.resolve(__dirname, 'OurChallenges.html'),
        thestory: path.resolve(__dirname, 'theStory.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        // Automatically find all HTML files
        ...Object.fromEntries(
          glob.sync('*.html').map(file => [
            path.basename(file, '.html'),
            path.resolve(__dirname, file)
          ])
        )
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})