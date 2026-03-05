<template>
  <section class="hero">
    <div class="hero-inner">
      <h1>GreenNoble Votre marketplace locale écoresponsable à Grenoble</h1>
      <p>
        Découvrez des producteurs et commerces engagés, commandez en ligne
        et choisissez un mode de retrait bas carbone.
      </p>
      <div class="actions">
        <RouterLink to="/produits" class="btn primary">Voir les produits</RouterLink>
        <RouterLink to="/vendeurs" class="btn">Découvrir les vendeurs</RouterLink>
      </div>
    </div>
  </section>

  <!-- Section Valeurs -->
  <section class="values">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">Nos Engagements</span>
        <h2>L'excellence locale au service de votre santé</h2>
        <p class="section-subtitle">Découvrez pourquoi plus de 5000 Grenoblois nous font confiance pour leurs courses écoresponsables</p>
      </div>
      
      <div class="carousel-container">
        <button @click="previousSlide" class="carousel-btn prev" aria-label="Précédent">‹</button>
        <div class="carousel-wrapper">
          <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop" alt="Bio et Local">
              <div class="slide-content">
                <div class="slide-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3>100% Bio & Local</h3>
                <p>Tous nos produits proviennent de producteurs locaux certifiés bio dans un rayon de 50km maximum autour de Grenoble.</p>
              </div>
            </div>
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=500&fit=crop" alt="Livraison Éco">
              <div class="slide-content">
                <div class="slide-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <h3>Livraison Éco-responsable</h3>
                <p>Click & collect, points relais ou livraison à vélo électrique pour réduire notre empreinte carbone à zéro.</p>
              </div>
            </div>
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop" alt="Commerce Équitable">
              <div class="slide-content">
                <div class="slide-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3>Commerce Équitable</h3>
                <p>Prix justes pour les producteurs, transparence totale sur les marges et les origines de chaque produit.</p>
              </div>
            </div>
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&fit=crop" alt="Zéro Déchet">
              <div class="slide-content">
                <div class="slide-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h3>Engagement Zéro Déchet</h3>
                <p>Emballages consignés, vrac privilégié et engagement fort pour éliminer les déchets plastiques.</p>
              </div>
            </div>
          </div>
        </div>
        <button @click="nextSlide" class="carousel-btn next" aria-label="Suivant">›</button>
      </div>
      <div class="carousel-dots">
        <button 
          v-for="(index) in 4"
          :key="index"
          @click="currentSlide = index"
          :class="['dot', { active: currentSlide === index }]"
          :aria-label="`Aller à la slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>

  <!-- Section Comment ça marche -->
  <section class="how-it-works">
    <div class="container">
      <h2>Comment ça marche ?</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Parcourez</h3>
          <p>Découvrez nos produits bio et nos producteurs locaux engagés</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Commandez</h3>
          <p>Ajoutez vos produits favoris au panier et validez votre commande</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Récupérez</h3>
          <p>Choisissez votre mode de retrait : click & collect ou point relais</p>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <h3>Dégustez</h3>
          <p>Savourez des produits frais, de saison et pleins de saveurs</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Section Produits Phares -->
  <section class="featured-products">
    <div class="container">
      <h2>Nos produits phares</h2>
      <p class="subtitle">Découvrez notre sélection de produits les plus populaires</p>
      <div class="products-grid">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
      <div class="cta-center">
        <RouterLink to="/produits" class="btn-large primary">Voir tous les produits</RouterLink>
      </div>
    </div>
  </section>

  <!-- Section Producteurs -->
  <section class="featured-vendors">
    <div class="container">
      <h2>Nos producteurs partenaires</h2>
      <p class="subtitle">Des acteurs locaux engagés pour une alimentation responsable</p>
      <div class="vendors-grid">
        <div v-for="vendor in vendors" :key="vendor.id" class="vendor-card">
          <img :src="vendor.imageUrl" :alt="vendor.name" />
          <div class="vendor-info">
            <h3>{{ vendor.name }}</h3>
            <p>{{ vendor.shortDescription }}</p>
            <div class="labels">
              <span v-for="label in vendor.labels" :key="label" class="label">{{ label }}</span>
            </div>
            <RouterLink :to="`/vendeurs/${vendor.slug}`" class="link">Découvrir →</RouterLink>
          </div>
        </div>
      </div>
      <div class="cta-center">
        <RouterLink to="/vendeurs" class="btn-large">Tous les producteurs</RouterLink>
      </div>
    </div>
  </section>

  <!-- Section Témoignages -->
  <section class="testimonials">
    <div class="container">
      <h2>Ils nous font confiance</h2>
      <div class="testimonials-grid">
        <div class="testimonial">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"Des produits frais et de qualité, livrés rapidement. Je recommande vivement GreenNoble pour faire mes courses locales !"</p>
          <p class="author">— Marie L., Grenoble 11ème</p>
        </div>
        <div class="testimonial">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"Enfin une vraie alternative aux supermarchés ! J'adore soutenir les producteurs locaux tout en mangeant bio."</p>
          <p class="author">— Thomas R., Grenoble 17ème</p>
        </div>
        <div class="testimonial">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"La livraison à vélo est un vrai plus. Je peux faire mes courses en respectant mes valeurs écologiques."</p>
          <p class="author">— Sophie M., Grenoble 20ème</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Section CTA Final -->
  <section class="cta-final">
    <div class="container">
      <h2>Prêt à consommer local et responsable ?</h2>
      <p>Rejoignez notre communauté et soutenez les producteurs de votre région</p>
      <RouterLink to="/produits" class="btn-large primary">Commencer mes achats</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { RouterLink } from 'vue-router'
