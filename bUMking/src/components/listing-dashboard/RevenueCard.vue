<template>
  <BaseFrame class="revenue-card" padding="1.5rem" rounded="1.5rem" elevation="1">
    <h3>{{ $t('dashboard.revenue_expected') }}</h3>
    <div class="revenue-comparison">
      <div class="rev-item">
        <span class="label">{{ $t('dashboard.revenue_actual') }}</span>
        <span class="value">{{ formatCurrency(revenueData.actual) }}</span>
      </div>
      <div class="rev-divider">vs</div>
      <div class="rev-item">
        <span class="label">{{ $t('dashboard.revenue_target') }}</span>
        <span class="value target">
          {{ formatCurrency(revenueData.expected_range[0]) }} - 
          {{ formatCurrency(revenueData.expected_range[1]) }}
        </span>
      </div>
    </div>
    <div class="perf-badge" :class="revenueData.performance === 'above_average' ? 'positive' : 'negative'">
      {{ $t('dashboard.performance.' + revenueData.performance) }}
    </div>
  </BaseFrame>
</template>

<script setup>
import BaseFrame from '@/components/common/BaseFrame.vue'

defineProps({
  revenueData: { type: Object, required: true }
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val)
</script>

<style scoped>
.revenue-card {
  background: var(--bg-primary);
  cursor: default;
}

.revenue-card h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 700;
  cursor: default;
}

.revenue-comparison {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.rev-item {
  display: flex;
  flex-direction: column;
}

.rev-item .label {
  font-size: 0.75rem;
  color: var(--color-primary-50);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  cursor: default;
}

.rev-item .value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  cursor: default;
}

.rev-item .value.target {
  color: var(--color-rating);
}

.rev-divider {
  font-size: 0.8rem;
  color: var(--color-primary-40);
  font-weight: 600;
}

.perf-badge {
  display: inline-block;
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.perf-badge.positive { background: var(--color-success-bg); color: var(--color-success); }
.perf-badge.negative { background: var(--color-error-bg); color: var(--color-error); }
</style>
