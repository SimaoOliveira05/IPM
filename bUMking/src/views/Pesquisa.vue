<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { useDropdowns } from '@/composables/useDropdowns'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/stores/searchStore'
import SearchControls from '@/components/search/SearchControls.vue'
import ResultsPanel from '@/components/search/ResultsPanel.vue'
import InsightsPanel from '@/components/InsightsPanel.vue'
import BaseMap from '@/components/common/BaseMap.vue'
import { getRoomTypeLabel } from '@/composables/useRoomTypeLabel'
import { locationStatsService } from '@/services/locationStatsService'
import { useUrlSync } from '@/composables/useUrlSync'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const { 
  loading, 
  error, 
  locationQuery, 
  category, 
  sortValue, 
  sortedListings
} = storeToRefs(searchStore)

const CATEGORY_OPTIONS = ['listings', 'hosts', 'neighbourhoods']

const SORT_OPTIONS = computed(() => [
  { value: 'rating-desc', label: t('sort.rating_best') },
  { value: 'rating-asc', label: t('sort.rating_worst') },
  { value: 'price-desc', label: t('sort.price_highest') },
  { value: 'price-asc', label: t('sort.price_lowest') }
])

const HOST_SORT_OPTIONS = computed(() => [
  { value: 'alphabetical', label: t('sort.alphabetical') }
])

const currentSortOptions = computed(() => 
  category.value === 'hosts' ? HOST_SORT_OPTIONS.value : SORT_OPTIONS.value
)
const defaultLocation = 'Porto'

// Dropdowns composable
const { filterOpen, sortOpen, categoryOpen, toggleDropdown } = useDropdowns()
const handleCategoryToggle = () => toggleDropdown('category')
const handleSortToggle = () => toggleDropdown('sort')
const handleFilterToggle = () => toggleDropdown('filter')

// Carregar dados da API via Store
const fetchListings = () => {
  searchStore.fetchListings()
}

// Gerar opções de filtro a partir dos tipos reais presentes nos dados
const HOUSE_TYPE_VALUES = Object.freeze([
  'Entire home/apt',
  'Private room',
  'Shared room'
])
const HOUSE_TYPE_OPTIONS = HOUSE_TYPE_VALUES.map(value => ({ value, label: getRoomTypeLabel(value) }))


const PRICE_STEP = 1
const RATING_STEP = 0.1

// Pagination and derived UI data (usePagination composable)
const resultsCount = computed(() => sortedListings.value.length)
const currentLocationLabel = computed(() => locationQuery.value || defaultLocation)
const categoryDisplay = computed(() => (category.value === 'hosts' ? 'anfitriões monitorizados' : 'anúncios analisados'))
const resultsMeta = computed(() => `${currentLocationLabel.value} • ${categoryDisplay.value}`)

const PAGE_SIZE_OPTIONS = Object.freeze([25, 50])
const pageSize = ref(PAGE_SIZE_OPTIONS[0])
const {
  currentPage,
  totalPages,
  paginatedItems: paginatedListings,
  pageNumbers,
  pageRangeLabel,
  goToPage,
  goToPreviousPage,
  goToNextPage,
  jumpPages
} = usePagination({ items: sortedListings, pageSize })

// Dynamic location stats
const locationData = ref(null)
const locationStatsLoading = ref(false)

const fetchLocationStats = async () => {
  locationStatsLoading.value = true
  try {
    const data = await locationStatsService.findLocationStats(locationQuery.value)
    locationData.value = data
  } catch (err) {
    console.error('Error fetching location stats:', err)
    locationData.value = null
  } finally {
    locationStatsLoading.value = false
  }
}

const locationStats = computed(() => {
  return locationStatsService.formatStatsForDisplay(locationData.value)
})

const statistics = computed(() => locationStats.value.formattedStats)
const matchedLocationName = computed(() => locationStats.value.locationName)
const matchedLocationType = computed(() => locationStats.value.locationType)

