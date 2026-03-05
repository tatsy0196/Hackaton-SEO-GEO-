// Service de gestion des commandes avec persistance localStorage
import type { CartItem } from './cart'
import { getCurrentUser } from './auth'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryMode: 'pickup' | 'relay'
  deliveryAddress?: string
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

const ORDERS_STORAGE_KEY = 'greennoble_orders'

// Récupérer toutes les commandes
const getStoredOrders = (): Order[] => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return []
  }
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error('Erreur chargement commandes:', error)
      return []
    }
  }
  return []
}

// Sauvegarder les commandes
const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

// Créer une nouvelle commande
export const createOrder = (
  items: CartItem[],
  deliveryMode: 'pickup' | 'relay',
  deliveryAddress?: string
): { success: boolean; error?: string; order?: Order } => {
  try {
    const user = getCurrentUser()
    if (!user) {
      return { success: false, error: 'Vous devez être connecté pour passer une commande' }
    }

    if (items.length === 0) {
      return { success: false, error: 'Votre panier est vide' }
    }

    // Calculer les montants
    const subtotal = items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price
      return total + (price * item.quantity)
    }, 0)

    const deliveryFee = deliveryMode === 'pickup' ? 0 : 3.5
    const total = subtotal + deliveryFee

    // Créer la commande
    const order: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items: items.map(item => ({ ...item })), // Copie profonde
      subtotal,
      deliveryFee,
      total,
      deliveryMode,
      deliveryAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Sauvegarder
    const orders = getStoredOrders()
    orders.push(order)
    saveOrders(orders)

    return { success: true, order }
  } catch (error) {
    return { success: false, error: 'Erreur lors de la création de la commande' }
  }
}

// Récupérer les commandes d'un utilisateur
export const getUserOrders = (): Order[] => {
  const user = getCurrentUser()
  if (!user) return []

  const orders = getStoredOrders()
  return orders
    .filter(order => order.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Récupérer une commande par ID
export const getOrderById = (orderId: string): Order | null => {
  const orders = getStoredOrders()
  return orders.find(order => order.id === orderId) || null
}

// Mettre à jour le statut d'une commande
export const updateOrderStatus = (
  orderId: string,
  status: Order['status']
): { success: boolean; error?: string } => {
  try {
    const orders = getStoredOrders()
    const order = orders.find(o => o.id === orderId)
    
    if (!order) {
      return { success: false, error: 'Commande introuvable' }
    }

    order.status = status
    order.updatedAt = new Date().toISOString()
    saveOrders(orders)

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}
