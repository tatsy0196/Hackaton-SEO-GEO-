<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {getProductBySlug} from "../services/api.ts";
import {trackEvent} from "../services/tracking.ts";

const route = useRoute()
const product = ref<any | null>(null)
const selectedImage = ref(0)
const quantity = ref(1)

const selectImage = (index: number) => {
  selectedImage.value = index
}

const addToCart = () => {
  // Logique d'ajout au panier
  alert(`${quantity.value} x ${product.value.name} ajouté(s) au panier`)
}

onMounted(async () => {
  const slug = route.params.slug as string
  product.value = await getProductBySlug(slug)

  if (product.value) {
    trackEvent('view_item', {
      product_id: product.value.id,
      price: product.value.price
    })
  }
})
</script>

<template>
  <section v-if="product" class="page">
    <!-- Navigation fil d'Ariane -->
    <nav class="breadcrumb">
      <RouterLink to="/">Accueil</RouterLink>
      <span>/</span>
      <RouterLink to="/produits">Produits</RouterLink>
      <span>/</span>
      <span>{{ product.name }}</span>
    </nav>

    <div class="product-container">
      <!-- Galerie d'images -->
      <div class="product-gallery">
        <div class="main-image">
          <img :src="product.images[selectedImage]" :alt="product.name" />
        </div>
        <div class="thumbnails">
          <button
            v-for="(image, index) in product.images"
            :key="index"
            @click="selectImage(index)"
            :class="['thumbnail', { active: selectedImage === index }]"
          >
            <img :src="image" :alt="`${product.name} - image ${index + 1}`" />
          </button>
        </div>
      </div>

      <!-- Informations produit -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        
        <div class="category-badge">{{ product.category }}</div>
        
        <div class="price-section">
          <p class="price">{{ product.price.toFixed(2) }} €</p>
          <p v-if="product.weight" class="weight">{{ product.weight }}</p>
        </div>

        <div class="stock-info" v-if="product.stock">
          <span v-if="product.stock > 10" class="in-stock">✓ En stock</span>
          <span v-else-if="product.stock > 0" class="low-stock">⚠ Stock limité ({{ product.stock }} restants)</span>
          <span v-else class="out-stock">✗ Rupture de stock</span>
        </div>

        <div class="certifications" v-if="product.certifications?.length">
          <span v-for="cert in product.certifications" :key="cert" class="cert-badge">{{ cert }}</span>
        </div>

        <p class="description">{{ product.shortDescription }}</p>

        <!-- Quantité et actions -->
        <div class="quantity-section">
          <label for="quantity">Quantité :</label>
          <div class="quantity-controls">
            <button @click="quantity = Math.max(1, quantity - 1)" class="qty-btn">−</button>
            <input type="number" id="quantity" v-model.number="quantity" min="1" />
            <button @click="quantity++" class="qty-btn">+</button>
          </div>
        </div>

        <div class="actions">
          <button @click="addToCart" class="add-cart" :disabled="!product.stock">
            {{ product.stock ? 'Ajouter au panier' : 'Rupture de stock' }}
          </button>
          <RouterLink to="/checkout" class="btn-checkout">Acheter maintenant</RouterLink>
        </div>

        <!-- Informations supplémentaires -->
        <div class="product-meta">
          <div class="meta-item" v-if="product.origin">
            <strong>Origine :</strong> {{ product.origin }}
          </div>
          <div class="meta-item" v-if="product.conservation">
            <strong>Conservation :</strong> {{ product.conservation }}
          </div>
        </div>
      </div>
    </div>

    <!-- Détails complets -->
    <div class="product-details">
      <div class="tabs">
        <h2>Description détaillée</h2>
        <div class="tab-content">
          <p class="long-description">{{ product.longDescription }}</p>
          
          <div v-if="product.composition" class="detail-section">
            <h3>Composition</h3>
            <p>{{ product.composition }}</p>
          </div>

          <div v-if="product.nutritionalInfo" class="detail-section">
            <h3>Informations nutritionnelles</h3>
            <p>{{ product.nutritionalInfo }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div v-else class="loading">Produit en cours de chargement...</div>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Fil d'Ariane */
.breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #1b5e20;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span:last-child {
  color: #333;
  font-weight: 500;
}

/* Container principal */
.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

/* Galerie d'images */
.product-gallery {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover img {
  transform: scale(1.05);
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.thumbnail {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  background: none;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: #1b5e20;
  opacity: 0.8;
}

.thumbnail.active {
  border-color: #1b5e20;
  box-shadow: 0 2px 8px rgba(27, 94, 32, 0.3);
}

/* Informations produit */
.product-info h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.category-badge {
  display: inline-block;
  background: #f0f4f0;
  color: #1b5e20;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #1b5e20;
}

.weight {
  font-size: 1rem;
  color: #666;
}

.stock-info {
  margin-bottom: 1rem;
}

.in-stock {
  color: #1b5e20;
  font-weight: 600;
}

.low-stock {
  color: #f57c00;
  font-weight: 600;
}

.out-stock {
  color: #d32f2f;
  font-weight: 600;
}

.certifications {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.cert-badge {
  background: #1b5e20;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #444;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

/* Quantité */
.quantity-section {
  margin-bottom: 2rem;
}

.quantity-section label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #1b5e20;
  background: white;
  color: #1b5e20;
  font-size: 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.qty-btn:hover {
  background: #1b5e20;
  color: white;
}

.quantity-controls input {
  width: 70px;
  height: 40px;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
}

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.add-cart {
  flex: 1;
  background: #1b5e20;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-cart:hover:not(:disabled) {
  background: #145214;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
}

.add-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-checkout {
  flex: 1;
  background: transparent;
  border: 2px solid #1b5e20;
  color: #1b5e20;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-checkout:hover {
  background: #1b5e20;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
}

/* Meta informations */
.product-meta {
  background: #f8faf9;
  padding: 1.5rem;
  border-radius: 12px;
}

.meta-item {
  padding: 0.5rem 0;
  line-height: 1.6;
  color: #555;
}

.meta-item strong {
  color: #1b5e20;
}

/* Détails produit */
.product-details {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tabs h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #1b5e20;
}

.long-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 2rem;
}

.detail-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.detail-section h3 {
  color: #1b5e20;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.detail-section p {
  line-height: 1.7;
  color: #555;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #666;
}

/* Responsive */
@media (max-width: 968px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-gallery {
    position: static;
  }

  .thumbnails {
    grid-template-columns: repeat(4, 1fr);
  }

  .actions {
    flex-direction: column;
  }

  .product-details {
    padding: 2rem 1.5rem;
  }
}
</style>
