import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listingsService } from '@/services/listingsService'
import { hostsService } from '@/services/hostsService'
import { locationStatsService } from '@/services/locationStatsService'

export const useSearchStore = defineStore('search', () => {
  // State
  const listings = ref([])
  const hosts = ref([])
  const neighbourhoods = ref([])
  const loading = ref(false)
  const error = ref(null)

  const locationQuery = ref('Porto')
  const category = ref('listings')
  const sortValue = ref('rating-desc')

  const filters = ref({
    houseTypes: [],
    anomalyOnly: false,
    verified: false,
    superhost: false,
    priceRange: { min: 0, max: 0 },
    ratingRange: { min: 0, max: 5 }
  })

  // Getters
  const filteredListings = computed(() => {
    let result = []
    if (category.value === 'hosts') result = hosts.value
    else if (category.value === 'neighbourhoods') result = neighbourhoods.value
    else result = listings.value

    // 1. Location/Search filter
    if (locationQuery.value) {
      const term = locationQuery.value.trim().toLowerCase()

      result = result.filter(item => {
        if (category.value === 'hosts') {
          const name = (item.host_name || '').toLowerCase()
          const location = (item.host_location || '').toLowerCase()
          const about = (item.host_about || '').toLowerCase()
          return name.includes(term) || location.includes(term) || about.includes(term)
        } else if (category.value === 'neighbourhoods') {
          const name = (item.name || '').toLowerCase()
          // Show all if searching for "Porto" (the city) or if name matches
          return term === 'porto' || name.includes(term)
        } else {
          const name = (item.name || '').toLowerCase()
          const neighbourhood = (item.neighbourhood || '').toLowerCase()
          const neighbourhoodCleansed = (item.neighbourhood_cleansed || '').toLowerCase()
          const location = (item.location || '').toLowerCase()
          const city = (item.city || '').toLowerCase()
          const description = (item.description || '').toLowerCase()

          return (
            name.includes(term) ||
            neighbourhood.includes(term) ||
            neighbourhoodCleansed.includes(term) ||
            location.includes(term) ||
            city.includes(term) ||
            description.includes(term)
          )
        }
      })
    }

    if (category.value === 'hosts') {
      // Host specific filters
      if (filters.value.verified) {
        result = result.filter(item => item.host_identity_verified)
      }
      if (filters.value.superhost) {
        result = result.filter(item => item.host_is_superhost)
      }
    } else if (category.value === 'neighbourhoods') {
      // Neighbourhood specific filters
      
      // 1. Price Range
      if (filters.value.priceRange.max > 0) {
        result = result.filter(item =>
          (item.avg_price || 0) >= filters.value.priceRange.min &&
          (item.avg_price || 0) <= filters.value.priceRange.max
        )
      }

      // 2. Rating Range
      result = result.filter(item =>
        (item.avg_rating || 0) >= filters.value.ratingRange.min &&
        (item.avg_rating || 0) <= filters.value.ratingRange.max
      )
      
      return result
    } else {
      // Listings specific filters
      // 2. House Type filter
      if (filters.value.houseTypes.length > 0) {
        result = result.filter(item => filters.value.houseTypes.includes(item.room_type))
      }

      // 3. Anomaly filter
      if (filters.value.anomalyOnly) {
        result = result.filter(item => item.anomalies && item.anomalies.length > 0)
      }

      // 4. Price Range
      if (filters.value.priceRange.max > 0) {
        result = result.filter(item =>
          item.price >= filters.value.priceRange.min &&
          item.price <= filters.value.priceRange.max
        )
      }

      // 5. Rating Range
      result = result.filter(item =>
        item.rating >= filters.value.ratingRange.min &&
        item.rating <= filters.value.ratingRange.max
      )
    }

    return result
  })

  const sortedListings = computed(() => {
    const result = [...filteredListings.value]

    if (category.value === 'hosts') {
      if (sortValue.value === 'alphabetical') {
        return result.sort((a, b) => (a.host_name || '').localeCompare(b.host_name || ''))
      }
      return result.sort((a, b) => (a.host_name || '').localeCompare(b.host_name || ''))
    } else if (category.value === 'neighbourhoods') {
      switch (sortValue.value) {
        case 'rating-desc':
          return result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
        case 'rating-asc':
          return result.sort((a, b) => (a.avg_rating || 0) - (b.avg_rating || 0))
        case 'price-desc':
          return result.sort((a, b) => (b.avg_price || 0) - (a.avg_price || 0))
        case 'price-asc':
          return result.sort((a, b) => (a.avg_price || 0) - (b.avg_price || 0))
        default:
          // Default alphabetical
          return result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      }
    }

    switch (sortValue.value) {
      case 'rating-desc':
        return result.sort((a, b) => b.rating - a.rating || a.price - b.price)
      case 'rating-asc':
        return result.sort((a, b) => a.rating - b.rating || a.price - b.price)
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price || b.rating - a.rating)
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price || b.rating - a.rating)
      default:
        return result
    }
  })

  const priceBounds = computed(() => {
    if (!listings.value.length) return { min: 0, max: 0 }
    const prices = listings.value.map(s => s.price)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  })

  const neighbourhoodPriceBounds = computed(() => {
    if (!neighbourhoods.value.length) return { min: 0, max: 0 }
    const prices = neighbourhoods.value.map(n => n.avg_price || 0)
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
  })

  const neighbourhoodRatingBounds = computed(() => {
    if (!neighbourhoods.value.length) return { min: 0, max: 5 }
    const ratings = neighbourhoods.value.map(n => n.avg_rating || 0)
    return { min: Math.floor(Math.min(...ratings) * 10) / 10, max: Math.ceil(Math.max(...ratings) * 10) / 10 }
  })

  // Actions
  async function fetchListings() {
    loading.value = true
    error.value = null
    try {
      const [listingsData, hostsData, neighbourhoodsData] = await Promise.all([
        listingsService.getAll(),
        hostsService.getAll(),
        locationStatsService.fetchNeighbourhoodStats()
      ])

      listings.value = listingsData
      hosts.value = hostsData
      
      // Transform neighbourhoods object to array
      neighbourhoods.value = Object.entries(neighbourhoodsData).map(([name, stats]) => ({
        id: name, // Use name as ID for navigation
        name,
        ...stats,
        // Add fake/computed properties for consistent card display if needed
        is_neighbourhood: true
      }))

      // Initialize price range if not set
      if (filters.value.priceRange.max === 0 && listings.value.length > 0) {
        filters.value.priceRange = { ...priceBounds.value }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching data:', err)
    } finally {
      loading.value = false
    }
  }

  function setLocation(loc) {
    locationQuery.value = loc
  }

  function setCategory(cat) {
    category.value = cat
  }

  function toggleHouseType(type) {
    const index = filters.value.houseTypes.indexOf(type)
    if (index === -1) {
      filters.value.houseTypes.push(type)
    } else {
      filters.value.houseTypes.splice(index, 1)
    }
  }

  function resetFilters() {
    filters.value.houseTypes = []
    filters.value.anomalyOnly = false
    filters.value.verified = false
    filters.value.superhost = false
    filters.value.priceRange = { ...priceBounds.value }
    filters.value.ratingRange = { min: 0, max: 5 }
  }

  return {
    listings,
    hosts,
    neighbourhoods,
    loading,
    error,
    locationQuery,
    category,
    sortValue,
    filters,
    filteredListings,
    sortedListings,
    priceBounds,
    neighbourhoodPriceBounds,
    neighbourhoodRatingBounds,
    fetchListings,
    setLocation,
    setCategory,
    toggleHouseType,
    resetFilters
  }
})
