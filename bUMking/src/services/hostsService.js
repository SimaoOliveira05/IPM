const API_URL = 'http://localhost:3000'

function normalizeHost(item) {
  return {
    id: item.host_id,
    host_id: item.host_id,
    host_name: item.host_name,
    host_location: item.host_location,
    host_picture_url: item.host_picture_url,
    host_since: item.host_since,
    host_is_superhost: item.host_is_superhost === 't',
    host_verifications: item.host_verifications,
    host_response_time: item.host_response_time,
    host_response_rate: item.host_response_rate,
    host_acceptance_rate: item.host_acceptance_rate,
    host_identity_verified: item.host_identity_verified === 't',
    host_about: item.host_about,
    host_url: item.host_url
  }
}

export const hostsService = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/hosts${queryString ? `?${queryString}` : ''}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch hosts')
    const data = await response.json()
    return data.map(normalizeHost)
  },

  async getById(hostId) {
    // Tentar buscar por host_id
    let response = await fetch(`${API_URL}/hosts?host_id=${hostId}`)
    let data = await response.json()
    // Se retornou array vazio, tentar buscar todos e filtrar
    if (!data || data.length === 0) {
      response = await fetch(`${API_URL}/hosts`)
      const allHosts = await response.json()
      // Filtrar pelo host_id
      data = allHosts.filter(h => 
        String(h.host_id) === String(hostId) || 
        String(h.id) === String(hostId)
      )
    }
    if (data && data.length > 0) {
      const normalized = normalizeHost(data[0])
      return normalized
    }
    throw new Error(`Host with ID ${hostId} not found`)
  }
}