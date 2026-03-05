<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { login, type LoginData } from '../services/auth'

const router = useRouter()

const formData = ref<LoginData>({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await login(formData.value)
    
    if (result.success) {
      router.push('/compte')
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
        <!-- Logo / Header -->
        <div class="login-header">
          <div class="logo-circle">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1>Connexion</h1>
          <p>Bienvenue sur GreenNoble</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="error" class="error-message">
            {{ error }}
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
                autocomplete="current-password"
              />
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Se connecter</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="login-footer">
          <p>Pas encore de compte ?</p>
          <RouterLink to="/inscription" class="link-register">
            Créer un compte
          </RouterLink>
        </div>
      </div>

      <!-- Image décorative -->
      <div class="login-visual">
        <div class="visual-content">
          <h2>Produits locaux<br/>& écoresponsables</h2>
          <p>Découvrez les meilleurs producteurs de votre région</p>
          <div class="visual-features">
            <div class="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>100% bio et local</span>
            </div>
            <div class="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Livraison rapide</span>
            </div>
            <div class="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Producteurs vérifiés</span>
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
  background-image: url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070');
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
  background: rgba(0, 0, 0, 0.3);
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
  justify-content: center;
  background: white;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #718096;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #c33;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
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
  margin-top: 1rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
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

.login-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #718096;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.link-register {
  color: #2E7D32;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-register:hover {
  color: #43A047;
  text-decoration: underline;
}

.login-visual {
  background: transparent;
  backdrop-filter: blur(10px);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-visual::before {
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

.visual-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: white;
}

.visual-content > p {
  font-size: 1.1rem;
  opacity: 0.98;
  margin-bottom: 2.5rem;
  color: white;
}

.visual-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  color: white;
}

.feature svg {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.3);
  padding: 0.5rem;
  border-radius: 50%;
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
