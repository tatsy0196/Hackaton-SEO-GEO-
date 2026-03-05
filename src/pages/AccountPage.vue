<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout, updateProfile, type User } from '../services/auth'
import { getUserOrders, type Order } from '../services/orders'

const router = useRouter()
const user = ref<User | null>(null)
const orders = ref<Order[]>([])
const isEditing = ref(false)
const message = ref('')
const error = ref('')

const editForm = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  postalCode: '',
  city: ''
})

onMounted(() => {
  user.value = getCurrentUser()
  
  if (!user.value) {
    router.push('/connexion')
    return
  }

  // Charger les commandes
  orders.value = getUserOrders()

  // Initialiser le formulaire avec les données actuelles
  editForm.value = {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    phone: user.value.phone || '',
    address: user.value.address || '',
    postalCode: user.value.postalCode || '',
    city: user.value.city || ''
  }
})

const handleLogout = () => {
  logout()
  router.push('/')
}

const startEditing = () => {
  isEditing.value = true
  message.value = ''
  error.value = ''
}

const cancelEditing = () => {
  isEditing.value = false
  if (user.value) {
    editForm.value = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      phone: user.value.phone || '',
      address: user.value.address || '',
      postalCode: user.value.postalCode || '',
      city: user.value.city || ''
    }
  }
}

