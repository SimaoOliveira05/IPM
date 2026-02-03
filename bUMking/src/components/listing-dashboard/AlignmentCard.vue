<template>
  <BaseFrame class="alignment-card" padding="1.5rem" rounded="1.5rem" elevation="1">
    <h3>{{ $t('dashboard.price_occupancy_alignment') }}</h3>
    <div class="alignment-status" :class="getAlignmentClass(alignment)">
      {{ $t('dashboard.alignment.' + alignment) }}
    </div>
    <p class="alignment-desc">{{ $t('dashboard.alignment_desc', { price: percentiles.price, occupancy: percentiles.occupancy, context: contextLabel.toLowerCase() }) }}</p>
  </BaseFrame>
</template>

<script setup>
import BaseFrame from '@/components/common/BaseFrame.vue'

defineProps({
  alignment: { type: String, required: true },
  percentiles: { type: Object, required: true },
  contextLabel: { type: String, required: true }
})

const getAlignmentClass = (align) => {
  if (align === 'balanced' || align === 'premium') return 'align-good'
  if (align === 'undervalued') return 'align-opportunity'
  return 'align-bad'
}
</script>

<style scoped>
.alignment-card {
  background: var(--bg-primary);
}

.alignment-card h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 700;
}

.alignment-status {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.align-good { color: var(--color-success); }
.align-opportunity { color: var(--color-rating); }
.align-bad { color: var(--color-error); }

.alignment-desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-primary-60);
  line-height: 1.5;
}
</style>
