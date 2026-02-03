<script setup>
defineProps({
  src: { type: String, default: null },
  name: { type: String, default: '' },
  size: { type: [Number, String], default: 64 },
  border: { type: Boolean, default: true }
})
</script>

<template>
  <div 
    class="host-avatar" 
    :class="{ 'has-border': border }"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img v-if="src" :src="src" :alt="name" />
    <div v-else class="placeholder">
      <span :style="{ fontSize: `${parseInt(size) * 0.4}px` }">
        {{ name?.charAt(0) || 'A' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.host-avatar {
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-accent-15) 0%, var(--color-accent-10) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-40);
}

.host-avatar.has-border {
  border: 2px solid var(--color-accent-20);
}

.host-avatar img {
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
  font-weight: 700;
  color: var(--color-accent-50);
}
</style>
