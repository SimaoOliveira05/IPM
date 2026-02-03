<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import BaseFrame from '@/components/common/BaseFrame.vue'

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  imageSrc: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  stats: {
    type: Array,
    default: () => []
  },
  ctaLabel: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  locationSlug: { type: String, default: '' }
})

const bairroLink = computed(() => {
  if (!props.locationSlug) return null
  return `/freguesia/${encodeURIComponent(props.locationSlug)}`
})
</script>

<template>
  <BaseFrame class="insight-panel" padding="1.5rem" rounded="1.5rem" elevation="2">
    <header>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </header>

    <img v-if="imageSrc" :src="imageSrc" :alt="imageAlt" class="insight-media" />

    <dl v-if="loading" class="insight-list loading">
      <div v-for="i in 4" :key="i" class="insight-item skeleton">
        <dt class="skeleton-text"></dt>
        <dd class="skeleton-value"></dd>
      </div>
    </dl>

    <dl v-else class="insight-list">
      <div v-for="stat in stats" :key="stat.label" class="insight-item">
        <dt>{{ $t(stat.label) }}</dt>
        <dd>{{ stat.value }}</dd>
      </div>
    </dl>

    <RouterLink v-if="bairroLink" :to="bairroLink" class="expand-button">
      {{ $t('insights.view_more_stats') }}
    </RouterLink>
  </BaseFrame>
</template>

<style scoped>
.insight-panel {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: var(--bg-gradient);
  border-radius: clamp(1.25rem, 3vw, 1.9rem);
  padding: clamp(1.5rem, 3vw, 2rem);
  box-shadow: 0 18px 36px var(--color-primary-08);
  position: sticky;
  top: clamp(1.5rem, 4vw, 2.5rem);
}

header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

header p {
  margin: 0.3rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.insight-media {
  width: 100%;
  border-radius: 1.1rem;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.insight-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin: 0;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

dt {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

dd {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.expand-button {
  align-self: center;
  border: none;
  background: var(--color-accent-10);
  color: var(--color-accent);
  border-radius: 999px;
  padding: 0.7rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  text-decoration: none;
}

.expand-button:hover {
  background: var(--color-accent-30);
  transform: translateY(-1px);
  text-decoration: none;
}

/* Skeleton loading styles */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton .skeleton-text,
.skeleton .skeleton-value {
  background: linear-gradient(
    90deg,
    var(--color-primary-08) 0%,
    var(--color-primary-12) 50%,
    var(--color-primary-08) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton .skeleton-text {
  width: 80px;
  height: 14px;
}

.skeleton .skeleton-value {
  width: 50px;
  height: 18px;
}
</style>