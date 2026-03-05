// Service de gestion du panier avec persistance localStorage
import { ref, computed } from 'vue'
import type { Product } from './api'

export interface CartItem {
  product: Product
  quantity: number
  notes: string
}

const CART_STORAGE_KEY = 'greennoble_cart'

// État réactif global du panier
const cartItems = ref<CartItem[]>([])

// Charger le panier depuis localStorage
const loadCart = (): void => {
  const stored = localStorage.getItem(CART_STORAGE_KEY)
  if (stored) {
    try {
      cartItems.value = JSON.parse(stored)
    } catch (error) {
      console.error('Erreur chargement panier:', error)
      cartItems.value = []
    }
  }
}

// Sauvegarder le panier dans localStorage
const saveCart = (): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
}

// Initialiser au chargement
loadCart()

// Nombre total d'articles
export const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// Prix total
export const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price
    return total + (price * item.quantity)
  }, 0)
})

// Obtenir tous les articles
export const getCartItems = (): CartItem[] => {
  return cartItems.value
}

// Ajouter un produit au panier
export const addToCart = (product: Product, quantity: number = 1, notes: string = ""): void => {
  const existingItem = cartItems.value.find(item => item.product.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.value.push({ product, quantity, notes })
  }
  
  saveCart()
}

// Mettre à jour la quantité d'un article
export const updateQuantity = (productId: string, quantity: number): void => {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }

  const item = cartItems.value.find(item => item.product.id === productId)
  if (item) {
    item.quantity = quantity
    saveCart()
  }
}
export const updateNotes = (productId: string, notes: string) => {
  const item = cartItems.value.find(i => i.product.id === productId)
  if (item) item.notes = notes
}

// Retirer un produit du panier
export const removeFromCart = (productId: string): void => {
  cartItems.value = cartItems.value.filter(item => item.product.id !== productId)
  saveCart()
}

// Vider le panier
export const clearCart = (): void => {
  cartItems.value = []
  saveCart()
}

// Vérifier si un produit est dans le panier
export const isInCart = (productId: string): boolean => {
  return cartItems.value.some(item => item.product.id === productId)
}

// Obtenir la quantité d'un produit dans le panier
export const getProductQuantity = (productId: string): number => {
  const item = cartItems.value.find(item => item.product.id === productId)
  return item ? item.quantity : 0
}

// Composable pour utiliser dans les composants
export const useCart = () => {
  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    clearCart,
    isInCart,
    getProductQuantity,
    getCartItems
  }
}
