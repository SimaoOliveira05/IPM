<template>
  <section class="dashboard">
    <DashboardHeader 
      :title="$t('dashboard.listings_title')"
      :show-save="false"
      :show-share="false"
      @download="showDownload = true"
    >
      <template #controls>
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
      :default-filename="`listings_stats_${selectedYear}`"
      @download="(args) => executeDownload({ ...args, data: { summary: summaryCards, distributions: distributions } })"
    />

    <QuickShareOverlay
      v-model="showShare"
      :link="shareLink"
    />

    <template v-if="selectedYear === 2025">
      <div class="stats-grid">
        <BaseFrame v-for="card in summaryCards" :key="card.label" class="stat-card" padding="1.25rem" rounded="1.35rem" elevation="1">
          <span class="stat-value">{{ card.value ?? '—' }}</span>
          <span class="stat-label">{{ card.label }}</span>
        </BaseFrame>
      </div>

      <div class="visual-grid">
        <BaseFrame class="panel" padding="1.5rem" rounded="1.5rem" elevation="2">
          <header><h3>{{ $t('dashboard.distribution_type') }}</h3></header>
          <div class="chart-container">
            <BaseChart 
              v-if="pieChartData"
              type="doughnut"
              :data="pieChartData"
              :options="pieChartOptions"
            />
          </div>
        </BaseFrame>

        <BaseFrame class="panel" padding="1.5rem" rounded="1.5rem" elevation="2">
          <header><h3>{{ $t('dashboard.top_neighborhoods') }}</h3></header>
          <ol class="entity-list">
            <li v-for="neighbourhood in topNeighbourhoods" :key="neighbourhood.name">
              <router-link :to="`/freguesia/${neighbourhood.name}`" class="entity-link">
                <span class="entity-name">{{ neighbourhood.name }}</span>
                <span class="entity-metric">{{ neighbourhood.count }} anúncios</span>
              </router-link>
            </li>
          </ol>
        </BaseFrame>

        <BaseFrame class="panel wide" padding="1.5rem" rounded="1.5rem" elevation="2">
          <header class="chart-header">
            <h3>{{ $t('dashboard.market_distributions') }}</h3>
            <BaseSegmentedControl
              v-model="selectedDistribution"
              :options="distributionOptions"
            />
          </header>
          <div class="chart-container bar-chart">
            <BaseChart 
              v-if="barChartData"
              type="line"
              :data="barChartData"
              :options="barChartOptions"
            />
          </div>
        </BaseFrame>
      </div>
    </template>
    
    <div v-else class="empty-state">
      <p>{{ $t('dashboard.no_data_year') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import BaseFrame from '@/components/common/BaseFrame.vue'
import BaseChart from '@/components/common/BaseChart.vue'
import DashboardHeader from '@/components/dashboards/DashboardHeader.vue'
import DownloadOverlay from '@/components/dashboards/overlays/DownloadOverlay.vue'
import QuickShareOverlay from '@/components/dashboards/overlays/QuickShareOverlay.vue'
import BaseSegmentedControl from '@/components/common/BaseSegmentedControl.vue'
import ControlDropDown from '@/components/common/ControlDropDown.vue'
import { useQuickActions } from '@/composables/useQuickActions'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { showDownload, showShare, shareLink, executeDownload } = useQuickActions()

// Stats State
const statsState = ref({
  totalListings: '...',
  avgPrice: '...',
  occupancy: '...',
  rating: '...'
})

const summaryCards = computed(() => [
  { label: t('dashboard.active_listings'), value: statsState.value.totalListings },
  { label: t('dashboard.avg_price_night'), value: statsState.value.avgPrice },
  { label: t('dashboard.occupancy_rate'), value: statsState.value.occupancy },
  { label: t('dashboard.avg_rating'), value: statsState.value.rating }
])

const topNeighbourhoods = ref([])
const selectedYear = ref(2025)
const availableYears = [2025, 2024, 2023]
const availableYearsOptions = computed(() => availableYears.map(y => ({ value: y, label: y.toString() })))

let themeObserver = null

const distributions = ref({})
const rawPieData = ref(null)
const selectedDistribution = ref('price')

const distributionOptions = computed(() => [
  { value: 'price', label: t('dashboard.price') },
  { value: 'occupancy', label: t('dashboard.occupancy') },
  { value: 'revenue', label: t('dashboard.revenue') }
])

// Computed Chart Data
const currentThemeColors = ref({
  chartPointBg: '#fff',
  textColor: '#0a2540',
  gridColor: 'rgba(0, 0, 0, 0.1)'
})

const updateThemeColors = () => {
  const styles = getComputedStyle(document.documentElement)
  currentThemeColors.value = {
    chartPointBg: styles.getPropertyValue('--chart-point-bg').trim() || '#fff',
    textColor: styles.getPropertyValue('--text-primary').trim() || '#0a2540',
    gridColor: styles.getPropertyValue('--border-color').trim() || 'rgba(0, 0, 0, 0.1)'
  }
}

const pieChartData = computed(() => {
  if (!rawPieData.value) return null
  const labels = Object.keys(rawPieData.value)
  const values = Object.values(rawPieData.value)

  return {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: ['#2563eb', '#22c55e', '#f97316', '#a855f7', '#facc15'],
      borderColor: currentThemeColors.value.chartPointBg,
      borderWidth: 2
    }]
  }
})

const pieChartOptions = computed(() => ({
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: currentThemeColors.value.textColor }
    }
  },
  cutout: '60%'
}))

