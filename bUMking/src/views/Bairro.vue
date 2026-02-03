<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseFrame from '@/components/common/BaseFrame.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseChart from '@/components/common/BaseChart.vue'
import ControlDropDown from '@/components/common/ControlDropDown.vue'
import DashboardHeader from '@/components/dashboards/DashboardHeader.vue'
import MetricsGrid from '@/components/listing-dashboard/MetricsGrid.vue'
import BaseMap from '@/components/common/BaseMap.vue'
import { locationStatsService } from '@/services/locationStatsService'
import { listingsService } from '@/services/listingsService'
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'

// Quick Actions
import { useQuickActions } from '@/composables/useQuickActions'
import DownloadOverlay from '@/components/dashboards/overlays/DownloadOverlay.vue'
import QuickShareOverlay from '@/components/dashboards/overlays/QuickShareOverlay.vue'

const { t } = useI18n()
const { showDownload, showShare, shareLink, executeDownload } = useQuickActions()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// State
const locationName = computed(() => decodeURIComponent(route.params.name || ''))
const locationData = ref(null)
const globalStats = ref(null)
const cityStats = ref(null)
const neighbourhoodStats = ref(null)
const neighbourhoodListings = ref([])
const loading = ref(true)
const error = ref(null)
const selectedContext = ref('city')
const selectedYear = ref(2025)
const availableYears = [2025, 2024, 2023]

const availableYearsOptions = computed(() => availableYears.map(y => ({ value: y, label: y.toString() })))

const comparisonOptions = computed(() => [
  { value: 'city', label: t('location.comparison_city') },
  { value: 'global', label: t('location.comparison_global') }
])

// Computed stats
const locationType = computed(() => locationData.value?.type || 'city')
const stats = computed(() => locationData.value?.stats || {})

const isSaved = computed(() => {
  if (!locationData.value) return false
  // Use a composite ID or name as ID since locations don't have numeric IDs
  const id = `${locationType.value}-${locationName.value}`
  return userStore.isLocationSaved(id)
})

const handleSave = () => {
  if (!locationData.value) return
  
  const id = `${locationType.value}-${locationName.value}`
  const locationToSave = {
    id: id,
    name: locationName.value,
    type: locationType.value,
    stats: stats.value
  }
  
  userStore.toggleSaveLocation(locationToSave)
}

// Metrics configuration for MetricsGrid
const metrics = computed(() => ({
  total_listings: { label: t('metrics.total_listings'), formatter: (v) => v?.toLocaleString('pt-PT') || '—' },
  total_hosts: { label: t('metrics.total_hosts'), formatter: (v) => v?.toLocaleString('pt-PT') || '—' },
  avg_price: { label: t('metrics.avg_price'), formatter: (v) => v ? `${Math.round(v)}€` : '—' },
  avg_rating: { label: t('metrics.avg_rating'), formatter: (v) => v ? v.toFixed(1) : '—' },
  avg_occupancy: { label: t('metrics.avg_occupancy'), formatter: (v) => v ? `${Math.round(v * 365)} ${t('dashboard.days') || 'dias'}` : '—' }, // Using fallback for days
  avg_revenue: { label: t('metrics.avg_revenue'), formatter: (v) => v ? `${Math.round(v).toLocaleString('pt-PT')}€` : '—' }
}))

// Deviation Table Calculation
const deviationTable = computed(() => {
  if (!stats.value || !globalStats.value) return {}
  
  const calculateDeviation = (val, baseVal) => {
    if (!baseVal) return 0
    return ((val - baseVal) / baseVal) * 100
  }

  // Calculate Average Neighbourhood Stats for Volume Metrics
  let avgNeighbourhoodListings = 0
  let avgNeighbourhoodHosts = 0
  
  if (neighbourhoodStats.value) {
    const neighbourhoods = Object.values(neighbourhoodStats.value)
    if (neighbourhoods.length > 0) {
      avgNeighbourhoodListings = neighbourhoods.reduce((acc, n) => acc + (n.total_listings || 0), 0) / neighbourhoods.length
      avgNeighbourhoodHosts = neighbourhoods.reduce((acc, n) => acc + (n.total_hosts || 0), 0) / neighbourhoods.length
    }
  }

  const cityBase = cityStats.value?.porto || {}
  const globalBase = globalStats.value?.global
  
  // For volume metrics (listings, hosts), if we are a neighbourhood, we compare against the AVERAGE neighbourhood, not the city total.
  // For rate metrics (price, rating, etc), we compare against the city average.
  
  const cityListingsBase = locationType.value === 'neighbourhood' ? avgNeighbourhoodListings : cityBase.total_listings
  const cityHostsBase = locationType.value === 'neighbourhood' ? avgNeighbourhoodHosts : cityBase.total_hosts

  return {
    city: {
      total_listings: calculateDeviation(stats.value.total_listings, cityListingsBase),
      total_hosts: calculateDeviation(stats.value.total_hosts, cityHostsBase),
      avg_price: calculateDeviation(stats.value.avg_price, cityBase.avg_price),
      avg_rating: calculateDeviation(stats.value.avg_rating, cityBase.avg_rating),
      avg_occupancy: calculateDeviation(stats.value.avg_occupancy, cityBase.avg_occupancy),
      avg_revenue: calculateDeviation(stats.value.avg_revenue, cityBase.avg_revenue)
    },
    global: {
      total_listings: calculateDeviation(stats.value.total_listings, globalBase?.total_listings),
      total_hosts: calculateDeviation(stats.value.total_hosts, globalBase?.total_hosts),
      avg_price: calculateDeviation(stats.value.avg_price, globalBase?.avg_price),
      avg_rating: calculateDeviation(stats.value.avg_rating, globalBase?.avg_rating),
      avg_occupancy: calculateDeviation(stats.value.avg_occupancy, globalBase?.avg_occupancy),
      avg_revenue: calculateDeviation(stats.value.avg_revenue, globalBase?.avg_revenue)
    }
  }
})

