<script setup>
defineProps({
  src: { type: String, default: null },
  alt: { type: String, default: 'Imagem do alojamento' }
})
</script>

<template>
  <div class="listing-gallery">
    <img v-if="src" :src="src" :alt="alt"/>
    <div v-else class="placeholder">
      <svg viewBox="0 0 64 64">
        <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 8c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12 12-12 5.373-12 12-12z" fill="currentColor" opacity="0.2"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.listing-gallery {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-primary-06);
  box-shadow: 0 16px 32px var(--color-primary-10);
}

.listing-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-20);
}

.placeholder svg {
  width: 80px;
  height: 80px;
}
</style>
