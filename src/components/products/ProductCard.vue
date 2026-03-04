<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  product: {
    id: string
    name: string
    slug: string
    price: number
    shortDescription: string
    imageUrl: string
  }
}>()
</script>

<template>
  <article class="card">
    <img :src="product.imageUrl" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p class="price">{{ product.price.toFixed(2) }} €</p>
    <p class="desc">{{ product.shortDescription }}</p>
    <RouterLink :to="`/produits/${product.slug}`" class="link">
      Voir le produit
    </RouterLink>
  </article>
</template>

<style scoped>
.card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 0;
  background: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  margin-bottom: 0;
}

.card h3 {
  font-size: 1.1rem;
  margin: 0.75rem 1rem 0.5rem;
  color: #2c3e50;
  line-height: 1.3;
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1b5e20;
  margin: 0 1rem 0.5rem;
}

.desc {
  font-size: 0.9rem;
  color: #666;
  margin: 0 1rem;
  line-height: 1.5;
  flex-grow: 1;
}

.link {
  display: block;
  margin: 1rem;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  color: white;
  background: #1b5e20;
  text-decoration: none;
  text-align: center;
  border-radius: 6px;
  transition: background 0.2s ease;
  font-weight: 600;
}

.link:hover {
  background: #145214;
  text-decoration: none;
}
</style>