const roomTypeCounts = computed(() => stats.value.room_type_counts || {})

// Theme aware chart border
const chartBorderColor = ref('#ffffff')

const updateThemeColors = () => {
  const styles = getComputedStyle(document.documentElement)
  chartBorderColor.value = styles.getPropertyValue('--chart-point-bg').trim() || '#ffffff'
}

let themeObserver = null

// Chart Data
const chartData = computed(() => {
  const labels = Object.keys(roomTypeCounts.value).map(key => {
    const labelMap = {
      'Entire home/apt': t('location.room_types.entire_home'),
      'Private room': t('location.room_types.private_room'),
      'Shared room': t('location.room_types.shared_room'),
      'Hotel room': t('location.room_types.hotel_room')
    }
    return labelMap[key] || key
  })
  const values = Object.values(roomTypeCounts.value)

  return {
    labels,
    datasets: [{
      data: values,
      backgroundColor: ['#2563eb', '#22c55e', '#f97316', '#a855f7'],
      borderColor: chartBorderColor.value,
      borderWidth: 2
    }]
  }
})

const chartOptions = {
  plugins: {
    legend: { position: 'bottom' }
  },
  cutout: '60%'
}

// Fetch data
async function fetchLocationData() {
  loading.value = true
  error.value = null
  
  if (selectedYear.value !== 2025) {
     // Clear data mocking empty year
     locationData.value = { type: 'neighbourhood', stats: { room_type_counts: {} } } 
     cityStats.value = {}
     neighbourhoodStats.value = {}
     globalStats.value = {}
     loading.value = false
     return
  }

  try {
    const [data, cStats, nStats] = await Promise.all([
      locationStatsService.findLocationStats(locationName.value),
      locationStatsService.fetchCityStats(),
      locationStatsService.fetchNeighbourhoodStats()
    ])
    
    if (data) {
      locationData.value = data
    } else {
      error.value = t('listing.error') // Use generic error
    }
    
    cityStats.value = cStats
    neighbourhoodStats.value = nStats
    
    const portoStats = cStats?.porto || {}
    
    globalStats.value = {
      porto: portoStats,
      // Global uses the same values as Porto since our dataset only contains Porto data
      // This ensures "Global" comparison shows 0% difference (as expected)
      global: {
        total_listings: portoStats.total_listings,
        total_hosts: portoStats.total_hosts,
        avg_price: portoStats.avg_price,
        avg_rating: portoStats.avg_rating,
        avg_occupancy: portoStats.avg_occupancy,
        avg_revenue: portoStats.avg_revenue
      }
    }
    
    // Ensure room_type_counts is reactive? It is, via computed stats
    
    // Fetch listings for this neighbourhood (for map)
    try {
      neighbourhoodListings.value = await listingsService.getByNeighbourhood(locationName.value)
    } catch (listErr) {
      console.warn('Could not fetch listings for map:', listErr)
      neighbourhoodListings.value = []
    }
    
  } catch (err) {
    console.error('Error fetching location data:', err)
    error.value = t('listing.error')
  } finally {
    loading.value = false
  }
}

// Map locations from neighbourhood listings
const mapLocations = computed(() => {
  return neighbourhoodListings.value
    .filter(l => l.latitude && l.longitude)
    .map(l => ({
      id: l.id,
      lat: l.latitude,
      lng: l.longitude,
      label: l.name,
      price: l.price,
      rating: l.rating
    }))
})

const goToListing = (id) => router.push(`/casa/${id}`)

