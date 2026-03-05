# 🏪 Système Vendeur - GreenNoble

## Vue d'ensemble

Système complet de gestion pour les vendeurs avec inscription, connexion et tableau de bord professionnel.

## 🎯 Fonctionnalités

### Authentification Vendeur
- ✅ **Inscription vendeur** (`/vendeur/inscription`)
  - Formulaire multi-sections (entreprise, contact, adresse, sécurité)
  - Sélection de labels/certifications (Bio, Circuit court, Zéro déchet, etc.)
  - Validation complète des données
  - Design glassmorphism moderne

- ✅ **Connexion vendeur** (`/vendeur/connexion`)
  - Formulaire simple et épuré
  - Gestion de session avec localStorage
  - Redirection automatique vers le dashboard

### Dashboard Vendeur
- ✅ **Tableau de bord** (`/vendeur/dashboard`)
  - **Statistiques en temps réel**:
    - Nombre total de produits
    - Produits en stock
    - Produits en rupture
    - Prix moyen
  
  - **Gestion complète des produits**:
    - Ajouter un nouveau produit
    - Modifier un produit existant
    - Supprimer un produit
    - Visualisation en grille moderne

  - **Formulaire produit avancé**:
    - Informations générales (nom, catégorie, description)
    - Prix et stock
    - Détails (poids, origine, composition, conservation)
    - Certifications (Bio, AOC, Label Rouge, etc.)
    - Images (URL)

## 📁 Structure des fichiers

```
src/
├── pages/
│   ├── VendorLoginPage.vue          # Page de connexion vendeur
│   ├── VendorRegisterPage.vue       # Page d'inscription vendeur
│   └── VendorDashboardPage.vue      # Dashboard de gestion
├── services/
│   ├── vendorAuth.ts                # Service d'authentification vendeur
│   └── vendorProducts.ts            # Service de gestion des produits
└── router/
    └── index.ts                      # Routes vendeur ajoutées
```

## 🔐 Services

### vendorAuth.ts
```typescript
// Interfaces
interface Vendor {
  id: string
  email: string
  businessName: string
  firstName: string
  lastName: string
  phone: string
  address: string
  postalCode: string
  city: string
  description?: string
  labels: string[]
  imageUrl?: string
  siret?: string
  createdAt: string
}

// Fonctions principales
- registerVendor(data): Promise<{ success, vendor?, error? }>
- loginVendor(data): Promise<{ success, vendor?, error? }>
- logoutVendor(): void
- getCurrentVendor(): Vendor | null
- isVendorAuthenticated(): boolean
- updateVendorProfile(updates): Promise<{ success, vendor?, error? }>
```

### vendorProducts.ts
```typescript
// Interface
interface VendorProduct {
  id: string
  vendorId: string
  name: string
  slug: string
  price: number
  discountPrice?: number
  category: string
  city: string
  shortDescription: string
  longDescription: string
  imageUrl: string
  images: string[]
  weight: string
  origin: string
  composition: string
  conservation: string
  nutritionalInfo: string
  certifications: string[]
  stock: number
  createdAt: string
  updatedAt: string
}

// Fonctions principales
- getVendorProducts(vendorId): VendorProduct[]
- addProduct(vendorId, productData): VendorProduct
- updateProduct(productId, updates): VendorProduct | null
- deleteProduct(productId): boolean
- getProductById(productId): VendorProduct | null
```

## 🎨 Design

### Palette de couleurs
- **Vert principal**: `#2E7D32` → `#43A047` (gradient)
- **Cartes blanches**: Fond blanc avec ombres légères
- **Accents**: Bleu (`#0284c7`), Orange (`#f57c00`), Violet (`#7b1fa2`)

### Composants UI

#### Stats Cards
- Icônes colorées avec gradients
- Valeurs en grand format
- Labels descriptifs
- Animation hover (translateY)

#### Product Cards
- Image avec overlay
- Badges de stock (rupture/stock faible)
- Prix avec ancien prix barré
- Actions: Modifier / Supprimer

#### Modal Formulaire
- Modal plein écran avec overlay backdrop-blur
- Formulaire multi-colonnes responsive
- Boutons de certification interactifs
- Validation en temps réel

## 🚀 Utilisation

### Pour les vendeurs

1. **Inscription**
   ```
   Accéder à /vendeur/inscription
   → Remplir le formulaire complet
   → Sélectionner au moins un label
   → Créer le compte
   → Redirection automatique vers le dashboard
   ```

2. **Connexion**
   ```
   Accéder à /vendeur/connexion
   → Entrer email et mot de passe
   → Se connecter
   → Accès au dashboard
   ```

3. **Gérer les produits**
   ```
   Dashboard → Ajouter un produit
   → Remplir le formulaire
   → Sélectionner catégorie et certifications
   → Définir prix et stock
   → Créer le produit
   ```

4. **Modifier/Supprimer**
   ```
   Cliquer sur "Modifier" sur une carte produit
   → Modifier les informations
   → Enregistrer
   
   OU
   
   Cliquer sur "Supprimer"
   → Confirmer la suppression
   ```

## 🔒 Sécurité

- ✅ Authentification avec vérification email/password
- ✅ Protection des routes (redirection si non authentifié)
- ✅ Validation côté client
- ✅ Stockage sécurisé dans localStorage
- ⚠️ **Note**: En production, utiliser une vraie API backend avec JWT

## 📊 Stockage des données

### localStorage Keys
- `greennoble_vendor`: Vendeur connecté
- `greennoble_vendors`: Liste des vendeurs (email → {password, vendor})
- `greennoble_vendor_products`: Liste de tous les produits vendeurs

### Structure de données
```javascript
// Vendeur connecté
{
  id: "vendor_1234567890",
  email: "ferme@exemple.fr",
  businessName: "Ferme des Batignolles",
  ...
}

// Produit
{
  id: "p_1234567890_abc123",
  vendorId: "vendor_1234567890",
  name: "Panier de légumes bio",
  slug: "panier-de-legumes-bio",
  price: 15.99,
  stock: 25,
  ...
}
```

## 🎯 Prochaines étapes (améliorations possibles)

- [ ] Upload d'images (actuellement URL uniquement)
- [ ] Statistiques avancées (ventes, chiffre d'affaires)
- [ ] Gestion des commandes clients
- [ ] Notifications en temps réel
- [ ] Export de données (CSV, PDF)
- [ ] Mode sombre
- [ ] Multilangue (i18n)
- [ ] API backend réelle
- [ ] Gestion des stocks avec alertes
- [ ] Historique des modifications

## 🐛 Debug

### Vérifier l'authentification
```javascript
// Dans la console du navigateur
const vendor = localStorage.getItem('greennoble_vendor')
console.log(JSON.parse(vendor))
```

### Vérifier les produits
```javascript
const products = localStorage.getItem('greennoble_vendor_products')
console.log(JSON.parse(products))
```

### Reset complet
```javascript
localStorage.removeItem('greennoble_vendor')
localStorage.removeItem('greennoble_vendors')
localStorage.removeItem('greennoble_vendor_products')
```

## 📱 Responsive

- ✅ Mobile-first design
- ✅ Breakpoint principal: 768px
- ✅ Grilles adaptatives (grid-template-columns: auto-fit)
- ✅ Navigation collapse sur mobile
- ✅ Modal fullscreen sur petits écrans

---

**Fait avec ❤️ pour GreenNoble - Marketplace Écoresponsable**
