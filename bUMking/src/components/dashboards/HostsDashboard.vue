<template>
  <section class="dashboard">
    <DashboardHeader 
      :title="$t('dashboard.hosts_title')"
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
      :default-filename="`hosts_stats_${selectedYear}`"
      @download="(args) => executeDownload({ ...args, data: { summary: summaryCards, revenue: topHostsByRevenue } })"
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
          <header><h3>{{ $t('dashboard.top_hosts_revenue') }}</h3></header>
          <ol class="entity-list">
            <li v-for="host in topHostsByRevenue" :key="host.host_id">
              <router-link :to="`/anfitriao/${host.host_id}`" class="entity-link">
                <span class="entity-name">{{ host.name }}</span>
                <span class="entity-metric">{{ formatCurrency(host.total_revenue) }}</span>
              </router-link>
            </li>
          </ol>
        </BaseFrame>

        <BaseFrame class="panel" padding="1.5rem" rounded="1.5rem" elevation="2">
          <header><h3>{{ $t('dashboard.top_hosts_listings') }}</h3></header>
          <ol class="entity-list">
            <li v-for="host in topHostsByListings" :key="host.host_id">
              <router-link :to="`/anfitriao/${host.host_id}`" class="entity-link">
                <span class="entity-name">{{ host.name }}</span>
                <span class="entity-metric">{{ host.num_listings }} {{ $t('dashboard.listings_unit') }}</span>
              </router-link>
            </li>
          </ol>
        </BaseFrame>
      </div>
    </template>

    <div v-else class="empty-state">
      <p>{{ $t('dashboard.no_data_year') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import BaseFrame from '@/components/common/BaseFrame.vue'
import DashboardHeader from '@/components/dashboards/DashboardHeader.vue'
import DownloadOverlay from '@/components/dashboards/overlays/DownloadOverlay.vue'
import QuickShareOverlay from '@/components/dashboards/overlays/QuickShareOverlay.vue'
import ControlDropDown from '@/components/common/ControlDropDown.vue'
import { statsService } from '@/services/statsService'
import { useQuickActions } from '@/composables/useQuickActions'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { showDownload, showShare, shareLink, executeDownload } = useQuickActions()

// Stats State
const statsState = ref({
  totalHosts: '...',
  avgRevenue: '...'
})

const summaryCards = computed(() => [
  { label: t('dashboard.total_hosts'), value: statsState.value.totalHosts },
  { label: t('dashboard.avg_revenue'), value: statsState.value.avgRevenue }
])

const topHostsByRevenue = ref([])
const topHostsByListings = ref([])
const selectedYear = ref(2025)
const availableYears = [2025, 2024, 2023]
const availableYearsOptions = computed(() => availableYears.map(y => ({ value: y, label: y.toString() })))

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
}

const fetchData = async () => {
  // Mock logic: Only 2025 has data
  if (selectedYear.value !== 2025) {
    statsState.value = {
      totalHosts: '0',
      avgRevenue: formatCurrency(0)
    }
    topHostsByRevenue.value = []
    topHostsByListings.value = []
    return
  }

  try {
    const data = await statsService.getTopHosts()

    statsState.value = {
        totalHosts: data.totalHosts.toLocaleString('pt-PT'),
        avgRevenue: formatCurrency(data.avgRevenue)
    }

    topHostsByRevenue.value = data.topHostsByRevenue
    topHostsByListings.value = data.topHostsByListings

  } catch (error) {
    console.error('Error fetching hosts data:', error)
  }
}

watch(selectedYear, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
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
  cursor: default;
}

.stat-value {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--text-primary);
  cursor: default;
}

.stat-label {
  font-size: 0.95rem;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  cursor: default;
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
  cursor: default;
}

.panel header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: var(--text-primary);
  cursor: default;
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
  width: 100%;
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
  cursor: default;
}
</style>
