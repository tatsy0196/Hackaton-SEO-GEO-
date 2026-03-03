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