const saveProfile = async () => {
  message.value = ''
  error.value = ''

  const result = await updateProfile(editForm.value)
  
  if (result.success && result.user) {
    user.value = result.user
    isEditing.value = false
    message.value = 'Profil mis à jour avec succès'
  } else {
    error.value = result.error || 'Erreur lors de la mise à jour'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusLabel = (status: Order['status']) => {
  const labels: Record<Order['status'], string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status]
}

const getStatusColor = (status: Order['status']) => {
  const colors: Record<Order['status'], string> = {
    pending: '#f59e0b',
    confirmed: '#2E7D32',
    delivered: '#0284c7',
    cancelled: '#dc2626'
  }
  return colors[status]
}
</script>

<template>
  <div v-if="user" class="account-page">
    <div class="account-container">
      <div class="account-header">
        <div class="header-content">
          <div class="avatar">
            <span>{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
          </div>
          <div class="header-info">
            <h1>{{ user.firstName }} {{ user.lastName }}</h1>
            <p>{{ user.email }}</p>
            <span class="member-since">Membre depuis le {{ formatDate(user.createdAt) }}</span>
          </div>
        </div>
        <button @click="handleLogout" class="btn-logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Déconnexion
        </button>
      </div>

      <!-- Messages -->
      <div v-if="message" class="success-message">{{ message }}</div>
      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="account-grid">
        <!-- Informations personnelles -->
        <div class="card">
          <div class="card-header">
            <h2>Informations personnelles</h2>
            <button v-if="!isEditing" @click="startEditing" class="btn-edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Modifier
            </button>
          </div>

          <div v-if="!isEditing" class="info-grid">
            <div class="info-item">
              <label>Prénom</label>
              <p>{{ user.firstName }}</p>
            </div>
            <div class="info-item">
              <label>Nom</label>
              <p>{{ user.lastName }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ user.email }}</p>
            </div>
            <div class="info-item">
              <label>Téléphone</label>
              <p>{{ user.phone || 'Non renseigné' }}</p>
            </div>
            <div class="info-item full-width">
              <label>Adresse</label>
              <p>{{ user.address || 'Non renseignée' }}</p>
            </div>
            <div class="info-item">
              <label>Code postal</label>
              <p>{{ user.postalCode || 'Non renseigné' }}</p>
            </div>
            <div class="info-item">
              <label>Ville</label>
              <p>{{ user.city || 'Non renseignée' }}</p>
            </div>
          </div>

          <form v-else @submit.prevent="saveProfile" class="edit-form">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom</label>
                <input v-model="editForm.firstName" type="text" required />
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input v-model="editForm.lastName" type="text" required />
              </div>
            </div>

            <div class="form-group">
              <label>Téléphone</label>
              <input v-model="editForm.phone" type="tel" />
            </div>

            <div class="form-group">
              <label>Adresse</label>
              <input v-model="editForm.address" type="text" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Code postal</label>
                <input v-model="editForm.postalCode" type="text" />
              </div>
              <div class="form-group">
                <label>Ville</label>
                <input v-model="editForm.city" type="text" />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="cancelEditing" class="btn-cancel">
                Annuler
              </button>
              <button type="submit" class="btn-save">
                Enregistrer
              </button>
            </div>
          </form>
        </div>

        <!-- Mes commandes -->
        <div class="card orders-card">
          <div class="card-header">
            <h2>Mes commandes</h2>
            <span v-if="orders.length > 0" class="count-badge">{{ orders.length }}</span>
          </div>

          <div v-if="orders.length === 0" class="empty-state">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <p>Aucune commande pour le moment</p>
            <RouterLink to="/produits" class="btn-link">Découvrir les produits</RouterLink>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-item">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">#{{ order.id.slice(-8).toUpperCase() }}</span>
                  <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                </div>
                <span class="order-status" :style="{ background: getStatusColor(order.status) }">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>

              <div class="order-products">
                <div v-for="item in order.items.slice(0, 3)" :key="item.product.id" class="order-product">
                  <img :src="item.product.imageUrl" :alt="item.product.name" />
                  <div class="product-info">
                    <span class="product-name">{{ item.product.name }}</span>
                    <span class="product-qty">x{{ item.quantity }}</span>
                  </div>
                </div>
                <span v-if="order.items.length > 3" class="more-products">
                  +{{ order.items.length - 3 }} autre{{ order.items.length - 3 > 1 ? 's' : '' }}
                </span>
              </div>

              <div class="order-footer">
                <div class="delivery-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path v-if="order.deliveryMode === 'pickup'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <rect v-else x="1" y="3" width="15" height="13"></rect>
                  </svg>
                  <span>{{ order.deliveryMode === 'pickup' ? 'Click & Collect' : 'Point Relais' }}</span>
                </div>
                <div class="order-total">
                  <span>Total :</span>
                  <strong>{{ order.total.toFixed(2) }} €</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mes favoris -->
        <div class="card">
          <h2>Mes favoris</h2>
          <div class="empty-state">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <p>Aucun produit favori</p>
            <RouterLink to="/produits" class="btn-link">Parcourir le catalogue</RouterLink>
          </div>
        </div>

        <!-- Paramètres -->
        <div class="card">
          <h2>Paramètres</h2>
          <div class="settings-list">
            <div class="setting-item">
              <div>
                <strong>Notifications email</strong>
                <p>Recevoir les offres et actualités</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div>
                <strong>Newsletter</strong>
                <p>Recettes et astuces des producteurs</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-page {
  min-height: 80vh;
  padding: 3rem 2rem;
  background: #f7fafc;
}

.account-container {
  max-width: 1200px;
  margin: 0 auto;
}

.account-header {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-info h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.header-info p {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.member-since {
  font-size: 0.9rem;
  color: #a0aec0;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: #fff5f5;
  border-color: #e53e3e;
  color: #e53e3e;
}

.success-message {
  background: #f0fff4;
  color: #22543d;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #38a169;
}

.error-message {
  background: #fff5f5;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e53e3e;
}

.account-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  margin: 0;
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: #667eea;
  color: white;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  color: #2d3748;
  font-size: 1.05rem;
  font-weight: 500;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 600;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel, .btn-save {
  flex: 1;
  padding: 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #f7fafc;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #a0aec0;
}

.empty-state svg {
  margin-bottom: 1rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: #718096;
}

.btn-link {
  display: inline-block;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.btn-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.setting-item p {
  font-size: 0.9rem;
  color: #718096;
}

.toggle {
  position: relative;
  width: 50px;
  height: 28px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  border-radius: 34px;
  transition: 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background-color: #2E7D32;
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

/* Styles pour les commandes */
.orders-card {
  grid-column: 1 / -1;
}

.count-badge {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s;
}

.order-item:hover {
  border-color: #2E7D32;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.order-id {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #2d3748;
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.order-date {
  color: #64748b;
  font-size: 0.875rem;
}

.order-status {
  padding: 0.375rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.order-products {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.order-product {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.order-product img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
}

.product-qty {
  font-size: 0.75rem;
  color: #64748b;
}

.more-products {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px dashed #cbd5e0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.delivery-info svg {
  color: #2E7D32;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #64748b;
}

.order-total strong {
  font-size: 1.25rem;
  color: #2E7D32;
  font-weight: 800;
}

@media (max-width: 968px) {
  .account-grid {
    grid-template-columns: 1fr;
  }

  .account-header {
    flex-direction: column;
    gap: 2rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
