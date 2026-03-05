<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCart } from '../services/cart'
import { isAuthenticated } from '../services/auth'

const router = useRouter()
const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, updateNotes } = useCart()

onMounted(() => {
  if (!isAuthenticated()) {
    router.push('/connexion')
  }
})

// --- Édition des notes ---
const editingNoteId = ref<string | null>(null)
const editingNoteValue = ref('')

const startEditNote = (productId: string, currentNote: string) => {
  editingNoteId.value = productId
  editingNoteValue.value = currentNote || ''
}

const confirmEditNote = (productId: string) => {
  updateNotes(productId, editingNoteValue.value)
  editingNoteId.value = null
}

const cancelEditNote = () => {
  editingNoteId.value = null
  editingNoteValue.value = ''
}
// -------------------------

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
          <i class="fas fa-shopping-cart"></i>
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

              <!-- Notes éditables -->
              <div class="item-notes-wrapper">
                <!-- Mode lecture -->
                <div
                    v-if="editingNoteId !== item.product.id"
                    class="item-notes-display"
                    @click="startEditNote(item.product.id, item.notes)"
                    :title="item.notes ? 'Cliquer pour modifier' : 'Cliquer pour ajouter une consigne'"
                >
                  <span v-if="item.notes" class="item-notes-text">
                    <i class="fas fa-comment-alt"></i>
                    {{ item.notes }}
                  </span>
                  <span v-else class="item-notes-placeholder">
                    <i class="fas fa-pen"></i>
                    Ajouter une consigne...
                  </span>
                </div>

                <!-- Mode édition -->
                <div v-else class="item-notes-edit">
                  <textarea
                      v-model="editingNoteValue"
                      class="notes-textarea"
                      placeholder="Instructions particulières pour le vendeur..."
                      rows="2"
                      @keydown.enter.prevent="confirmEditNote(item.product.id)"
                      @keydown.esc="cancelEditNote"
                  />
                  <div class="notes-actions">
                    <button class="btn-confirm-note" @click="confirmEditNote(item.product.id)">
                      <i class="fas fa-check"></i>
                      Confirmer
                    </button>
                    <button class="btn-cancel-note" @click="cancelEditNote">
                      <i class="fas fa-times"></i>
                      Annuler
                    </button>
                  </div>
                </div>
              </div>

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
              >
                <i class="fas fa-minus"></i>
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button
                  @click="increaseQuantity(item.product.id, item.quantity)"
                  class="qty-btn"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>

            <div class="item-price">
              <span class="price">{{ formatPrice((item.product.discountPrice || item.product.price) * item.quantity) }}</span>
              <span class="unit-price">{{ formatPrice(item.product.discountPrice || item.product.price) }} / unité</span>
            </div>

            <button @click="removeFromCart(item.product.id)" class="btn-remove">
              <i class="fas fa-trash-alt"></i>
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
              <i class="fas fa-shield-alt"></i>
              <span>Paiement sécurisé</span>
            </div>
            <div class="guarantee-item">
              <i class="fas fa-clock"></i>
              <span>Livraison rapide</span>
            </div>
            <div class="guarantee-item">
              <i class="fas fa-check-circle"></i>
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
  font-size: 5rem;
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
  gap: 0.4rem;
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

/* Notes éditables */
.item-notes-wrapper {
  margin: 0.1rem 0;
}

.item-notes-display {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.4rem;
  cursor: pointer;
  border-radius: 6px;
  padding: 0.3rem 0.55rem;
  border: 1px dashed transparent;
  transition: all 0.2s ease;
  max-width: 100%;
}

.item-notes-display:hover {
  background: #f0fff4;
  border-color: #68d391;
}

.item-notes-text {
  font-size: 0.88rem;
  color: #2d3748;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  line-height: 1.45;
}

.item-notes-text i {
  color: #2E7D32;
  margin-top: 0.15rem;
  flex-shrink: 0;
  font-size: 0.78rem;
}

.item-notes-placeholder {
  font-size: 0.85rem;
  color: #a0aec0;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.item-notes-placeholder i {
  font-size: 0.75rem;
}

.item-notes-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notes-textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid #2E7D32;
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: inherit;
  color: #2d3748;
  background: white;
  resize: vertical;
  outline: none;
  line-height: 1.5;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  box-sizing: border-box;
  min-height: 60px;
  max-height: 160px;
}

.notes-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-confirm-note {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #2E7D32;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm-note:hover {
  background: #1b5e20;
  transform: translateY(-1px);
}

.btn-cancel-note {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: transparent;
  color: #718096;
  border: 1px solid #e2e8f0;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel-note:hover {
  background: #fff5f5;
  color: #e53e3e;
  border-color: #e53e3e;
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
  color: #2E7D32;
  font-size: 0.75rem;
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
  font-size: 1rem;
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

.guarantee-item i {
  color: #38a169;
  font-size: 1.2rem;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
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