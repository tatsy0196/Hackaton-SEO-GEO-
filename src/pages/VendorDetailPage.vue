<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute, RouterLink } from 'vue-router'
import {getVendorBySlug, getProductsByVendor} from "../services/api.ts";
import {trackEvent} from "../services/tracking.ts";

const route = useRoute()
const vendor = ref<any | null>(null)
const vendorProducts = ref<any[]>([])

onMounted(async () => {
  const slug = route.params.slug as string
  vendor.value = await getVendorBySlug(slug)

  if (vendor.value) {
    trackEvent('view_vendor', {
      vendor_id: vendor.value.id,
      city: vendor.value.city
    })
    
    // Charger les produits du vendeur
    vendorProducts.value = await getProductsByVendor(vendor.value.id)

    useHead({
      title: `${vendor.value.name} - Producteur local écoresponsable - GreenNoble`,
      meta: [
        {
          name: 'description',
          content: vendor.value.shortDescription || `Découvrez ${vendor.value.name}, producteur local écoresponsable à ${vendor.value.city}`
        },
        {
          name: 'keywords',
          content: `${vendor.value.name}, producteur local, ${vendor.value.city}, écoresponsable, bio`
        }
      ]
    })
  }
})
</script>

<template>
  <div v-if="vendor" class="vendor-detail">
    <!-- Image Hero -->
    <div class="vendor-hero">
      <img :src="vendor.imageUrl" :alt="vendor.name" class="hero-image" />
      <div class="hero-overlay"></div>
    </div>

    <!-- Main Content -->
    <div class="vendor-container">
      <div class="vendor-grid">
        <!-- Left: Info -->
        <div class="vendor-main">
          <h1 class="vendor-name">{{ vendor.name }}</h1>

          <div class="vendor-header-meta">
            <span class="city-badge">📍 {{ vendor.city }}</span>
            <span class="code-badge">{{ vendor.postalCode }}</span>
          </div>

          <p class="vendor-description">{{ vendor.shortDescription }}</p>

          <!-- Labels -->
          <div v-if="vendor.labels?.length" class="labels-section">
            <h3>Engagements</h3>
            <div class="labels-grid">
              <span v-for="label in vendor.labels" :key="label" class="label-chip">
                ✓ {{ label }}
              </span>
            </div>
          </div>

          <!-- Address Section -->
          <div class="address-section">
            <h3>Localisation</h3>
            <div class="address-card">
              <div class="address-item">
                <span class="address-icon">🏢</span>
                <div>
                  <p class="label">Adresse</p>
                  <p class="value">{{ vendor.address }}</p>
                </div>
              </div>
              <div class="address-item">
                <span class="address-icon">📮</span>
                <div>
                  <p class="label">Code postal</p>
                  <p class="value">{{ vendor.postalCode }}</p>
                </div>
              </div>
              <div class="address-item">
                <span class="address-icon">🗺️</span>
                <div>
                  <p class="label">Ville</p>
                  <p class="value">{{ vendor.city }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sidebar -->
        <aside class="vendor-sidebar">
          <div class="sidebar-card">
            <h3>À propos</h3>
            <div class="about-stats">
              <div class="stat">
                <span class="stat-value">{{ vendor.labels?.length || 0 }}</span>
                <span class="stat-label">Engagements</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ vendor.city }}</span>
                <span class="stat-label">Localisation</span>
              </div>
            </div>
          </div>

          <div class="sidebar-card cta-card">
            <h3>Découvrir</h3>
            <p>Parcourez nos produits sélectionnés avec soin.</p>
            <RouterLink to="/produits" class="btn-explore">Voir les produits</RouterLink>
          </div>

          <div class="sidebar-card eco-card">
            <h3>Écoresponsable 🌱</h3>
            <p>Ce producteur s'engage pour un Grenoble plus durable avec des pratiques respectueuses de l'environnement.</p>
          </div>
        </aside>
      </div>

      <!-- Section des produits du vendeur -->
      <div v-if="vendorProducts.length" class="vendor-products-section">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Produits disponibles ({{ vendorProducts.length }})
        </h2>
        <div class="products-grid">
          <RouterLink 
            v-for="product in vendorProducts" 
            :key="product.id"
            :to="`/produit/${product.slug}`"
            class="product-card"
          >
            <div class="product-image-wrapper">
              <img :src="product.imageUrl" :alt="product.name" />
              <div class="product-overlay">
                <span class="view-btn">Voir le produit</span>
              </div>
            </div>
            <div class="product-content">
              <span class="product-category">{{ product.category }}</span>
              <h3>{{ product.name }}</h3>
              <p class="product-desc">{{ product.shortDescription }}</p>
              <div class="product-footer">
                <span class="product-price">{{ product.price.toFixed(2) }} €</span>
                <span v-if="product.stock > 0" class="product-stock in-stock">En stock</span>
                <span v-else class="product-stock out-stock">Rupture</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Message si aucun produit -->
      <div v-else class="no-products">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Aucun produit disponible</h3>
        <p>Ce vendeur n'a pas encore de produits en ligne.</p>
      </div>
    </div>
  </div>

  <div v-else class="loading-state">
    <div class="spinner"></div>
    <p>Vendeur en cours de chargement...</p>
  </div>
