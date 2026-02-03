<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array, // Array of { label: String, value: Any, icon?: String }
    required: true
  },
  name: {
    type: String,
    default: 'segment'
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: undefined
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div 
    class="segmented-controls" 
    :class="{ 'full-width': fullWidth }"
    :style="width ? { width: width } : {}"
  >
    <button
      v-for="option in options"
      :key="option.value"
      class="control-btn"
      :class="{ active: modelValue === option.value }"
      @click="$emit('update:modelValue', option.value)"
      type="button"
    >
      <span v-if="option.icon" class="btn-icon">{{ option.icon }}</span>
      <span class="btn-label">{{ option.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.segmented-controls {
  display: flex;
  padding: 0.35rem;
  background: var(--color-primary-05);
  border-radius: 0.75rem;
  gap: 0.25rem;
}

.segmented-controls.full-width {
  width: 100%;
}

.control-btn {
  flex: 1;
  padding: 0.45rem 0.8rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.control-btn:hover {
  background: var(--color-accent-10);
  color: var(--color-accent);
}

.control-btn.active {
  background: var(--bg-primary);
  color: var(--color-accent);
  box-shadow: 0 2px 8px var(--color-primary-10);
}

.btn-icon {
  font-size: 1.1em;
  line-height: 1;
}

/* Ensure label doesn't break layout if empty */
.btn-label:empty {
  display: none;
}
</style>
