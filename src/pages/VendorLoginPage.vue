<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { loginVendor, type VendorLoginData } from '../services/vendorAuth'

const router = useRouter()

const formData = ref<VendorLoginData>({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await loginVendor(formData.value)
    
    if (result.success) {
      router.push('/vendeur/dashboard')
    } else {
      error.value = result.error || 'Erreur de connexion'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7h-9M14 17H5M17 12H3M12 2L2 7l10 5 10-5-10-5z"/>
            </svg>
          </div>
          <h1>Espace Vendeur</h1>
          <p>Connectez-vous pour gérer votre boutique</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="form-group">
            <label for="email">Email professionnel</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                placeholder="vendeur@exemple.com"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading">Se connecter</span>
            <span v-else class="spinner"></span>
          </button>
        </form>

        <div class="login-footer">
          <p>
            Pas encore inscrit ?
            <RouterLink to="/vendeur/inscription" class="link-register">Créer un compte vendeur</RouterLink>
          </p>
          <RouterLink to="/connexion" class="link-customer">Vous êtes client ?</RouterLink>
        </div>
      </div>

      <div class="login-visual">
        <div class="visual-content">
          <h2>Vendez vos produits locaux</h2>
          <p>Rejoignez GreenNoble et développez votre activité auprès de clients engagés</p>
          
          <div class="visual-features">
            <div class="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Gestion simplifiée de votre boutique</span>
            </div>
            <div class="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Accédez à une clientèle locale engagée</span>
            </div>
            <div class="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>Commission transparente et équitable</span>
            </div>
            <div class="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <span>Statistiques en temps réel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem;
  position: relative;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: transparent;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.login-card {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  background: white;
  gap: 2rem;
}

.login-header {
  text-align: center;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
}

.login-header h1 {
  font-size: 2rem;
  color: #1a202c;
  margin: 0 0 0.5rem;
}

.login-header p {
  color: #64748b;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #1a202c;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #43A047;
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
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

.login-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-footer p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.link-register,
.link-customer {
  color: #2E7D32;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-register:hover,
.link-customer:hover {
  color: #43A047;
  text-decoration: underline;
}

.login-visual {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.95) 0%, rgba(67, 160, 71, 0.95) 100%);
  padding: 3rem;
  display: flex;
  align-items: center;
  position: relative;
  backdrop-filter: blur(20px);
}

.login-visual::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(46, 125, 50, 0.25);
  backdrop-filter: blur(10px);
  z-index: 0;
}

.visual-content {
  position: relative;
  z-index: 1;
  color: white;
}

.visual-content h2 {
  font-size: 2rem;
  margin: 0 0 1rem;
  font-weight: 700;
  line-height: 1.2;
}

.visual-content > p {
  font-size: 1.1rem;
  margin: 0 0 2.5rem;
  opacity: 0.95;
}

.visual-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.25rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature svg {
  flex-shrink: 0;
  margin-top: 2px;
  stroke-width: 2.5;
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-visual {
    display: none;
  }

  .login-card {
    padding: 2rem;
  }

  .login-header h1 {
    font-size: 1.75rem;
  }
}
</style>
