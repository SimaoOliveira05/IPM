import { ref } from 'vue'
import { listingsService } from '@/services/listingsService'

export function useListing() {
  const listing = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchListing = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await listingsService.getById(id)
      listing.value = {
        id: data.id,
        name: data.name,
        description: data.description,
        rating: data.rating,
        price: typeof data.price === 'string'
          ? parseFloat(data.price.replace(/[^\d.]/g, ''))
          : parseFloat(data.price) || 0,
        picture_url: data.picture_url,
        neighbourhood: data.neighbourhood,
        address: data.street || '',
        accommodates: data.accommodates,
        bedrooms: data.bedrooms,
        beds: data.beds,
        bathrooms: data.bathroom,
        room_type: data.room_type,
        host_id: data.host_id,
        latitude: data.latitude,
        longitude: data.longitude,
        listing_url: data.listing_url,
        occupancy: data.occupancy,
        revenue: data.revenue
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { listing, loading, error, fetchListing }
}