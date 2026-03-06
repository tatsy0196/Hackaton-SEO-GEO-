<!-- filepath: c:\APPS\hackaton\Hackaton-SEO-GEO-\src\pages\LegalPage.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'

onMounted(() => {
  useHead({
    title: 'Mentions Légales - GreenNoble',
    meta: [
      {
        name: 'description',
        content: 'Mentions légales de GreenNoble, marketplace locale écoresponsable à Grenoble.'
      }
    ]
  })
})
</script>

<template>
  <div class="legal-page">
    <div class="legal-container">
      <div class="page-header">
        <h1>Mentions Légales</h1>
        <p class="updated">Dernière mise à jour : {{ new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
      </div>

      <div class="legal-content">
        <!-- Éditeur du site -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>1. Éditeur du site</h2>
          <div class="section-content">
            <p><strong>Raison sociale :</strong> GreenNoble SAS</p>
            <p><strong>Forme juridique :</strong> Société par Actions Simplifiée</p>
            <p><strong>Capital social :</strong> 50 000 €</p>
            <p><strong>Siège social :</strong> 15 Rue de la République, 38000 Grenoble, France</p>
            <p><strong>SIRET :</strong> 123 456 789 00012</p>
            <p><strong>RCS :</strong> Grenoble B 123 456 789</p>
            <p><strong>TVA intracommunautaire :</strong> FR 12 123456789</p>
            <p><strong>Email :</strong> <a href="mailto:contact@greennoble.fr">contact@greennoble.fr</a></p>
            <p><strong>Téléphone :</strong> +33 4 76 XX XX XX</p>
            <p><strong>Directeur de la publication :</strong> Jean Dupont, Président</p>
          </div>
        </section>

        <!-- Hébergement -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
          </div>
          <h2>2. Hébergement</h2>
          <div class="section-content">
            <p><strong>Hébergeur :</strong> O2switch</p>
            <p><strong>Adresse :</strong> Chemin des Pardiaux, 63000 Clermont-Ferrand, France</p>
            <p><strong>Site web :</strong> <a href="https://www.o2switch.fr" target="_blank" rel="noopener">https://www.o2switch.fr</a></p>
          </div>
        </section>

        <!-- Propriété intellectuelle -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4M12 8h.01"></path>
            </svg>
          </div>
          <h2>3. Propriété intellectuelle</h2>
          <div class="section-content">
            <p>L'ensemble du contenu présent sur le site GreenNoble (textes, images, logos, graphismes, vidéos, icônes, sons) est la propriété exclusive de GreenNoble SAS ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
            <p>Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de GreenNoble SAS.</p>
            <p>Les marques, logos, graphismes et icônes reproduits sur le site GreenNoble sont des marques déposées. Toute reproduction totale ou partielle de ces marques sans autorisation préalable et écrite de GreenNoble SAS est strictement interdite.</p>
          </div>
        </section>

        <!-- Protection des données -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2>4. Protection des données personnelles</h2>
          <div class="section-content">
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.</p>
            
            <h3>4.1 Responsable du traitement</h3>
            <p>Le responsable du traitement des données est GreenNoble SAS, représentée par son Président, Jean Dupont.</p>
            
            <h3>4.2 Données collectées</h3>
            <p>Nous collectons les données suivantes :</p>
            <ul>
              <li>Données d'identification : nom, prénom, email, téléphone</li>
              <li>Données de connexion : adresse IP, logs de connexion</li>
              <li>Données de commande : historique d'achats, préférences</li>
              <li>Données de navigation : cookies, pages visitées</li>
            </ul>
            
            <h3>4.3 Finalités du traitement</h3>
            <p>Vos données sont collectées pour :</p>
            <ul>
              <li>La gestion de votre compte client</li>
              <li>Le traitement de vos commandes</li>
              <li>L'amélioration de nos services</li>
              <li>L'envoi de communications marketing (avec votre consentement)</li>
              <li>La prévention de la fraude</li>
            </ul>
            
            <h3>4.4 Vos droits</h3>
            <p>Vous pouvez exercer vos droits en nous contactant à l'adresse : <a href="mailto:privacy@greennoble.fr">privacy@greennoble.fr</a></p>
            <p>Vous disposez également du droit d'introduire une réclamation auprès de la CNIL.</p>
          </div>
        </section>

        <!-- Cookies -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h2>5. Cookies</h2>
          <div class="section-content">
            <p>Le site GreenNoble utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visites.</p>
            
            <h3>5.1 Types de cookies utilisés</h3>
            <ul>
              <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (panier, authentification)</li>
              <li><strong>Cookies analytiques :</strong> Pour comprendre comment vous utilisez notre site (utilisation des outils PIWIK Pro et Ahrefs)</li>
              <li><strong>Cookies de préférence :</strong> Pour mémoriser vos choix et préférences</li>
            </ul>
            
            <h3>5.2 Gestion des cookies</h3>
            <p>Vous pouvez à tout moment désactiver les cookies depuis les paramètres de votre navigateur. Toutefois, certaines fonctionnalités du site pourraient ne plus être accessibles.</p>
          </div>
        </section>

        <!-- Responsabilité -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h2>6. Limitation de responsabilité</h2>
          <div class="section-content">
            <p>GreenNoble SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, GreenNoble SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.</p>
            <p>GreenNoble SAS ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.</p>
            <p>GreenNoble SAS se réserve le droit de modifier ou de corriger le contenu de ce site à tout moment et sans préavis.</p>
          </div>
        </section>

        <!-- Liens hypertextes -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <h2>7. Liens hypertextes</h2>
          <div class="section-content">
            <p>Le site GreenNoble peut contenir des liens hypertextes vers d'autres sites. GreenNoble SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
            <p>La création de liens hypertextes vers le site GreenNoble nécessite une autorisation préalable écrite de GreenNoble SAS.</p>
          </div>
        </section>

        <!-- Droit applicable -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h2>8. Droit applicable et juridiction</h2>
          <div class="section-content">
            <p>Les présentes mentions légales sont régies par le droit français.</p>
            <p>En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux compétents de Grenoble, France.</p>
          </div>
        </section>

        <!-- Médiation de la consommation -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
          </div>
          <h2>9. Médiation de la consommation</h2>
          <div class="section-content">
            <p>Conformément aux articles L.612-1 et suivants du Code de la consommation, en cas de litige, vous avez le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige qui vous opposerait à GreenNoble SAS.</p>
            <p>Vous pouvez contacter le médiateur désigné par GreenNoble SAS :</p>
            <p><strong>Médiateur :</strong> MCP Médiation</p>
            <p><strong>Adresse :</strong> 12 square Desnouettes, 75015 Paris, France</p>
            <p><strong>Site web :</strong> <a href="https://mcpmediation.org" target="_blank" rel="noopener">https://mcpmediation.org</a></p>
          </div>
        </section>

        <!-- Règlement en Ligne des Litiges -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h2>10. Règlement en Ligne des Litiges (RLL)</h2>
          <div class="section-content">
            <p>La Commission Européenne met à disposition une plateforme de règlement en ligne des litiges (RLL) pour les consommateurs et les professionnels de l'Union Européenne.</p>
            <p>Vous pouvez y accéder via le lien suivant : <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">Plateforme RLL de la Commission Européenne</a></p>
          </div>
        </section>

        <!-- Fonctionnement Marketplace -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2>11. Modalités de référencement, classement et déréférencement</h2>
          <div class="section-content">
            <p>En tant qu'opérateur de plateforme en ligne, GreenNoble SAS met en relation des vendeurs tiers (producteurs locaux) avec des acheteurs.</p>
            
            <h3>11.1 Référencement des vendeurs</h3>
            <p>Les vendeurs sont sélectionnés selon des critères stricts de proximité géographique (Isère et départements limitrophes) et de pratiques écoresponsables (agriculture biologique, circuits courts, réduction des emballages).</p>
            
            <h3>11.2 Classement des offres</h3>
            <p>Par défaut, les offres sur la marketplace sont classées selon les critères suivants :</p>
            <ul>
              <li><strong>Pertinence :</strong> Adéquation entre la recherche et les caractéristiques du produit.</li>
              <li><strong>Proximité :</strong> Distance géographique entre le vendeur et l'acheteur (pour favoriser le circuit court).</li>
              <li><strong>Nouveauté :</strong> Mise en avant des produits saisonniers et nouveaux arrivants.</li>
            </ul>
            
            <h3>11.3 Déréférencement</h3>
            <p>GreenNoble SAS se réserve le droit de déréférencer un vendeur ou une offre en cas de non-respect de la charte de qualité GreenNoble, de manquements graves aux obligations contractuelles ou de signalements répétés d'acheteurs restés sans réponse.</p>
          </div>
        </section>

        <!-- Avis en ligne -->
        <section class="legal-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M12 7l1.5 3 3.5.5-2.5 2.5 1 3.5-3.5-2-3.5 2 1-3.5L7 10.5l3.5-.5z"></path>
            </svg>
          </div>
          <h2>12. Gestion des avis en ligne</h2>
          <div class="section-content">
            <p>Les avis publiés sur GreenNoble permettent aux clients de partager leur expérience. Voici les modalités de contrôle :</p>
            <ul>
              <li><strong>Authenticité :</strong> Seuls les clients ayant effectivement acheté un produit peuvent laisser un avis (avis vérifiés).</li>
              <li><strong>Contrôle :</strong> Les avis font l'objet d'une modération a posteriori pour éviter tout contenu illicite, insultant ou inapproprié.</li>
              <li><strong>Délai :</strong> Les avis sont publiés sans délai après modération.</li>
              <li><strong>Contrepartie :</strong> Aucune contrepartie n'est fournie en échange du dépôt d'un avis.</li>
            </ul>
          </div>
        </section>

        <!-- Contact -->
        <section class="legal-section contact-section">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h2>13. Contact</h2>
          <div class="section-content">
            <p>Pour toute question concernant ces mentions légales, vous pouvez nous contacter :</p>
            <div class="contact-methods">
              <div class="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:contact@greennoble.fr">contact@greennoble.fr</a>
              </div>
              <div class="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+33 4 76 XX XX XX</span>
              </div>
              <div class="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>15 Rue de la République, 38000 Grenoble</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem 1.5rem;
}

.legal-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid #2E7D32;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.updated {
  color: #64748b;
  font-size: 0.95rem;
  font-style: italic;
}

