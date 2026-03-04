import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    {
      name: 'copy-htaccess',
      writeBundle() {
        // Copier .htaccess après le build
        copyFileSync(
          resolve(__dirname, '.htaccess'),
          resolve(__dirname, 'dist/.htaccess')
        )
      }
    }
  ],
})
