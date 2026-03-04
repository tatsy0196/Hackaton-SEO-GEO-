<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {getProductsByArrondissement} from "../services/api.ts";

const route = useRoute()
const arrondissement = ref('')
const products = ref<any[]>([])

onMounted(async () => {
  arrondissement.value = route.params.arrondissement as string
  products.value = await getProductsByArrondissement()
})
</script>

<template>
  <section class="page">
    <h1>Produits locaux à Paris {{ arrondissement }}</h1>
    <p>Produits écoresponsables disponibles près de chez vous dans le {{ arrondissement }}ᵉ.</p>

    <div v-if="products.length" class="grid">
      <div v-for="product in products" :key="product.id" class="card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.shortDescription }}</p>
        <p class="price">{{ product.price.toFixed(2) }} €</p>
      </div>
    </div>
    <p v-else>Aucun produit disponible pour le moment dans ce quartier.</p>
  </section>
</template>

<style scoped>
.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1.5rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.card {
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 1rem;
  background: #fff;
}
.price {
  font-weight: 600;
  color: #1b5e20;
}
</style>
