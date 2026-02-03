import { computed } from 'vue'

/**
 * useSearch composable
 * @param {import('vue').Ref<Array>} listings - array de objetos a filtrar/ordenar
 * @param {import('vue').Ref<string>} locationQuery
 * @param {string} defaultLocation
 * @param {import('vue').Ref<Array>} selectedHouseTypes
 * @param {import('vue').Ref<boolean>} anomalyOnly
 * @param {import('vue').Ref<Object>} priceRange
 * @param {import('vue').Ref<Object>} ratingRange
 * @param {import('vue').Ref<string>} sortValue
 * @returns {Object} filteredListings, sortedListings
 */
export function useSearch({
  listings,
  locationQuery,
  defaultLocation,
  selectedHouseTypes,
  anomalyOnly,
  priceRange,
  ratingRange,
  sortValue
}) {
  const filteredListings = computed(() => {
    const term = locationQuery.value.trim().toLowerCase()
    const defaultTerm = defaultLocation.toLowerCase()
    let result = listings.value
    if (term && term !== defaultTerm) {
      result = result.filter(listings => {
        // Defensive: check all possible fields, fallback to empty string if missing
        const name = (listings.name || '').toLowerCase()
        const neighbourhood = (listings.neighbourhood || '').toLowerCase()
        const neighbourhoodCleansed = (listings.neighbourhood_cleansed || '').toLowerCase()
        const location = (listings.location || '').toLowerCase()
        const city = (listings.city || '').toLowerCase()
        const description = (listings.description || '').toLowerCase()
        return (
          name.includes(term) ||
          neighbourhood.includes(term) ||
          neighbourhoodCleansed.includes(term) ||
          location.includes(term) ||
          city.includes(term) ||
          description.includes(term)
        )
      })
    }
    if (selectedHouseTypes.value.length) {
      result = result.filter(listings => selectedHouseTypes.value.includes(listings.room_type))
    }
    if (anomalyOnly.value) {
      result = result.filter(listings => listings.anomalies && listings.anomalies.length > 0)
    }
    result = result.filter(listings => listings.price >= priceRange.value.min && listings.price <= priceRange.value.max)
    result = result.filter(listings => listings.rating >= ratingRange.value.min && listings.rating <= ratingRange.value.max)
    return result
  })

  const sortedListings = computed(() => {
    const items = [...filteredListings.value]
    switch (sortValue.value) {
      case 'rating-desc':
        return items.sort((a, b) => b.rating - a.rating || a.price - b.price)
      case 'rating-asc':
        return items.sort((a, b) => a.rating - b.rating || a.price - b.price)
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price || b.rating - a.rating)
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price || b.rating - a.rating)
      default:
        return items
    }
  })

  return { filteredListings, sortedListings }
}
