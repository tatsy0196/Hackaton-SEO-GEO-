<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute, RouterLink } from 'vue-router'
import {getProductBySlug, getProducts, getVendorForProduct} from "../services/api.ts";
import type { Product, Vendor } from "../services/api.ts";
import {trackEvent} from "../services/tracking.ts";
import { useCart } from '../services/cart'

const route = useRoute()
const product = ref<Product | null>(null)
const vendor = ref<Vendor | null>(null)
const selectedImage = ref(0)
const quantity = ref(1)
const activeTab = ref('description')
const relatedProducts = ref<Product[]>([])

const { addToCart: addToCartService } = useCart()
const showAdded = ref(false)

const selectImage = (index: number) => {
  selectedImage.value = index
}

const selectTab = (tab: string) => {
  activeTab.value = tab
}

const addToCart = () => {
  if (!product.value || !product.value.stock) return

  addToCartService(product.value, quantity.value)
  showAdded.value = true

  trackEvent('add_to_cart', {
    product_id: product.value.id,
    quantity: quantity.value,
    price: product.value.price
  })
  
  setTimeout(() => {
    showAdded.value = false
  }, 2000)
}

const discountPercentage = computed(() => {
  // Simuler un prix barré pour certains produits
  if (product.value?.id === 'p1' || product.value?.id === 'p19') {
    return 15
  }
  return 0
})

const originalPrice = computed(() => {
  if (discountPercentage.value > 0) {
    return product.value && (product.value.price / (1 - discountPercentage.value / 100));
  }
  return null
})

onMounted(async () => {
  const slug = route.params.slug as string
  product.value = await getProductBySlug(slug)

  if (product.value) {
    trackEvent('view_item', {
      product_id: product.value.id,
      price: product.value.price
    })
    
    // Charger le vendeur du produit
    vendor.value = await getVendorForProduct(product.value.vendorId)
    
    // Charger les produits similaires
    const allProducts = await getProducts()
    relatedProducts.value = allProducts
      .filter(p => product.value && ( p.id !== product.value.id && p.category === product.value.category))
      .slice(0, 3)

    useHead({
      title: `${product.value.name} - GreenNoble`,
      meta: [
        {
          name: 'description',
          content: product.value.shortDescription || `Découvrez ${product.value.name} sur GreenNoble marketplace locale`
        },
        {
          name: 'keywords',
          content: `${product.value.name}, ${product.value.category}, produits bio, Grenoble`
        }
      ]
    })
  }
})
</script>

