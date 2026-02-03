<script setup>
import BaseFrame from '@/components/common/BaseFrame.vue'
import { computed } from 'vue'
import { getRoomTypeLabel } from '@/composables/useRoomTypeLabel'

const props = defineProps({
  listing: { type: Object, required: true }
})

const roomTypeLabel = computed(() => 
  getRoomTypeLabel(props.listing.type || props.listing.room_type)
)
</script>

<template>
  <BaseFrame class="info-card">
    <div class="icon">
      <svg viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M9 22V12h6v10" fill="none" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </div>
    <div>
      <h2>{{ $t('listing_details.housing') }}</h2>
      <ul>
        <li><strong>{{ $t('listing_details.type') }}:</strong> {{ $t(roomTypeLabel) }}</li>
        <li v-if="listing.bedrooms"><strong>{{ $t('listing_details.bedrooms') }}:</strong> {{ listing.bedrooms }}</li>
        <li v-if="listing.accommodates"><strong>{{ $t('listing_details.capacity') }}:</strong> {{ listing.accommodates }}</li>
        <li v-if="listing.beds"><strong>{{ $t('listing_details.beds') }}:</strong> {{ listing.beds }}</li>
        <li v-if="listing.bathrooms"><strong>{{ $t('listing_details.bathrooms') }}:</strong> {{ listing.bathrooms }}</li>
      </ul>
    </div>
  </BaseFrame>
</template>

<style scoped>
.info-card {
  display: flex;
  gap: 1rem;
  background: var(--color-accent-06);
  border: 1px solid var(--color-accent-12);
}

.info-card .icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-12);
  border-radius: 0.75rem;
  color: var(--color-accent);
}

.info-card svg {
  width: 24px;
  height: 24px;
}

.info-card h2 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-card li {
  font-size: 0.92rem;
  color: var(--color-primary-75);
}

.info-card strong {
  font-weight: 600;
  color: var(--text-primary);
}
</style>
