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
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 0.75rem;
  background: #fff;
}
img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  object-fit: cover;
}
.price {
  font-weight: 600;
  color: #1b5e20;
}
.desc {
  font-size: 0.9rem;
  color: #555;
}
.link {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: #1b5e20;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
