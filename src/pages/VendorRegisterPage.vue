<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { registerVendor, type VendorRegisterData } from '../services/vendorAuth'

const router = useRouter()

const formData = ref<VendorRegisterData>({
  email: '',
  password: '',
  businessName: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  postalCode: '',
  city: 'Grenoble',
  description: '',
  siret: '',
  labels: []
})

const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const selectedLabels = ref<string[]>([])

const availableLabels = [
  'Bio', 
  'Circuit court', 
  'Zéro déchet', 
  'Vrac', 
  'Local', 
  'Équitable', 
  'Artisanal',
  'Agriculture raisonnée'
]

const toggleLabel = (label: string) => {
  const index = selectedLabels.value.indexOf(label)
  if (index > -1) {
    selectedLabels.value.splice(index, 1)
  } else {
    selectedLabels.value.push(label)
  }
}

const handleRegister = async () => {
  error.value = ''

  if (formData.value.password !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (formData.value.password.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  if (selectedLabels.value.length === 0) {
    error.value = 'Veuillez sélectionner au moins un label'
    return
  }

  loading.value = true
  formData.value.labels = selectedLabels.value

  try {
    const result = await registerVendor(formData.value)
    
    if (result.success) {
      router.push('/vendeur/dashboard')
    } else {
      error.value = result.error || 'Erreur lors de l\'inscription'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7h-9M14 17H5M17 12H3M12 2L2 7l10 5 10-5-10-5z"/>
            </svg>
          </div>
          <h1>Devenir Vendeur</h1>
          <p>Rejoignez notre marketplace écoresponsable</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Informations entreprise -->
          <div class="section-title">Informations sur votre entreprise</div>

          <div class="form-group">
            <label for="businessName">Nom de l'entreprise *</label>
            <input
              id="businessName"
              v-model="formData.businessName"
              type="text"
              required
              placeholder="Ex: Ferme des Batignolles"
            />
          </div>

          <div class="form-group">
            <label for="description">Description de votre activité</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              placeholder="Présentez votre activité en quelques lignes..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="siret">SIRET (optionnel)</label>
            <input
              id="siret"
              v-model="formData.siret"
              type="text"
              placeholder="123 456 789 00012"
            />
          </div>

          <!-- Labels -->
          <div class="form-group">
            <label>Labels et certifications *</label>
            <div class="labels-grid">
              <button
                v-for="label in availableLabels"
                :key="label"
                type="button"
                class="label-btn"
                :class="{ active: selectedLabels.includes(label) }"
                @click="toggleLabel(label)"
              >
                <svg v-if="selectedLabels.includes(label)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ label }}
              </button>
            </div>
          </div>

          <!-- Contact -->
          <div class="section-title">Informations de contact</div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom *</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                placeholder="Jean"
              />
            </div>

            <div class="form-group">
              <label for="lastName">Nom *</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                placeholder="Dupont"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email professionnel *</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                placeholder="contact@monentreprise.fr"
              />
            </div>

            <div class="form-group">
              <label for="phone">Téléphone *</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                required
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <!-- Adresse -->
          <div class="section-title">Adresse</div>

          <div class="form-group">
            <label for="address">Rue *</label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              required
              placeholder="12 rue des Moines"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="postalCode">Code postal *</label>
              <input
                id="postalCode"
                v-model="formData.postalCode"
                type="text"
                required
                placeholder="38000"
              />
            </div>

            <div class="form-group">
              <label for="city">Ville *</label>
              <input
                id="city"
                v-model="formData.city"
                type="text"
                required
                placeholder="Grenoble"
              />
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="section-title">Sécurité</div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">Mot de passe *</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                required
                placeholder="••••••••"
              />
              <span class="hint">Minimum 6 caractères</span>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe *</label>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading">Créer mon compte vendeur</span>
            <span v-else class="spinner"></span>
          </button>
        </form>

        <div class="register-footer">
          <p>
            Déjà inscrit ?
            <RouterLink to="/vendeur/connexion" class="link-login">Se connecter</RouterLink>
          </p>
        </div>
      </div>

      <div class="register-visual">
        <div class="visual-content">
          <h2>Pourquoi nous rejoindre ?</h2>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">5 000+</div>
              <div class="stat-label">Clients actifs</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">150+</div>
              <div class="stat-label">Producteurs partenaires</div>
            </div>
          </div>

          <div class="benefits">
            <h3>Nos avantages</h3>
            <ul>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Commission de seulement 8% sur les ventes
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Outil de gestion de boutique simple et efficace
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Visibilité auprès d'une clientèle engagée
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Paiements sécurisés et rapides
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Support dédié pour vous accompagner
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070');
  background-size: cover;
  background-position: center;
  padding: 1.5rem;
  position: relative;
}

.register-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.register-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  max-width: 1100px;
  width: 100%;
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  height: 95vh;
  max-height: 95vh;
}

.register-card {
  padding: 1.5rem 2rem;
  background: white;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  max-height: 95vh;
}

/* Custom scrollbar pour un look plus pro */
.register-card::-webkit-scrollbar {
  width: 8px;
}

.register-card::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.register-card::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.register-card::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.register-header {
  text-align: center;
  margin-bottom: 1.25rem;
}

.logo-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  color: white;
}

.logo-circle svg {
  width: 28px;
  height: 28px;
}

.register-header h1 {
  font-size: 1.5rem;
  color: #1a202c;
  margin: 0 0 0.35rem;
}

.register-header p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2E7D32;
  margin: 0.75rem 0 0.4rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #e2e8f0;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-weight: 600;
  color: #1a202c;
  font-size: 0.85rem;
}

.form-group input,
.form-group textarea {
  padding: 0.6rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.hint {
  font-size: 0.8rem;
  color: #94a3b8;
}

.labels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.6rem;
}

.label-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 0.85rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.label-btn:hover {
  border-color: #43A047;
  background: #f0f9f4;
}

.label-btn.active {
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border-color: #2E7D32;
}

.label-btn svg {
  flex-shrink: 0;
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
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

.register-footer {
  text-align: center;
  margin-top: 1rem;
}

.register-footer p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.link-login {
  color: #2E7D32;
  font-weight: 600;
  text-decoration: none;
}

.link-login:hover {
  text-decoration: underline;
}

.register-visual {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.95) 0%, rgba(67, 160, 71, 0.95) 100%);
  padding: 2rem 1.75rem;
  display: flex;
  align-items: center;
  position: relative;
  backdrop-filter: blur(20px);
  height: 100%;
  overflow-y: auto;
}

.register-visual::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(46, 125, 50, 0.25);
  backdrop-filter: blur(10px);
}

.visual-content {
  position: relative;
  z-index: 1;
  color: white;
}

.visual-content h2 {
  font-size: 1.5rem;
  margin: 0 0 1.5rem;
  font-weight: 700;
  line-height: 1.3;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 1.15rem;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 1.65rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.9;
  line-height: 1.2;
}

.benefits h3 {
  font-size: 1.1rem;
  margin: 0 0 0.85rem;
  font-weight: 700;
}

.benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.benefits li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 0.85rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  line-height: 1.4;
}

.benefits li svg {
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 968px) {
  .register-container {
    grid-template-columns: 1fr;
    max-height: none;
  }

  .register-visual {
    display: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .labels-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
