<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
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
const notes = ref("")

const selectImage = (index: number) => {
  selectedImage.value = index
}

const selectTab = (tab: string) => {
  activeTab.value = tab
}

const addToCart = () => {
  if (!product.value || !product.value.stock) return

  addToCartService(product.value, quantity.value, notes.value)
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

// Fonction pour charger les données du produit
const loadProductData = async () => {
  const slug = route.params.slug as string
  product.value = await getProductBySlug(slug)

  if (product.value) {
    // Réinitialiser l'image sélectionnée
    selectedImage.value = 0
    
    trackEvent('view_item', {
      product_id: product.value.id,
      price: product.value.price
    })

    vendor.value = await getVendorForProduct(product.value.vendorId)

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
}

onMounted(async () => {
  await loadProductData()
})

// Watcher pour recharger les données quand le slug change
watch(() => route.params.slug, async (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    // Scroll en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    await loadProductData()
  }
})
</script>

<template>
  <section v-if="product" class="page">
    <!-- Navigation fil d'Ariane -->
    <nav class="breadcrumb">
      <RouterLink to="/">
        <i class="fas fa-home"></i>
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
            <i class="fas fa-search-plus"></i>
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
              <i class="fas fa-th-large"></i>
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
            <i class="fas fa-check-circle"></i>
            <span>Livraison gratuite dès 50€</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-clock"></i>
            <span>Livraison sous 24-48h</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Produit local - {{ product.origin }}</span>
          </div>
        </div>

        <div class="stock-info" v-if="product.stock">
          <div v-if="product.stock > 10" class="stock-indicator in-stock">
            <i class="fas fa-check-circle"></i>
            <span>En stock ({{ product.stock }} disponibles)</span>
          </div>
          <div v-else-if="product.stock > 0" class="stock-indicator low-stock">
            <i class="fas fa-exclamation-circle"></i>
            <span>Stock limité - Plus que {{ product.stock }} disponibles</span>
          </div>
          <div v-else class="stock-indicator out-stock">
            <i class="fas fa-times-circle"></i>
            <span>Rupture de stock</span>
          </div>
        </div>

        <div class="certifications-modern" v-if="product.certifications?.length">
          <div class="cert-title">Certifications & Labels</div>
          <div class="cert-list">
            <div v-for="cert in product.certifications" :key="cert" class="cert-item">
              <i class="fas fa-certificate"></i>
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
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" id="quantity" v-model.number="quantity" min="1" :max="product.stock" :disabled="!product.stock" />
              <button @click="quantity = Math.min(product.stock, quantity + 1)" class="qty-btn" :disabled="!product.stock">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <div class="notes-section">
            <label for="notes">
              <i class="fas fa-pen"></i>
              Instructions particulières
            </label>
            <textarea
                id="notes"
                v-model="notes"
                placeholder="Si vous avez des consignes particulières, n'hésitez pas à en faire part à votre vendeur..."
                class="notes-textarea"
            />
          </div>
          <div class="actions">
            <button @click="addToCart" class="add-cart" :class="{ added: showAdded }" :disabled="!product.stock">
              <i v-if="!showAdded" class="fas fa-shopping-cart"></i>
              <i v-else class="fas fa-check-circle"></i>
              <span>{{ showAdded ? 'Ajouté !' : (product.stock ? 'Ajouter au panier' : 'Rupture de stock') }}</span>
            </button>
            <button class="wishlist-btn">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>

        <!-- Informations supplémentaires -->
        <div class="product-meta">
          <div class="meta-item" v-if="product.origin">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <strong>Origine</strong>
              <span>{{ product.origin }}</span>
            </div>
          </div>
          <div class="meta-item" v-if="product.conservation">
            <i class="fas fa-sync-alt"></i>
            <div>
              <strong>Conservation</strong>
              <span>{{ product.conservation }}</span>
            </div>
          </div>
        </div>

        <!-- Vendeur -->
        <div v-if="vendor" class="vendor-section">
          <div class="vendor-header">
            <i class="fas fa-store"></i>
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
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ vendor.postalCode }} {{ vendor.city }}</span>
              </div>
              <div v-if="vendor.labels?.length" class="vendor-labels">
                <span v-for="label in vendor.labels" :key="label" class="vendor-label">
                  {{ label }}
                </span>
              </div>
              <RouterLink :to="`/vendeurs/${vendor.slug}`" class="vendor-link">
                Voir le profil du vendeur
                <i class="fas fa-arrow-right"></i>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Sécurité et garanties -->
        <div class="trust-badges">
          <div class="trust-item">
            <i class="fas fa-shield-alt"></i>
            <span>Paiement sécurisé</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-box-open"></i>
            <span>Fraîcheur garantie</span>
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
              <li><i class="fas fa-check"></i> Produit 100% bio et naturel</li>
              <li><i class="fas fa-check"></i> Cultivé localement à {{ product.origin }}</li>
              <li><i class="fas fa-check"></i> Fraîcheur garantie - Récolte récente</li>
              <li><i class="fas fa-check"></i> Respectueux de l'environnement</li>
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
              <tr><td>Énergie</td><td>165 kJ / 40 kcal</td></tr>
              <tr><td>Matières grasses</td><td>0,2 g</td></tr>
              <tr><td>dont acides gras saturés</td><td>0,05 g</td></tr>
              <tr><td>Glucides</td><td>7,6 g</td></tr>
              <tr><td>dont sucres</td><td>4,7 g</td></tr>
              <tr><td>Protéines</td><td>0,9 g</td></tr>
              <tr><td>Sel</td><td>0,07 g</td></tr>
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
            :to="`/produits/${relatedProduct.slug}`"
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

