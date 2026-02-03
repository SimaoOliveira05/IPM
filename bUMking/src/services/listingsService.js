const API_URL = 'http://localhost:3000'

function normalizeListing(item) {
  const price = typeof item.price === 'string'
    ? parseFloat(item.price.replace(/[^\d.]/g, ''))
    : parseFloat(item.price) || 0

  let occupancy
  if (item.estimated_occupancy_l365d !== undefined && item.estimated_occupancy_l365d !== null) {
    occupancy = parseInt(item.estimated_occupancy_l365d) || 0
  } else if (item.occupancy !== undefined && item.occupancy !== null) {
    occupancy = parseInt(item.occupancy) || 0
  } else if (item.availability_365 !== undefined && item.availability_365 !== null) {
    const avail = parseInt(item.availability_365)
    occupancy = isNaN(avail) ? 0 : (365 - avail)
  } else {
    occupancy = Math.floor(Math.random() * 200) + 100
  }

  // Ensure occupancy is never NaN
  if (isNaN(occupancy)) occupancy = 0

  const listing = {
    id: item.id,
    name: item.name,
    rating: item.review_scores_rating || 0,
    price: price,
    nights: parseInt(item.minimum_nights) || 1,
    room_type: item.room_type,
    anomalies: item.anomalies || [],
    picture_url: item.picture_url,
    listing_url: item.listing_url,
    neighbourhood: item.neighbourhood,
    neighbourhood_cleansed: item.neighbourhood_cleansed,
    accommodates: item.accommodates,
    bedrooms: item.bedrooms,
    bathroom: item.bathroom,
    beds: item.beds,
    latitude: item.latitude,
    longitude: item.longitude,
    host_id: item.host_id,
    description: item.description,
    occupancy: occupancy,
    revenue: price * occupancy
  }

  return listing
}

export const listingsService = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/listings${queryString ? `?${queryString}` : ''}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch listings')
    const data = await response.json()
    return data.map(normalizeListing)
  },

  async getById(id) {
    // Tenta /listings/:id e depois /listings?id=...
    let response = await fetch(`${API_URL}/listings/${id}`)
    if (response.ok) return normalizeListing(await response.json())
    response = await fetch(`${API_URL}/listings?id=${id}`)
    const data = await response.json()
    if (data && data.length) return normalizeListing(data[0])
    throw new Error('Listing not found')
  },

  async getByHostId(hostId) {
    const response = await fetch(`${API_URL}/listings?host_id=${hostId}`)
    if (!response.ok) throw new Error('Failed to fetch host listings')
    const data = await response.json()
    return data.map(normalizeListing)
  },

  async getByNeighbourhood(neighbourhoodName) {
    const response = await fetch(`${API_URL}/listings?neighbourhood_cleansed=${encodeURIComponent(neighbourhoodName)}`)
    if (!response.ok) throw new Error('Failed to fetch neighbourhood listings')
    const data = await response.json()
    return data.map(normalizeListing)
  }
}