<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hostsService } from '@/services/hostsService'
import { listingsService } from '@/services/listingsService'
import { useMarketStats } from '@/composables/useMarketStats'
import { useUserStore } from '@/stores/userStore'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseFrame from '@/components/common/BaseFrame.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import HostAvatar from '@/components/common/HostAvatar.vue'
import DashboardHeader from '@/components/dashboards/DashboardHeader.vue'
import HostAnalytics from '@/components/dashboards/HostAnalytics.vue'
import MetricsGrid from '@/components/listing-dashboard/MetricsGrid.vue'
import { useI18n } from 'vue-i18n'
import ControlDropDown from '@/components/common/ControlDropDown.vue'
import BaseMap from '@/components/common/BaseMap.vue'

// Quick Actions
import { useQuickActions } from '@/composables/useQuickActions'
import DownloadOverlay from '@/components/dashboards/overlays/DownloadOverlay.vue'
import QuickShareOverlay from '@/components/dashboards/overlays/QuickShareOverlay.vue'

const { t } = useI18n()
const { showDownload, showShare, shareLink, executeDownload } = useQuickActions()

const route = useRoute()
const router = useRouter()
const host = ref(null)
const listings = ref([])
const loading = ref(true)
const error = ref(null)

const { marketStats, fetchMarketStats } = useMarketStats()
const userStore = useUserStore()
const selectedContext = ref('city')
const selectedYear = ref(2025)
const availableYears = [2025, 2024, 2023]
const availableYearsOptions = computed(() => availableYears.map(y => ({ value: y, label: y.toString() })))

const comparisonOptions = computed(() => [
  { value: 'city', label: t('location.city') },
  { value: 'global', label: t('location.comparison_global') }
])

