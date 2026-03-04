import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {copyFileSync} from 'fs'
import {resolve} from 'path'
import ViteSitemap from "vite-plugin-sitemap"
import {getProducts} from "./src/services/api.ts"
import {getVendors} from "./src/services/api.ts"


export default defineConfig({
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
            routes: async () => {
                const products = await getProducts()
                const vendors = await getVendors()

                const productRoutes = products.map(p => `/produit/${p.slug}`)
                const vendorRoutes = vendors.map(v => `/vendeur/${v.slug}`)

                return [...productRoutes, ...vendorRoutes]
            }
        })
    ],
})