import { ref } from 'vue'
import { listingsService } from '@/services/listingsService'

export function useMarketStats() {
  const marketStats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const calculateStats = (values) => {
    if (!values || values.length === 0) return { min: 0, max: 0, mean: 0, median: 0, std: 0 }
    
    const sorted = [...values].sort((a, b) => a - b)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const sum = sorted.reduce((a, b) => a + b, 0)
    const mean = sum / sorted.length
    const median = sorted[Math.floor(sorted.length / 2)]
    
    const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length
    const std = Math.sqrt(variance)

    return { min, max, mean, median, std }
  }

  const fetchMarketStats = async (targetListing) => {
    loading.value = true
    error.value = null
    try {
      // Fetch all listings to build the dataset
      // In a real large-scale app, this should be an aggregation endpoint.
      const allListings = await listingsService.getAll()
      
      // Filter for context

      // Note: The provided listing object in Casa.vue doesn't seem to have 'city' explicitly shown in the view_file output of listingsService normalize, 
      // but the comparison logic in ListingDashboard.vue used 'city'. 
      // Let's assume the dataset is small enough or we filter by what we have.
      // Actually, looking at listingsService.js, 'neighbourhood' is there. 'city' might be implicit or missing.
      // Let's treat "City" as "All Listings" in this context if city field is missing, 
      // or if we can infer it. For now, let's use allListings as "City/Global" and filter by neighbourhood.

      const nbhListings = allListings.filter(l => l.neighbourhood === targetListing.neighbourhood)


      
      const getVal = (l, key) => {
        // Revenue and occupancy are now provided by listingsService
        return Number(l[key]) || 0
      }

      const buildDistribution = (arr, key) => arr.map(l => getVal(l, key))

      const city_price = buildDistribution(allListings, 'price')
      const city_occupancy = buildDistribution(allListings, 'occupancy')
      const city_revenue = buildDistribution(allListings, 'revenue')
      
      const nbh_price = buildDistribution(nbhListings, 'price')
      const nbh_occupancy = buildDistribution(nbhListings, 'occupancy')
      const nbh_revenue = buildDistribution(nbhListings, 'revenue')

      marketStats.value = {
        // Default distributions (City)
        price_distribution: city_price,
        occupancy_distribution: city_occupancy,
        revenue_distribution: city_revenue,
        rating_distribution: buildDistribution(allListings, 'rating'),

        // Context-specific distributions
        city_distributions: {
          price: city_price,
          occupancy: city_occupancy,
          revenue: city_revenue,
          rating: buildDistribution(allListings, 'rating')
        },
        nbh_distributions: {
          price: nbh_price,
          occupancy: nbh_occupancy,
          revenue: nbh_revenue,
          rating: buildDistribution(nbhListings, 'rating')
        },
        global_distributions: {
          price: city_price,
          occupancy: city_occupancy,
          revenue: city_revenue,
          rating: buildDistribution(allListings, 'rating')
        },
        
        city_stats: {
          price: calculateStats(city_price),
          occupancy: calculateStats(city_occupancy),
          revenue: calculateStats(city_revenue)
        },
        nbh_stats: {
          price: calculateStats(nbh_price),
          occupancy: calculateStats(nbh_occupancy),
          revenue: calculateStats(nbh_revenue)
        },
        global_stats: { // Same as city for now if single city dataset
          price: calculateStats(city_price),
          occupancy: calculateStats(city_occupancy),
          revenue: calculateStats(city_revenue)
        }
      }

    } catch (e) {
      console.error("Failed to fetch market stats", e)
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return {
    marketStats,
    loading,
    error,
    fetchMarketStats
  }
}
