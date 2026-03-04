<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {getVendorBySlug} from "../services/api.ts";
import {trackEvent} from "../services/tracking.ts";

const route = useRoute()
const vendor = ref<any | null>(null)

onMounted(async () => {
  const slug = route.params.slug as string
  vendor.value = await getVendorBySlug(slug)

  if (vendor.value) {
    trackEvent('view_vendor', {
      vendor_id: vendor.value.id,
      city: vendor.value.city
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
            <button class="btn-explore">Voir les produits</button>
          </div>

          <div class="sidebar-card eco-card">
            <h3>Écoresponsable 🌱</h3>
            <p>Ce producteur s'engage pour un Paris plus durable avec des pratiques respectueuses de l'environnement.</p>
          </div>
        </aside>
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
}
</style>
