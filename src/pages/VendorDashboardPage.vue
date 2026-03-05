<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentVendor, logoutVendor, type Vendor } from '../services/vendorAuth'
import { 
  getVendorProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  type VendorProduct 
} from '../services/vendorProducts'

const router = useRouter()
const vendor = ref<Vendor | null>(null)
const products = ref<VendorProduct[]>([])
const showProductForm = ref(false)
const editingProduct = ref<VendorProduct | null>(null)

const productForm = ref({
  name: '',
  category: '',
  price: 0,
  discountPrice: undefined as number | undefined,
  shortDescription: '',
  longDescription: '',
  imageUrl: '',
  weight: '',
  origin: '',
  composition: '',
  conservation: '',
  nutritionalInfo: '',
  certifications: [] as string[],
  stock: 0,
  images: [] as string[]
})

const categories = [
  'Fruits & Légumes',
  'Produits laitiers',
  'Viande & Poisson',
  'Boulangerie',
  'Épicerie',
  'Boissons',
  'Autre'
]

const availableCertifications = [
  'Bio', 
  'AOC', 
  'Label Rouge', 
  'Agriculture raisonnée',
  'Commerce équitable'
]

const stats = computed(() => ({
  totalProducts: products.value.length,
  inStock: products.value.filter(p => p.stock > 0).length,
  outOfStock: products.value.filter(p => p.stock === 0).length,
  averagePrice: products.value.length > 0
    ? (products.value.reduce((sum, p) => sum + p.price, 0) / products.value.length).toFixed(2)
    : '0.00'
}))

onMounted(() => {
  vendor.value = getCurrentVendor()
  
  if (!vendor.value) {
    router.push('/vendeur/connexion')
    return
  }

  loadProducts()
})

const loadProducts = () => {
  if (vendor.value) {
    products.value = getVendorProducts(vendor.value.id)
  }
}

const handleLogout = () => {
  logoutVendor()
  router.push('/vendeur/connexion')
}

const openProductForm = (product?: VendorProduct) => {
  if (product) {
    editingProduct.value = product
    productForm.value = {
      name: product.name,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      imageUrl: product.imageUrl,
      weight: product.weight,
      origin: product.origin,
      composition: product.composition,
      conservation: product.conservation,
      nutritionalInfo: product.nutritionalInfo,
      certifications: [...product.certifications],
      stock: product.stock,
      images: [...product.images]
    }
  } else {
    editingProduct.value = null
    resetForm()
  }
  showProductForm.value = true
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  resetForm()
}

const resetForm = () => {
  productForm.value = {
    name: '',
    category: '',
    price: 0,
    discountPrice: undefined,
    shortDescription: '',
    longDescription: '',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
    weight: '',
    origin: 'Grenoble',
    composition: '',
    conservation: '',
    nutritionalInfo: '',
    certifications: [],
    stock: 0,
    images: []
  }
}

const toggleCertification = (cert: string) => {
  const index = productForm.value.certifications.indexOf(cert)
  if (index > -1) {
    productForm.value.certifications.splice(index, 1)
  } else {
    productForm.value.certifications.push(cert)
  }
}

const saveProduct = () => {
  if (!vendor.value) return

  if (editingProduct.value) {
    // Mise à jour
    updateProduct(editingProduct.value.id, {
      ...productForm.value,
      city: vendor.value.city
    })
  } else {
    // Création
    addProduct(vendor.value.id, {
      ...productForm.value,
      city: vendor.value.city,
      images: productForm.value.imageUrl ? [productForm.value.imageUrl] : []
    })
  }

  loadProducts()
  closeProductForm()
}

const handleDeleteProduct = (productId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    deleteProduct(productId)
    loadProducts()
  }
}

const formatPrice = (price: number) => {
  return price.toFixed(2) + ' €'
}
</script>

