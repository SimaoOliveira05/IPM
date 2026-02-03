<template>
  <section class="listing-dashboard">
    <DashboardHeader 
      :title="$t('dashboard.market_analysis_title')"
      v-model="selectedContext"
      :comparison-options="comparisonOptions"
      dropdown-min-width="220px"
      :is-saved="isSaved"
      @save="handleSave"
      @share="showShare = true"
      @download="showDownload = true"
    >
      <template #append-controls>
        <div class="year-selector-control">
          <span class="label">{{ $t('dashboard.year') || 'Ano:' }}</span>
          <ControlDropDown 
              :model-value="selectedYear"
              @update:model-value="selectedYear = $event"
              :options="availableYearsOptions"
              min-width="120px"
          />
        </div>
      </template>
    </DashboardHeader>

    <DownloadOverlay 
      v-model="showDownload"
      :default-filename="`analise_${listing?.id || 'mercado'}_${selectedYear}`"
      @download="(args) => executeDownload({ ...args, data: analysis })"
    />

    <QuickShareOverlay
      v-model="showShare"
      :link="shareLink"
    />

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ $t('dashboard.calculating') }}</p>
    </div>

    <div v-else-if="analysis" class="dashboard-content">
      
      <!-- Top Row: Score & Market Fit -->
      <ScoreCard 
        :score="analysis.competitiveness_score.score"
        :label="analysis.competitiveness_score.label"
        :market-fit="analysis.market_fit"
        :summary="analysis.summary"
        :context-label="contextLabel"
      />

      <!-- Key Metrics & Percentiles -->
      <MetricsGrid 
        :metrics="metrics"
        :listing="listing"
        :deviation-table="analysis.deviation_table"
        :selected-context="selectedContext"
      />

      <!-- Pricing Alignment & Expected Revenue -->
      <div class="alignment-grid">
        <AlignmentCard 
          :alignment="analysis.pricing_alignment"
          :percentiles="analysis.percentiles"
          :context-label="contextLabel"
        />

        <RevenueCard 
          :revenue-data="analysis.expected_vs_actual_revenue"
        />
      </div>

      <!-- Anomalies -->
      <div v-if="analysis.anomalies.length" class="anomalies-section">
        <h3>{{ $t('dashboard.anomalies_title') }}</h3>
        <div class="anomalies-list">
          <span 
            v-for="anomaly in analysis.anomalies" 
            :key="anomaly" 
            class="anomaly-tag"
            :class="getAnomalyClass(anomaly)"
          >
            <!-- Translate the anomaly key -->
            ⚠️ {{ $t(`dashboard.anomalies.${anomaly === 'critical_rating' ? 'critical_rating' : 
                      anomaly === 'low_rating' ? 'low_rating' :
                      anomaly === 'premium_price' ? 'premium_price' :
                      anomaly === 'low_cost' ? 'low_cost' :
                      anomaly === 'top_revenue' ? 'top_revenue' :
                      'low_occupancy'}`) }} 
            <!-- Actually a cleaner way: $t('dashboard.anomalies.' + anomaly) works if anomaly is the key -->
          </span>
        </div>
      </div>

    </div>
    
    <div v-else class="empty-state">
      <p v-if="selectedYear !== 2025">{{ $t('dashboard.no_data_year') }}</p>
      <p v-else>Não foi possível gerar a análise estatística.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMarketStats } from '@/composables/useMarketStats'
import { analyticsEngine } from '@/utils/analyticsEngine'
import { useUserStore } from '@/stores/userStore'
import { useQuickActions } from '@/composables/useQuickActions'
import DashboardHeader from '@/components/dashboards/DashboardHeader.vue'
import ControlDropDown from '@/components/common/ControlDropDown.vue'

// Child Components
import ScoreCard from '@/components/listing-dashboard/ScoreCard.vue'
import MetricsGrid from '@/components/listing-dashboard/MetricsGrid.vue'
import AlignmentCard from '@/components/listing-dashboard/AlignmentCard.vue'
import RevenueCard from '@/components/listing-dashboard/RevenueCard.vue'

// Overlays
import DownloadOverlay from '@/components/dashboards/overlays/DownloadOverlay.vue'
import QuickShareOverlay from '@/components/dashboards/overlays/QuickShareOverlay.vue'

