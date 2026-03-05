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
  <RouterLink :to="`/produits/${product.slug}`" class="card-link">
    <article class="card">
      <div class="card-image-wrapper">
        <div class="card-image">
          <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
          <div class="overlay"></div>
        </div>
        <div v-if="product.discountPrice" class="discount-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          -{{ Math.round(((product.price - product.discountPrice) / product.price) * 100) }}%
        </div>
        <div class="eco-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.19-.66C5.9 21.34 8.5 15.5 17 14V19l7-7-7-7v3z"/>
          </svg>
          Local
        </div>
      </div>

      <div class="card-content">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-desc">{{ product.shortDescription }}</p>

        <div class="card-footer">
          <div class="price-section">
            <div v-if="product.discountPrice" class="price-container">
              <span class="old-price">{{ product.price.toFixed(2) }}€</span>
              <span class="price">{{ displayPrice.toFixed(2) }}€</span>
            </div>
            <span v-else class="price price-single">{{ displayPrice.toFixed(2) }}€</span>
          </div>

          <button
            @click.prevent="handleAddToCart"
            class="btn-cart"
            :class="{ 'added': showAdded }"
            :aria-label="showAdded ? 'Produit ajouté' : 'Ajouter au panier'"
          >
            <svg v-if="!showAdded" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
}

.card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(46, 125, 50, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.08);
}

/* Image Section */
.card-image-wrapper {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover .card-image img {
  transform: scale(1.15) rotate(2deg);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.02) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover .overlay {
  opacity: 1;
}

/* Badges */
.discount-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  padding: 8px 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow:
    0 4px 12px rgba(220, 38, 38, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  backdrop-filter: blur(4px);
}

.eco-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: #2E7D32;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Content Section */
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 12px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
  transition: color 0.3s ease;
}

.card:hover .product-name {
  color: #2E7D32;
}

.product-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

/* Footer Section */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.price-section {
  flex: 1;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.old-price {
  font-size: 0.875rem;
  color: #94a3b8;
  text-decoration: line-through;
  font-weight: 500;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2E7D32;
  line-height: 1;
  letter-spacing: -0.5px;
}

.price-single {
  font-size: 1.65rem;
}

/* Add to Cart Button */
.btn-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 12px rgba(46, 125, 50, 0.25),
    0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.btn-cart:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow:
    0 8px 20px rgba(46, 125, 50, 0.35),
    0 4px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #1b5e20 0%, #2E7D32 100%);
}

.btn-cart:active {
  transform: translateY(-1px) scale(1.02);
}

.btn-cart.added {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  animation: successPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-cart svg {
  flex-shrink: 0;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 8px 24px rgba(5, 150, 105, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .card-content {
    padding: 16px;
  }

  .product-name {
    font-size: 1rem;
  }

  .product-desc {
    font-size: 0.8125rem;
  }

  .price {
    font-size: 1.35rem;
  }

  .btn-cart {
    width: 44px;
    height: 44px;
  }

  .btn-cart svg {
    width: 18px;
    height: 18px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .card,
  .card-image img,
  .btn-cart {
    transition: none;
  }

  .card:hover {
    transform: none;
  }
}
</style>