<template>
  <div v-if="vendor" class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="vendor-info">
          <div class="vendor-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7h-9M14 17H5M17 12H3M12 2L2 7l10 5 10-5-10-5z"/>
            </svg>
          </div>
          <div>
            <h1>{{ vendor.businessName }}</h1>
            <p>{{ vendor.city }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="btn-logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </header>

    <!-- Stats -->
    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalProducts }}</div>
          <div class="stat-label">Produits</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #0288d1 0%, #03a9f4 100%);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.inStock }}</div>
          <div class="stat-label">En stock</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.outOfStock }}</div>
          <div class="stat-label">Rupture</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.averagePrice }}€</div>
          <div class="stat-label">Prix moyen</div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="products-section">
      <div class="section-header">
        <h2>Mes Produits</h2>
        <button @click="openProductForm()" class="btn-add">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Ajouter un produit
        </button>
      </div>

      <div v-if="products.length === 0" class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h3>Aucun produit</h3>
        <p>Commencez par ajouter votre premier produit</p>
      </div>

      <div v-else class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-item">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name" />
            <div v-if="product.stock === 0" class="stock-badge out">Rupture</div>
            <div v-else-if="product.stock < 10" class="stock-badge low">Stock faible</div>
          </div>
          
          <div class="product-details">
            <h3>{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
            <div class="product-price">
              <span v-if="product.discountPrice" class="old-price">{{ formatPrice(product.price) }}</span>
              <span class="price">{{ formatPrice(product.discountPrice || product.price) }}</span>
            </div>
            <div class="product-stock">
              Stock: <strong>{{ product.stock }}</strong> unités
            </div>
          </div>

          <div class="product-actions">
            <button @click="openProductForm(product)" class="btn-edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Modifier
            </button>
            <button @click="handleDeleteProduct(product.id)" class="btn-delete">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Form Modal -->
    <div v-if="showProductForm" class="modal-overlay" @click.self="closeProductForm">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingProduct ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
          <button @click="closeProductForm" class="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Nom du produit *</label>
              <input
                id="name"
                v-model="productForm.name"
                type="text"
                required
                placeholder="Ex: Panier de légumes bio"
              />
            </div>

            <div class="form-group">
              <label for="category">Catégorie *</label>
              <select id="category" v-model="productForm.category" required>
                <option value="">Sélectionner...</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="shortDescription">Description courte *</label>
            <textarea
              id="shortDescription"
              v-model="productForm.shortDescription"
              rows="2"
              required
              placeholder="Description visible sur la carte produit"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="longDescription">Description détaillée</label>
            <textarea
              id="longDescription"
              v-model="productForm.longDescription"
              rows="4"
              placeholder="Description complète du produit"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Prix (€) *</label>
              <input
                id="price"
                v-model.number="productForm.price"
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div class="form-group">
              <label for="discountPrice">Prix promotionnel (€)</label>
              <input
                id="discountPrice"
                v-model.number="productForm.discountPrice"
                type="number"
                step="0.01"
                min="0"
              />
            </div>

            <div class="form-group">
              <label for="stock">Stock *</label>
              <input
                id="stock"
                v-model.number="productForm.stock"
                type="number"
                min="0"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="weight">Poids / Contenance</label>
              <input
                id="weight"
                v-model="productForm.weight"
                type="text"
                placeholder="Ex: 500g, 1L, 1kg"
              />
            </div>

            <div class="form-group">
              <label for="origin">Origine</label>
              <input
                id="origin"
                v-model="productForm.origin"
                type="text"
                placeholder="Ex: France, Grenoble"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="imageUrl">URL de l'image</label>
            <input
              id="imageUrl"
              v-model="productForm.imageUrl"
              type="url"
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div class="form-group">
            <label>Certifications</label>
            <div class="certifications-grid">
              <button
                v-for="cert in availableCertifications"
                :key="cert"
                type="button"
                class="cert-btn"
                :class="{ active: productForm.certifications.includes(cert) }"
                @click="toggleCertification(cert)"
              >
                <svg v-if="productForm.certifications.includes(cert)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ cert }}
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeProductForm" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">
              {{ editingProduct ? 'Enregistrer' : 'Créer le produit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-header {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vendor-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.vendor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.vendor-info h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
  font-weight: 700;
}

.vendor-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.stats-section {
  max-width: 1400px;
  margin: -2rem auto 2rem;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.products-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.75rem;
  color: #1a202c;
  margin: 0;
  font-weight: 700;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-state svg {
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1a202c;
  margin: 0 0 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.product-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
}

.stock-badge.out {
  background: rgba(220, 38, 38, 0.95);
  color: white;
}

.stock-badge.low {
  background: rgba(245, 158, 11, 0.95);
  color: white;
}

.product-details {
  padding: 1.25rem;
  flex: 1;
}

.product-details h3 {
  font-size: 1.15rem;
  color: #1a202c;
  margin: 0 0 0.5rem;
  font-weight: 700;
  line-height: 1.3;
}

.product-category {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.old-price {
  font-size: 0.95rem;
  color: #94a3b8;
  text-decoration: line-through;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2E7D32;
}

.product-stock {
  font-size: 0.9rem;
  color: #64748b;
}

.product-stock strong {
  color: #1a202c;
  font-weight: 700;
}

.product-actions {
  padding: 1rem 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.btn-edit,
.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #e0f2fe;
  color: #0284c7;
}

.btn-edit:hover {
  background: #0284c7;
  color: white;
}

.btn-delete {
  background: #fee;
  color: #dc2626;
}

.btn-delete:hover {
  background: #dc2626;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f1f5f9;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #1a202c;
  margin: 0;
  font-weight: 700;
}

.btn-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #e2e8f0;
  color: #1a202c;
}

.product-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #1a202c;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.cert-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.cert-btn:hover {
  border-color: #43A047;
  background: #f0f9f4;
}

.cert-btn.active {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border-color: #2E7D32;
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f1f5f9;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
