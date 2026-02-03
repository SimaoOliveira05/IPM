<template>
  <div
    class="base-card"
    :style="{
      padding: padding,
      borderRadius: rounded,
      boxShadow: elevationMap[elevation] || elevationMap[1]
    }"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  padding: { type: String, default: '1.2rem' },
  elevation: { type: [Number, String], default: 1 },
  rounded: { type: String, default: '1rem' }
})

const elevationMap = {
  0: 'none',
  1: '0 2px 16px 0 var(--color-primary-05)',
  2: '0 4px 24px 0 var(--color-primary-10)'
}
</script>

<style scoped>
.base-card {
  background: var(--bg-primary);
  transition: box-shadow 0.2s;
}
</style>