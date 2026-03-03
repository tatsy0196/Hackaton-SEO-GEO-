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
  <section v-if="vendor" class="page">
    <div class="vendor-hero">
      <img :src="vendor.imageUrl" :alt="vendor.name" />
      <div class="vendor-info">
        <h1>{{ vendor.name }}</h1>
        <p class="desc">{{ vendor.shortDescription }}</p>
        <div class="address">
          <p><strong>Adresse :</strong> {{ vendor.address }}</p>
          <p><strong>Code postal :</strong> {{ vendor.postalCode }}</p>
          <p><strong>Ville :</strong> {{ vendor.city }}</p>
        </div>
        <div v-if="vendor.labels?.length" class="labels">
          <span v-for="label in vendor.labels" :key="label" class="label">{{ label }}</span>
        </div>
      </div>
    </div>
  </section>

  <div v-else class="loading">Vendeur en cours de chargement...</div>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
}
.vendor-hero {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}
img {
  width: 100%;
  border-radius: 12px;
}
.vendor-info h1 {
  margin-bottom: 0.5rem;
}
.desc {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
.address {
  background: #f8faf9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.labels {
  display: flex;
  gap: 0.5rem;
}
.label {
  background: #1b5e20;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}
</style>
