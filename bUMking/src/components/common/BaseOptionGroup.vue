<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
    // Expected format: [{ label: 'JSON', value: 'json' }, ...]
  },
  modelValue: {
    type: [String, Number],
    default: null
  },
  label: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="base-option-group">
    <label v-if="label" class="group-label">{{ label }}</label>
    <div class="options-row">
      <button 
        v-for="option in options" 
        :key="option.value"
        class="option-btn"
        :class="{ active: modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.base-option-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-label {
  font-size: 0.9rem;
  color: var(--color-primary-60, #666);
  font-weight: 500;
}

.options-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.option-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary, #eee);
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.option-btn:hover {
  transform: translateY(-2px);
  background: var(--bg-secondary-hover, #e5e5e5);
}

.option-btn.active {
  background: var(--color-text-primary, #000);
  color: var(--color-white, #fff);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>
