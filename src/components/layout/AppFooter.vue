<template>
  <footer class="footer">
    <div class="footer-inner">
      <p>© {{ year }} GreenNoble – Marketplace locale écoresponsable</p>
      <p class="small">Projet pédagogique – M2 IW</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
