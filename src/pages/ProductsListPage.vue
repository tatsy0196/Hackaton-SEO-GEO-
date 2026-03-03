<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductCard from "../components/products/ProductCard.vue";
import {getProducts} from "../services/api.ts";

const products = ref<any[]>([])

onMounted(async () => {
  products.value = await getProducts()
})
</script>

<template>
  <section class="page">
    <h1>Produits locaux écoresponsables</h1>
    <div class="grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </section>
</template>
