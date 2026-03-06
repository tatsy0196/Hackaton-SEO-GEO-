<template>
  <div v-if="isVisible" class="cookie-overlay">
    <div class="cookie-modal" :class="{ 'modal-detailed': showDetails }">
      <div class="cookie-icon" v-if="!showDetails">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </div>
      
      <div class="cookie-content">
        <h3>Respect de votre vie privée</h3>
        
        <div v-if="!showDetails" class="summary-text">
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur notre marketplace écoresponsable,
            mémoriser vos préférences et réaliser des statistiques de visites.
          </p>
        </div>

        <div v-else class="detailed-options">
          <div class="cookie-option">
            <div class="option-info">
              <h4>Cookies essentiels</h4>
              <p>Nécessaires au fonctionnement du site (panier, authentification). Ils ne peuvent pas être désactivés.</p>
            </div>
            <div class="option-toggle">
              <input type="checkbox" checked disabled id="essential-cookies">
              <label for="essential-cookies" class="toggle-slider"></label>
            </div>
          </div>

          <div class="cookie-option">
            <div class="option-info">
              <h4>Cookies analytiques</h4>
              <p>Pour comprendre comment vous utilisez notre site (utilisation des outils PIWIK Pro et Ahrefs).</p>
            </div>
            <div class="option-toggle">
              <input type="checkbox" v-model="consents.analytics" id="analytics-cookies">
              <label for="analytics-cookies" class="toggle-slider"></label>
            </div>
          </div>

          <div class="cookie-option">
            <div class="option-info">
              <h4>Cookies de préférence</h4>
              <p>Pour mémoriser vos choix et préférences afin de faciliter votre navigation.</p>
            </div>
            <div class="option-toggle">
              <input type="checkbox" v-model="consents.preference" id="preference-cookies">
              <label for="preference-cookies" class="toggle-slider"></label>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <template v-if="!showDetails">
          <button class="btn-reject" @click="onReject">Tout refuser</button>
          <button class="btn-customize" @click="toggleDetails">Personnaliser</button>
          <button class="btn-accept" @click="onAccept">Tout accepter</button>
        </template>
        <template v-else>
          <button class="btn-back" @click="toggleDetails">Retour</button>
          <button class="btn-save" @click="onSave">Enregistrer mes choix</button>
        </template>
      </div>
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

const isVisible = ref(false)
const showDetails = ref(false)

const consents = ref({
  analytics: true,
  preference: true
})

const applyConsent = (settings: { analytics: boolean; preference: boolean }) => {
  if (!window.ppms?.cm?.api) {
    // Réessayer si Piwik n'est pas encore prêt
    setTimeout(() => applyConsent(settings), 300);
    return;
  }
  
  // 1. Initialiser les réglages de conformité
  window.ppms.cm.api(
    'setInitialComplianceSettings',
    { consents: ['analytics', 'personalization'] }
  );

  // 2. Appliquer le statut du consentement
  window.ppms.cm.api(
    'setComplianceSettings',
    { 
      consents: { 
        analytics: { status: settings.analytics ? 1 : 0 },
        personalization: { status: settings.preference ? 1 : 0 }
      } 
    }
  );
}

onMounted(() => {
  const consentStr = localStorage.getItem('gc-consent');
  if (consentStr) {
    try {
      const stored = JSON.parse(consentStr);
      consents.value = stored;
      isVisible.value = false;
      applyConsent(stored);
    } catch (e) {
      // Compatibilité avec l'ancien format
      if (consentStr === 'accepted') {
        consents.value = { analytics: true, preference: true };
        isVisible.value = false;
        applyConsent(consents.value);
      } else if (consentStr === 'rejected') {
        consents.value = { analytics: false, preference: false };
        isVisible.value = false;
        applyConsent(consents.value);
      } else {
        isVisible.value = true;
      }
    }
  } else {
    isVisible.value = true;
  }
})

const onAccept = () => {
  consents.value = { analytics: true, preference: true }
  saveAndApply();
}

const onReject = () => {
  consents.value = { analytics: false, preference: false }
  saveAndApply();
}

const onSave = () => {
  saveAndApply();
}

const saveAndApply = () => {
  isVisible.value = false
  localStorage.setItem('gc-consent', JSON.stringify(consents.value))
  applyConsent(consents.value);
}

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}
</script>

<style scoped>
.cookie-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.cookie-modal {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: calc(100% - 2rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: modal-appear 0.4s ease-out;
  transition: all 0.3s ease;
  position: relative;
  margin: 1rem auto;
}

.modal-detailed {
  max-width: 700px;
  text-align: left;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.cookie-icon {
  width: 70px;
  height: 70px;
  background: #E8F5E9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #2E7D32;
}

.cookie-content h3 {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 1rem;
  font-weight: 700;
}

.cookie-content p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.detailed-options {
  margin-bottom: 2rem;
  text-align: left;
}

.cookie-option {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 0;
  border-bottom: 1px solid #edf2f7;
  gap: 1.5rem;
}

.cookie-option:last-child {
  border-bottom: none;
}

.option-info h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.option-info p {
  font-size: 0.9rem;
  margin-bottom: 0;
  color: #718096;
}

/* Toggle Switch Styles */
.option-toggle {
  position: relative;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
}

.option-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #2E7D32;
}

input:focus + .toggle-slider {
  box-shadow: 0 0 1px #2E7D32;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

input:disabled + .toggle-slider {
  background-color: #e2e8f0;
  cursor: not-allowed;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

button {
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-accept, .btn-save {
  background: #2E7D32;
  color: white;
}

.btn-accept:hover, .btn-save:hover {
  background: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.btn-reject, .btn-back {
  background: #f1f5f9;
  color: #64748b;
}

.btn-reject:hover, .btn-back:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.btn-customize {
  background: #e8f5e9;
  color: #2E7D32;
}

.btn-customize:hover {
  background: #c8e6c9;
}

@media (max-width: 640px) {
  .cookie-modal {
    padding: 1.5rem;
    border-radius: 16px;
    width: calc(100% - 2rem);
    margin: 0.5rem 2rem;
  }

  .cookie-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }

  .cookie-content h3 {
    font-size: 1.3rem;
  }

  .cookie-content p {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .actions {
    gap: 0.5rem;
  }

  button {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
}

@media (min-width: 640px) {
  .actions {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }

  button {
    flex: 1;
  }
}
</style>
