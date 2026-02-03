import { ref } from 'vue'
import { hostsService } from '@/services/hostsService'

export function useHost() {
  const host = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchHost = async (hostId) => {
    if (!hostId) {
      error.value = 'ID do anfitrião não fornecido'
      return
    }

    loading.value = true
    error.value = null
    
    try {
      const data = await hostsService.getById(hostId)
      
      // Mapear para o formato esperado pelo componente
      host.value = {
        id: data.host_id,
        name: data.host_name,
        location: data.host_location,
        picture_url: data.host_picture_url,
        since: data.host_since,
        is_superhost: data.host_is_superhost,
        verifications: data.host_verifications,
        response_time: data.host_response_time,
        response_rate: data.host_response_rate,
        acceptance_rate: data.host_acceptance_rate,
        identity_verified: data.host_identity_verified,
        about: data.host_about,
        url: data.host_url
      }
    } catch (err) {
      console.error('Erro ao carregar anfitrião:', err)
      error.value = err.message
      host.value = null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    host.value = null
    loading.value = false
    error.value = null
  }

  return {
    host,
    loading,
    error,
    fetchHost,
    reset
  }
}