<template>
  <section v-if="product" class="page">
    <!-- Navigation fil d'Ariane -->
    <nav class="breadcrumb">
      <RouterLink to="/">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        Accueil
      </RouterLink>
      <span class="separator">›</span>
      <RouterLink to="/produits">Produits</RouterLink>
      <span class="separator">›</span>
      <span class="current">{{ product.name }}</span>
    </nav>

    <div class="product-container">
      <!-- Galerie d'images -->
      <div class="product-gallery">
        <div class="badge-container">
          <span v-if="discountPercentage" class="discount-badge">-{{ discountPercentage }}%</span>
          <span v-if="product.certifications?.includes('Bio AB')" class="bio-badge">🌿 BIO</span>
        </div>
        
        <div class="main-image">
          <img :src="product.images[selectedImage]" :alt="product.name" />
          <div class="image-zoom-indicator">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
        </div>
        
        <div class="thumbnails">
          <button
            v-for="(image, index) in product.images"
            :key="index"
            @click="selectImage(index as number)"
            :class="['thumbnail', { active: selectedImage === index }]"
          >
            <img :src="image" :alt="`${product.name} - image ${index as number + 1}`" />
          </button>
        </div>
      </div>

      <!-- Informations produit -->
      <div class="product-info">
        <div class="product-header">
          <div>
            <span class="category-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              {{ product.category }}
            </span>
            <h1>{{ product.name }}</h1>
          </div>
        </div>
        
        <div class="rating-reviews">
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star">★</span>
          </div>
          <span class="reviews-count">4.8 (127 avis)</span>
        </div>

        <div class="price-section">
          <div class="price-container">
            <span class="current-price">{{ product.price.toFixed(2) }} €</span>
            <span v-if="originalPrice" class="original-price">{{ originalPrice.toFixed(2) }} €</span>
          </div>
          <span v-if="product.weight" class="weight-info">{{ product.weight }}</span>
        </div>

        <div class="highlights">
          <div class="highlight-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Livraison gratuite dès 50€</span>
          </div>
          <div class="highlight-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Livraison sous 24-48h</span>
          </div>
          <div class="highlight-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Produit local - {{ product.origin }}</span>
          </div>
        </div>

        <div class="stock-info" v-if="product.stock">
          <div v-if="product.stock > 10" class="stock-indicator in-stock">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>En stock ({{ product.stock }} disponibles)</span>
          </div>
          <div v-else-if="product.stock > 0" class="stock-indicator low-stock">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Stock limité - Plus que {{ product.stock }} disponibles</span>
          </div>
          <div v-else class="stock-indicator out-stock">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>Rupture de stock</span>
          </div>
        </div>

        <div class="certifications-modern" v-if="product.certifications?.length">
          <div class="cert-title">Certifications & Labels</div>
          <div class="cert-list">
            <div v-for="cert in product.certifications" :key="cert" class="cert-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span>{{ cert }}</span>
            </div>
          </div>
        </div>

        <p class="description">{{ product.shortDescription }}</p>

        <!-- Quantité et actions -->
        <div class="purchase-section">
          <div class="quantity-section">
            <label for="quantity">Quantité</label>
            <div class="quantity-controls">
              <button @click="quantity = Math.max(1, quantity - 1)" class="qty-btn" :disabled="!product.stock">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <input type="number" id="quantity" v-model.number="quantity" min="1" :max="product.stock" :disabled="!product.stock" />
              <button @click="quantity = Math.min(product.stock, quantity + 1)" class="qty-btn" :disabled="!product.stock">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="actions">
            <button @click="addToCart" class="add-cart" :class="{ added: showAdded }" :disabled="!product.stock">
              <svg v-if="!showAdded" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ showAdded ? 'Ajouté !' : (product.stock ? 'Ajouter au panier' : 'Rupture de stock') }}</span>
            </button>
            <button class="wishlist-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Informations supplémentaires -->
        <div class="product-meta">
          <div class="meta-item" v-if="product.origin">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div>
              <strong>Origine</strong>
              <span>{{ product.origin }}</span>
            </div>
          </div>
          <div class="meta-item" v-if="product.conservation">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"></path>
            </svg>
            <div>
              <strong>Conservation</strong>
              <span>{{ product.conservation }}</span>
            </div>
          </div>
        </div>

        <!-- Vendeur -->
        <div v-if="vendor" class="vendor-section">
          <div class="vendor-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <h3>Vendu par</h3>
          </div>
          <div class="vendor-card">
            <div class="vendor-image">
              <img :src="vendor.imageUrl" :alt="vendor.name" />
            </div>
            <div class="vendor-info-content">
              <h4>{{ vendor.name }}</h4>
              <p class="vendor-description">{{ vendor.shortDescription }}</p>
              <div class="vendor-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ vendor.postalCode }} {{ vendor.city }}</span>
              </div>
              <div v-if="vendor.labels?.length" class="vendor-labels">
                <span v-for="label in vendor.labels" :key="label" class="vendor-label">
                  {{ label }}
                </span>
              </div>
              <RouterLink :to="`/vendeurs/${vendor.slug}`" class="vendor-link">
                Voir le profil du vendeur
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Sécurité et garanties -->
        <div class="trust-badges">
          <div class="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Paiement sécurisé</span>
          </div>
          <div class="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Fraîcheur garantie</span>
          </div>
          <div class="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            <span>Retour sous 14 jours</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs avec détails -->
    <div class="product-details">
      <div class="tabs-header">
        <button 
          @click="selectTab('description')" 
          :class="['tab-btn', { active: activeTab === 'description' }]"
        >
          Description
        </button>
        <button 
          @click="selectTab('composition')" 
          :class="['tab-btn', { active: activeTab === 'composition' }]"
        >
          Composition
        </button>
        <button 
          @click="selectTab('nutrition')" 
          :class="['tab-btn', { active: activeTab === 'nutrition' }]"
        >
          Nutrition
        </button>
        <button 
          @click="selectTab('reviews')" 
          :class="['tab-btn', { active: activeTab === 'reviews' }]"
        >
          Avis (127)
        </button>
      </div>

      <div class="tab-content">
        <div v-show="activeTab === 'description'" class="tab-panel fade-in">
          <h3>Description détaillée</h3>
          <p class="long-description">{{ product.longDescription }}</p>
          
          <div class="key-features">
            <h4>Points clés</h4>
            <ul class="features-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Produit 100% bio et naturel
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Cultivé localement à {{ product.origin }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Fraîcheur garantie - Récolte récente
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Respectueux de l'environnement
              </li>
            </ul>
          </div>
        </div>

        <div v-show="activeTab === 'composition'" class="tab-panel fade-in">
          <h3>Composition & Ingrédients</h3>
          <div class="composition-content">
            <p>{{ product.composition }}</p>
            <div class="allergens-info">
              <strong>Allergènes :</strong> Peut contenir des traces de fruits à coque
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'nutrition'" class="tab-panel fade-in">
          <h3>Informations nutritionnelles</h3>
          <div class="nutrition-info">
            <p class="nutrition-desc">{{ product.nutritionalInfo }}</p>
            <table class="nutrition-table">
              <thead>
                <tr>
                  <th>Valeurs nutritionnelles</th>
                  <th>Pour 100g</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Énergie</td>
                  <td>165 kJ / 40 kcal</td>
                </tr>
                <tr>
                  <td>Matières grasses</td>
                  <td>0,2 g</td>
                </tr>
                <tr>
                  <td>dont acides gras saturés</td>
                  <td>0,05 g</td>
                </tr>
                <tr>
                  <td>Glucides</td>
                  <td>7,6 g</td>
                </tr>
                <tr>
                  <td>dont sucres</td>
                  <td>4,7 g</td>
                </tr>
                <tr>
                  <td>Protéines</td>
                  <td>0,9 g</td>
                </tr>
                <tr>
                  <td>Sel</td>
                  <td>0,07 g</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'reviews'" class="tab-panel fade-in">
          <h3>Avis clients</h3>
          <div class="reviews-summary">
            <div class="rating-overview">
              <div class="rating-score">4.8</div>
              <div class="rating-details">
                <div class="stars-large">
                  <span v-for="i in 5" :key="i" class="star">★</span>
                </div>
                <p>Basé sur 127 avis</p>
              </div>
            </div>
          </div>

          <div class="reviews-list">
            <div class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="avatar">ML</div>
                  <div>
                    <strong>Marie Laurent</strong>
                    <div class="review-stars">★★★★★</div>
                  </div>
                </div>
                <span class="review-date">Il y a 3 jours</span>
              </div>
              <p class="review-text">Produit excellent, très frais et de qualité. Je recommande vivement !</p>
            </div>

            <div class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="avatar">TD</div>
                  <div>
                    <strong>Thomas Dubois</strong>
                    <div class="review-stars">★★★★★</div>
                  </div>
                </div>
                <span class="review-date">Il y a 1 semaine</span>
              </div>
              <p class="review-text">Livraison rapide et produit conforme. Très satisfait de mon achat.</p>
            </div>

            <div class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="avatar">SP</div>
                  <div>
                    <strong>Sophie Petit</strong>
                    <div class="review-stars">★★★★☆</div>
                  </div>
                </div>
                <span class="review-date">Il y a 2 semaines</span>
              </div>
              <p class="review-text">Bon produit mais prix un peu élevé. La qualité est au rendez-vous cependant.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Produits similaires -->
    <div v-if="relatedProducts.length" class="related-products">
      <h2>Produits similaires</h2>
      <div class="related-grid">
        <RouterLink 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id"
          :to="`/produit/${relatedProduct.slug}`"
          class="related-card"
        >
          <div class="related-image">
            <img :src="relatedProduct.imageUrl" :alt="relatedProduct.name" />
          </div>
          <div class="related-info">
            <h4>{{ relatedProduct.name }}</h4>
            <p class="related-price">{{ relatedProduct.price.toFixed(2) }} €</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>

  <div v-else class="loading">
    <div class="spinner"></div>
    <p>Chargement du produit...</p>
  </div>
</template>

<style scoped>
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fil d'Ariane modernisé */
.breadcrumb {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 2.5rem;
  padding: 1rem 0;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: #1b5e20;
}

.breadcrumb .separator {
  color: #ccc;
  font-size: 1.2rem;
}

.breadcrumb .current {
  color: #333;
  font-weight: 500;
}

/* Container principal avec animations */
.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 5rem;
}

