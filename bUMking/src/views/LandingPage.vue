<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/stores/searchStore'
import MarketOverview from '@/components/dashboards/MarketOverview.vue'
import HostsDashboard from '@/components/dashboards/HostsDashboard.vue'
import InsightsGrid from '@/components/InsightsGrid.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { statsService } from '@/services/statsService'
import { useI18n } from 'vue-i18n'

// Hero images for light/dark themes
import heroImageLight from '@/assets/images/hero_analytics_illustration.png'
import heroImageDark from '@/assets/images/hero_analytics_dark.png'

const { t } = useI18n()

// Theme detection
const isDarkTheme = ref(false)

const updateTheme = () => {
  isDarkTheme.value = document.documentElement.getAttribute('data-theme') === 'dark'
}

const heroImage = computed(() => isDarkTheme.value ? heroImageDark : heroImageLight)

const router = useRouter()
const searchStore = useSearchStore()
const { locationQuery, category } = storeToRefs(searchStore)

// Reactive stats values
const statsData = ref({
  cities: null,
  listings: null,
  hosts: null
})

const datasetStats = computed(() => [
  { value: statsData.value.cities ?? '...', label: t('stats.monitored_cities') },
  { value: statsData.value.listings ?? '...', label: t('stats.active_listings') },
  { value: statsData.value.hosts ?? '...', label: t('stats.analyzed_hosts') }
])

const insightCards = computed(() => [
  {
    title: t('insights.benchmark.title'),
    description: t('insights.benchmark.description'),
  },
  {
    title: t('insights.availability.title'),
    description: t('insights.availability.description'),
  },
  {
    title: t('insights.reputation.title'),
    description: t('insights.reputation.description'),
  }
])

// Buscar estatísticas da API
const fetchStats = async () => {
  try {
    const stats = await statsService.getGlobalStats()
    
    statsData.value = {
      cities: stats.total_cities.toString(),
      listings: stats.total_listings.toLocaleString('pt-PT'),
      hosts: stats.total_hosts.toLocaleString('pt-PT')
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    statsData.value = { cities: '—', listings: '—', hosts: '—' }
  }
}

onMounted(() => {
  fetchStats()
  updateTheme()
  // Watch for theme changes
  const observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})

const handleSearch = () => {
  // Store state is already updated via v-model
  router.push({
    path: '/pesquisa',
    query: {
      q: locationQuery.value,
      category: category.value
    }
  })
}

</script>

<template>
  <div class="landing-page">
    <section class="hero">
      <div class="hero-shell">
        <div class="hero-content">
          <span class="hero-tag">{{ $t('hero.tag') }}</span>
          <h1>{{ $t('hero.title') }}</h1>
          <p class="hero-subtitle">
            {{ $t('hero.subtitle') }}
          </p>  

          <SearchBar
            v-model="locationQuery"
            v-model:category="category"
            @search="handleSearch"
          />

          <ul class="hero-stats">
            <li v-for="item in datasetStats" :key="item.label" class="stat-item">
              <span class="value">{{ item.value }}</span>
              <span class="label">{{ item.label }}</span>
            </li>
          </ul>
        </div>
        
        <div class="hero-image">
          <img :src="heroImage" alt="Analytics Illustration" />
        </div>
      </div>
    </section>

    <InsightsGrid :cards="insightCards" />

    <section class="global-stats">
      <div class="stats-shell">
        <MarketOverview />
        <HostsDashboard />
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 7vw, 4rem);
  padding-bottom: clamp(2.5rem, 7vw, 4.5rem);
}

.global-stats {
  padding: 0 clamp(1.5rem, 6vw, 5rem);
}

.stats-shell {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
}

.hero {
  position: relative;
  isolation: isolate;
  padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 6vw, 5rem);
  background: var(--bg-secondary);
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-shell {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(4rem, 8vw, 8rem);
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
  text-align: left;
}

.hero-image {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 2rem;
}

.hero-image img {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(10, 37, 64, 0.1));
  border-radius: 2rem;
}

.hero-tag {
  align-self: flex-start;
  padding: 0.45rem 1.25rem;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.hero h1 {
  margin: 0;
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin: 0;
  font-size: clamp(1.1rem, 1.5vw, 1.25rem);
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 90%;
}

.hero-stats {
  display: flex;
  gap: clamp(1.5rem, 3vw, 3rem);
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: nowrap; /* Force single line */
  margin-top: 2rem;
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.stat-item .value {
  font-size: clamp(1.8rem, 2.5vw, 2.2rem);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-item .label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-weight: 500;
}

@media (max-width: 900px) {
  .hero-shell {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }

  .hero-content {
    align-items: center;
    text-align: center;
  }

  .hero-tag {
    align-self: center;
  }

  .hero-subtitle {
    max-width: 100%;
  }

  .hero-stats {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1rem;
    min-height: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-around;
  }

  .stat-item {
    align-items: center;
    min-width: 80px;
  }

  .stat-item .value {
    font-size: 1.4rem;
  }

  .stat-item .label {
    font-size: 0.7rem;
  }

  .global-stats {
    padding: 0 1rem;
  }

  .hero-image {
    display: none;
  }
}

</style>