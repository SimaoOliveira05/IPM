<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseFrame from '@/components/common/BaseFrame.vue'
import BaseChart from '@/components/common/BaseChart.vue'

const props = defineProps({
  listings: {
    type: Array,
    required: true
  }
})

const { t } = useI18n()
const chartBorderColor = ref('#ffffff')

const updateThemeColors = () => {
  const styles = getComputedStyle(document.documentElement)
  chartBorderColor.value = styles.getPropertyValue('--chart-point-bg').trim() || '#ffffff'
}

let observer = null
onMounted(() => {
  updateThemeColors()
  observer = new MutationObserver(updateThemeColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

// Room Type Distribution (Pie Chart)
const roomTypeData = computed(() => {
  const counts = {}
  props.listings.forEach(l => {
    const type = l.room_type
    counts[type] = (counts[type] || 0) + 1
  })

  const labels = Object.keys(counts).map(key => {
    // Map usage of room types to translation keys if possible or just use the same logic as elsewhere
    // Assuming keys are 'Entire home/apt', etc from DB. we can use getRoomTypeLabel logic OR standard keys.
    // Let's use standard keys.
    const keyMap = {
      'Entire home/apt': 'location.room_types.entire_home',
      'Private room': 'location.room_types.private_room',
      'Shared room': 'location.room_types.shared_room',
      'Hotel room': 'location.room_types.hotel_room'
    }
    return keyMap[key] ? t(keyMap[key]) : key
  })

  return {
    labels,
    datasets: [{
      data: Object.values(counts),
      backgroundColor: ['#2563eb', '#22c55e', '#f97316', '#a855f7'],
      borderColor: chartBorderColor.value,
      borderWidth: 2
    }]
  }
})

// Ratings Distribution (Bar Chart)
const ratingsData = computed(() => {
  // Buckets: 0-1, 1-2, 2-3, 3-4, 4-5
  const buckets = [0, 0, 0, 0, 0]
  props.listings.forEach(l => {
    const r = l.rating || 0
    if (r >= 5) buckets[4]++
    else buckets[Math.floor(r)]++
  })

  return {
    labels: ['0-1', '1-2', '2-3', '3-4', '4-5'],
    datasets: [{
      label: t('host_analytics.ratings'),
      data: buckets,
      backgroundColor: '#2563eb',
      borderRadius: 4
    }]
  }
})

// Price Distribution (Line/Area Chart) - Simplified Histogram
const priceData = computed(() => {
  const prices = props.listings.map(l => l.price).sort((a, b) => a - b)
  if (!prices.length) return { labels: [], datasets: [] }

  // Create 5 buckets
  const min = prices[0]
  const max = prices[prices.length - 1]
  const step = (max - min) / 5 || 10
  
  const buckets = [0, 0, 0, 0, 0]
  const labels = []
  
  for (let i = 0; i < 5; i++) {
    const start = Math.floor(min + i * step)
    const end = Math.floor(min + (i + 1) * step)
    labels.push(`${start}-${end}€`)
  }

  prices.forEach(p => {
    const index = Math.min(Math.floor((p - min) / step), 4)
    buckets[index]++
  })

  return {
    labels,
    datasets: [{
      label: t('host_analytics.prices'),
      data: buckets,
      backgroundColor: '#2563eb',
      borderRadius: 4
    }]
  }
})

const pieOptions = {
  plugins: { legend: { position: 'bottom' } },
  cutout: '60%'
}

const barOptions = computed(() => ({
  plugins: { legend: { display: false } },
  scales: { 
    y: { 
      beginAtZero: true, 
      ticks: { precision: 0 },
      title: { display: true, text: t('host_analytics.num_listings') }
    },
    x: {
      title: { display: true, text: t('host_analytics.range') }
    }
  }
}))
</script>

<template>
  <div class="host-analytics">
    <div class="analytics-grid">
      <!-- Room Types -->
      <BaseFrame :title="$t('host_analytics.room_type_dist')" padding="1.25rem">
        <div class="chart-container">
          <BaseChart type="doughnut" :data="roomTypeData" :options="pieOptions" />
        </div>
      </BaseFrame>

      <!-- Ratings -->
      <BaseFrame :title="$t('host_analytics.rating_dist')" padding="1.25rem">
        <div class="chart-container">
          <BaseChart type="bar" :data="ratingsData" :options="barOptions" />
        </div>
      </BaseFrame>

      <!-- Prices -->
      <BaseFrame :title="$t('host_analytics.price_dist')" padding="1.25rem">
        <div class="chart-container">
          <BaseChart type="bar" :data="priceData" :options="barOptions" />
        </div>
      </BaseFrame>
    </div>
  </div>
</template>

<style scoped>
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  height: 250px;
  position: relative;
}
</style>