const barChartData = computed(() => {
  if (!distributions.value[selectedDistribution.value]) return null
  const data = distributions.value[selectedDistribution.value]
  
  const points = [
    { x: data.min, y: 0 },
    { x: data['25%'], y: 0.25 },
    { x: data['50%'], y: 0.50 },
    { x: data['75%'], y: 0.75 },
    { x: data['90%'], y: 0.90 },
    { x: data.max, y: 1.0 }
  ]

  const mean = data.mean
  const median = data['50%']

  return {
    datasets: [
      {
        label: t('dashboard.cdf_label'),
        data: points,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: currentThemeColors.value.chartPointBg,
        pointBorderColor: '#2563eb',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        order: 2
      },
      {
        label: t('dashboard.mean'),
        data: [{ x: mean, y: 0 }, { x: mean, y: 1.0 }],
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        order: 1
      },
      {
        label: t('dashboard.median'),
        data: [{ x: median, y: 0 }, { x: median, y: 1.0 }],
        borderColor: '#22c55e',
        borderWidth: 2,
        borderDash: [2, 2],
        pointRadius: 0,
        fill: false,
        order: 0
      }
    ]
  }
})

const barChartOptions = computed(() => {
  const labelMap = {
    price: t('dashboard.price_eur'),
    occupancy: t('dashboard.occupancy_days'),
    revenue: t('dashboard.revenue_eur')
  }

  return {
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { usePointStyle: true, color: currentThemeColors.value.textColor }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const val = context[0].parsed.x
            return `${labelMap[selectedDistribution.value]}: ${new Intl.NumberFormat('pt-PT').format(val)}`
          },
          label: (context) => {
            if (context.datasetIndex === 0) {
              return `${t('dashboard.percentile')}: ${(context.parsed.y * 100).toFixed(0)}%`
            }
            return context.dataset.label
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: labelMap[selectedDistribution.value],
          color: currentThemeColors.value.textColor
        },
        ticks: { color: currentThemeColors.value.textColor },
        grid: { color: currentThemeColors.value.gridColor }
      },
      y: {
        min: 0,
        max: 1.05,
        title: {
          display: true,
          text: t('dashboard.cumulative_percentile'),
          color: currentThemeColors.value.textColor
        },
        ticks: {
          callback: (value) => (value * 100).toFixed(0) + '%',
          color: currentThemeColors.value.textColor
        },
        grid: { color: currentThemeColors.value.gridColor }
      }
    }
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
}

const formatPercent = (value) => {
  return new Intl.NumberFormat('pt-PT', { style: 'percent', minimumFractionDigits: 1 }).format(value)
}

const fetchData = async () => {
  // Mock logic: Only 2025 has data
  if (selectedYear.value !== 2025) {
    statsState.value = {
      totalListings: '0',
      avgPrice: formatCurrency(0),
      occupancy: formatPercent(0),
      rating: '0.00'
    }
    rawPieData.value = null
    distributions.value = {}
    topNeighbourhoods.value = []
    return
  }

  try {
    // Fetch Global Stats
    const resGlobal = await fetch('http://localhost:3000/stats_global')
    const statsGlobal = await resGlobal.json()

    statsState.value = {
        totalListings: statsGlobal.total_listings.toLocaleString('pt-PT'),
        avgPrice: formatCurrency(statsGlobal.avg_price),
        occupancy: formatPercent(statsGlobal.avg_occupancy),
        rating: statsGlobal.avg_rating.toFixed(2)
    }

    rawPieData.value = statsGlobal.room_type_counts

    // Store distributions
    distributions.value = {
      price: statsGlobal.price_distribution,
      occupancy: statsGlobal.occupancy_distribution,
      revenue: statsGlobal.revenue_distribution
    }

    // Fetch Neighbourhood Stats
    const resNeighbourhoods = await fetch('http://localhost:3000/stats_neighbourhoods')
    const statsNeighbourhoods = await resNeighbourhoods.json()

    // Process Top Neighbourhoods
    const sortedNeighbourhoods = Object.entries(statsNeighbourhoods)
      .map(([name, data]) => ({ name, count: data.total_listings }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    topNeighbourhoods.value = sortedNeighbourhoods

  } catch (error) {
    console.error('Error fetching listings data:', error)
  }
}

watch(selectedYear, () => {
    fetchData()
})

onMounted(() => {
  fetchData()
  updateThemeColors()
  
  // Watch for theme changes
  themeObserver = new MutationObserver(updateThemeColors)
  themeObserver.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['data-theme'] 
  })
})

onBeforeUnmount(() => {
  if (themeObserver) themeObserver.disconnect()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--bg-gradient);
  border-radius: clamp(1.5rem, 4vw, 2rem);
  box-shadow: 0 18px 36px var(--color-primary-08);
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background: var(--color-primary-04);
  border-radius: 1.5rem;
  color: var(--color-primary-60);
  font-size: 1.1rem;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
}

.stat-card {
  position: relative;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  background: var(--bg-primary);
  border-radius: 1.35rem;
  box-shadow: 0 12px 24px var(--color-primary-05);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.stat-value {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.95rem;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

.visual-grid {
  display: grid;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.panel {
  background: var(--bg-primary);
  border-radius: 1.5rem;
  box-shadow: 0 16px 32px var(--color-primary-08);
  padding: clamp(1.5rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel.wide {
  grid-column: 1 / -1;
}

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

.chart-container.bar-chart {
  height: 300px;
}

.panel header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: var(--text-primary);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.entity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.entity-list li {
  padding: 0;
}

.entity-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  color: var(--text-primary);
  text-decoration: none;
  padding: 0.5rem 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.entity-link:hover {
  background: var(--bg-secondary);
  color: var(--color-accent);
}

.entity-name {
  font-weight: 600;
}

.entity-metric {
  color: var(--text-secondary);
}
</style>