/* Galerie d'images améliorée */
.product-gallery {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.badge-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.discount-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(238, 90, 82, 0.3);
}

.bio-badge {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
}

.main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  background: #f8f9fa;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.main-image:hover img {
  transform: scale(1.08);
}

.image-zoom-indicator {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.6rem;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image:hover .image-zoom-indicator {
  opacity: 1;
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
}

.thumbnail {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  background: #f8f9fa;
  position: relative;
}

.thumbnail::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: #1b5e20;
  transform: translateY(-2px);
}

.thumbnail.active {
  border-color: #1b5e20;
  box-shadow: 0 4px 16px rgba(27, 94, 32, 0.3);
}

/* Informations produit stylisées */
.product-header {
  margin-bottom: 1.5rem;
}

.product-info h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin: 0.8rem 0 0.5rem;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #1b5e20;
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rating-reviews {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 0.2rem;
}

.star {
  color: #ffc107;
  font-size: 1.3rem;
}

.reviews-count {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

.price-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.current-price {
  font-size: 3rem;
  font-weight: 800;
  color: #1b5e20;
  line-height: 1;
}

.original-price {
  font-size: 1.5rem;
  color: #999;
  text-decoration: line-through;
}

.weight-info {
  font-size: 1.1rem;
  color: #666;
  background: #f8f9fa;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-weight: 500;
}

/* Highlights section */
.highlights {
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0;
  color: #2c3e50;
}

.highlight-item svg {
  color: #1b5e20;
  flex-shrink: 0;
}

/* Indicateur de stock moderne */
.stock-info {
  margin-bottom: 2rem;
}

.stock-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
}

