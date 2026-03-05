<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '../../services/cart'
import type { Product } from '../../services/api'

const props = defineProps<{
  product: Product
}>()

const { addToCart } = useCart()
const showAdded = ref(false)

const handleAddToCart = (e: Event) => {
  e.preventDefault()
  addToCart(props.product, 1)
  
  showAdded.value = true
  setTimeout(() => {
    showAdded.value = false
  }, 2000)
}

const displayPrice = props.product.discountPrice || props.product.price
</script>

<template>
  <article class="card">
    <div class="card-image">
      <img :src="product.imageUrl" :alt="product.name" />
      <div v-if="product.discountPrice" class="discount-badge">
        -{{ Math.round(((product.price - product.discountPrice) / product.price) * 100) }}%
      </div>
    </div>
    
    <div class="card-content">
      <h3>{{ product.name }}</h3>
      <div class="price-row">
        <div class="prices">
          <span v-if="product.discountPrice" class="old-price">{{ product.price.toFixed(2) }} €</span>
          <span class="price">{{ displayPrice.toFixed(2) }} €</span>
        </div>
      </div>
      <p class="desc">{{ product.shortDescription }}</p>
    </div>

    <div class="card-actions">
      <RouterLink :to="`/produits/${product.slug}`" class="btn-view">
        Détails
      </RouterLink>
      <button @click="handleAddToCart" class="btn-cart" :class="{ 'added': showAdded }">
        <svg v-if="!showAdded" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>{{ showAdded ? 'Ajouté !' : 'Panier' }}</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.card-image {
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e53e3e;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
}

.card-content {
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card h3 {
  font-size: 1.15rem;
  margin: 0 0 0.75rem;
  color: #2d3748;
  line-height: 1.4;
  font-weight: 700;
}

.price-row {
  margin-bottom: 0.75rem;
}

.prices {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.old-price {
  font-size: 1rem;
  color: #a0aec0;
  text-decoration: line-through;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #38a169;
}

.desc {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
  line-height: 1.6;
  flex-grow: 1;
}

.card-actions {
  padding: 0 1.25rem 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.btn-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  font-size: 0.95rem;
  color: #2E7D32;
  background: transparent;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  border: 2px solid #2E7D32;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-view:hover {
  background: #2E7D32;
  color: white;
}

.btn-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.95rem;
  color: white;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  border: none;
  text-align: center;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-weight: 600;
  cursor: pointer;
}

.btn-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-cart.added {
  background: #38a169;
  animation: pulse 0.4s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>