const isSaved = computed(() => {
  return host.value ? userStore.isHostSaved(host.value.id) : false
})

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const id = route.params.id
    const [hostData, listingsData] = await Promise.all([
      hostsService.getById(id),
      listingsService.getByHostId(id)
    ])
    host.value = hostData
    listings.value = listingsData
    
    // Fetch market stats for comparison (using a dummy listing to get general stats)
    // We assume the host operates in the city of their first listing or a default
    const city = listingsData[0]?.city || 'Porto'
    await fetchMarketStats({ city, neighbourhood: '' })
    
  } catch (err) {
    console.error('Erro ao carregar anfitrião:', err)
    error.value = t('listing.error') // Reusing error message
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

watch(() => route.params.id, (newId) => {
  if (newId) fetchData()
})

// Aggregated stats
const stats = computed(() => {
  if (!listings.value.length) return null
  
  const totalListings = listings.value.length
  const avgPrice = listings.value.reduce((sum, l) => sum + l.price, 0) / totalListings
  const avgOccupancy = listings.value.reduce((sum, l) => sum + l.occupancy, 0) / totalListings
  const totalRevenue = listings.value.reduce((sum, l) => sum + l.revenue, 0)
  const avgRating = listings.value.reduce((sum, l) => sum + l.rating, 0) / totalListings
  
  return {
    totalListings,
    price: avgPrice,
    occupancy: avgOccupancy,
    revenue: totalRevenue,
    rating: avgRating
  }
})

const metrics = computed(() => ({
  price: { label: t('metrics.avg_price'), formatter: (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v) },
  occupancy: { label: t('metrics.avg_occupancy'), formatter: (v) => `${v.toFixed(0)} ${t('dashboard.days')}` },
  revenue: { label: t('metrics.total_revenue_est'), formatter: (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v) },
  rating: { label: t('metrics.avg_rating'), formatter: (v) => v.toFixed(1) }
}))

const deviationTable = computed(() => {
  if (!stats.value || !marketStats.value) return {}
  
  const calculateDeviation = (hostVal, marketVal) => {
    if (!marketVal) return 0
    return ((hostVal - marketVal) / marketVal) * 100
  }

  const cityStats = marketStats.value.city_stats
  const globalStats = marketStats.value.global_stats // Assuming global_stats exists in useMarketStats

  return {
    city: {
      price: calculateDeviation(stats.value.price, cityStats.price.mean),
      occupancy: calculateDeviation(stats.value.occupancy, cityStats.occupancy.mean),
      revenue: calculateDeviation(stats.value.revenue, cityStats.revenue.mean), // Note: Total revenue vs Avg revenue might be misleading if not careful, but assuming per-listing avg for market
      rating: 0 // Rating deviation if needed
    },
    global: {
      price: calculateDeviation(stats.value.price, globalStats.price.mean),
      occupancy: calculateDeviation(stats.value.occupancy, globalStats.occupancy.mean),
      revenue: calculateDeviation(stats.value.revenue, globalStats.revenue.mean),
      rating: 0
    }
  }
})



const goToListing = (id) => router.push(`/casa/${id}`)

// Map locations from host's listings
const mapLocations = computed(() => {
  return listings.value
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

const handleSave = () => {
  if (host.value) {
    userStore.toggleSaveHost(host.value)
  }
}
</script>

<template>
  <section class="anfitriao-view">
    <div v-if="loading" class="state-box">
      <p>{{ $t('listing.loading') }}</p>
    </div>

    <div v-else-if="error" class="state-box error">
      <p>{{ error }}</p>
      <BaseButton variant="secondary" @click="fetchData">{{ $t('listing.retry') }}</BaseButton>
    </div>

    <div v-else-if="host" class="host-content">
      <div class="top-bar">
        <BaseButton variant="secondary" size="small" @click="router.back()">
          <template #icon>
            <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
              <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          {{ $t('listing.back') }}
        </BaseButton>
      </div>

      <!-- Host Profile Section -->
      <BaseFrame class="host-profile">
        <div class="profile-header">
          <HostAvatar 
            :src="host.host_picture_url" 
            :name="host.host_name" 
            size="100" 
            :border="true"
          />
          
          <div class="profile-info">
            <div class="name-row">
              <h1>{{ host.host_name }}</h1>
              <span v-if="host.host_is_superhost" class="superhost-badge">{{ $t('host_profile.superhost') }}</span>
              <span v-if="host.host_identity_verified" class="verified-badge">{{ $t('host_profile.verified') }}</span>
            </div>
            <p class="location">{{ host.host_location }}</p>
            <p class="member-since">{{ $t('host_profile.member_since') }} {{ host.host_since }}</p>
          </div>
        </div>

        <div v-if="host.host_about" class="about-section">
          <h2>{{ $t('host_profile.about') }}</h2>
          <p>{{ host.host_about }}</p>
        </div>

        <div class="host-meta-section">
          <div class="host-meta">
            <div class="meta-item">
              <span class="meta-label">{{ $t('host_profile.response_rate') }}</span>
              <span class="meta-value">{{ host.host_response_rate || 'N/A' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">{{ $t('host_profile.response_time') }}</span>
              <span class="meta-value">{{ host.host_response_time || 'N/A' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">{{ $t('host_profile.acceptance_rate') }}</span>
              <span class="meta-value">{{ host.host_acceptance_rate || 'N/A' }}</span>
            </div>
          </div>

          <BaseButton
            v-if="host.host_url"
            as="a"
            :href="host.host_url"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            {{ $t('host_profile.view_profile') }}
            <template #icon-right>
              <svg viewBox="0 0 20 20" style="width: 18px; height: 18px;">
                <path d="M11 3l6 6m0 0l-6 6m6-6H3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </template>
          </BaseButton>
        </div>
      </BaseFrame>

      <!-- Stats Dashboard -->
      <section v-if="stats" class="stats-dashboard">
        <DashboardHeader 
          :title="$t('host_profile.title_stats')"
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
          :default-filename="`host_${host.id}_stats_${selectedYear}`"
          @download="(args) => executeDownload({ ...args, data: { host: host, stats: stats, metrics: metrics } })"
        />

        <QuickShareOverlay
          v-model="showShare"
          :link="shareLink"
        />

        <!-- Conditional render based on year -->
        <MetricsGrid 
          v-if="selectedYear === 2025"
          :metrics="metrics"
          :listing="stats"
          :deviation-table="deviationTable"
          :selected-context="selectedContext"
        />
        
        <div v-if="selectedYear === 2025" class="analytics-section">
          <HostAnalytics :listings="listings" />
        </div>
        
        <div v-else class="empty-state">
           {{ $t('dashboard.no_data_year') }}
        </div>
      </section>

      <!-- Listings Section -->
      <section v-if="listings.length && selectedYear === 2025" class="listings-section">
        <h2>{{ $t('host_profile.properties') }} ({{ listings.length }})</h2>
        
        <!-- Map of all properties -->
        <BaseMap
          v-if="mapLocations.length > 0"
          :locations="mapLocations"
          height="300px"
          class="properties-map"
          @marker-click="(loc) => goToListing(loc.id)"
        />
        
        <div class="listings-grid">
          <BaseCard
            v-for="listing in listings"
            :key="listing.id"
            :data="listing"
            @click="goToListing"
          />
        </div>
      </section>
      
      <div v-else-if="selectedYear !== 2025" class="no-listings">
          {{ $t('host_profile.no_listings_year') }}
      </div>

      <div v-else class="no-listings">
        <p>{{ $t('host_profile.no_listings') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.anfitriao-view {
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

.host-content {
  max-width: 1200px;
  margin: 0 auto;
}

.host-content > * + * {
  margin-top: 2rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Host Profile */
.host-profile {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-header {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.profile-info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.name-row h1 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
}

.superhost-badge {
  background: linear-gradient(135deg, var(--color-star) 0%, var(--color-warning) 100%);
  color: var(--color-white);
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.verified-badge {
  background: var(--color-success-bg);
  color: var(--color-success);
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.location {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  color: var(--color-accent);
  font-weight: 500;
}

.member-since {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: var(--color-primary-60);
}

.about-section {
  padding-top: 1rem;
  border-top: 1px solid var(--color-primary-10);
}

.about-section h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.about-section p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-primary-75);
}

.host-meta-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.host-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.8rem;
  color: var(--color-primary-50);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 600;
}

.meta-value {
  font-size: 1rem;
  font-weight: 600;
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

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-primary-60);
  background: var(--color-primary-04);
  border-radius: 1rem;
}

/* Stats Dashboard */
.stats-dashboard {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 1.75rem);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.analytics-section {
  /* Margin handled by parent gap */
}

/* Listings Section */
.listings-section {
  margin-top: 1rem;
}

.listings-section h2 {
  margin: 0 0 1.25rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.properties-map {
  margin-bottom: 1.5rem;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.no-listings {
  padding: 2rem;
  text-align: center;
  background: var(--color-primary-04);
  border-radius: 1rem;
  color: var(--color-primary-60);
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

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .name-row {
    justify-content: center;
  }

  .host-meta {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>