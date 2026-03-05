<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCart } from '../services/cart'
import { isAuthenticated } from '../services/auth'

const router = useRouter()
const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()

onMounted(() => {
  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated()) {
    router.push('/connexion')
  }
})

const increaseQuantity = (productId: string, currentQuantity: number) => {
  updateQuantity(productId, currentQuantity + 1)
}

const decreaseQuantity = (productId: string, currentQuantity: number) => {
  if (currentQuantity > 1) {
    updateQuantity(productId, currentQuantity - 1)
  }
}

const handleCheckout = () => {
  router.push('/checkout')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>

<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1 class="page-title">Mon Panier</h1>

      <!-- Panier vide -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits locaux et bio</p>
        <RouterLink to="/produits" class="btn-shop">
          Voir les produits
        </RouterLink>
      </div>

      <!-- Panier avec articles -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
            <div class="item-image">
              <img :src="item.product.imageUrl" :alt="item.product.name" />
            </div>

            <div class="item-details">
              <RouterLink :to="`/produits/${item.product.slug}`" class="item-name">
                {{ item.product.name }}
              </RouterLink>
              <p class="item-category">{{ item.product.category }}</p>
              <div class="item-meta">
                <span v-if="item.product.vendorId" class="vendor-badge">
                  📍 Vendeur local
                </span>
                <span v-if="item.product.labels?.includes('Bio')" class="bio-badge">
                  🌿 Bio
                </span>
              </div>
            </div>

            <div class="item-quantity">
              <button 
                @click="decreaseQuantity(item.product.id, item.quantity)"
                class="qty-btn"
                :disabled="item.quantity <= 1"
              > -
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button 
                @click="increaseQuantity(item.product.id, item.quantity)"
                class="qty-btn"
              > +
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <div class="item-price">
              <span class="price">{{ formatPrice((item.product.discountPrice || item.product.price) * item.quantity) }}</span>
              <span class="unit-price">{{ formatPrice(item.product.discountPrice || item.product.price) }} / unité</span>
            </div>

            <button @click="removeFromCart(item.product.id)" class="btn-remove">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Résumé -->
        <div class="cart-summary">
          <div class="summary-card">
            <h2>Récapitulatif</h2>
            
            <div class="summary-line">
              <span>Articles ({{ cartItems.length }})</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>

            <div class="summary-line">
              <span>Livraison</span>
              <span class="free">Gratuite</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total">
              <span>Total</span>
              <span class="total-amount">{{ formatPrice(cartTotal) }}</span>
            </div>

            <button @click="handleCheckout" class="btn-checkout">
              Passer la commande
            </button>

            <button @click="clearCart" class="btn-clear">
              Vider le panier
            </button>
          </div>

          <!-- Garanties -->
          <div class="guarantees">
            <div class="guarantee-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Paiement sécurisé</span>
            </div>
            <div class="guarantee-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Livraison rapide</span>
            </div>
            <div class="guarantee-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Produits garantis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 80vh;
  padding: 3rem 2rem;
  background: #f7fafc;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 2.5rem;
  text-align: center;
}

/* Panier vide */
.empty-cart {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.empty-cart h2 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.empty-cart p {
  color: #718096;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.btn-shop {
  display: inline-block;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-shop:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(46, 125, 50, 0.3);
}

/* Contenu panier */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: #f7fafc;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cart-item:hover .item-image img {
  transform: scale(1.05);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  text-decoration: none;
  transition: color 0.3s ease;
}

.item-name:hover {
  color: #2E7D32;
}

.item-category {
  color: #718096;
  font-size: 0.9rem;
}

.item-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.vendor-badge, .bio-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #f0fff4;
  color: #22543d;
  font-weight: 500;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f7fafc;
  padding: 0.5rem;
  border-radius: 8px;
}

.qty-btn {
  background: white;
  border: 1px solid #e2e8f0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #2E7D32;
  color: white;
  border-color: #2E7D32;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.unit-price {
  font-size: 0.8rem;
  color: #a0aec0;
}

.btn-remove {
  background: transparent;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #fff5f5;
}

/* Résumé */
.cart-summary {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.summary-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #4a5568;
}

.free {
  color: #38a169;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.total-amount {
  font-size: 1.75rem;
  font-weight: 800;
  color: #2E7D32;
}

.btn-checkout {
  width: 100%;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(46, 125, 50, 0.3);
}

.btn-clear {
  width: 100%;
  background: transparent;
  color: #e53e3e;
  padding: 0.75rem;
  border: 2px solid #e53e3e;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: #fff5f5;
}

.guarantees {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  color: #4a5568;
  font-size: 0.95rem;
}

.guarantee-item:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
}

.guarantee-item svg {
  color: #38a169;
  flex-shrink: 0;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }

  .item-quantity, .item-price {
    grid-column: 2;
  }

  .btn-remove {
    grid-column: 2;
    justify-self: end;
  }
}
</style>

