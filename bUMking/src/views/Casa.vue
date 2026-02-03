<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListing } from '@/composables/useListing'
import { useHost } from '@/composables/useHost'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseFrame from '@/components/common/BaseFrame.vue'
import ListingAnalytics from '@/components/dashboards/ListingAnalytics.vue'

// New Components
import ListingGallery from '@/components/listing-details/ListingGallery.vue'
import HostSummaryBar from '@/components/listing-details/HostSummaryBar.vue'
import ListingHeader from '@/components/listing-details/ListingHeader.vue'
import ListingInfoCard from '@/components/listing-details/ListingInfoCard.vue'
import BaseMap from '@/components/common/BaseMap.vue'

const route = useRoute()
const router = useRouter()

const { listing, loading, error, fetchListing } = useListing()
const { host, fetchHost } = useHost()

const loadData = async (id) => {
  await fetchListing(id)
  if (listing.value?.host_id) await fetchHost(listing.value.host_id)
}

onMounted(() => {
  loadData(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) loadData(newId)
  }
)
</script>

<template>
  <section class="casa-view">
    <div v-if="loading" class="state-box">
      <p>{{ $t('listing.loading') }}</p>
    </div>

    <div v-else-if="error" class="state-box">
      <p>{{ $t('listing.error') }}: {{ error }}</p>
      <button @click="fetchListing" class="retry-btn">{{ $t('listing.retry') }}</button>
    </div>

    <div v-else-if="listing" class="casa-content">
      <BaseButton variant="secondary" size="small" @click="router.back()">
        <template #icon>
          <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
        {{ $t('listing.back') }}
      </BaseButton>

      <BaseFrame class="casa-layout">
        <div class="left-column">
          <ListingGallery 
            :src="listing.picture_url" 
            :alt="listing.name" 
          />

          <HostSummaryBar 
            :host="host" 
            @click="router.push(`/anfitriao/${host.id}`)" 
          />
        </div>

        <BaseFrame class="casa-details">
          <ListingHeader 
            :name="listing.name"
            :rating="listing.rating"
            :neighbourhood="listing.neighbourhood"
            :address="listing.address"
          />

          <ListingInfoCard :listing="listing" />

          <div v-if="listing.description" class="description">
            <h2>{{ $t('listing.description') }}</h2>
            <p v-html="listing.description"></p>
          </div>

          <div class="actions">
            <div class="price">
              <span class="value">{{ listing.price }}€</span>
              <span class="label">{{ $t('listing.per_night') }}</span>
            </div>
            <BaseButton
              v-if="listing.listing_url"
              as="a"
              :href="listing.listing_url"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              full-width
            >
              {{ $t('listing.view_airbnb') }}
              <template #icon-right>
                <svg viewBox="0 0 20 20" style="width: 18px; height: 18px;">
                  <path d="M11 3l6 6m0 0l-6 6m6-6H3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </template>
            </BaseButton>
          </div>
        </BaseFrame>
      </BaseFrame>

      <!-- Location Map (full width, below main content) -->
      <BaseMap
        v-if="listing.latitude && listing.longitude"
        :locations="[{ lat: listing.latitude, lng: listing.longitude, label: listing.name, price: listing.price }]"
        height="280px"
        :zoom="14"
        class="listing-map"
      />
      
      <ListingAnalytics :listing="listing" />

    </div>
  </section>
</template>

<style scoped>
.casa-view {
  min-height: calc(100vh - 120px);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: var(--bg-gradient);
}

.state-box {
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 1.5rem;
  background: var(--bg-primary);
  box-shadow: 0 16px 32px var(--color-primary-08);
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.casa-content {
  max-width: 1400px;
  margin: 0 auto;
}

.casa-layout {
  /* Nested border-radius setup: outer = inner + padding */
  --layout-padding: clamp(1.5rem, 3vw, 2.5rem);
  --inner-radius: var(--radius-xl);
  --outer-radius: calc(var(--inner-radius) + var(--layout-padding) * 0.5);
  
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: var(--layout-padding);
  margin-top: 1.5rem;
  border-radius: var(--outer-radius);
}

.listing-map {
  margin-top: 1.5rem;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.casa-details {
  display: flex;
  flex-direction: column;
  gap: clamp(1.2rem, 2.5vw, 1.8rem);
  position: sticky;
  top: 2rem;
  border-radius: var(--inner-radius, var(--radius-xl));
}

.description h2 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.description p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-primary-75);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-primary-10);
}

.price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price .value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price .label {
  font-size: 0.92rem;
  color: var(--color-primary-60);
}

@media (max-width: 1024px) {
  .casa-layout {
    grid-template-columns: 1fr;
  }
  
  .casa-details {
    position: static;
  }
}
</style>