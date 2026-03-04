<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import ProductCard from "../components/products/ProductCard.vue";
import {getProducts} from "../services/api.ts";

const products = ref<any[]>([])

onMounted(async () => {
  products.value = await getProducts()

  useHead({
    title: 'Produits locaux écoresponsables - GreenNoble',
    meta: [
      {
        name: 'description',
        content: 'Découvrez notre sélection de produits bio, artisanaux et de saison provenant de producteurs locaux à Paris.'
      },
      {
        name: 'keywords',
        content: 'produits bio, produits locaux, artisanaux, Paris, écoresponsable'
      }
    ]
  })
})
</script>

<template>
  <section class="page">
    <div class="header">
      <h1>Produits locaux écoresponsables</h1>
      <p class="subtitle">Découvrez notre sélection de produits bio, artisanaux et de saison</p>
      <div class="stats">
        <span class="stat">{{ products.length }} produits disponibles</span>
      </div>
    </div>
    <div class="grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  background-color: #fff;
  padding: 2rem 1.5rem;
  position: sticky;
  top: 73px;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat {
  background: #f0f4f0;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  color: #1b5e20;
  font-weight: 600;
  font-size: 0.95rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
}
</style>
