<template>
  <button
    :class="[
      'control-btn',
      variant,
      size,
      { active, disabled, 'with-caret': withCaret, 'has-icon': $slots.icon }
    ]"
    :disabled="disabled"
    :aria-pressed="active"
    v-bind="$attrs"
  >
    <span v-if="$slots.icon" class="btn-icon">
      <slot name="icon" />
    </span>
    <span v-if="$slots.default" class="btn-label">
      <slot />
    </span>
    <svg v-if="withCaret" class="caret" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
</template>

<script setup>
defineProps({
  variant: { 
    type: String, 
    default: 'default',
    validator: (value) => ['default', 'primary', 'ghost', 'dropdown'].includes(value)
  },
  size: { 
    type: String, 
    default: 'normal',
    validator: (value) => ['normal', 'small'].includes(value)
  },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  withCaret: { type: Boolean, default: false }
})
</script>

<style scoped>
.control-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  border-radius: 1rem;
  padding: 0 1rem;
  height: var(--control-height, clamp(2.1rem, 3.8vw, 2.6rem));
  font-weight: 600;
  background: var(--color-primary-04);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  border: 1px solid var(--border-color);
  outline: none;
  box-sizing: border-box;
}

.control-btn:hover:not(:disabled) {
  background: var(--color-primary-08);
  border-color: var(--color-primary-12);
  transform: translateY(-1px);
}

.control-btn.primary {
  background: var(--color-accent);
  color: var(--color-white);
  border-color: var(--color-accent);
}

.control-btn.primary:hover:not(:disabled) {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.control-btn.ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border-color);
}

.control-btn.ghost:hover:not(:disabled) {
  background: var(--color-primary-05);
  border-color: var(--color-primary-20);
}

.control-btn.dropdown {
  background: var(--color-primary-04);
  border: 1px solid var(--border-color);
}

.control-btn.dropdown[aria-pressed='true'] {
  background: var(--color-accent-10);
  border-color: var(--color-accent-30);
  color: var(--color-accent);
}

.control-btn.small {
  padding: 0 0.9rem;
  height: calc(var(--control-height, 2.4rem) - 0.4rem);
  font-size: 0.92rem;
}

.control-btn.active {
  background: var(--color-accent-10);
  border-color: var(--color-accent-30);
  color: var(--color-accent);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.control-btn :deep(svg) {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: currentColor;
  opacity: 0.7;
}

.btn-label {
  white-space: nowrap;
}

.control-btn.with-caret {
  padding-right: 0.75rem;
  gap: 0.6rem;
}

.caret {
  width: 16px !important;
  height: 16px !important;
  transition: transform 0.2s ease;
  margin-left: -0.2rem;
}

.control-btn[aria-pressed='true'] .caret {
  transform: rotate(180deg);
}
</style>