function goBack() {
  router.back()
}

// Watchers
watch(() => locationName.value, fetchLocationData)
watch(selectedYear, fetchLocationData)

onMounted(async () => {
  await fetchLocationData()
  
  updateThemeColors()
  themeObserver = new MutationObserver(updateThemeColors)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})

onBeforeUnmount(() => {
  if (themeObserver) themeObserver.disconnect()
})
</script>

<template>
  <section class="bairro-view">
    <!-- Loading state -->
    <div v-if="loading" class="state-box">
      <p>{{ $t('listing.loading') }}</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="state-box error">
      <p>{{ error }}</p>
      <BaseButton variant="secondary" @click="fetchLocationData">{{ $t('listing.retry') }}</BaseButton>
    </div>
    
    <!-- Dashboard content -->
    <div v-else class="bairro-content">
      <BaseButton variant="secondary" size="small" @click="goBack">
        <template #icon>
          <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
        {{ $t('listing.back') }}
      </BaseButton>

      <!-- Header -->
      <BaseFrame class="location-header">
        <div class="header-content">
          <h1>
            {{ locationName }}
            <span class="location-type-badge">
              {{ locationType === 'neighbourhood' ? $t('location.neighbourhood') : $t('location.city') }}
            </span>
          </h1>
        </div>
      </BaseFrame>
      
      <!-- Stats Dashboard -->
      <section class="stats-dashboard">
        <DashboardHeader 
          :title="$t('location.title_stats')"
          v-model="selectedContext"
          :comparison-options="comparisonOptions"
          dropdown-min-width="180px"
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
          :default-filename="`${locationType}_${locationName}_stats_${selectedYear}`"
          @download="(args) => executeDownload({ ...args, data: { location: locationData, stats: stats, metrics: metrics } })"
        />

        <QuickShareOverlay
          v-model="showShare"
          :link="shareLink"
        />
        <MetricsGrid 
          v-if="selectedYear === 2025"
          :metrics="metrics"
          :listing="stats"
          :deviation-table="deviationTable"
          :selected-context="selectedContext"
        />
      </section>
      
      <!-- Charts -->
      <section v-if="selectedYear === 2025" class="charts-section">
        <h2>{{ $t('location.market_analysis') }}</h2>
        <BaseFrame class="panel" padding="1.25rem" rounded="1.25rem" elevation="1">
          <p class="chart-title">{{ $t('location.accom_type') }}</p>
          <div class="chart-container">
            <BaseChart 
              v-if="roomTypeCounts && Object.keys(roomTypeCounts).length"
              type="doughnut" 
              :data="chartData" 
              :options="chartOptions" 
            />
            <p v-else class="no-data">{{ $t('location.no_data') }}</p>
          </div>
        </BaseFrame>
      </section>

      <!-- Empty state for non-2025 years -->
      <div v-if="selectedYear !== 2025" class="empty-state">
        <p>{{ $t('dashboard.no_data_year') }}</p>
      </div>

      <!-- Neighbourhood Map -->
      <section v-if="selectedYear === 2025 && mapLocations.length > 0" class="map-section">
        <h2>{{ $t('location.properties_map') || 'Mapa de Propriedades' }}</h2>
        <BaseMap
          :locations="mapLocations"
          height="350px"
          @marker-click="(loc) => goToListing(loc.id)"
        />
      </section>
    </div>
  </section>
</template>

<style scoped>
.bairro-view {
  min-height: calc(100vh - 120px);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: var(--bg-gradient);
}

.state-box {
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 1.5rem;
  background: var(--bg-primary);
  box-shadow: 0 16px 32px var(--color-primary-08);
}

.state-box.error {
  color: var(--color-error);
}

.bairro-content {
  max-width: 1200px;
  margin: 0 auto;
}

.bairro-content > * + * {
  margin-top: 1.5rem;
}

/* Location Header */
.location-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.location-type-badge {
  display: inline-block;
  vertical-align: middle;
  padding: 0.3rem 0.75rem;
  margin-left: 0.75rem;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.location-header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

/* Stats Dashboard */
.stats-dashboard {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 1.75rem);
}

.charts-section {
  margin-top: 2rem;
}

.map-section {
  margin-top: 2rem;
}

.map-section h2 {
  margin: 0 0 1.25rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.charts-section h2 {
  margin: 0 0 1.25rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--bg-primary);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-primary-60);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 600;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
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

/* Charts */
.panel {
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.chart-title {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-primary-60);
}

.chart-container {
  position: relative;
  height: 220px;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.no-data {
  text-align: center;
  color: var(--color-primary-50);
  margin-top: 4rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-primary-60);
  background: var(--color-primary-04);
  border-radius: 1rem;
  margin-top: 2rem;
}
</style>