.notes-section {
  margin-bottom: 1.5rem;
  width: 100%;
}

.notes-section label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #333;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.notes-section label i {
  color: #1b5e20;
  font-size: 0.9rem;
}

.notes-textarea {
  width: 100%;
  min-height: 100px;
  max-height: 300px;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #2d3748;
  background: white;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.notes-textarea:focus {
  border-color: #1b5e20;
  box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
}

.notes-textarea::placeholder {
  color: #a0aec0;
  font-style: italic;
}


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

/* Fil d'Ariane */
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

.breadcrumb a:hover { color: #1b5e20; }
.breadcrumb .separator { color: #ccc; font-size: 1.2rem; }
.breadcrumb .current { color: #333; font-weight: 500; }

/* Container principal */
.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 5rem;
}

/* Galerie */
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

.main-image:hover img { transform: scale(1.08); }

.image-zoom-indicator {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.6rem 0.7rem;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #1b5e20;
  font-size: 1rem;
}

.main-image:hover .image-zoom-indicator { opacity: 1; }

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
}

.thumbnail img { width: 100%; height: 100%; object-fit: cover; }

.thumbnail:hover {
  border-color: #1b5e20;
  transform: translateY(-2px);
}

.thumbnail.active {
  border-color: #1b5e20;
  box-shadow: 0 4px 16px rgba(27, 94, 32, 0.3);
}

/* Infos produit */
.product-header { margin-bottom: 1.5rem; }

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

.stars { display: flex; gap: 0.2rem; }
.star { color: #ffc107; font-size: 1.3rem; }
.reviews-count { color: #666; font-size: 0.95rem; font-weight: 500; }

.price-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.price-container { display: flex; align-items: baseline; gap: 1rem; }

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

/* Highlights */
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

.highlight-item i { color: #1b5e20; font-size: 1.1rem; flex-shrink: 0; }

/* Stock */
.stock-info { margin-bottom: 2rem; }

.stock-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
}

.stock-indicator i { font-size: 1.05rem; }

.in-stock { background: linear-gradient(135deg, #d4edda, #c3e6cb); color: #155724; }
.low-stock { background: linear-gradient(135deg, #fff3cd, #ffeaa7); color: #856404; }
.out-stock { background: linear-gradient(135deg, #f8d7da, #f5c6cb); color: #721c24; }

/* Certifications */
.certifications-modern { margin-bottom: 2rem; }

.cert-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cert-list { display: flex; gap: 0.8rem; flex-wrap: wrap; }

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

.description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 2rem;
}

/* Section achat */
.purchase-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.quantity-section { margin-bottom: 1.5rem; }

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

 qty-btn {
  width: 48px;
  height: 48px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #2E7D32;
  font-size: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

 qty-btn:hover:not(:disabled) {
  background: #2E7D32;
  color: white;
  border-color: #2E7D32;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

 qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

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

/* Boutons */
.actions { display: flex; gap: 1rem; }

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

.add-cart i { font-size: 1.05rem; }

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
  font-size: 1.1rem;
}

.wishlist-btn:hover {
  background: #ffe5e5;
  border-color: #ff6b6b;
  color: #ff6b6b;
  transform: scale(1.05);
}

/* Meta */
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

.meta-item:not(:last-child) { border-bottom: 1px solid #f0f0f0; }

.meta-item > i {
  color: #1b5e20;
  flex-shrink: 0;
  margin-top: 0.25rem;
  font-size: 1rem;
}

.meta-item div { flex: 1; }

.meta-item strong {
  display: block;
  color: #1b5e20;
  font-weight: 700;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.meta-item span { color: #666; line-height: 1.6; }

/* Vendeur */
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

.vendor-header i { font-size: 1.2rem; flex-shrink: 0; }

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

.vendor-image img { width: 100%; height: 100%; object-fit: cover; }

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

.vendor-description { margin: 0; color: #555; font-size: 0.95rem; line-height: 1.6; }

.vendor-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.vendor-location i { color: #1b5e20; flex-shrink: 0; }

.vendor-labels { display: flex; gap: 0.5rem; flex-wrap: wrap; }

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

.vendor-link:hover { gap: 0.8rem; }

.vendor-link i {
  flex-shrink: 0;
  transition: transform 0.3s ease;
  font-size: 0.85rem;
}

.vendor-link:hover i { transform: translateX(4px); }

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

.trust-item:hover { transform: translateY(-4px); }
.trust-item i { color: #1b5e20; font-size: 1.4rem; }

.trust-item span {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  line-height: 1.4;
}

/* Tabs */
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

.tab-btn:hover { color: #1b5e20; background: rgba(27, 94, 32, 0.05); }
.tab-btn.active { color: #1b5e20; background: white; }
.tab-btn.active::after { transform: scaleX(1); }

.tab-content { padding: 3rem; }
.tab-panel { animation: fadeIn 0.4s ease; }

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

.key-features {
  background: #f8fdf9;
  padding: 2rem;
  border-radius: 16px;
  border-left: 4px solid #1b5e20;
}

.features-list { list-style: none; padding: 0; margin: 0; }

.features-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  color: #555;
  font-size: 1.05rem;
}

.features-list i { color: #1b5e20; flex-shrink: 0; font-size: 0.9rem; }

/* Composition */
.composition-content { font-size: 1.1rem; line-height: 1.9; color: #555; }

.allergens-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 0.95rem;
}

/* Nutrition */
.nutrition-info { max-width: 600px; }

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

.nutrition-table tbody tr:hover { background: #f8f9fa; }
.nutrition-table tbody tr:last-child td { border-bottom: none; }

/* Reviews */
.reviews-summary {
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.rating-overview { display: flex; align-items: center; gap: 2rem; }

.rating-score {
  font-size: 4rem;
  font-weight: 800;
  color: #1b5e20;
  line-height: 1;
}

.stars-large { display: flex; gap: 0.3rem; margin-bottom: 0.5rem; }
.stars-large .star { color: #ffc107; font-size: 1.8rem; }
.rating-details p { color: #666; font-size: 0.95rem; }

.reviews-list { display: flex; flex-direction: column; gap: 1.5rem; }

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

.reviewer-info { display: flex; align-items: center; gap: 1rem; }

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

.reviewer-info strong { display: block; color: #2c3e50; margin-bottom: 0.3rem; }
.review-stars { color: #ffc107; font-size: 0.95rem; }
.review-date { color: #999; font-size: 0.85rem; }
.review-text { color: #555; line-height: 1.7; font-size: 1.05rem; }

/* Related */
.related-products { margin-top: 4rem; }

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

.related-image { width: 100%; aspect-ratio: 1; overflow: hidden; background: #f8f9fa; }

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .related-image img { transform: scale(1.1); }

.related-info { padding: 1.5rem; }

.related-info h4 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.related-price { font-size: 1.3rem; font-weight: 700; color: #1b5e20; margin: 0; }

/* Loading */
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

.loading p { font-size: 1.2rem; color: #666; font-weight: 500; }

/* Responsive */
@media (max-width: 1024px) {
  .product-container { grid-template-columns: 1fr; gap: 3rem; }
  .product-gallery { position: static; }
  .product-info h1 { font-size: 2rem; }
  .current-price { font-size: 2.5rem; }
  .trust-badges { grid-template-columns: 1fr; }
  .tab-content { padding: 2rem 1.5rem; }
}

@media (max-width: 768px) {
  .page { padding: 1rem; }
  .breadcrumb { font-size: 0.8rem; gap: 0.5rem; }
  .product-info h1 { font-size: 1.6rem; }
  .current-price { font-size: 2rem; }
  .price-section { flex-direction: column; gap: 1rem; }
  .actions { flex-direction: column; }
  .wishlist-btn { width: 100%; }
  .tabs-header { flex-wrap: nowrap; overflow-x: auto; }
  .tab-btn { font-size: 0.9rem; padding: 1.2rem 1.5rem; }
  .related-grid { grid-template-columns: 1fr; }
  .rating-overview { flex-direction: column; text-align: center; gap: 1rem; }
  .vendor-card { flex-direction: column; }
  .vendor-image { width: 100%; height: 200px; }
}
</style>