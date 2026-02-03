<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'


defineProps({
  modelValue: { type: Boolean, required: true }
})

defineEmits(['update:modelValue'])



const documentationItems = computed(() => [
  { key: 'house_score', icon: 'home' },
  { key: 'host_rank', icon: 'star' },
  { key: 'revenue_est', icon: 'trending-up' },
  { key: 'occupancy', icon: 'calendar' }
])
</script>

<template>
  <BaseModal 
    :model-value="modelValue" 
    :title="$t('documentation.title')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="docs-container">
      <p class="intro">{{ $t('documentation.intro') }}</p>

      <div class="metrics-list">
        <div v-for="item in documentationItems" :key="item.key" class="metric-item">
          <div class="metric-icon">
            <!-- Icons -->
            <svg v-if="item.icon === 'home'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <svg v-else-if="item.icon === 'star'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <svg v-else-if="item.icon === 'trending-up'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <svg v-else-if="item.icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="metric-content">
            <h4>{{ $t(`documentation.metrics.${item.key}.title`) }}</h4>
            <p>{{ $t(`documentation.metrics.${item.key}.description`) }}</p>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.docs-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.intro {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.metric-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
}

.metric-item:hover {
  transform: translateY(-2px);
  background: var(--color-primary-04);
}

.metric-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: var(--color-accent); /* Use accent color for icons */
}

.metric-content {
  flex: 1;
}

.metric-content h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.metric-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
