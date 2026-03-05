// Service d'authentification vendeur avec persistance localStorage
export interface Vendor {
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

export interface VendorRegisterData {
  email: string
  password: string
  businessName: string
  firstName: string
  lastName: string
  phone: string
  address: string
  postalCode: string
  city: string
  description?: string
  siret?: string
  labels: string[]
}

export interface VendorLoginData {
  email: string
  password: string
}

const STORAGE_KEY = 'greennoble_vendor'
const VENDORS_KEY = 'greennoble_vendors'

// Émettre un événement custom pour notifier les changements d'authentification vendeur
const emitVendorAuthChange = () => {
  window.dispatchEvent(new CustomEvent('vendor-auth-change'))
}

// Stockage simulé des vendeurs
const getStoredVendors = (): Map<string, { password: string; vendor: Vendor }> => {
  const stored = localStorage.getItem(VENDORS_KEY)
  if (stored) {
    const data = JSON.parse(stored)
    return new Map(Object.entries(data))
  }
  return new Map()
}

const saveVendors = (vendors: Map<string, { password: string; vendor: Vendor }>) => {
  const data = Object.fromEntries(vendors)
  localStorage.setItem(VENDORS_KEY, JSON.stringify(data))
}

// Récupérer le vendeur connecté
export const getCurrentVendor = (): Vendor | null => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

// Vérifier si un vendeur est connecté
export const isVendorAuthenticated = (): boolean => {
  return getCurrentVendor() !== null
}

// Inscription vendeur
export const registerVendor = async (data: VendorRegisterData): Promise<{ success: boolean; error?: string; vendor?: Vendor }> => {
  try {
    const vendors = getStoredVendors()
    
    if (vendors.has(data.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }

    if (!data.email.includes('@')) {
      return { success: false, error: 'Email invalide' }
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' }
    }

    if (!data.businessName || !data.firstName || !data.lastName) {
      return { success: false, error: 'Tous les champs obligatoires doivent être remplis' }
    }

    const vendor: Vendor = {
      id: `vendor_${Date.now()}`,
      email: data.email,
      businessName: data.businessName,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      postalCode: data.postalCode,
      city: data.city,
      description: data.description,
      labels: data.labels,
      siret: data.siret,
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=400&fit=crop',
      createdAt: new Date().toISOString()
    }

    vendors.set(data.email, { password: data.password, vendor })
    saveVendors(vendors)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendor))
    emitVendorAuthChange()
    return { success: true, vendor }
  } catch (error) {
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// Connexion vendeur
export const loginVendor = async (data: VendorLoginData): Promise<{ success: boolean; error?: string; vendor?: Vendor }> => {
  try {
    const vendors = getStoredVendors()
    const vendorData = vendors.get(data.email)

    if (!vendorData) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    if (vendorData.password !== data.password) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendorData.vendor))
    emitVendorAuthChange()
    return { success: true, vendor: vendorData.vendor }
  } catch (error) {
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// Déconnexion vendeur
export const logoutVendor = (): void => {
  localStorage.removeItem(STORAGE_KEY)
  emitVendorAuthChange()
}

// Mettre à jour le profil vendeur
export const updateVendorProfile = async (updates: Partial<Vendor>): Promise<{ success: boolean; error?: string; vendor?: Vendor }> => {
  try {
    const currentVendor = getCurrentVendor()
    if (!currentVendor) {
      return { success: false, error: 'Aucun vendeur connecté' }
    }

    const vendors = getStoredVendors()
    const vendorData = vendors.get(currentVendor.email)
    
    if (!vendorData) {
      return { success: false, error: 'Vendeur introuvable' }
    }

    const updatedVendor = { ...vendorData.vendor, ...updates }
    vendors.set(currentVendor.email, { ...vendorData, vendor: updatedVendor })
    saveVendors(vendors)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVendor))
    return { success: true, vendor: updatedVendor }
  } catch (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}
