import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)

  // Initialize from localStorage
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser)
      // Filter out items without IDs (fix for previous bug)
      if (parsed.savedHosts) {
        parsed.savedHosts = parsed.savedHosts.filter(h => h.id)
      }
      if (parsed.savedListings) {
        parsed.savedListings = parsed.savedListings.filter(l => l.id)
      }
      currentUser.value = parsed
    } catch (e) {
      console.error('Failed to parse saved user', e)
      localStorage.removeItem('currentUser')
    }
  }

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`http://localhost:3000/users?email=${email}`)
      const users = await response.json()
      
      if (users.length === 0) {
        throw new Error('User not found')
      }

      const user = users[0]
      if (user.password !== password) {
        throw new Error('Invalid password')
      }

      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      if (window.$toast) {
        window.$toast.success(`Bem-vindo, ${user.name}!`)
      }
    } catch (err) {
      console.error(err)
      if (window.$toast) {
        window.$toast.error('Email ou password incorretos')
      }
      throw err
    }
  }

  const register = async ({ name, email, password }) => {
    try {
      // Check if user exists
      const checkResponse = await fetch(`http://localhost:3000/users?email=${email}`)
      const existingUsers = await checkResponse.json()

      if (existingUsers.length > 0) {
        throw new Error('User already exists')
      }

      // Initialize with empty arrays for saved items as requested
      const newUser = {
        name,
        email,
        password,
        savedHosts: [],
        savedListings: [],
        savedLocations: []
      }

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })

      if (!response.ok) {
        throw new Error('Failed to register')
      }

      const user = await response.json()
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))

      if (window.$toast) {
        window.$toast.success(`Conta criada com sucesso! Bem-vindo, ${user.name}!`)
      }
    } catch (err) {
      console.error(err)
      if (window.$toast) {
        window.$toast.error(err.message === 'User already exists' ? 'Este email já está registado' : 'Erro ao criar conta')
      }
      throw err
    }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
    if (window.$toast) {
      window.$toast.info('Sessão terminada')
    }
  }

  const toggleItem = async (listName, item) => {
    if (!currentUser.value) {
      if (window.$toast) {
        window.$toast.warning('Inicie sessão para guardar nos favoritos')
      }
      return { added: false, requiresLogin: true }
    }
    
    if (!currentUser.value[listName]) {
      currentUser.value[listName] = []
    }

    const list = currentUser.value[listName]
    const index = list.findIndex(i => i.id === item.id)
    let added = false
    
    if (index === -1) {
      list.push(item)
      added = true
    } else {
      list.splice(index, 1)
      added = false
    }
    
    // Update local storage
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))

    // Show toast notification
    if (window.$toast) {
      if (added) {
        window.$toast.success('Adicionado aos favoritos!')
      } else {
        window.$toast.info('Removido dos favoritos')
      }
    }

    // Sync with backend
    try {
      if (currentUser.value.id) {
        await fetch(`http://localhost:3000/users/${currentUser.value.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            [listName]: list
          })
        })
      }
    } catch (err) {
      console.error('Failed to sync with server:', err)
      if (window.$toast) {
        window.$toast.error('Erro ao sincronizar com o servidor')
      }
    }
    
    return { added }
  }

  const isItemSaved = (listName, itemId) => {
    return currentUser.value?.[listName]?.some(i => i.id === itemId) || false
  }

  const toggleSaveHost = (host) => toggleItem('savedHosts', host)
  const isHostSaved = (hostId) => isItemSaved('savedHosts', hostId)

  const toggleSaveListing = (listing) => toggleItem('savedListings', listing)
  const isListingSaved = (listingId) => isItemSaved('savedListings', listingId)

  const toggleSaveLocation = (location) => toggleItem('savedLocations', location)
  const isLocationSaved = (locationId) => isItemSaved('savedLocations', locationId)

  return {
    currentUser,
    login,
    register,
    logout,
    toggleSaveHost,
    isHostSaved,
    toggleSaveListing,
    isListingSaved,
    toggleSaveLocation,
    isLocationSaved
  }
})