</template>

<style scoped>
.vendor-detail {
  min-height: 100vh;
}

/* Hero Image */
.vendor-hero {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
}

/* Container */
.vendor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: -60px;
  position: relative;
  z-index: 10;
}

.vendor-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

/* Main Content */
.vendor-main {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.vendor-name {
  font-size: 2.5em;
  margin: 0 0 1rem 0;
  color: #1b5e20;
  font-weight: 700;
}

.vendor-header-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.city-badge,
.code-badge {
  padding: 0.5rem 1rem;
  background: #e8f5e9;
  color: #1b5e20;
  border-radius: 20px;
  font-size: 0.95em;
  font-weight: 500;
}

.vendor-description {
  font-size: 1.1em;
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* Labels Section */
.labels-section {
  margin-bottom: 2.5rem;
}

.labels-section h3 {
  color: #1b5e20;
  font-size: 1.2em;
  margin-bottom: 1rem;
  font-weight: 600;
}

.labels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.label-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f6 100%);
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  color: #1b5e20;
  font-weight: 500;
  font-size: 0.95em;
}

/* Address Section */
.address-section {
  margin-top: 2.5rem;
}

.address-section h3 {
  color: #1b5e20;
  font-size: 1.2em;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.address-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.address-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8faf9;
  border-radius: 10px;
  border-left: 4px solid #1b5e20;
}

.address-icon {
  font-size: 1.8em;
  min-width: 40px;
  text-align: center;
}

.address-item p {
  margin: 0;
}

.address-item .label {
  font-size: 0.85em;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.address-item .value {
  font-size: 1em;
  color: #333;
  font-weight: 500;
}

/* Sidebar */
.vendor-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.sidebar-card h3 {
  margin: 0 0 1rem 0;
  color: #1b5e20;
  font-size: 1.1em;
  font-weight: 600;
}

.about-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat:last-child {
  border-bottom: none;
}

.stat-value {
  font-size: 1.5em;
  font-weight: 700;
  color: #1b5e20;
  min-width: 50px;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

/* CTA Card */
.cta-card {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
}

.cta-card h3 {
  color: white;
}

.cta-card p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  font-size: 0.95em;
}

.btn-explore {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #1b5e20;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95em;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-explore:hover {
  background: #f0f0f0;
  transform: scale(1.02);
}

/* Eco Card */
.eco-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f6 100%);
  border: 2px solid #c8e6c9;
}

.eco-card h3 {
  color: #1b5e20;
}

.eco-card p {
  color: #555;
  margin: 0;
  font-size: 0.95em;
  line-height: 1.5;
}

/* Vendor Products Section */
.vendor-products-section {
  margin-top: 4rem;
}

.vendor-products-section h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2em;
  color: #1b5e20;
  margin-bottom: 2rem;
  font-weight: 700;
}

.vendor-products-section svg {
  flex-shrink: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image-wrapper img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(27, 94, 32, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.view-btn {
  background: white;
  color: #1b5e20;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95em;
}

.product-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-category {
  display: inline-block;
  background: #e8f5e9;
  color: #1b5e20;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.product-content h3 {
  margin: 0;
  font-size: 1.2em;
  color: #2c3e50;
  font-weight: 600;
  line-height: 1.3;
}

.product-desc {
  margin: 0;
  color: #666;
  font-size: 0.9em;
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.product-price {
  font-size: 1.5em;
  font-weight: 700;
  color: #1b5e20;
}

.product-stock {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
}

.product-stock.in-stock {
  background: #d4edda;
  color: #155724;
}

.product-stock.out-stock {
  background: #f8d7da;
  color: #721c24;
}

/* No products message */
.no-products {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-top: 4rem;
}

.no-products svg {
  color: #ccc;
  margin-bottom: 1.5rem;
}

.no-products h3 {
  color: #666;
  font-size: 1.5em;
  margin: 0 0 0.5rem 0;
}

.no-products p {
  color: #999;
  margin: 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e8f5e9;
  border-top-color: #1b5e20;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .vendor-hero {
    height: 250px;
  }

  .vendor-container {
    padding: 1rem;
    margin-top: -40px;
  }

  .vendor-grid {
    grid-template-columns: 1fr;
  }

  .vendor-main {
    padding: 1.5rem;
  }

  .vendor-name {
    font-size: 1.8em;
  }

  .address-card {
    grid-template-columns: 1fr;
  }

  .labels-grid {
    grid-template-columns: 1fr;
  }

  .vendor-sidebar {
    order: -1;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .vendor-products-section h2 {
    font-size: 1.5em;
  }
}
</style>
