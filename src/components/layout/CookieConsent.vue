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

declare global {
  interface Window {
    ppms?: any;
  }
}

const accepted = ref(false)
const rejected = ref(false)

onMounted(() => {
  const consent = localStorage.getItem('gc-consent');
  accepted.value = consent === 'accepted'
  rejected.value = consent === 'rejected'
  
  // Si le consentement a déjà été donné, on informe Piwik au chargement
  if (accepted.value && window.ppms && window.ppms.cm) {
    window.ppms.cm.api('setComplianceSettings', { consents: { analytics: { status: 1 } } });
  } else if (rejected.value && window.ppms && window.ppms.cm) {
    window.ppms.cm.api('setComplianceSettings', { consents: { analytics: { status: 0 } } });
  }
})
const onAccept = () => {
  accepted.value = true
  localStorage.setItem('gc-consent', 'accepted')
  if (window.ppms && window.ppms.cm) {
    window.ppms.cm.api('setComplianceSettings', { consents: { analytics: { status: 1 } } });
  }
}
const onReject = () => {
  rejected.value = true
  localStorage.setItem('gc-consent', 'rejected')
  if (window.ppms && window.ppms.cm) {
    window.ppms.cm.api('setComplianceSettings', { consents: { analytics: { status: 0 } } });
  }
}
</script>
