import { watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

export function useUrlSync({ 
  router, 
  route, 
  searchStore, 
  currentPage, 
  goToPage, 
  categoryOptions 
}) {
  const { filters, locationQuery, category, sortValue } = storeToRefs(searchStore)

  const isValidCategory = (value) => typeof value === 'string' && categoryOptions.includes(value)

  // Flag to prevent URL updates while syncing from URL
  let isSyncingFromUrl = false

  // 1. Parse URL to State (Hydration)
  const syncStateFromUrl = () => {
    isSyncingFromUrl = true
    const q = route.query
    
    // ... all logic ...

    // Core Search
    if (q.q && q.q !== locationQuery.value) {
      searchStore.setLocation(q.q)
    }
    
    if (q.category && isValidCategory(q.category) && q.category !== category.value) {
      searchStore.setCategory(q.category)
    }
    
    // Sort
    if (q.sort && q.sort !== sortValue.value) {
      sortValue.value = q.sort 
    }

    // Filters
    // House Types
    if (q.house_types) {
      const types = q.house_types.split(',')
      // Avoid store update if identical to prevent reactivity loop
      if (filters.value.houseTypes.join(',') !== q.house_types) {
         filters.value.houseTypes = types
      }
    } else if (filters.value.houseTypes.length > 0) {
      filters.value.houseTypes = []
    }
    
    // Booleans
    const qAnomaly = q.anomalies === 'true'
    if (filters.value.anomalyOnly !== qAnomaly) filters.value.anomalyOnly = qAnomaly

    const qVerified = q.verified === 'true'
    if (filters.value.verified !== qVerified) filters.value.verified = qVerified

    const qSuperhost = q.superhost === 'true'
    if (filters.value.superhost !== qSuperhost) filters.value.superhost = qSuperhost
    
    // Ranges
    const qMinPrice = Number(q.price_min) || 0
    const qMaxPrice = Number(q.price_max) || 0
    if (filters.value.priceRange.min !== qMinPrice || filters.value.priceRange.max !== qMaxPrice) {
      if (q.price_min || q.price_max) {
         filters.value.priceRange = { min: qMinPrice, max: qMaxPrice }
      }
    }
    
    const qMinRating = Number(q.rating_min) || 0
    const qMaxRating = Number(q.rating_max) || 0
    if (q.rating_min || q.rating_max) {
       if (filters.value.ratingRange.min !== qMinRating || filters.value.ratingRange.max !== qMaxRating) {
          filters.value.ratingRange = { min: qMinRating, max: qMaxRating || 5 }
       }
    }
    
    // Pagination - restore page from URL
    if (q.page) {
      const p = Number(q.page)
      if (!isNaN(p) && p > 0 && p !== currentPage.value) {
        goToPage(p)
      }
    }
    
    // Defer reset to allow watchers to react to state changes while isSyncingFromUrl is still true
    nextTick(() => {
      isSyncingFromUrl = false
    })
  }

  // 2. Update URL from State
  const updateUrlFromState = () => {
    const query = { ...route.query }
    let hasChanges = false
    
    const setQuery = (key, val) => {
      const strVal = String(val)
      if (query[key] !== strVal) {
        query[key] = strVal
        hasChanges = true
      }
    }
    
    const delQuery = (key) => {
       if (query[key] !== undefined) {
         delete query[key]
         hasChanges = true
       }
    }

    // Core
    if (locationQuery.value) setQuery('q', locationQuery.value)
    else delQuery('q')
    
    if (category.value !== 'listings') setQuery('category', category.value)
    else delQuery('category')
    
    // Sort
    if (sortValue.value !== 'rating-desc') setQuery('sort', sortValue.value)
    else delQuery('sort')
    
    // Filters
    if (filters.value.houseTypes.length > 0) {
      setQuery('house_types', filters.value.houseTypes.join(','))
    } else {
      delQuery('house_types')
    }
    
    if (filters.value.anomalyOnly) setQuery('anomalies', 'true')
    else delQuery('anomalies')
    
    if (filters.value.verified) setQuery('verified', 'true')
    else delQuery('verified')
    
    if (filters.value.superhost) setQuery('superhost', 'true')
    else delQuery('superhost')
    
    // Price
    if (filters.value.priceRange.max > 0) {
       setQuery('price_min', filters.value.priceRange.min)
       setQuery('price_max', filters.value.priceRange.max)
    } else {
       delQuery('price_min')
       delQuery('price_max')
    }
    
    // Rating
    if (filters.value.ratingRange.min > 0 || filters.value.ratingRange.max < 5) {
       setQuery('rating_min', filters.value.ratingRange.min)
       setQuery('rating_max', filters.value.ratingRange.max)
    } else {
       delQuery('rating_min')
       delQuery('rating_max')
    }
    
    // Pagination
    if (currentPage.value > 1) setQuery('page', currentPage.value)
    else delQuery('page')
    
    // Replace only if meaningful change
    if (hasChanges) {
      router.replace({ query })
    }
  }

  // Watchers & Initialization logic
  
  let urlUpdateTimer = null
  
  const updateUrlImmediate = () => {
    clearTimeout(urlUpdateTimer)
    // Skip URL update if we're currently syncing state from URL
    if (!isSyncingFromUrl) {
      updateUrlFromState()
    }
  }

  const debouncedUpdateUrl = () => {
    clearTimeout(urlUpdateTimer)
    urlUpdateTimer = setTimeout(() => {
      if (!isSyncingFromUrl) {
        updateUrlFromState()
      }
    }, 500)
  }

  // Setup watchers
  const setupWatchers = () => {
    // Debounced: Input and Sliders (High frequency changes)
    watch([
      locationQuery, 
      () => filters.value
    ], () => {
      debouncedUpdateUrl()
    }, { deep: true })

    // Immediate: Buttons and Pagination (Discrete actions)
    watch([
      category, 
      sortValue, 
      currentPage
    ], () => {
      updateUrlImmediate()
    })

    // Reset to page 1 when filters change (but NOT when syncing from URL)
    watch([
      locationQuery,
      category,
      sortValue,
      () => filters.value
    ], () => {
      if (!isSyncingFromUrl && currentPage.value !== 1) {
        goToPage(1)
      }
    }, { deep: true })

    watch(() => route.query, () => {
      syncStateFromUrl()
    }, { deep: true })
  }

  return {
    syncStateFromUrl,
    setupWatchers
  }
}
