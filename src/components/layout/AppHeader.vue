<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        GreenNoble
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="nav desktop-nav">
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

        <RouterLink v-if="user" to="/compte" class="icon-btn user-btn desktop-only">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </RouterLink>

        <RouterLink v-else to="/connexion" class="btn-login desktop-only">
          Connexion
        </RouterLink>

        <!-- Hamburger button — mobile only -->
        <button class="hamburger mobile-only" @click="openMenu" :aria-expanded="menuOpen" aria-label="Ouvrir le menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="menuOpen" class="overlay" @click="closeMenu"></div>
  </Transition>

  <!-- Mobile drawer -->
  <Transition name="slide">
    <aside v-if="menuOpen" class="drawer" role="dialog" aria-modal="true" aria-label="Menu navigation">
      <div class="drawer-header">
        <RouterLink to="/" class="logo" @click="closeMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          GreenNoble
        </RouterLink>
        <button class="close-btn" @click="closeMenu" aria-label="Fermer le menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="drawer-nav">
        <RouterLink to="/produits" class="drawer-link" @click="closeMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2"></rect>
            <path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2"></path>
          </svg>
          Produits
        </RouterLink>
        <RouterLink to="/vendeurs" class="drawer-link" @click="closeMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Vendeurs
        </RouterLink>
        <RouterLink to="/faq" class="drawer-link" @click="closeMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          FAQ
        </RouterLink>
      </nav>

      <div class="drawer-footer">
        <RouterLink v-if="user" to="/compte" class="drawer-account-btn" @click="closeMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Mon compte
        </RouterLink>
        <RouterLink v-else to="/connexion" class="btn-login drawer-login" @click="closeMenu">
          Connexion
        </RouterLink>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '../../services/cart'
import { getCurrentUser, type User } from '../../services/auth'

const { cartCount } = useCart()
const user = ref<User | null>(null)
const menuOpen = ref(false)

function openMenu() {
  menuOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMenu()
}

onMounted(() => {
  user.value = getCurrentUser()
  window.addEventListener('storage', () => {
    user.value = getCurrentUser()
  })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ─── Header ─────────────────────────────────────────────── */
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

/* ─── Logo ───────────────────────────────────────────────── */
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

/* ─── Desktop nav ────────────────────────────────────────── */
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

/* ─── Header actions ─────────────────────────────────────── */
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

/* ─── Hamburger ──────────────────────────────────────────── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 10px;
  padding: 0;
  transition: background 0.2s;
}

.hamburger:hover {
  background: #f7fafc;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #4a5568;
  border-radius: 2px;
  transition: background 0.2s;
}

.hamburger:hover span {
  background: #667eea;
}

/* ─── Overlay ────────────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  backdrop-filter: blur(2px);
}

/* ─── Drawer ─────────────────────────────────────────────── */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: white;
  z-index: 300;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f7fafc;
  color: #667eea;
}

/* ─── Drawer nav ─────────────────────────────────────────── */
.drawer-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  gap: 0.25rem;
  overflow-y: auto;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: #4a5568;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.drawer-link svg {
  flex-shrink: 0;
  color: #a0aec0;
  transition: color 0.2s;
}

.drawer-link:hover,
.drawer-link.router-link-active {
  background: #f0f4ff;
  color: #667eea;
}

.drawer-link:hover svg,
.drawer-link.router-link-active svg {
  color: #667eea;
}

/* ─── Drawer footer ──────────────────────────────────────── */
.drawer-footer {
  padding: 1rem 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
}

.drawer-account-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: #4a5568;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 100%;
}

.drawer-account-btn:hover {
  background: #f0f4ff;
  color: #667eea;
}

.drawer-login {
  display: block;
  text-align: center;
  width: 100%;
  padding: 0.875rem;
  box-sizing: border-box;
}

/* ─── Transitions ────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* ─── Responsive ─────────────────────────────────────────── */
.mobile-only { display: none; }

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .desktop-nav  { display: none !important; }
  .mobile-only  { display: flex; }

  .header-inner {
    padding: 0.875rem 1rem;
    gap: 0;
  }

  .logo {
    font-size: 1.25rem;
  }

  .hamburger {
    display: flex;
  }
}
</style>