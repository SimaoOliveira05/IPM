<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  options: { type: Array, default: () => [] }, // [{ value, label }]
  buttonLabel: { type: String, default: '' },
  buttonIcon: { type: String, default: null }, // SVG path
  placeholder: { type: String, default: 'Selecionar' },
  dropdownTitle: { type: String, default: '' },
  minWidth: { type: String, default: '200px' },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'update:open'])

const localOpen = ref(props.open)

watch(() => props.open, (newValue) => {
  localOpen.value = newValue
})

const isOpen = computed({
  get: () => localOpen.value,
  set: (value) => {
    localOpen.value = value
    emit('update:open', value)
  }
})

const dropdownRef = ref(null)

const displayLabel = computed(() => {
  if (!props.modelValue) return props.placeholder
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option ? option.label : props.placeholder
})

const isDefaultLabel = computed(() => !props.modelValue)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleSelect = (value) => {
  if (value === props.modelValue) {
    closeMenu()
    return
  }
  emit('update:modelValue', value)
  closeMenu()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeMenu()
    event.stopPropagation()
  }
}

const handleClickOutside = (event) => {
  if (!isOpen.value || !dropdownRef.value) return

  const path = typeof event.composedPath === 'function' ? event.composedPath() : []
  const isWithinDropdown = path.includes(dropdownRef.value) || dropdownRef.value.contains(event.target)

  if (!isWithinDropdown) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="dropdown-menu-wrapper">
    <button
      type="button"
      class="control-button with-caret"
      :aria-expanded="isOpen"
      :aria-pressed="isOpen"
      aria-haspopup="listbox"
      @click.stop="toggleMenu"
      @keydown="handleKeydown"
    >
      <svg v-if="buttonIcon" viewBox="0 0 20 20" aria-hidden="true">
        <path
          :d="buttonIcon"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span
        class="menu-button-label"
        :class="{ 'is-default': isDefaultLabel }"
        aria-live="polite"
      >
        {{ displayLabel }}
      </span>
      <svg class="caret" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <div
      v-if="isOpen && options.length"
      class="menu-dropdown"
      :style="{ minWidth: minWidth }"
      role="listbox"
      :aria-label="dropdownTitle || 'Menu de seleção'"
    >
      <p v-if="dropdownTitle" class="dropdown-title">{{ dropdownTitle }}</p>
      <ul class="menu-options">
        <li
          v-for="option in options"
          :key="option.value"
          class="menu-option"
        >
          <button
            type="button"
            class="menu-option-button"
            :class="{ active: option.value === modelValue }"
            role="option"
            :aria-selected="option.value === modelValue"
            @click.stop="handleSelect(option.value)"
          >
            <span>{{ option.label }}</span>
            <svg v-if="option.value === modelValue" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M5 11l3 3 7-7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropdown-menu-wrapper {
  position: relative;
  display: inline-flex;
  width: fit-content;
}

.control-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-sizing: border-box;
  height: var(--control-height, clamp(2.1rem, 3.8vw, 2.6rem));
  padding: 0 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--color-primary-04);
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.control-button svg {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.control-button:hover {
  background: var(--color-primary-08);
  border-color: var(--color-primary-12);
  transform: translateY(-1px);
}

.control-button[aria-pressed='true'] {
  background: var(--color-accent-10);
  border-color: var(--color-accent-30);
  color: var(--color-accent);
}

.control-button.with-caret {
  gap: 0.6rem;
  padding-right: 0.9rem;
}

.menu-button-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.menu-button-label.is-default {
  color: var(--text-secondary);
}

.control-button .caret {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.control-button[aria-expanded='true'] .caret {
  transform: rotate(180deg);
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 0.55rem);
  left: 0;
  width: min(260px, calc(100vw - 2rem));
  background: var(--bg-primary);
  border-radius: clamp(0.85rem, 3vw, 1.1rem);
  padding: clamp(0.9rem, 2.4vw, 1.2rem);
  box-shadow: 0 20px 40px var(--color-primary-12);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 11;
}

.dropdown-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.menu-options {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.menu-option-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: var(--color-primary-04);
  border: 1px solid var(--color-primary-05);
  border-radius: 0.9rem;
  padding: 0.7rem 1rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.menu-option-button svg {
  width: 18px;
  height: 18px;
  color: var(--color-accent);
}

.menu-option-button:hover {
  background: var(--color-accent-10);
  border-color: var(--color-accent-30);
  transform: translateY(-1px);
}

.menu-option-button.active {
  background: var(--color-accent-10);
  border-color: var(--color-accent-30);
  color: var(--color-accent);
  box-shadow: inset 0 0 0 1px var(--color-accent-30);
}

.menu-option-button.active:hover {
  transform: none;
}

@media (max-width: 640px) {
  .menu-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    margin-top: 0;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1.5rem;
    box-shadow: 0 -18px 36px var(--color-primary-12);
    max-height: 60vh;
    overflow-y: auto;
    z-index: 1000;
  }
}
</style>