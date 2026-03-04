import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "../pages/HomePage.vue";
import ProductsListPage from "../pages/ProductsListPage.vue";
import LocalAreaPage from "../pages/LocalAreaPage.vue";
import ContentPage from "../pages/ContentPage.vue";
import FaqPage from "../pages/FaqPage.vue";
import CheckoutPage from "../pages/CheckoutPage.vue";
import ProductDetailPage from "../pages/ProductDetailPage.vue";
import VendorsListPage from "../pages/VendorsListPage.vue";
import VendorDetailPage from "../pages/VendorDetailPage.vue";


const routes = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/produits', name: 'products', component: ProductsListPage },
    { path: '/produits/:slug', name: 'product-detail', component: ProductDetailPage },
    { path: '/vendeurs', name: 'vendors', component: VendorsListPage },
    { path: '/vendeurs/:slug', name: 'vendor-detail', component: VendorDetailPage },
    { path: '/paris/:arrondissement/produits-locaux', name: 'local-area', component: LocalAreaPage },
    { path: '/guide/:slug', name: 'content', component: ContentPage },
    { path: '/faq', name: 'faq', component: FaqPage },
    { path: '/checkout', name: 'checkout', component: CheckoutPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
