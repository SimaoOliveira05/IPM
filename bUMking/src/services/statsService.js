const API_URL = 'http://localhost:3000'

export const statsService = {
  async getGlobalStats() {
    const response = await fetch(`${API_URL}/stats_global`)
    if (!response.ok) throw new Error('Failed to fetch global stats')
    return await response.json()
  },

  async getTopHosts() {
    try {
      const [statsGlobal, hosts] = await Promise.all([
        this.getGlobalStats(),
        this.getAllHosts()
      ])

      const hostMap = new Map(hosts.map(h => [h.host_id, h.host_name]))

      const topRevenue = statsGlobal.top_10_hosts_by_revenue.slice(0, 5).map(h => ({
        ...h,
        name: hostMap.get(h.host_id) || `Host ${h.host_id}`
      }))

      const topListings = statsGlobal.top_10_hosts_by_listings.slice(0, 5).map(h => ({
        ...h,
        name: hostMap.get(h.host_id) || `Host ${h.host_id}`
      }))

      return {
        topHostsByRevenue: topRevenue,
        topHostsByListings: topListings,
        totalHosts: statsGlobal.total_hosts,
        avgRevenue: statsGlobal.avg_revenue
      }
    } catch (error) {
      console.error('Error processing top hosts:', error)
      throw error
    }
  },

  async getAllHosts() {
    const response = await fetch(`${API_URL}/hosts`)
    if (!response.ok) throw new Error('Failed to fetch hosts')
    return await response.json()
  }
}
