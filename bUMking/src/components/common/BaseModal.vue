<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})



onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="close">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-content">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  background: var(--bg-primary); /* Assuming light/dark theme var */
  width: 100%;
  max-width: 550px;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem 0.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-primary-60);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.modal-content {
  padding: 1.5rem 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.96);
}
</style>
