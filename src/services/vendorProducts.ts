// Service de gestion des produits vendeur
export interface VendorProduct {
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

const PRODUCTS_KEY = 'greennoble_vendor_products'

// Récupérer tous les produits d'un vendeur
export const getVendorProducts = (vendorId: string): VendorProduct[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) return []
  
  try {
    const allProducts: VendorProduct[] = JSON.parse(stored)
    return allProducts.filter(p => p.vendorId === vendorId)
  } catch (error) {
    console.error('Erreur chargement produits:', error)
    return []
  }
}

// Sauvegarder les produits
const saveAllProducts = (products: VendorProduct[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

// Créer un slug à partir du nom
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Ajouter un produit
export const addProduct = (vendorId: string, productData: Omit<VendorProduct, 'id' | 'vendorId' | 'slug' | 'createdAt' | 'updatedAt'>): VendorProduct => {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  const allProducts: VendorProduct[] = stored ? JSON.parse(stored) : []
  
  const newProduct: VendorProduct = {
    ...productData,
    id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    vendorId,
    slug: createSlug(productData.name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  allProducts.push(newProduct)
  saveAllProducts(allProducts)
  
  return newProduct
}

// Mettre à jour un produit
export const updateProduct = (productId: string, updates: Partial<Omit<VendorProduct, 'id' | 'vendorId' | 'createdAt'>>): VendorProduct | null => {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) return null
  
  const allProducts: VendorProduct[] = JSON.parse(stored)
  const index = allProducts.findIndex(p => p.id === productId)
  
  if (index === -1) return null
  
  const currentProduct = allProducts[index]
  if (!currentProduct) return null
  
  const updatedProduct: VendorProduct = {
    id: currentProduct.id,
    vendorId: currentProduct.vendorId,
    createdAt: currentProduct.createdAt,
    slug: updates.slug || currentProduct.slug,
    name: updates.name || currentProduct.name,
    price: updates.price !== undefined ? updates.price : currentProduct.price,
    discountPrice: updates.discountPrice !== undefined ? updates.discountPrice : currentProduct.discountPrice,
    category: updates.category || currentProduct.category,
    city: updates.city || currentProduct.city,
    shortDescription: updates.shortDescription || currentProduct.shortDescription,
    longDescription: updates.longDescription || currentProduct.longDescription,
    imageUrl: updates.imageUrl || currentProduct.imageUrl,
    images: updates.images || currentProduct.images,
    weight: updates.weight || currentProduct.weight,
    origin: updates.origin || currentProduct.origin,
    composition: updates.composition || currentProduct.composition,
    conservation: updates.conservation || currentProduct.conservation,
    nutritionalInfo: updates.nutritionalInfo || currentProduct.nutritionalInfo,
    certifications: updates.certifications || currentProduct.certifications,
    stock: updates.stock !== undefined ? updates.stock : currentProduct.stock,
    updatedAt: new Date().toISOString()
  }
  
  if (updates.name) {
    updatedProduct.slug = createSlug(updates.name)
  }
  
  allProducts[index] = updatedProduct
  saveAllProducts(allProducts)
  return updatedProduct
}

// Supprimer un produit
export const deleteProduct = (productId: string): boolean => {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) return false
  
  const allProducts: VendorProduct[] = JSON.parse(stored)
  const filtered = allProducts.filter(p => p.id !== productId)
  
  if (filtered.length === allProducts.length) return false
  
  saveAllProducts(filtered)
  return true
}

// Obtenir un produit par ID
export const getProductById = (productId: string): VendorProduct | null => {
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) return null
  
  const allProducts: VendorProduct[] = JSON.parse(stored)
  return allProducts.find(p => p.id === productId) || null
}
