<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useCart } from '../services/cart'
import { createOrder } from '../services/orders'
import { isAuthenticated } from '../services/auth'

const router = useRouter()
const { cartItems, cartTotal, clearCart } = useCart()

const deliveryMode = ref<'pickup' | 'relay'>('pickup')
const relayAddress = ref('')
const isProcessing = ref(false)
const showSuccessModal = ref(false)

// Calculer les frais et totaux
const subtotal = computed(() => cartTotal.value)
const deliveryFee = computed(() => deliveryMode.value === 'pickup' ? 0 : 3.5)
const total = computed(() => subtotal.value + deliveryFee.value)

// Validation
const canSubmit = computed(() => {
  if (cartItems.value.length === 0) return false
  if (deliveryMode.value === 'relay' && !relayAddress.value.trim()) return false
  return true
})

const handleSubmitOrder = async () => {
  if (!isAuthenticated()) {
    router.push('/connexion?redirect=/panier')
    return
  }

  if (!canSubmit.value) return

  isProcessing.value = true

  try {
    const result = createOrder(
      cartItems.value,
      deliveryMode.value,
      deliveryMode.value === 'relay' ? relayAddress.value : undefined
    )

    if (result.success) {
      clearCart()
      showSuccessModal.value = true
      
      // Rediriger vers le profil après 3 secondes
      setTimeout(() => {
        router.push('/compte')
      }, 3000)
    } else {
      alert(result.error || 'Erreur lors de la commande')
    }
  } catch (error) {
    alert('Une erreur est survenue')
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  useHead({
    title: 'Commande - Checkout - GreenNoble',
    meta: [
      {
        name: 'description',
        content: 'Finalisez votre commande sur GreenNoble. Choisissez votre mode de retrait : click & collect ou point relais.'
      },
      {
        name: 'keywords',
        content: 'commande, checkout, panier, achat, Grenoble'
      }
    ]
  })
})
</script>

<template>
  <section class="checkout-page">
    <div class="container">
      <div class="page-header">
        <h1>Finaliser ma commande</h1>
        <p class="subtitle">Vérifiez votre panier et choisissez votre mode de retrait</p>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits locaux et éco-responsables</p>
        <RouterLink to="/produits" class="btn-primary">Voir les produits</RouterLink>
      </div>

      <div v-else class="checkout-grid">
        <!-- Résumé du panier -->
        <div class="cart-summary">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Votre panier ({{ cartItems.length }} article{{ cartItems.length > 1 ? 's' : '' }})
          </h2>

          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
              <img :src="item.product.imageUrl" :alt="item.product.name" class="item-image" />
              <div class="item-details">
                <h3>{{ item.product.name }}</h3>
                <p class="item-vendor">{{ item.product.vendor }}</p>
                <div class="item-pricing">
                  <span class="quantity">x{{ item.quantity }}</span>
                  <span class="price">{{ ((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2) }} €</span>
                </div>
              </div>
            </div>
          </div>

          <div class="price-breakdown">
            <div class="price-row">
              <span>Sous-total</span>
              <span>{{ subtotal.toFixed(2) }} €</span>
            </div>
            <div class="price-row">
              <span>Frais de livraison</span>
              <span class="delivery-fee">{{ deliveryFee.toFixed(2) }} €</span>
            </div>
            <div class="price-row total-row">
              <span>Total</span>
              <span class="total-amount">{{ total.toFixed(2) }} €</span>
            </div>
          </div>
        </div>

        <!-- Formulaire de commande -->
        <div class="order-form">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Mode de retrait
          </h2>

          <div class="delivery-options">
            <label class="delivery-option" :class="{ active: deliveryMode === 'pickup' }">
              <input type="radio" name="delivery" value="pickup" v-model="deliveryMode" />
              <div class="option-content">
                <div class="option-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M3 21h18"></path>
                  </svg>
                </div>
                <div class="option-info">
                  <h3>Click & Collect</h3>
                  <p>Retrait gratuit en magasin</p>
                  <span class="badge-free">Gratuit</span>
                </div>
              </div>
            </label>

            <label class="delivery-option" :class="{ active: deliveryMode === 'relay' }">
              <input type="radio" name="delivery" value="relay" v-model="deliveryMode" />
              <div class="option-content">
                <div class="option-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div class="option-info">
                  <h3>Point Relais</h3>
                  <p>Livraison en point relais</p>
                  <span class="badge-price">3,50 €</span>
                </div>
              </div>
            </label>
          </div>

          <div v-if="deliveryMode === 'relay'" class="relay-address-section">
            <label for="relayAddress" class="input-label">Adresse du point relais</label>
            <input
              id="relayAddress"
              v-model="relayAddress"
              type="text"
              placeholder="Ex: 15 Rue de la République, 38000 Grenoble"
              class="input-field"
              required
            />
          </div>

          <button
            @click="handleSubmitOrder"
            :disabled="!canSubmit || isProcessing"
            class="btn-confirm"
          >
            <svg v-if="!isProcessing" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span v-if="isProcessing" class="spinner"></span>
            {{ isProcessing ? 'Traitement...' : 'Confirmer ma commande' }}
          </button>

          <div class="secure-payment">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de succès -->
    <Transition name="modal">
      <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
        <div class="modal-content" @click.stop>
          <div class="success-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>Commande confirmée !</h2>
          <p>Votre commande a été enregistrée avec succès.</p>
          <p class="redirect-info">Redirection vers votre profil...</p>
          <button @click="router.push('/compte')" class="btn-view-orders">
            Voir mes commandes
          </button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1b5e20;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

.empty-cart {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-cart svg {
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.empty-cart h2 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* Résumé du panier */
.cart-summary {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.section-title svg {
  color: #2E7D32;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: background 0.2s;
}

.cart-item:hover {
  background: #f1f5f9;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.item-vendor {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.item-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity {
  font-size: 0.875rem;
  color: #64748b;
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.price {
  font-weight: 700;
  color: #2E7D32;
  font-size: 1.1rem;
}

.price-breakdown {
  border-top: 2px solid #e2e8f0;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #475569;
}

.delivery-fee {
  color: #2E7D32;
}

.total-row {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 2px solid #e2e8f0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.total-amount {
  color: #2E7D32;
  font-size: 1.75rem;
}

/* Formulaire de commande */
.order-form {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 2rem;
}

.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.delivery-option {
  cursor: pointer;
  position: relative;
}

.delivery-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s;
  background: #fafafa;
}

.delivery-option:hover .option-content {
  border-color: #2E7D32;
  background: #f1f8f4;
}

.delivery-option.active .option-content {
  border-color: #2E7D32;
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(67, 160, 71, 0.05) 100%);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 12px;
  color: #64748b;
  transition: all 0.3s;
}

.delivery-option.active .option-icon {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
}

.option-info {
  flex: 1;
}

.option-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.option-info p {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.badge-free {
  display: inline-block;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-price {
  display: inline-block;
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.relay-address-section {
  margin-bottom: 1.5rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-field {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #2E7D32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.btn-confirm {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border: none;
  padding: 1.125rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* Modal de succès */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.success-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.success-icon svg {
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.modal-content h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1b5e20;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.redirect-info {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.btn-view-orders {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-view-orders:hover {
  transform: translateY(-2px);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 968px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .order-form {
    position: static;
  }
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.875rem;
  }

  .cart-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }
}
</style>
