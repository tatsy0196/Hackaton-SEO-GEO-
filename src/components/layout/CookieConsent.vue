<template>
  <div v-if="!accepted && !rejected" class="banner">
    <p>
      Nous utilisons des cookies de mesure d’audience pour améliorer la marketplace.
      Vous pouvez accepter ou refuser.
    </p>
    <div class="actions">
      <button @click="onAccept">Accepter</button>
      <button @click="onReject">Refuser</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

const accepted = ref(false)
const rejected = ref(false)

onMounted(() => {
  accepted.value = localStorage.getItem('gc-consent') === 'accepted'
  rejected.value = localStorage.getItem('gc-consent') === 'rejected'
})
const onAccept = () => {
  accepted.value = true
  localStorage.setItem('gc-consent', 'accepted')
}
const onReject = () => {
  rejected.value = true
  localStorage.setItem('gc-consent', 'rejected')
}
</script>
