<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug as string
</script>

<template>
  <section class="page">
    <h1>Guide : {{ slug }}</h1>
    <article class="content">
      <p>Contenu SEO pour le guide "{{ slug }}".</p>
      <p>Cette page fait partie du cluster sémantique "marketplace locale écoresponsable Paris".</p>
      <p>Optimisée pour les moteurs IA avec structure claire et entités bien définies.</p>
    </article>
  </section>
</template>

<style scoped>
.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem;
}
.content {
  line-height: 1.6;
}
</style>
