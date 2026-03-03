import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/ESC/',  
  root: '.',
  publicDir: 'public',  
  build: {
    outDir: 'dist',    
    emptyOutDir: true,  
    assetsDir: 'assets', 
    
  
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ourchallenges: resolve(__dirname, 'OurChallenges.html'),
        thestory: resolve(__dirname, 'theStory.html'),
        contact: resolve(__dirname, 'contact.html'),
        modal: resolve(__dirname, 'bookThisRoomModal.html')
      },
      output: {
        
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.')[1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'assets/images/[name][extname]'
          }
          if (/css/i.test(extType)) {
            return 'assets/css/[name][extname]'
          }
          return 'assets/[name][extname]'
        }
      }
    }
  },
  

  server: {
    port: 3000,
    open: true
  },
  

  preview: {
    port: 3001,
    open: true
  }
})
