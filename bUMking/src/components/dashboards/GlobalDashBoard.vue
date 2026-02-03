<template>
  <section class="dashboard">
    <header class="dashboard-header">
      <h2>Panorama global</h2>
      <p class="last-update">Última atualização: {{ lastUpdated || '—' }}</p>
    </header>

    <div class="stats-grid">
      <BaseFrame v-for="card in summaryCards" :key="card.label" class="stat-card" padding="1.25rem" rounded="1.35rem" elevation="1">
        <span class="stat-value">{{ card.value ?? '—' }}</span>
        <span class="stat-label">{{ card.label }}</span>
        <small v-if="card.delta" :class="['stat-delta', { up: card.delta > 0, down: card.delta < 0 }]">
          {{ formatDelta(card.delta) }}
        </small>
      </BaseFrame>
    </div>

    <div class="visual-grid">
      <BaseFrame class="panel wide" padding="1.5rem" rounded="1.5rem" elevation="2">
        <header><h3>Evolução do preço médio</h3></header>
        <canvas ref="lineCanvas" aria-label="Evolução do preço médio"></canvas>
      </BaseFrame>

      <BaseFrame class="panel" padding="1.5rem" rounded="1.5rem" elevation="2">
        <header><h3>Distribuição por tipo de alojamento</h3></header>
        <canvas ref="pieCanvas" aria-label="Distribuição por tipo de alojamento"></canvas>
      </BaseFrame>

      <BaseFrame class="panel" padding="1.5rem" rounded="1.5rem" elevation="2">
        <header><h3>Top anfitriões</h3></header>
        <ol class="entity-list">
          <li v-for="host in topHosts" :key="host.id">
            <span class="entity-name">{{ host.name }}</span>
            <span class="entity-metric">{{ host.metric }}</span>
          </li>
        </ol>
      </BaseFrame>

      <BaseFrame class="panel" padding="1.5rem" rounded="1.5rem" elevation="2">
        <header><h3>Top cidades por anúncios</h3></header>
        <ol class="entity-list">
          <li v-for="city in topCities" :key="city.id">
            <span class="entity-name">{{ city.name }}</span>
            <span class="entity-metric">{{ city.metric }}</span>
          </li>
        </ol>
      </BaseFrame>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'
import BaseFrame from '@/components/common/BaseFrame.vue'

const placeholderDashboard = Object.freeze({
  summaryCards: [
    { label: 'Anúncios monitorizados', value: 'x', delta: 0.047 },
    { label: 'Taxa média de ocupação', value: 'x%', delta: 0.012 },
    { label: 'Preço médio/noite', value: '€ x', delta: -0.018 },
    { label: 'Avaliações analisadas', value: 'x', delta: 0.063 }
  ],
  listingDistribution: {
    labels: ['Quarto', 'Casa', 'Hotel', 'Apartamento', 'Outro'],
    values: [42, 28, 15, 11, 4]
  },
  averagePriceSeries: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    values: [79, 82, 85, 88, 92, 96, 104, 112, 108, 101, 95, 90]
  },
  topHosts: [
    { id: 'host-1', name: 'Lisbon Prime Stays', metric: 'x reservas' },
    { id: 'host-2', name: 'Porto Charming Homes', metric: 'x reservas' },
    { id: 'host-3', name: 'Algarve Sun Rentals', metric: 'x reservas' }
  ],
  topCities: [
    { id: 'lisboa', name: 'Lisboa', metric: 'x anúncios' },
    { id: 'porto', name: 'Porto', metric: 'x anúncios' },
    { id: 'faro', name: 'Faro', metric: 'x anúncios' }
  ],
  lastUpdated: new Date().toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' })
})

const summaryCards = ref(placeholderDashboard.summaryCards)
const listingDistribution = ref(placeholderDashboard.listingDistribution)
const averagePriceSeries = ref(placeholderDashboard.averagePriceSeries)
const topHosts = ref(placeholderDashboard.topHosts)
const topCities = ref(placeholderDashboard.topCities)
const lastUpdated = ref(placeholderDashboard.lastUpdated)

const pieCanvas = ref(null)
const lineCanvas = ref(null)
let pieChartInstance = null
let lineChartInstance = null

const formatDelta = (delta) => {
  if (typeof delta !== 'number') return ''
  const formatted = (delta * 100).toFixed(1)
  return `${delta > 0 ? '+' : ''}${formatted}%`
}

const renderPieChart = () => {
  if (!pieCanvas.value) return
  if (pieChartInstance) pieChartInstance.destroy()

  pieChartInstance = new Chart(pieCanvas.value, {
    type: 'doughnut',
    data: {
      labels: listingDistribution.value.labels,
      datasets: [
        {
          data: listingDistribution.value.values,
          backgroundColor: ['#2563eb', '#22c55e', '#f97316', '#a855f7', '#facc15']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      cutout: '60%'
    }
  })
}

const renderLineChart = () => {
  if (!lineCanvas.value) return
  if (lineChartInstance) lineChartInstance.destroy()

  lineChartInstance = new Chart(lineCanvas.value, {
    type: 'line',
    data: {
      labels: averagePriceSeries.value.labels,
      datasets: [
        {
          label: 'Preço médio (€/noite)',
          data: averagePriceSeries.value.values,
          fill: false,
          borderColor: '#2563eb',
          tension: 0.35,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false, ticks: { callback: (value) => `€ ${value}` } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  })
}

watch(listingDistribution, renderPieChart, { deep: true })
watch(averagePriceSeries, renderLineChart, { deep: true })

onMounted(() => {
  renderPieChart()
  renderLineChart()
})

onBeforeUnmount(() => {
  if (pieChartInstance) pieChartInstance.destroy()
  if (lineChartInstance) lineChartInstance.destroy()
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
  box-shadow: 0 18px 36px rgba(10, 37, 64, 0.08);
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
}

.dashboard-header h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.35rem);
  color: #0a2540;
}

.last-update {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(10, 37, 64, 0.55);
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
  box-shadow: 0 12px 24px rgba(10, 37, 64, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.stat-value {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  color: #0a2540;
}

.stat-label {
  font-size: 0.95rem;
  color: rgba(10, 37, 64, 0.55);
  letter-spacing: 0.02em;
}

.stat-delta {
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-delta.up {
  color: #16a34a;
}

.stat-delta.down {
  color: #dc2626;
}

.visual-grid {
  display: grid;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.panel {
  background: var(--bg-primary);
  border-radius: 1.5rem;
  box-shadow: 0 16px 32px rgba(10, 37, 64, 0.07);
  padding: clamp(1.5rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel.wide {
  grid-column: span 2;
}

.panel header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0a2540;
}

.entity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.entity-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  color: #0a2540;
}

.entity-name {
  font-weight: 600;
}

.entity-metric {
  color: rgba(10, 37, 64, 0.6);
}

@media (max-width: 900px) {
  .panel.wide {
    grid-column: span 1;
  }
}
</style>