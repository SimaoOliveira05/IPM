<script setup>
import { computed } from 'vue'
import BaseFrame from '@/components/common/BaseFrame.vue'

const props = defineProps({
  data: { type: Object, required: true },
})
const emit = defineEmits(['click'])
const onClick = () => emit('click', props.data.id || props.data.host_id)

const isHost = computed(() => !!props.data.host_name)
const isNeighbourhood = computed(() => !!props.data.is_neighbourhood)

const title = computed(() => {
  if (isHost.value) return props.data.host_name
  if (isNeighbourhood.value) return props.data.name
  return props.data.name
})

const subtitle = computed(() => {
  if (isHost.value) return props.data.host_location
  if (isNeighbourhood.value) return 'Freguesia'
  return props.data.neighbourhood
})

const image = computed(() => {
  if (isHost.value) return props.data.host_picture_url
  if (isNeighbourhood.value) return null 
  return props.data.picture_url
})

const placeholderChar = computed(() => {
  if (isHost.value) return (props.data.host_name?.charAt(0) || 'H')
  if (isNeighbourhood.value) return (props.data.name?.charAt(0) || 'N')
  return null
})

</script>

<template>
  <BaseFrame
    class="base-card"
    padding="0"
    rounded="1.5rem"
    elevation="2"
    @click="onClick"
  >
    <div class="card-media">
      <img 
        v-if="image" 
        :src="image" 
        :alt="title"
        loading="lazy"
      />
      <div v-else-if="isHost || isNeighbourhood" class="card-placeholder">
        {{ placeholderChar }}
      </div>
      <svg v-else viewBox="0 0 64 64" role="presentation">
        <path
          d="M12 30.5l20-15.5 20 15.5v19.5a2 2 0 01-2 2H29v-13h-6v13H14a2 2 0 01-2-2z"
          fill="url(#houseGradient)"
        />
        <path
          d="M8 30l24-18 24 18"
          fill="none"
          stroke="var(--color-primary-28)"
          stroke-width="3"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient id="houseGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#dbeafe" />
            <stop offset="100%" stop-color="#bfdbfe" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="card-body">
      <h3>{{ title }}</h3>
      <p class="card-subtitle">{{ subtitle }}</p>
      
      <div v-if="isHost" class="card-details">
        <p class="host-status">
          <span v-if="data.host_is_superhost">Superhost</span>
          <span v-if="data.host_is_superhost && data.host_identity_verified"> • </span>
          <span v-if="data.host_identity_verified">Verificado</span>
        </p>
      </div>
      <div v-else-if="isNeighbourhood" class="card-details">
        <p>
          <span class="rating">{{ (data.total_listings || 0).toLocaleString() }}</span>
          anúncios
          <span class="bullet">•</span>
          <span class="price-label" style="margin-left: 0; margin-right: 0.25rem;">{{ $t('dashboard.avg_price_night') }}:</span>
          {{ Math.round(data.avg_price || 0) }}€ 
        </p>
      </div>
      <div v-else class="card-details">
        <p>
          <span class="rating">{{ data.rating.toFixed(1) }}</span>
          <span class="bullet">•</span>
          {{ data.price }}€ {{ $t('listing.per_night') }}
        </p>
      </div>
    </div>
  </BaseFrame>
</template>

<style scoped>
.base-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: var(--bg-gradient);
  border-radius: 1.25rem;
  padding: clamp(0.9rem, 3vw, 1.5rem);
  min-height: 21.5rem;
  box-shadow: 0 14px 28px var(--color-primary-08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.base-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px var(--color-primary-12);
}
.base-card:focus {
  outline: 2px solid var(--color-accent-80);
  outline-offset: 2px;
}
.base-card:active {
  transform: translateY(-1px);
}

.card-media {
  border-radius: 1rem;
  aspect-ratio: 1 / 1;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px var(--color-primary-08);
  overflow: hidden;
}
.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}
.card-media svg {
  width: 64%;
  height: auto;
}
.card-placeholder {
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-primary-40);
}

.card-body {
  padding: 0 0.5rem;
}

.card-body h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.card-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
}

.card-details {
  margin-top: 0.5rem;
}

.card-details p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.card-details .rating {
  font-weight: 700;
  color: var(--color-accent);
}
.card-details .bullet {
  color: var(--color-primary-35);
}

.host-status {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.price-label {
  font-size: 0.8rem;
  color: var(--color-primary-50);
  font-weight: 400;
  margin-left: 0.25rem;
}


</style>
