<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {getVendors} from "../services/api.ts";

const vendors = ref<any[]>([])

onMounted(async () => {
  vendors.value = await getVendors()
})
</script>

<template>
  <section class="page">
    <h1>Producteurs & commerces écoresponsables à Paris</h1>
    <div class="grid">
      <article v-for="vendor in vendors" :key="vendor.id" class="card">
        <img :src="vendor.imageUrl" :alt="vendor.name" />
        <h3>{{ vendor.name }}</h3>
        <p>{{ vendor.shortDescription }}</p>
        <p class="location">{{ vendor.address }}, {{ vendor.postalCode }} {{ vendor.city }}</p>
        <RouterLink :to="`/vendeurs/${vendor.slug}`" class="link">Voir le profil</RouterLink>
      </article>
    </div>
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.card {
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 1rem;
  background: #fff;
}
img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}
.location {
  font-size: 0.9rem;
  color: #666;
}
.link {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #1b5e20;
  text-decoration: none;
}
</style>
