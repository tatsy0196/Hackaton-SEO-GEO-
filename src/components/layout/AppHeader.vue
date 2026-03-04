<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        GreenNoble
      </RouterLink>
      <nav class="nav">
        <RouterLink to="/produits" class="nav-link">Produits</RouterLink>
        <RouterLink to="/vendeurs" class="nav-link">Vendeurs</RouterLink>
        <RouterLink to="/faq" class="nav-link">FAQ</RouterLink>
      </nav>
      
      <div class="header-actions">
        <RouterLink to="/panier" class="icon-btn cart-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </RouterLink>

        <RouterLink v-if="user" to="/compte" class="icon-btn user-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </RouterLink>
        
        <RouterLink v-else to="/connexion" class="btn-login">
          Connexion
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '../../services/cart'
import { getCurrentUser, type User } from '../../services/auth'

const { cartCount } = useCart()
const user = ref<User | null>(null)

onMounted(() => {
  user.value = getCurrentUser()
  
  // Écouter les changements d'authentification
  window.addEventListener('storage', () => {
    user.value = getCurrentUser()
  })
})
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3748;
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo svg {
  color: #667eea;
}

.logo:hover {
  color: #667eea;
}

.nav {
  display: flex;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
}

.nav-link.router-link-active {
  color: #667eea;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 3px;
  background: #667eea;
  border-radius: 3px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #4a5568;
  transition: all 0.3s ease;
  text-decoration: none;
}

.icon-btn:hover {
  background: #f7fafc;
  color: #667eea;
}

.cart-btn .badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #f56565;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .header-inner {
    padding: 1rem;
  }

  .nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .btn-login {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
