<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'

onMounted(() => {
  useHead({
    title: 'FAQ - Questions fréquemment posées - GreenNoble',
    meta: [
      {
        name: 'description',
        content: 'Trouvez les réponses à vos questions sur GreenNoble, marketplace locale écoresponsable à Paris.'
      },
      {
        name: 'keywords',
        content: 'FAQ, questions, marketplace locale, Paris, écoresponsable'
      }
    ]
  })
})
</script>

<template>
  <section class="page">
    <h1>FAQ – Acheter local et écoresponsable à Paris</h1>

    <div class="faq">
      <details>
        <summary>Qu'est-ce que GreenNoble ?</summary>
        <p>Une marketplace qui met en relation les consommateurs parisiens avec des producteurs et commerces locaux écoresponsables.</p>
      </details>

      <details>
        <summary>Comment fonctionne la livraison ?</summary>
        <p>Click & collect, points relais, ou livraison vélo dans Paris et petite couronne.</p>
      </details>

      <details>
        <summary>Comment sont sélectionnés les vendeurs ?</summary>
        <p>Charte écoresponsable stricte : bio, circuit court, zéro déchet, engagements sociaux.</p>
      </details>

      <details>
        <summary>Comment annuler une commande ?</summary>
        <p>Contactez le vendeur directement via la plateforme avant la date de retrait.</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem;
}
.faq details {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.75rem;
}
details[open] summary {
  border-bottom: 1px solid #eee;
}
</style>
