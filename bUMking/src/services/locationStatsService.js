const API_URL = 'http://localhost:3000'

// Cache for stats data
let cityStatsCache = null
let neighbourhoodStatsCache = null

/**
 * Fetch city-level statistics
 */
async function fetchCityStats() {
  if (cityStatsCache) return cityStatsCache
  
  const response = await fetch(`${API_URL}/stats_cities`)
  if (!response.ok) throw new Error('Failed to fetch city stats')
  cityStatsCache = await response.json()
  return cityStatsCache
}

/**
 * Fetch neighbourhood-level statistics
 */
async function fetchNeighbourhoodStats() {
  if (neighbourhoodStatsCache) return neighbourhoodStatsCache
  
  const response = await fetch(`${API_URL}/stats_neighbourhoods`)
  if (!response.ok) throw new Error('Failed to fetch neighbourhood stats')
  neighbourhoodStatsCache = await response.json()
  return neighbourhoodStatsCache
}

/**
 * Calculate similarity score between query and target string
 * Returns a score from 0 to 1, where 1 is an exact match
 */
function calculateSimilarity(query, target) {
  const q = query.toLowerCase().trim()
  const t = target.toLowerCase()
  
  // Exact match
  if (t === q) return 1
  
  // Target starts with query
  if (t.startsWith(q)) return 0.9
  
  // Query is contained in target
  if (t.includes(q)) return 0.7 + (q.length / t.length) * 0.2
  
  // Check if any word in target starts with query
  const words = t.split(/[\s,]+/)
  for (const word of words) {
    if (word.startsWith(q)) return 0.6
  }
  
  return 0
}

/**
 * Find the best matching location for a search query
 * Returns { type: 'city'|'neighbourhood', name: string, stats: object } or null
 */
async function findLocationStats(query) {
  if (!query || query.trim().length === 0) {
    return null
  }
  
  const searchTerm = query.trim().toLowerCase()
  
  try {
    // Fetch both datasets
    const [cityStats, neighbourhoodStats] = await Promise.all([
      fetchCityStats(),
      fetchNeighbourhoodStats()
    ])
    
    let bestMatch = null
    let bestScore = 0
    
    // Check city matches
    for (const [cityName, stats] of Object.entries(cityStats)) {
      const score = calculateSimilarity(searchTerm, cityName)
      if (score > bestScore) {
        bestScore = score
        bestMatch = {
          type: 'city',
          name: capitalizeFirst(cityName),
          stats
        }
      }
    }
    
    // Check neighbourhood matches
    for (const [neighbourhoodName, stats] of Object.entries(neighbourhoodStats)) {
      const score = calculateSimilarity(searchTerm, neighbourhoodName)
      if (score > bestScore) {
        bestScore = score
        bestMatch = {
          type: 'neighbourhood',
          name: neighbourhoodName,
          stats
        }
      }
    }
    
    // Only return if we have a reasonable match (score > 0.3)
    if (bestScore >= 0.3) {
      return bestMatch
    }
    
    // Fallback to Porto city stats if no match found
    if (cityStats.porto) {
      return {
        type: 'city',
        name: 'Porto',
        stats: cityStats.porto
      }
    }
    
    return null
  } catch (error) {
    console.error('Error finding location stats:', error)
    return null
  }
}

/**
 * Capitalize the first letter of a string
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Format stats for display in InsightsPanel
 */
function formatStatsForDisplay(locationData) {
  if (!locationData || !locationData.stats) {
    return {
      locationName: 'Porto',
      locationType: 'city',
      formattedStats: [
        { label: 'metrics.total_listings', value: '—' },
        { label: 'metrics.avg_price', value: '—' },
        { label: 'metrics.avg_rating', value: '—' },
        { label: 'metrics.avg_occupancy', value: '—' }
      ]
    }
  }
  
  const { type, name, stats } = locationData
  
  return {
    locationName: name,
    locationType: type,
    formattedStats: [
      { 
        label: 'metrics.total_listings', 
        value: stats.total_listings?.toLocaleString('pt-PT') || '—' 
      },
      { 
        label: 'metrics.total_hosts', 
        value: stats.total_hosts?.toLocaleString('pt-PT') || '—' 
      },
      { 
        label: 'metrics.avg_price', 
        value: stats.avg_price ? `${Math.round(stats.avg_price)}€` : '—' 
      },
      { 
        label: 'metrics.avg_rating', 
        value: stats.avg_rating ? stats.avg_rating.toFixed(1) : '—' 
      },
      { 
        label: 'metrics.avg_occupancy', 
        value: stats.avg_occupancy ? `${Math.round(stats.avg_occupancy * 100)}%` : '—' 
      },
      { 
        label: 'metrics.avg_revenue', 
        value: stats.avg_revenue ? `${Math.round(stats.avg_revenue).toLocaleString('pt-PT')}€` : '—' 
      }
    ]
  }
}

/**
 * Clear the cache (useful for testing or refreshing data)
 */
function clearCache() {
  cityStatsCache = null
  neighbourhoodStatsCache = null
}

export const locationStatsService = {
  findLocationStats,
  formatStatsForDisplay,
  clearCache,
  fetchCityStats,
  fetchNeighbourhoodStats
}
