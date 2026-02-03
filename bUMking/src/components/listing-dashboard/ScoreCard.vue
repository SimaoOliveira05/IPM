<template>
  <div class="score-row">
    <BaseFrame class="score-card" padding="1.5rem" rounded="1.5rem" elevation="2">
      <div class="score-circle" :class="getScoreClass(score)">
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="score-details">
        <h3>{{ $t('dashboard.competitiveness.' + label) }}</h3>
        <div class="market-fit-badge" :class="getMarketFitClass(marketFit)">
          {{ $t('dashboard.market_fit.' + marketFit) }}
        </div>
      </div>
    </BaseFrame>

    <BaseFrame class="narrative-card" padding="1.5rem" rounded="1.5rem" elevation="1">
      <h3>{{ $t('dashboard.analysis_summary', { context: contextLabel }) }}</h3>
      <div class="summary-text">
        <p>{{ formattedSummary.intro }}</p>
        <p>{{ formattedSummary.pos }}</p>
        <p v-if="formattedSummary.anomalies">{{ formattedSummary.anomalies }}</p>
        <p>{{ formattedSummary.recommendation }}</p>
      </div>
    </BaseFrame>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseFrame from '@/components/common/BaseFrame.vue'

const props = defineProps({
  score: { type: Number, required: true },
  label: { type: String, required: true },
  marketFit: { type: String, required: true },
  summary: { type: Object, required: true },
  contextLabel: { type: String, required: true }
})

const { t } = useI18n()

const formattedSummary = computed(() => {
  const s = props.summary
  const intro = t('dashboard.summary_intro', { price: s.percentiles.price, occupancy: s.percentiles.occupancy })
  const pos = t('dashboard.summary_pos', { 
    alignment: t('dashboard.alignment.' + s.alignment), 
    score: s.score, 
    label: t('dashboard.competitiveness.' + s.label) 
  })
  
  let anomalies = null
  if (s.anomalies.length > 0) {
    const list = s.anomalies.map(a => t('dashboard.anomalies.' + a)).join(', ')
    anomalies = t('dashboard.summary_anomalies', { list })
  }
  
  const recommendation = (s.marketFit === 'excellent' || s.marketFit === 'good')
    ? t('dashboard.summary_recommendation_good')
    : t('dashboard.summary_recommendation_bad')
    
  return { intro, pos, anomalies, recommendation }
})

const getScoreClass = (score) => {
  if (score >= 80) return 'score-high'
  if (score >= 50) return 'score-med'
  return 'score-low'
}

const getMarketFitClass = (fit) => {
  if (fit === 'excellent') return 'fit-excellent'
  if (fit === 'good') return 'fit-good'
  if (fit === 'needs_work') return 'fit-warn'
  return 'fit-bad'
}
</script>

<style scoped>
.score-row {
  display: grid;
  grid-template-columns: minmax(280px, 1.2fr) 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.score-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--bg-primary);
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid;
  flex-shrink: 0;
}

.score-value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
}

.score-high { border-color: var(--color-success); color: var(--color-success); background: var(--color-success-10); }
.score-med { border-color: var(--color-warning); color: var(--color-warning); background: var(--color-warning-10); }
.score-low { border-color: var(--color-error); color: var(--color-error); background: var(--color-error-10); }

.score-details h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 700;
}

.market-fit-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.fit-excellent { background: var(--color-success-bg); color: var(--color-success-dark); }
.fit-good { background: #dbeafe; color: #1e40af; }
.fit-warn { background: var(--color-warning-bg); color: var(--color-warning-dark); }
.fit-bad { background: var(--color-error-bg); color: var(--color-error-dark); }

.narrative-card {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.narrative-card h3 {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: var(--color-primary-60);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.narrative-card p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .score-row {
    grid-template-columns: 1fr;
  }
  
  .score-card {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }
}
</style>
