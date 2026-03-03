<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">GreenCorner Paris</RouterLink>
      <nav class="nav">
        <RouterLink to="/produits">Produits</RouterLink>
        <RouterLink to="/vendeurs">Vendeurs</RouterLink>
        <RouterLink to="/faq">FAQ</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
