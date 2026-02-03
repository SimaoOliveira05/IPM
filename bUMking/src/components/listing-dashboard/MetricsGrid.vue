<template>
  <div class="metrics-grid">
    <BaseFrame v-for="(metric, key) in metrics" :key="key" class="metric-card" padding="1.25rem" rounded="1.25rem" elevation="1">
      <span class="metric-label">{{ metric.label }}</span>
      <div class="metric-value-row">
        <span class="metric-value">{{ metric.formatter(listing[key]) }}</span>
        <span class="comparison-badge" :class="getComparisonClass(getDeviation(key))">
          <span class="arrow">{{ getComparisonArrow(getDeviation(key)) }}</span>
          {{ Math.abs(parseFloat(getDeviation(key))).toFixed(1) }}%
        </span>
      </div>
    </BaseFrame>
  </div>
</template>

<script setup>
import BaseFrame from '@/components/common/BaseFrame.vue'

const props = defineProps({
  metrics: { type: Object, required: true },
  listing: { type: Object, required: true },
  deviationTable: { type: Object, default: () => ({}) },
  selectedContext: { type: String, default: 'city' }
})

const getDeviation = (key) => {
  if (!props.deviationTable) return 0
  const contextMap = {
    city: 'city',
    neighbourhood: 'neighbourhood',
    global: 'global'
  }
  const context = contextMap[props.selectedContext] || 'city'
  return props.deviationTable[context]?.[key] || 0
}

const getComparisonClass = (deviation) => {
  const val = parseFloat(deviation)
  if (isNaN(val) || val === 0) return 'neutral'
  return val > 0 ? 'positive' : 'negative'
}

const getComparisonArrow = (deviation) => {
  const val = parseFloat(deviation)
  if (isNaN(val) || val === 0) return '→'
  return val > 0 ? '↑' : '↓'
}
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-label {
  font-size: 0.8rem;
  color: var(--color-primary-60);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 600;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.comparison-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-weight: 700;
}

.comparison-badge .arrow {
  font-size: 0.9rem;
}

.comparison-badge.positive {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.comparison-badge.negative {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.comparison-badge.neutral {
  background: var(--color-primary-06);
  color: var(--color-primary-70);
}
</style>