const props = defineProps({
  listing: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()
const { marketStats, loading, fetchMarketStats } = useMarketStats()
const userStore = useUserStore()
const { showDownload, showShare, shareLink, executeDownload } = useQuickActions()

const selectedContext = ref('city')
const selectedYear = ref(2025)
const availableYears = [2025, 2024, 2023]
const availableYearsOptions = computed(() => availableYears.map(y => ({ value: y, label: y.toString() })))
const analysis = ref(null)

const isSaved = computed(() => {
  return props.listing ? userStore.isListingSaved(props.listing.id) : false
})

const handleSave = () => {
  if (props.listing) {
    userStore.toggleSaveListing(props.listing)
  }
}

const comparisonOptions = computed(() => {
  const options = [
    { value: 'city', label: `${t('location.city')} (Porto)` },
    { value: 'global', label: t('location.comparison_global') }
  ]
  // Only include neighbourhood option if it has a valid value
  if (props.listing.neighbourhood) {
    options.splice(1, 0, { value: 'neighbourhood', label: `${t('location.neighbourhood')} (${props.listing.neighbourhood})` })
  }
  return options
})

const getAnomalyClass = (anomaly) => {
  if (['critical_rating', 'low_rating', 'low_occupancy'].includes(anomaly)) return 'anomaly-danger'
  if (['premium_price', 'low_cost'].includes(anomaly)) return 'anomaly-warning'
  if (['top_revenue'].includes(anomaly)) return 'anomaly-info'
  return ''
}

const metrics = computed(() => ({
  price: { label: t('dashboard.price'), formatter: (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v) },
  occupancy: { label: `${t('dashboard.occupancy')} ${t('dashboard.est')}`, formatter: (v) => `${v} ${t('dashboard.days')}` },
  revenue: { label: `${t('dashboard.revenue')} ${t('dashboard.est')}`, formatter: (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v) }
}))

const contextLabel = computed(() => {
  if (selectedContext.value === 'city') return t('dashboard.context_city')
  if (selectedContext.value === 'neighbourhood') return t('dashboard.context_neighbourhood')
  return t('dashboard.context_global')
})

onMounted(async () => {
  await fetchMarketStats(props.listing)
})

watch([() => props.listing, marketStats, selectedContext, selectedYear], ([newListing, newStats, context, year]) => {
  if (year !== 2025) {
      analysis.value = null
      return
  }
    
  if (newListing && newStats) {
    // Map the selectedContext value to the actual key used in marketStats
    const contextKeyMap = {
      city: 'city',
      neighbourhood: 'nbh',
      global: 'global'
    }
    const contextKey = contextKeyMap[context] || 'city'
    
    // Dynamically construct the stats object for the engine based on context
    // All stats references (nbh, city, global) are set to the selected context's stats
    // This ensures all deviation calculations use the same baseline
    const selectedStats = newStats[`${contextKey}_stats`] || newStats.city_stats
    const selectedDistributions = newStats[`${contextKey}_distributions`] || newStats.city_distributions
    
    const contextStats = {
      ...newStats,
      // Override the main distributions with the selected context's distributions
      price_distribution: selectedDistributions?.price || newStats.price_distribution,
      occupancy_distribution: selectedDistributions?.occupancy || newStats.occupancy_distribution,
      revenue_distribution: selectedDistributions?.revenue || newStats.revenue_distribution,
      rating_distribution: selectedDistributions?.rating || newStats.rating_distribution,
      
      // Override ALL stats to use the selected context - this ensures deviation_table 
      // calculates against the same baseline regardless of which context key it uses
      nbh_stats: selectedStats,
      city_stats: selectedStats,
      global_stats: selectedStats
    }
    
    analysis.value = analyticsEngine.analyze(newListing, contextStats)
  }
})
</script>

<style scoped>
.listing-dashboard {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-primary-10);
}

.year-selector-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.year-selector-control .label {
  font-size: 0.9rem;
  color: var(--color-primary-60);
  font-weight: 500;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--color-primary-60);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-primary-10);
  border-top-color: var(--color-rating);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 1.75rem);
}

/* Alignment Grid */
.alignment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Anomalies */
.anomalies-section h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0 0 1rem;
  font-weight: 700;
}

.anomalies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.anomaly-tag {
  background: var(--color-error-rose-bg);
  color: var(--color-error-rose);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(253, 164, 175, 0.5);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.anomaly-danger {
  background: var(--color-error-rose-bg);
  color: var(--color-error-rose);
  border-color: rgba(253, 164, 175, 0.5);
}

.anomaly-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning-dark);
  border-color: var(--color-warning);
}

.anomaly-info {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #93c5fd;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  background: var(--color-primary-02);
  border-radius: 1.5rem;
  color: var(--color-primary-60);
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
