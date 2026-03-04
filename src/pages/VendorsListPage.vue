<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { RouterLink } from 'vue-router'
import {getVendors} from "../services/api.ts";

const vendors = ref<any[]>([])

onMounted(async () => {
  vendors.value = await getVendors()

  useHead({
    title: "Liste des vendeurs de notre communauté - GreenNoble",
    meta: [
      {
        name: 'description',
        content: "Cette page regroupe l'ensemble des vendeurs de notre magnifique communauté écoresponsable"
      }
    ]
  })
})
</script>

<template>
  <!-- Hero Section -->
  <section class="vendors-hero">
    <div class="hero-content">
      <h1>Producteurs & Commerces Écoresponsables</h1>
      <p>Découvrez nos partenaires engagés pour un Grenoble plus durable</p>
      <div class="stats">
        <div class="stat">
          <span class="number">{{ vendors.length }}</span>
          <span class="label">Vendeurs</span>
        </div>
        <div class="stat">
          <span class="number">+100</span>
          <span class="label">Produits</span>
        </div>
        <div class="stat">
          <span class="number">0 CO₂</span>
          <span class="label">Livraison</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Grid Section -->
  <section class="vendors-section">
    <div class="container">
      <div class="vendors-grid">
        <article v-for="vendor in vendors" :key="vendor.id" class="vendor-card">
          <div class="card-image-wrapper">
            <img :src="vendor.imageUrl" :alt="vendor.name" class="card-image" />
            <div class="card-overlay">
              <RouterLink :to="`/vendeurs/${vendor.slug}`" class="btn-cta">
                Voir le profil
              </RouterLink>
            </div>
          </div>

          <div class="card-content">
            <h3 class="card-title">{{ vendor.name }}</h3>
            <p class="card-description">{{ vendor.shortDescription }}</p>

            <div class="card-meta">
              <span class="icon">📍</span>
              <span class="location">{{ vendor.postalCode }} {{ vendor.city }}</span>
            </div>

            <div v-if="vendor.labels?.length" class="card-labels">
              <span v-for="label in vendor.labels.slice(0, 2)" :key="label" class="badge">
                {{ label }}
              </span>
              <span v-if="vendor.labels.length > 2" class="badge badge-more">
                +{{ vendor.labels.length - 2 }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero Section */
.vendors-hero {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.vendors-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.vendors-hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.vendors-hero h1 {
  font-size: 3em;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.vendors-hero p {
  font-size: 1.2em;
  margin: 0 0 3rem 0;
  opacity: 0.95;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat .number {
  font-size: 2.5em;
  font-weight: 700;
  display: block;
}

.stat .label {
  font-size: 0.9em;
  opacity: 0.9;
  margin-top: 0.5rem;
}

/* Vendors Section */
.vendors-section {
  padding: 4rem 2rem;
  background: #f8faf9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.vendors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Vendor Card */
.vendor-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.vendor-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
  background: #e8f5e9;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.vendor-card:hover .card-image {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(27, 94, 32, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vendor-card:hover .card-overlay {
  opacity: 1;
}

.btn-cta {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #1b5e20;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95em;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-cta:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 1.3em;
  margin: 0 0 0.75rem 0;
  color: #1b5e20;
  font-weight: 600;
}

.card-description {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.95em;
  line-height: 1.5;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9em;
  color: #888;
}

.icon {
  font-size: 1.1em;
}

.location {
  word-break: break-word;
}

.card-labels {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  background: #e8f5e9;
  color: #1b5e20;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 500;
}

.badge-more {
  background: #c8e6c9;
  color: #2e7d32;
}

/* Responsive */
@media (max-width: 768px) {
  .vendors-hero h1 {
    font-size: 2em;
  }

  .vendors-hero p {
    font-size: 1em;
  }

  .stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .vendors-grid {
    grid-template-columns: 1fr;
  }

  .vendors-section {
    padding: 2rem 1rem;
  }
}
</style>
