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
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import CartPage from "../pages/CartPage.vue";
import AccountPage from "../pages/AccountPage.vue";
import VendorLoginPage from "../pages/VendorLoginPage.vue";
import VendorRegisterPage from "../pages/VendorRegisterPage.vue";
import VendorDashboardPage from "../pages/VendorDashboardPage.vue";

const routes = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/produits', name: 'products', component: ProductsListPage },
    { path: '/produits/:slug', name: 'product-detail', component: ProductDetailPage },
    { path: '/vendeurs', name: 'vendors', component: VendorsListPage },
    { path: '/vendeurs/:slug', name: 'vendor-detail', component: VendorDetailPage },
    { path: '/Grenoble/:arrondissement/produits-locaux', name: 'local-area', component: LocalAreaPage },
    { path: '/guide/:slug', name: 'content', component: ContentPage },
    { path: '/faq', name: 'faq', component: FaqPage },
    { path: '/checkout', name: 'checkout', component: CheckoutPage },
    { path: '/connexion', name: 'login', component: LoginPage },
    { path: '/inscription', name: 'register', component: RegisterPage },
    { path: '/panier', name: 'cart', component: CartPage },
    { path: '/compte', name: 'account', component: AccountPage },
    { path: '/vendeur/connexion', name: 'vendor-login', component: VendorLoginPage },
    { path: '/vendeur/inscription', name: 'vendor-register', component: VendorRegisterPage },
    { path: '/vendeur/dashboard', name: 'vendor-dashboard', component: VendorDashboardPage },
    {
        path: '/mentions-legales',
        name: 'Legal',
        component: () => import('../pages/LegalPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
