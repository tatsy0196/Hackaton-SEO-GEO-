<template>
  <section class="hero">
    <div class="hero-inner">
      <h1>Votre marketplace locale écoresponsable à Paris</h1>
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
      <h2>Pourquoi choisir GreenNoble ?</h2>
      <div class="carousel-container">
        <button @click="previousSlide" class="carousel-btn prev" aria-label="Précédent">‹</button>
        <div class="carousel-wrapper">
          <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop" alt="Bio et Local">
              <div class="slide-content">
                <h3>100% Bio & Local</h3>
                <p>Tous nos produits proviennent de producteurs locaux certifiés bio dans un rayon de 50km maximum.</p>
              </div>
            </div>
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=500&fit=crop" alt="Livraison Éco">
              <div class="slide-content">
                <h3>Livraison Éco</h3>
                <p>Click & collect, points relais ou livraison à vélo pour réduire notre empreinte carbone.</p>
              </div>
            </div>
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop" alt="Commerce Équitable">
              <div class="slide-content">
                <h3>Commerce Équitable</h3>
                <p>Prix justes pour les producteurs, transparence totale sur les marges et les origines.</p>
              </div>
            </div>
            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&fit=crop" alt="Zéro Déchet">
              <div class="slide-content">
                <h3>Zéro Déchet</h3>
                <p>Emballages consignés, vrac privilégié et engagement pour réduire les déchets plastiques.</p>
              </div>
            </div>
          </div>
        </div>
        <button @click="nextSlide" class="carousel-btn next" aria-label="Suivant">›</button>
      </div>
      <div class="carousel-dots">
        <button 
          v-for="(slide, index) in 4" 
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
          <p class="author">— Marie L., Paris 11ème</p>
        </div>
        <div class="testimonial">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"Enfin une vraie alternative aux supermarchés ! J'adore soutenir les producteurs locaux tout en mangeant bio."</p>
          <p class="author">— Thomas R., Paris 17ème</p>
        </div>
        <div class="testimonial">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"La livraison à vélo est un vrai plus. Je peux faire mes courses en respectant mes valeurs écologiques."</p>
          <p class="author">— Sophie M., Paris 20ème</p>
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
    title: 'GreenNoble - Marketplace locale écoresponsable à Paris',
    meta: [
      {
        name: 'description',
        content: 'Découvrez des producteurs et commerces locaux engagés à Paris. Commandez des produits bio, artisanaux et de saison en ligne.'
      },
      {
        name: 'keywords',
        content: 'marketplace locale, produits bio, Paris, écoresponsable, producteurs locaux'
      }
    ]
  })
})
</script>

<style scoped>
.hero {
  position: relative;
  background-image: url('../assets/anne-preble-SAPvKo12dQE-unsplash.jpg');
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
  background: #f8faf9;
}

.carousel-container {
  position: relative;
  max-width: 900px;
  margin: 3rem auto 2rem;
}

.carousel-wrapper {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  position: relative;
}

.carousel-slide img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
  color: white;
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.slide-content h3 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: white;
}

.slide-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.95;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 2rem;
  color: #1b5e20;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.carousel-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 1rem;
}

.carousel-btn.next {
  right: 1rem;
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