.in-stock {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
}

.low-stock {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
}

.out-stock {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
}

/* Certifications modernes */
.certifications-modern {
  margin-bottom: 2rem;
}

.cert-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cert-list {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #1b5e20;
  color: #1b5e20;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cert-item:hover {
  background: #1b5e20;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
}

.cert-item svg {
  width: 16px;
  height: 16px;
}

.description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 2rem;
}

/* Section d'achat */
.purchase-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.quantity-section {
  margin-bottom: 1.5rem;
}

.quantity-section label {
  display: block;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #333;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: fit-content;
}

.qty-btn {
  width: 48px;
  height: 48px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #2E7D32;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qty-btn:hover:not(:disabled) {
  background: #2E7D32;
  color: white;
  border-color: #2E7D32;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 80px;
  height: 48px;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: #2d3748;
}

.quantity-controls input:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

/* Boutons d'action */
.actions {
  display: flex;
  gap: 1rem;
}

.add-cart {
  flex: 1;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  box-shadow: 0 4px 16px rgba(27, 94, 32, 0.3);
}

.add-cart:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(27, 94, 32, 0.4);
}

.add-cart.added {
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
  animation: pulse 0.6s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.add-cart:disabled {
  background: linear-gradient(135deg, #ccc 0%, #999 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.wishlist-btn {
  width: 60px;
  height: 60px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.wishlist-btn:hover {
  background: #ffe5e5;
  border-color: #ff6b6b;
  color: #ff6b6b;
  transform: scale(1.05);
}

/* Meta informations */
.product-meta {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
}

.meta-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.meta-item svg {
  color: #1b5e20;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.meta-item div {
  flex: 1;
}

.meta-item strong {
  display: block;
  color: #1b5e20;
  font-weight: 700;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.meta-item span {
  color: #666;
  line-height: 1.6;
}

/* Vendor section */
.vendor-section {
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid #c8e6c9;
}

.vendor-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  color: #1b5e20;
}

.vendor-header svg {
  flex-shrink: 0;
}

.vendor-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vendor-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vendor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.vendor-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f8f9fa;
}

.vendor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vendor-info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.vendor-info-content h4 {
  margin: 0;
  font-size: 1.3rem;
  color: #1b5e20;
  font-weight: 700;
}

.vendor-description {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
}

.vendor-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.vendor-location svg {
  color: #1b5e20;
  flex-shrink: 0;
}

.vendor-labels {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.vendor-label {
  background: #e8f5e9;
  color: #1b5e20;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.vendor-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #1b5e20;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  transition: gap 0.3s ease;
  width: fit-content;
}

.vendor-link:hover {
  gap: 0.8rem;
}

.vendor-link svg {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.vendor-link:hover svg {
  transform: translateX(4px);
}

/* Trust badges */
.trust-badges {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.trust-item:hover {
  transform: translateY(-4px);
}

.trust-item svg {
  color: #1b5e20;
}

.trust-item span {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  line-height: 1.4;
}

/* Tabs modernes */
.product-details {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 4rem;
}

.tabs-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  min-width: 150px;
  padding: 1.5rem 2rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: #1b5e20;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-btn:hover {
  color: #1b5e20;
  background: rgba(27, 94, 32, 0.05);
}

.tab-btn.active {
  color: #1b5e20;
  background: white;
}

.tab-btn.active::after {
  transform: scaleX(1);
}

.tab-content {
  padding: 3rem;
}

.tab-panel {
  animation: fadeIn 0.4s ease;
}

.tab-panel h3 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.tab-panel h4 {
  color: #1b5e20;
  font-size: 1.3rem;
  margin: 2rem 0 1rem;
  font-weight: 600;
}

.long-description {
  font-size: 1.15rem;
  line-height: 2;
  color: #555;
  margin-bottom: 2rem;
}

/* Key features list */
.key-features {
  background: #f8fdf9;
  padding: 2rem;
  border-radius: 16px;
  border-left: 4px solid #1b5e20;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  color: #555;
  font-size: 1.05rem;
}

.features-list svg {
  color: #1b5e20;
  flex-shrink: 0;
}

/* Composition */
.composition-content {
  font-size: 1.1rem;
  line-height: 1.9;
  color: #555;
}

.allergens-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 0.95rem;
}

/* Nutrition table */
.nutrition-info {
  max-width: 600px;
}

.nutrition-desc {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 2rem;
}

.nutrition-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.nutrition-table thead {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
}

.nutrition-table th {
  padding: 1.2rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
}

.nutrition-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  color: #555;
}

.nutrition-table tbody tr:hover {
  background: #f8f9fa;
}

.nutrition-table tbody tr:last-child td {
  border-bottom: none;
}

/* Reviews section */
.reviews-summary {
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.rating-overview {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.rating-score {
  font-size: 4rem;
  font-weight: 800;
  color: #1b5e20;
  line-height: 1;
}

.stars-large {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.stars-large .star {
  color: #ffc107;
  font-size: 1.8rem;
}

.rating-details p {
  color: #666;
  font-size: 0.95rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.reviewer-info strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.3rem;
}

.review-stars {
  color: #ffc107;
  font-size: 0.95rem;
}

.review-date {
  color: #999;
  font-size: 0.85rem;
}

.review-text {
  color: #555;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* Related products */
.related-products {
  margin-top: 4rem;
}

.related-products h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 700;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.related-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.related-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.related-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f8f9fa;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .related-image img {
  transform: scale(1.1);
}

.related-info {
  padding: 1.5rem;
}

.related-info h4 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.related-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1b5e20;
  margin: 0;
}

/* Loading state */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1b5e20;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .product-gallery {
    position: static;
  }

  .product-info h1 {
    font-size: 2rem;
  }

  .current-price {
    font-size: 2.5rem;
  }

  .trust-badges {
    grid-template-columns: 1fr;
  }

  .tab-content {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 1rem;
  }

  .breadcrumb {
    font-size: 0.8rem;
    gap: 0.5rem;
  }

  .product-info h1 {
    font-size: 1.6rem;
  }

  .current-price {
    font-size: 2rem;
  }

  .price-section {
    flex-direction: column;
    gap: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .wishlist-btn {
    width: 100%;
  }

  .tabs-header {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .tab-btn {
    font-size: 0.9rem;
    padding: 1.2rem 1.5rem;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .rating-overview {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .vendor-card {
    flex-direction: column;
  }

  .vendor-image {
    width: 100%;
    height: 200px;
  }
}
</style>
