<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {getProductBySlug} from "../services/api.ts";
import {trackEvent} from "../services/tracking.ts";

const route = useRoute()
const product = ref<any | null>(null)

onMounted(async () => {
  const slug = route.params.slug as string
  product.value = await getProductBySlug(slug)

  if (product.value) {
    trackEvent('view_item', {
      product_id: product.value.id,
      price: product.value.price
    })
  }
})
</script>

<template>
  <section v-if="product" class="page">
    <div class="product-hero">
      <img :src="product.imageUrl" :alt="product.name" />
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">{{ product.price.toFixed(2) }} €</p>
        <p class="category">{{ product.category }}</p>
        <p class="desc">{{ product.shortDescription }}</p>
        <div class="actions">
          <button class="add-cart">Ajouter au panier</button>
          <RouterLink to="/checkout" class="btn-checkout">Passer commande</RouterLink>
        </div>
      </div>
    </div>
  </section>

  <div v-else class="loading">Produit en cours de chargement...</div>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
}
.product-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
img {
  width: 100%;
  border-radius: 12px;
}
.product-info h1 {
  margin-bottom: 0.5rem;
}
.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b5e20;
  margin-bottom: 0.25rem;
}
.category {
  color: #666;
  margin-bottom: 1rem;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
.add-cart {
  background: #1b5e20;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}
.btn-checkout {
  background: transparent;
  border: 2px solid #1b5e20;
  color: #1b5e20;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
}
</style>
