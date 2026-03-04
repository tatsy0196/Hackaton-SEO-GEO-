// Service d'authentification utilisateur avec persistance localStorage
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  address?: string
  postalCode?: string
  city?: string
  phone?: string
  createdAt: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

const STORAGE_KEY = 'greennoble_user'
const USERS_KEY = 'greennoble_users'

// Stockage simulé des utilisateurs (en production, utiliser une vraie API)
const getStoredUsers = (): Map<string, { password: string; user: User }> => {
  const stored = localStorage.getItem(USERS_KEY)
  if (stored) {
    const data = JSON.parse(stored)
    return new Map(Object.entries(data))
  }
  return new Map()
}

const saveUsers = (users: Map<string, { password: string; user: User }>) => {
  const data = Object.fromEntries(users)
  localStorage.setItem(USERS_KEY, JSON.stringify(data))
}

// Récupérer l'utilisateur connecté
export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

// Vérifier si un utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}

// Inscription
export const register = async (data: RegisterData): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const users = getStoredUsers()
    
    // Vérifier si l'email existe déjà
    if (users.has(data.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }

    // Validation basique
    if (!data.email.includes('@')) {
      return { success: false, error: 'Email invalide' }
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' }
    }

    if (!data.firstName || !data.lastName) {
      return { success: false, error: 'Prénom et nom sont requis' }
    }

    // Créer le nouvel utilisateur
    const user: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      createdAt: new Date().toISOString()
    }

    // Sauvegarder (en prod, hasher le mot de passe !)
    users.set(data.email, { password: data.password, user })
    saveUsers(users)

    // Connecter automatiquement
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Erreur lors de l\'inscription' }
  }
}

// Connexion
export const login = async (data: LoginData): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const users = getStoredUsers()
    const userRecord = users.get(data.email)

    if (!userRecord) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    if (userRecord.password !== data.password) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }

    // Connexion réussie
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userRecord.user))

    return { success: true, user: userRecord.user }
  } catch (error) {
    return { success: false, error: 'Erreur lors de la connexion' }
  }
}

// Déconnexion
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

// Mettre à jour le profil
export const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    const users = getStoredUsers()
    const userRecord = users.get(currentUser.email)
    
    if (!userRecord) {
      return { success: false, error: 'Utilisateur non trouvé' }
    }

    // Mettre à jour
    const updatedUser = { ...userRecord.user, ...updates, id: userRecord.user.id, email: userRecord.user.email }
    userRecord.user = updatedUser
    
    users.set(currentUser.email, userRecord)
    saveUsers(users)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))

    return { success: true, user: updatedUser }
  } catch (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}
