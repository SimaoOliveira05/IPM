<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'destructive', 'plain', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  as: {
    type: String,
    default: 'button'
  },
  href: {
    type: String,
    default: undefined
  },
  target: {
    type: String,
    default: undefined
  },
  rel: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['click'])

const slots = useSlots()

const classes = computed(() => {
  return {
    btn: true,
    [`btn--variant-${props.variant}`]: true,
    [`btn--size-${props.size}`]: true,
    'btn--disabled': props.disabled,
    'btn--full-width': props.fullWidth
  }
})

const hasDefaultSlot = computed(() => !!slots.default)

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <component
    :is="as"
    :class="classes"
    v-bind="$attrs"
    :disabled="as === 'button' ? disabled : undefined"
    :type="as === 'button' ? type : undefined"
    :href="as === 'a' ? href : undefined"
    :target="as === 'a' ? target : undefined"
    :rel="as === 'a' ? rel : undefined"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="btn__icon btn__icon--left">
      <slot name="icon" />
    </span>
    <span class="btn__content">
      <slot v-if="hasDefaultSlot" />
      <span v-else>{{ text }}</span>
    </span>
    <span v-if="$slots['icon-right']" class="btn__icon btn__icon--right">
      <slot name="icon-right" />
    </span>
  </component>
</template>

<style scoped>
/* BASE */
.btn {
  --btn-bg: #e8e8e8;
  --btn-color: #000000;
  --btn-border: none;
  --btn-hover-bg: #e9e9e9;
  --btn-active-bg: #e1e1e1;
  --btn-shadow: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-weight: 600;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  outline: none;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--btn-bg);
  color: var(--btn-color);
  border: var(--btn-border);
  box-shadow: var(--btn-shadow);
  padding: 0 24px;
  text-decoration: none;
}

.btn:hover:not(.btn--disabled) {
  background: var(--btn-hover-bg);
  transform: translateY(-1px);
}

.btn:active:not(.btn--disabled) {
  background: var(--btn-active-bg);
  transform: translateY(0);
}

/* SIZES */
.btn--size-small {
  min-width: 100px;
  height: 36px;
  font-size: 14px;
  padding: 0 14px;
}

.btn--size-medium {
  min-width: 120px;
  height: 40px;
  font-size: 15px;
  padding: 0 18px;
}

.btn--size-large {
  min-width: 160px;
  height: 48px;
  font-size: 17px;
  padding: 0 22px;
}

.btn--variant-primary {
  --btn-bg: var(--color-accent);
  --btn-hover-bg: var(--color-accent-hover);
  --btn-active-bg: var(--color-accent-active);
  --btn-color: var(--color-white);
  --btn-border: none;
}
.btn.btn--variant-primary {
  color: var(--btn-color) !important;
  background: var(--btn-bg) !important;
  border: var(--btn-border) !important;
}
.btn.btn--variant-primary:hover:not(.btn--disabled) {
  background: var(--btn-hover-bg) !important;
}
.btn.btn--variant-primary:active:not(.btn--disabled) {
  background: var(--btn-active-bg) !important;
}
/* VARIANT TOKENS */
.btn--variant-secondary {
  --btn-bg: var(--bg-primary);
  --btn-hover-bg: var(--color-primary-04);
  --btn-active-bg: var(--color-primary-08);
  --btn-color: var(--text-primary);
  --btn-border: 1px solid var(--border-color);
}
.btn.btn--variant-secondary {
  color: var(--btn-color);
  border: var(--btn-border);
  background: var(--btn-bg);
}
.btn.btn--variant-secondary:hover:not(.btn--disabled) {
  background: var(--btn-hover-bg);
}
.btn.btn--variant-secondary:active:not(.btn--disabled) {
  background: var(--btn-active-bg);
}

.btn.btn--variant-secondary:hover:not(.btn--disabled) {
  background: var(--btn-hover-bg);
}
.btn.btn--variant-secondary:active:not(.btn--disabled) {
  background: var(--btn-active-bg);
}

.btn--variant-destructive {
  --btn-bg: #ff3b30;
  --btn-hover-bg: #ff6158;
  --btn-active-bg: #d70015;
  --btn-color: #000000;
  --btn-shadow: 0 6px 18px rgba(255, 59, 48, 0.25);
}

.btn--variant-plain {
  --btn-bg: transparent;
  --btn-hover-bg: rgba(0, 0, 0, 0.08);
  --btn-active-bg: rgba(0, 0, 0, 0.12);
  --btn-color: #000000;
}

.btn--variant-outline {
  --btn-bg: transparent;
  --btn-hover-bg: rgba(0, 0, 0, 0.06);
  --btn-active-bg: rgba(0, 0, 0, 0.1);
  --btn-color: #000000;
  --btn-border: 2px solid #1d1d1f;
}

/* STATES */
.btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.btn--full-width {
  width: 100%;
}
/* Ícones e conteúdo */
.btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn__icon--left {
  margin-right: 0.5rem;
}
.btn__icon--right {
  margin-left: 0.5rem;
}
.btn__content {
  display: inline-flex;
  align-items: center;
}
</style>