.legal-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.legal-section {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.legal-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(180deg, #2E7D32 0%, #43A047 100%);
}

.legal-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.section-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2E7D32 0%, #43A047 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.legal-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.section-content {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1rem;
}

.section-content p {
  margin-bottom: 1rem;
}

.section-content p:last-child {
  margin-bottom: 0;
}

.section-content strong {
  color: #2d3748;
  font-weight: 700;
}

.section-content a {
  color: #2E7D32;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.section-content a:hover {
  color: #1b5e20;
  border-bottom-color: #2E7D32;
}

.section-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2E7D32;
  margin: 1.75rem 0 1rem;
}

.section-content ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.section-content li {
  margin-bottom: 0.75rem;
  position: relative;
}

.section-content li::marker {
  color: #2E7D32;
  font-weight: 700;
}

.contact-section {
  background: linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%);
  border: 2px solid #c8e6c9;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.contact-item:hover {
  border-color: #2E7D32;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
}

.contact-item svg {
  color: #2E7D32;
  flex-shrink: 0;
}

.contact-item a {
  color: #2E7D32;
  text-decoration: none;
  font-weight: 600;
  border: none;
}

.contact-item span {
  color: #4a5568;
  font-weight: 500;
}

@media (max-width: 768px) {
  .legal-page {
    padding: 2rem 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .legal-section {
    padding: 1.75rem;
  }

  .legal-section h2 {
    font-size: 1.4rem;
  }

  .section-content {
    font-size: 0.95rem;
  }

  .section-icon {
    width: 50px;
    height: 50px;
  }
}
</style>