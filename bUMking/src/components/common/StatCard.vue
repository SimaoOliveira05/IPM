<script setup>
import BaseFrame from '@/components/common/BaseFrame.vue'

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtext: { type: String, default: '' },
  variant: { type: String, default: 'default' } // default, rating
})
</script>

<template>
  <BaseFrame class="stat-card" padding="1.25rem" rounded="1.25rem" elevation="1">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value" :class="{ rating: variant === 'rating' }">
      {{ value }}
      <span v-if="variant === 'rating'" class="star">★</span>
    </span>
    <span v-if="subtext" class="stat-subtext">{{ subtext }}</span>
  </BaseFrame>
</template>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--bg-primary);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-primary-60);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 600;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-value.rating {
  color: var(--color-warning);
}

.star {
  font-size: 1.2rem;
}

.stat-subtext {
  font-size: 0.85rem;
  color: var(--color-primary-50);
}
</style>
