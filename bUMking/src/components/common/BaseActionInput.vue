<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  actionLabel: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'action'])
</script>

<template>
  <div class="base-action-input">
    <div class="input-wrapper">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :readonly="readonly"
        type="text"
        class="styled-input"
      />
      
      <button class="action-btn" @click="$emit('action')">
        <slot name="icon"></slot>
        <span v-if="actionLabel">{{ actionLabel }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.base-action-input {
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-secondary, #f3f4f6);
  border-radius: 999px;
  padding: 0.5rem;
  transition: box-shadow 0.2s ease;
}

.input-wrapper:focus-within {
  box-shadow: 0 0 0 2px var(--color-primary-20, rgba(0,0,0,0.1));
}

.styled-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0 1rem;
  font-size: 0.95rem;
  color: var(--text-primary);
  outline: none;
  min-width: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: var(--text-primary);
  transition: background 0.2s;
}

.action-btn:hover {
  background: rgba(0,0,0,0.05);
}
</style>
