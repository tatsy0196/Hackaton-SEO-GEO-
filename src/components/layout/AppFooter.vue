<!-- filepath: c:\APPS\hackaton\Hackaton-SEO-GEO-\src\components\layout\AppFooter.vue -->
<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3>GreenNoble</h3>
          <p>Votre marketplace locale écoresponsable à Grenoble</p>
        </div>
        
        <div class="footer-column">
          <h4>Navigation</h4>
          <ul>
            <li><RouterLink to="/produits">Produits</RouterLink></li>
            <li><RouterLink to="/vendeurs">Vendeurs</RouterLink></li>
            <li><RouterLink to="/faq">FAQ</RouterLink></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Légal</h4>
          <ul>
            <li><RouterLink to="/mentions-legales">Mentions légales</RouterLink></li>
            <li><a href="#">CGU</a></li>
            <li><a href="#">Politique de confidentialité</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:contact@greennoble.fr">contact@greennoble.fr</a></li>
            <li>15 Rue de la République</li>
            <li>38000 Grenoble</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} GreenNoble. Tous droits réservés.</p>
        <p class="small">Projet pédagogique – M2 IW</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  padding: 3rem 2rem 1.5rem;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-column h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 800;
}

.footer-column h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.footer-column p {
  opacity: 0.9;
  line-height: 1.6;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 0.75rem;
}

.footer-column a {
  color: white;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.footer-column a:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0.8;
  font-size: 0.9rem;
}

.footer-bottom p {
  margin: 0.25rem 0;
}

.small {
  font-size: 0.85rem;
  opacity: 0.7;
}

@media (max-width: 968px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .footer {
    padding: 2rem 1rem 1rem;
  }
}
</style>