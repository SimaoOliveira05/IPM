<script setup>
import HostAvatar from '@/components/common/HostAvatar.vue'

defineProps({
  host: { type: Object, default: null }
})

defineEmits(['click'])
</script>

<template>
  <div 
    v-if="host" 
    class="host-bar" 
    @click="$emit('click')" 
    role="button" 
    tabindex="0"
  >
    <HostAvatar 
      :src="host.picture_url" 
      :name="host.name" 
      size="64" 
      :border="true"
    />
    
    <div class="info">
      <p class="label">{{ $t('host_profile.host_label') }}</p>
      <p class="name">{{ host.name }}</p>
    </div>
    
    <svg class="arrow" viewBox="0 0 24 24">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>

  <div v-else class="host-placeholder">
    <p>{{ $t('host_profile.not_available') }}</p>
  </div>
</template>

<style scoped>
.host-bar {
  /* Nested border-radius for host-bar */
  --bar-padding: 1.25rem;
  --bar-inner-radius: var(--radius-md);
  --bar-outer-radius: calc(var(--bar-inner-radius) + var(--bar-padding));
  
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: var(--bar-padding) 1.5rem;
  background: linear-gradient(135deg, var(--color-accent-08) 0%, rgba(59, 130, 246, 0.06) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--bar-outer-radius);
  cursor: pointer;
  transition: all 0.25s;
}

.host-bar:hover {
  background: linear-gradient(135deg, var(--color-accent-12) 0%, var(--color-accent-10) 100%);
  border-color: var(--color-accent-25);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px var(--color-accent-12);
}

.info {
  flex: 1;
}

.label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent-70);
}

.name {
  margin: 0.35rem 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.arrow {
  width: 24px;
  height: 24px;
  color: var(--color-accent-60);
  transition: all 0.25s;
}

.host-bar:hover .arrow {
  transform: translateX(4px);
  color: var(--color-accent-90);
}

.host-placeholder {
  padding: 1.25rem 1.5rem;
  background: var(--color-primary-04);
  border: 1px solid var(--color-primary-08);
  border-radius: clamp(1rem, 2.5vw, 1.5rem);
  text-align: center;
  color: var(--color-primary-50);
  font-size: 0.92rem;
}
</style>
