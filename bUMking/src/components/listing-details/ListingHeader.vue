<script setup>
defineProps({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  neighbourhood: { type: String, default: '' },
  address: { type: String, default: '' }
})
</script>

<template>
  <header class="listing-header">
    <h1>{{ name }}</h1>
    <p class="rating">
      <span class="value">{{ rating.toFixed(1) }}</span>
      <span class="stars">★</span>
    </p>
    <p class="location">{{ neighbourhood }}</p>
    <p v-if="address" class="address">{{ address }}</p>
  </header>
</template>

<style scoped>
.listing-header h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 3vw, 1.85rem);
  font-weight: 700;
  color: var(--text-primary);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.5rem 0;
}

.rating .value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.rating .stars {
  font-size: 1.2rem;
  color: var(--color-star);
}

.location {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary-70);
}

.address {
  margin: 0.25rem 0;
  font-size: 0.88rem;
  color: var(--color-primary-50);
}
</style>