// Map locations from all listings (filtered/sorted)
const listingsMapLocations = computed(() => {
  return sortedListings.value
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

// Debounced watcher for location query changes for statistics
let locationStatsDebounce = null
watch(() => locationQuery.value, () => {
  clearTimeout(locationStatsDebounce)
  locationStatsDebounce = setTimeout(() => {
    fetchLocationStats()
  }, 300)
})

// --- URL Sync Logic (Refactored to Composable) ---
const { syncStateFromUrl, setupWatchers } = useUrlSync({
  router,
  route,
  searchStore,
  currentPage,
  goToPage,
  categoryOptions: CATEGORY_OPTIONS
})

// Initialize
onMounted(async () => {
  // 1. Fetch data first (Populates items so pagination limits are valid)
  await fetchListings()
  fetchLocationStats()
  
  // 2. Sync state from URL (Sets Page=18. Since data exists, no clamp happens)
  syncStateFromUrl()
  
  // 3. Setup watchers (Start tracking changes)
  setupWatchers()
})

</script>

<template>
  <section class="pesquisa">
    <header class="page-hero">
    </header>

    <div class="layout" :class="{ 'single-column': category === 'hosts' || category === 'neighbourhoods' }">
      <div class="primary-column">
        <SearchControls
          v-model="locationQuery"
          v-model:category="category"
          :categories="CATEGORY_OPTIONS"
          :filter-open="filterOpen"
          :sort-open="sortOpen"
          :category-open="categoryOpen"
          :sort-options="currentSortOptions"
          v-model:sort-value="sortValue"
          :house-type-options="HOUSE_TYPE_OPTIONS"
          :price-step="PRICE_STEP"
          :rating-step="RATING_STEP"
          @toggle-filter="handleFilterToggle"
          @toggle-sort="handleSortToggle"
          @toggle-category="handleCategoryToggle"
        />

        <ResultsPanel
          :meta-label="resultsMeta"
          :results-count="resultsCount"
          :listings="paginatedListings"
          :page-size="pageSize"
          :page-size-options="PAGE_SIZE_OPTIONS"
          :page-range-label="pageRangeLabel"
          :page-numbers="pageNumbers"
          :current-page="currentPage"
          :total-pages="totalPages"
          v-model:page-size="pageSize"
          @go-to-page="goToPage"
          @next-page="goToNextPage"
          @previous-page="goToPreviousPage"
          @jump-pages="jumpPages"
        />
      </div>
      <!-- Sidebar: Insights + Map side by side -->
      <div v-if="category !== 'hosts' && category !== 'neighbourhoods'" class="sidebar-with-map">
        <InsightsPanel
          :title="matchedLocationName"
          :description="matchedLocationType === 'neighbourhood' ? ($t('location.neighbourhood') + ' ' + $t('location.title_stats')) : ($t('location.city') + ' ' + $t('location.title_stats'))"
          :stats="statistics"
          :loading="locationStatsLoading"
          :location-slug="matchedLocationName"
        />

        <!-- Mini Map of listings -->
        <div v-if="listingsMapLocations.length > 0" class="mini-map-container">
          <BaseMap
            :locations="listingsMapLocations"
            height="100%"
            @marker-click="(loc) => router.push(`/casa/${loc.id}`)"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <p>A carregar dados...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>Erro ao carregar dados: {{ error }}</p>
      <button @click="fetchListings">Tentar novamente</button>
    </div>
  </section>
</template>

<style scoped>
.pesquisa {
  display: flex;
  flex-direction: column;
  gap: clamp(1.6rem, 3.5vw, 2.6rem);
  padding: clamp(1.1rem, 3vw, 2.1rem) clamp(1.5rem, 4vw, 3rem) clamp(1.75rem, 4vw, 3rem);
  background: var(--bg-gradient);
  border-radius: clamp(1.6rem, 4vw, 2.2rem);
  box-shadow: 0 22px 44px var(--color-primary-08);
  color: var(--text-primary);
  min-height: calc(100vh - 120px);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 420px);
  gap: clamp(1.75rem, 4vw, 3rem);
  align-items: start;
}

.primary-column {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.3rem);
}

.layout.single-column {
  grid-template-columns: 1fr;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .primary-column {
    gap: clamp(1.4rem, 4vw, 2.1rem);
  }
}

.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
  border-radius: 1rem;
  background: rgba(246, 248, 251, 0.8);
}

.error-state button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.sidebar-with-map {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1.5rem;
  align-self: start;
}

.mini-map-container {
  height: 280px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 16px var(--color-primary-08);
}
</style>