import ProductCard from '../components/products/ProductCard.vue'
import { getProducts, getVendors } from '../services/api'

const featuredProducts = ref<any[]>([])
const vendors = ref<any[]>([])
const currentSlide = ref(0)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 4
}

const previousSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + 4) % 4
}

onMounted(async () => {
  const allProducts = await getProducts()
  featuredProducts.value = allProducts.slice(0, 3)
  vendors.value = await getVendors()

  useHead({
    title: 'GreenNoble - Marketplace locale écoresponsable à Grenoble',
    meta: [
      {
        name: 'description',
        content: 'Découvrez des producteurs et commerces locaux engagés à Grenoble. Commandez des produits bio, artisanaux et de saison en ligne.'
      },
      {
        name: 'keywords',
        content: 'marketplace locale, produits bio, Grenoble, écoresponsable, producteurs locaux'
      }
    ]
  })
})
</script>

<style scoped>
.hero {
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&h=900&fit=crop');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hero-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn.primary {
  background: #1b5e20;
  color: white;
}

.btn:not(.primary) {
  background: white;
  color: #1b5e20;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Sections communes */
section {
  padding: 4rem 0;
}

section h2 {
  text-align: center;
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
}

/* Section Valeurs */
.values {
  background: linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%);
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.section-header h2 {
  font-size: 2.75rem;
  font-weight: 800;
  color: #1b5e20;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #546e7a;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.carousel-container {
  position: relative;
  max-width: 900px;
  margin: 3rem auto 2rem;
}

.carousel-wrapper {
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  position: relative;
}

.carousel-slide img {
  width: 100%;
  height: 550px;
  object-fit: cover;
  display: block;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(27, 94, 32, 0.95), rgba(27, 94, 32, 0.4));
  color: white;
  padding: 4rem 3rem 3rem;
  text-align: center;
  backdrop-filter: blur(8px);
}

.slide-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.slide-icon svg {
  color: white;
}

.slide-content h3 {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  color: white;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.slide-content p {
  font-size: 1.15rem;
  line-height: 1.7;
  max-width: 650px;
  margin: 0 auto;
  opacity: 0.98;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 2.5rem;
  color: #1b5e20;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  font-weight: 300;
}

.carousel-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.15);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
}

.carousel-btn.prev {
  left: 1.5rem;
}

.carousel-btn.next {
  right: 1.5rem;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #1b5e20;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot.active {
  background: #1b5e20;
  transform: scale(1.3);
}

.dot:hover {
  background: #1b5e20;
  opacity: 0.7;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.value-card h3 {
  color: #1b5e20;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.value-card p {
  color: #666;
  line-height: 1.6;
}

/* Section Comment ça marche */
.how-it-works {
  background: white;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.step {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  background: #1b5e20;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.step h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.step p {
  color: #666;
  line-height: 1.6;
}

/* Section Produits Phares */
.featured-products {
  background: #f8faf9;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Section Producteurs */
.featured-vendors {
  background: white;
}

.vendors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.vendor-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vendor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.vendor-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.vendor-info {
  padding: 1.5rem;
}

.vendor-info h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.vendor-info p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.labels {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.label {
  background: #1b5e20;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.vendor-info .link {
  color: #1b5e20;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  transition: transform 0.2s ease;
}

.vendor-info .link:hover {
  transform: translateX(5px);
}

/* Section Témoignages */
.testimonials {
  background: #f8faf9;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.testimonial {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stars {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.quote {
  color: #444;
  font-style: italic;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.author {
  color: #1b5e20;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Section CTA Final */
.cta-final {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  text-align: center;
  padding: 5rem 0;
}

.cta-final h2 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-final p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

/* Boutons */
.btn-large {
  display: inline-block;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: white;
  color: #1b5e20;
}

.btn-large.primary {
  background: #1b5e20;
  color: white;
}

.btn-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.cta-center {
  text-align: center;
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }

  .hero p {
    font-size: 1rem;
  }

  section h2 {
    font-size: 1.8rem;
  }

  .carousel-slide img {
    height: 350px;
  }

  .slide-content {
    padding: 2rem 1.5rem 1.5rem;
  }

  .slide-content h3 {
    font-size: 1.5rem;
  }

  .slide-content p {
    font-size: 1rem;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .carousel-btn.prev {
    left: 0.5rem;
  }

  .carousel-btn.next {
    right: 0.5rem;
  }

  .values-grid,
  .steps,
  .products-grid,
  .vendors-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .cta-final h2 {
    font-size: 1.8rem;
  }
}
</style>
