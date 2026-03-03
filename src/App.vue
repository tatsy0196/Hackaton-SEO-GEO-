<template>
  <div id="app">
    <AppHeader />
    <main>
      <RouterView />
    </main>
    <AppFooter />
    <CookieConsent />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from "./components/layout/AppFooter.vue";
import CookieConsent from "./components/layout/CookieConsent.vue";
import AppHeader from "./components/layout/AppHeader.vue";
</script>
