/**
 * Analytics Engine for Airbnb/Real-Estate Listing Evaluation
 */

export const analyticsEngine = {
  /**
   * Main entry point to generate the complete dashboard analysis
   * @param {Object} listing - The listing object
   * @param {Object} marketStats - Market statistics (min, max, median, mean, std, etc.)
   * @returns {Object} Structured analysis result
   */
  analyze(listing, marketStats) {
    const percentiles = this.calculatePercentiles(listing, marketStats)
    const zScores = this.calculateZScores(listing, marketStats)
    const deviation = this.calculateDeviations(listing, marketStats)
    const pricingAlignment = this.evaluatePricingAlignment(percentiles)
    const competitiveness = this.calculateCompetitivenessScore(percentiles)
    const marketFit = this.assessMarketFit(competitiveness.score, pricingAlignment)
    const anomalies = this.detectAnomalies(listing, marketStats, percentiles)
    const expectedRevenue = this.calculateExpectedRevenue(listing, marketStats)
    
    const summary = this.generateNarrativeSummary({
      listing,
      percentiles,
      zScores,
      pricingAlignment,
      competitiveness,
      marketFit,
      anomalies
    })

    return {
      percentiles,
      z_scores: zScores,
      deviation_table: deviation,
      pricing_alignment: pricingAlignment,
      competitiveness_score: competitiveness,
      market_fit: marketFit,
      anomalies,
      expected_vs_actual_revenue: expectedRevenue,
      summary
    }
  },

  // 1. Percentile Positioning
  calculatePercentiles(listing, marketStats) {
    return {
      price: this.getApproximatePercentile(listing.price, marketStats.price_distribution),
      occupancy: this.getApproximatePercentile(listing.occupancy, marketStats.occupancy_distribution),
      revenue: this.getApproximatePercentile(listing.revenue, marketStats.revenue_distribution),
      rating: this.getApproximatePercentile(listing.rating, marketStats.rating_distribution)
    }
  },

  getApproximatePercentile(value, distribution) {
    if (!distribution || distribution.length === 0) return 50 // Default to median if no data
    // Simple rank-based percentile
    const sorted = [...distribution].sort((a, b) => a - b)
    const rank = sorted.findIndex(x => x >= value)
    if (rank === -1) return 100
    return Math.round((rank / sorted.length) * 100)
  },

  // 2. Z-Score Normalization
  calculateZScores(listing, marketStats) {
    const calc = (val, mean, std) => std ? ((val - mean) / std).toFixed(2) : 0
    return {
      price: calc(listing.price, marketStats.city_stats.price.mean, marketStats.city_stats.price.std),
      occupancy: calc(listing.occupancy, marketStats.city_stats.occupancy.mean, marketStats.city_stats.occupancy.std),
      revenue: calc(listing.revenue, marketStats.city_stats.revenue.mean, marketStats.city_stats.revenue.std)
    }
  },

  // 3. Deviation Table
  calculateDeviations(listing, marketStats) {
    const calcDiff = (val, baseline) => baseline ? (((val - baseline) / baseline) * 100).toFixed(1) : 0
    
    return {
      neighbourhood: {
        price: calcDiff(listing.price, marketStats.nbh_stats.price.mean),
        occupancy: calcDiff(listing.occupancy, marketStats.nbh_stats.occupancy.mean),
        revenue: calcDiff(listing.revenue, marketStats.nbh_stats.revenue.mean)
      },
      city: {
        price: calcDiff(listing.price, marketStats.city_stats.price.mean),
        occupancy: calcDiff(listing.occupancy, marketStats.city_stats.occupancy.mean),
        revenue: calcDiff(listing.revenue, marketStats.city_stats.revenue.mean)
      },
      global: {
        price: calcDiff(listing.price, marketStats.global_stats.price.mean),
        occupancy: calcDiff(listing.occupancy, marketStats.global_stats.occupancy.mean),
        revenue: calcDiff(listing.revenue, marketStats.global_stats.revenue.mean)
      }
    }
  },

  // 4. Overpricing / Underpricing Index (Implicit in Deviation but specific logic requested)
  // & 5. Price–Occupancy Alignment
  evaluatePricingAlignment(percentiles) {
    const { price, occupancy } = percentiles
    
    if (price < 40 && occupancy < 40) return "misaligned_low"
    if (price > 60 && occupancy > 60) return "premium"
    if (price < 40 && occupancy > 60) return "undervalued"
    if (price > 60 && occupancy < 40) return "overvalued"
    return "balanced"
  },

  // 6. Competitiveness Score
  calculateCompetitivenessScore(percentiles) {
    const score = Math.round(
      (percentiles.price * 0.4) + 
      (percentiles.occupancy * 0.4) + 
      (percentiles.revenue * 0.2)
    )

    let label = ""
    if (score >= 80) label = "dominant"
    else if (score >= 60) label = "strong"
    else if (score >= 40) label = "medium"
    else label = "weak"

    return { score, label }
  },

  // 7. Market Fit Assessment
  assessMarketFit(score, alignment) {
    if (score > 75 && alignment !== "misaligned_low") return "excellent"
    if (score > 50 && alignment !== "overvalued") return "good"
    if (alignment === "overvalued" || alignment === "misaligned_low") return "needs_work"
    return "bad"
  },

  // 8. Anomaly Detection (formerly Outliers)
  detectAnomalies(listing, marketStats, percentiles) {
    const anomalies = []
    
    if (percentiles.price > 90) anomalies.push("premium_price")
    if (percentiles.price < 10) anomalies.push("low_cost")
    
    if (percentiles.rating < 20) anomalies.push("critical_rating")
    if (listing.rating < 4.0) anomalies.push("low_rating")
    
    if (percentiles.revenue > 90) anomalies.push("top_revenue")
    if (percentiles.occupancy < 10) anomalies.push("low_occupancy")

    return anomalies
  },

  // 9. Expected vs Actual Revenue
  calculateExpectedRevenue(listing, marketStats) {
    const sortedRev = [...marketStats.revenue_distribution].sort((a,b)=>a-b)
    const p50 = sortedRev[Math.floor(sortedRev.length * 0.5)] || 0
    const p75 = sortedRev[Math.floor(sortedRev.length * 0.75)] || 0

    return {
      actual: listing.revenue,
      expected_range: [p50, p75],
      performance: listing.revenue > p50 ? "above_average" : "below_average"
    }
  },

  // 10. Automatic Narrative Summary - Returns data for i18n construction
  generateNarrativeSummary(data) {
    return {
      percentiles: data.percentiles,
      alignment: data.pricingAlignment,
      score: data.competitiveness.score,
      label: data.competitiveness.label,
      anomalies: data.anomalies,
      marketFit: data.marketFit
    }
  }
}
