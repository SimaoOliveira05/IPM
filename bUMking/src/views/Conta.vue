<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed } from 'vue'

import { useUserStore } from '@/stores/userStore'
import BaseFrame from '@/components/common/BaseFrame.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'


const userStore = useUserStore()
const user = computed(() => userStore.currentUser)
</script>

<template>
  <div class="conta-view">
    <div class="conta-content">
      <BaseButton class="back-btn" variant="secondary" size="small" @click="$router.back()">
        <template #icon>
          <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
        {{ $t('listing.back') }}
      </BaseButton>

      <!-- Header -->
      <BaseFrame class="profile-header" padding="2rem" rounded="1.5rem">
        <div class="profile-info">
          <div class="avatar-large">
            {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="user-details">
            <h1>{{ $t('account.welcome', { name: user?.name || $t('account.visitor') }) }}</h1>
            <p>{{ user?.email }}</p>
          </div>
        </div>
      </BaseFrame>

      <!-- Saved Items Sections -->
      <section class="saved-section">
        <h2>{{ $t('account.saved_cities') }}</h2>
        <div v-if="user?.savedLocations?.length" class="saved-grid">
          <BaseFrame 
            v-for="location in user.savedLocations" 
            :key="location.id" 
            class="saved-card"
            padding="1rem"
            rounded="1rem"
            @click="$router.push(`/pesquisa?q=${location.name}`)"
          >
            <div class="location-card-content">
              <div class="location-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div class="location-info">
                <h3>{{ location.name }}</h3>
                <p>{{ location.type === 'neighbourhood' ? $t('location.neighbourhood') : $t('location.city') }}</p>
              </div>
            </div>
          </BaseFrame>
        </div>
        <BaseFrame v-else class="empty-state" padding="2rem" rounded="1rem">
          <p>{{ $t('account.empty_cities') }}</p>
        </BaseFrame>
      </section>

      <section class="saved-section">
        <h2>{{ $t('account.saved_hosts') }}</h2>
        <div v-if="user?.savedHosts?.length" class="saved-grid">
          <BaseFrame 
            v-for="host in user.savedHosts" 
            :key="host.id" 
            class="saved-card"
            padding="1rem"
            rounded="1rem"
            @click="$router.push(`/anfitriao/${host.id}`)"
          >
            <div class="host-card-content">
              <div class="host-avatar">
                <img :src="host.host_picture_url" :alt="host.host_name">
              </div>
              <div class="host-info">
                <h3>{{ host.host_name }}</h3>
                <p>{{ host.host_location }}</p>
              </div>
            </div>
          </BaseFrame>
        </div>
        <BaseFrame v-else class="empty-state" padding="2rem" rounded="1rem">
          <p>{{ $t('account.empty_hosts') }}</p>
        </BaseFrame>
      </section>

      <section class="saved-section">
        <h2>{{ $t('account.saved_listings') }}</h2>
        <div v-if="user?.savedListings?.length" class="saved-grid">
          <BaseCard
            v-for="listing in user.savedListings"
            :key="listing.id"
            :data="listing"
            @click="$router.push(`/casa/${listing.id}`)"
          />
        </div>
        <BaseFrame v-else class="empty-state" padding="2rem" rounded="1rem">
          <p>{{ $t('account.empty_listings') }}</p>
        </BaseFrame>
      </section>
    </div>
  </div>
</template>

<style scoped>
.conta-view {
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: var(--bg-gradient);
}

.conta-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.back-btn {
  align-self: flex-start;
}

.profile-header {
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #00a3ff 100%);
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.2);
}

.user-details h1 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-primary);
}

.user-details p {
  margin: 0.25rem 0 0;
  color: var(--color-primary-60);
}

.saved-section h2 {
  font-size: 1.4rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.empty-state {
  background: rgba(255, 255, 255, 0.5);
  text-align: center;
  color: var(--color-primary-60);
  border: 2px dashed rgba(0, 0, 0, 0.05);
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.saved-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: var(--bg-primary);
}

.saved-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.host-card-content,
.location-card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.host-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.location-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-icon svg {
  width: 24px;
  height: 24px;
}

.host-info h3,
.location-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.host-info p,
.location-info p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--color-primary-60);
}
</style>