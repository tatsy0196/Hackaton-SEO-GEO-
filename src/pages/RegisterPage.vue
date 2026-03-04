<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { register, type RegisterData } from '../services/auth'

const router = useRouter()

const formData = ref<RegisterData>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: ''
})

const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''

  // Validation
  if (formData.value.password !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (formData.value.password.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  loading.value = true

  try {
    const result = await register(formData.value)
    
    if (result.success) {
      router.push('/compte')
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
        <!-- Header -->
        <div class="register-header">
          <div class="logo-circle">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
          <h1>Créer un compte</h1>
          <p>Rejoignez GreenNoble et soutenez les producteurs locaux</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleRegister" class="register-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                placeholder="Jean"
                required
                autocomplete="given-name"
              />
            </div>

            <div class="form-group">
              <label for="lastName">Nom</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                placeholder="Dupont"
                required
                autocomplete="family-name"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="votre@email.com"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Téléphone (optionnel)</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                placeholder="06 12 34 56 78"
                autocomplete="tel"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                required
                autocomplete="new-password"
              />
            </div>
            <small class="hint">Au moins 6 caractères</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                autocomplete="new-password"
              />
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Créer mon compte</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="register-footer">
          <p>Vous avez déjà un compte ?</p>
          <RouterLink to="/connexion" class="link-login">
            Se connecter
          </RouterLink>
        </div>
      </div>

      <!-- Image décorative -->
      <div class="register-visual">
        <div class="visual-content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">200+</div>
              <div class="stat-label">Producteurs</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">1000+</div>
              <div class="stat-label">Produits bio</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">5000+</div>
              <div class="stat-label">Clients satisfaits</div>
            </div>
          </div>
          
          <div class="benefits">
            <h3>Pourquoi nous rejoindre ?</h3>
            <ul>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Accès à des produits locaux et bio</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Support direct aux producteurs</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Livraison rapide et écoresponsable</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Offres et promotions exclusives</span>
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
  background-image: url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem;
  position: relative;
}

.register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.register-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  max-width: 1100px;
  width: 100%;
  background: transparent;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.register-card {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  max-height: 90vh;
  background: white;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
}

.register-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #718096;
  font-size: 0.9rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #c33;
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
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.hint {
  color: #718096;
  font-size: 0.8rem;
  margin-top: -0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #a0aec0;
  pointer-events: none;
}

.input-wrapper input,
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.input-wrapper input {
  padding-left: 3rem;
}

.input-wrapper input:focus,
.form-group input:focus {
  outline: none;
  border-color: #2E7D32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.btn-submit {
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(46, 125, 50, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-footer {
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.register-footer p {
  color: #718096;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.link-login {
  color: #43A047;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-login:hover {
  color: #2E7D32;
  text-decoration: underline;
}

.register-visual {
  background: transparent;
  backdrop-filter: blur(10px);
  padding: 3rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-visual::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(46, 125, 50, 0.25);
  z-index: 0;
}

.visual-content {
  position: relative;
  z-index: 1;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: white;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.95;
  color: white;
}

.benefits h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
}

.benefits ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefits li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  color: white;
}

.benefits li svg {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.3);
  padding: 0.4rem;
  border-radius: 50%;
}

@media (max-width: 968px) {
  .register-container {
    grid-template-columns: 1fr;
  }

  .register-visual {
    display: none;
  }

  .register-card {
    padding: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

