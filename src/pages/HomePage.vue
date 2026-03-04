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
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
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
</style>
