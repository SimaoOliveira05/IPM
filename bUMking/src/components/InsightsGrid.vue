<script setup>
import BaseFrame from '@/components/common/BaseFrame.vue'
defineProps({
  cards: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="insights">
    <h2>{{ $t('insights.discover_title') }}</h2>
    <div class="insights-grid">
  <BaseFrame
        v-for="card in cards"
        :key="card.title"
        class="insight-card"
        padding="1.5rem"
        rounded="1.5rem"
        elevation="2"
      >
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
  </BaseFrame>
    </div>
  </section>
</template>

<style scoped>
.insights {
  padding: 0 clamp(1.5rem, 6vw, 5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.insights h2 {
  margin: 0;
  font-size: clamp(1.9rem, 3.5vw, 2.6rem);
  text-align: center;
  color: var(--text-primary);
}

.insights-grid {
  display: grid;
  gap: clamp(1.25rem, 3vw, 2rem);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.insight-card {
  background: var(--bg-primary);
  border-radius: 1.5rem;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  box-shadow: 0 16px 36px var(--color-primary-08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-card h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.insight-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>