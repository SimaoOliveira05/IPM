<template>
  <label class="compact-toggle">
    <span class="compact-toggle-label">{{ label }}</span>
    <input
      class="switch-input"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :aria-label="label"
    />
    <span class="switch" aria-hidden="true">
      <span class="switch-track"></span>
      <span class="switch-thumb"></span>
    </span>
  </label>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: Boolean, required: true }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.compact-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(10, 37, 64, 0.02);
  transition: background 0.2s ease;
}

.compact-toggle:hover {
  background: rgba(10, 37, 64, 0.04);
}

.compact-toggle-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  user-select: none;
}

.switch-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.switch-track {
  position: absolute;
  inset: 0;
  background: rgba(10, 37, 64, 0.2);
  border-radius: 999px;
  transition: background 0.25s ease;
}

.switch-thumb {
  position: absolute;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--bg-primary);
  box-shadow: 0 2px 8px rgba(10, 37, 64, 0.2);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-input:checked + .switch .switch-track {
  background: var(--bg-accent-gradient);
}

.switch-input:checked + .switch .switch-thumb {
  transform: translateX(20px);
}

.switch-input:focus-visible + .switch .switch-track {
  outline: 2px solid var(--color-accent-50);
  outline-offset: 2px;
}
</style>
