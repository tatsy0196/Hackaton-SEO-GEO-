import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {copyFileSync} from 'fs'
import {resolve} from 'path'
import ViteSitemap from "vite-plugin-sitemap"
import {getProducts} from "./src/services/api.ts"
import {getVendors} from "./src/services/api.ts"


export default defineConfig(async () => ({
    base: '/',
    plugins: [
        vue(),

        // Plugin pour copier .htaccess
        {
            name: 'copy-htaccess',
            writeBundle() {
                copyFileSync(
                    resolve(__dirname, '.htaccess'),
                    resolve(__dirname, 'dist/.htaccess')
                )
            }
        },

        // Plugin pour générer le sitemap
        ViteSitemap({
            hostname: 'https://GreeNoble.com', // ton domaine
            dynamicRoutes: [
                ...(await getProducts()).map(p => `/produit/${p.slug}`),
                ...(await getVendors()).map(v => `/vendeur/${v.slug}`)
            ]
        })
    ],
}))