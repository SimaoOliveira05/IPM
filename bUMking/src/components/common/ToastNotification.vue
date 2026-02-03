<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let toastId = 0

const addToast = (message, type = 'info', duration = 3000) => {
  const id = toastId++
  toasts.value.push({ id, message, type, visible: true })
  
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value[index].visible = false
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 300)
  }
}

// Expose to window for global access
onMounted(() => {
  window.$toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning')
  }
})

onUnmounted(() => {
  delete window.$toast
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          :class="['toast', toast.type, { hiding: !toast.visible }]"
          @click="removeToast(toast.id)"
        >
          <span class="toast-icon">
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: var(--bg-primary, white);
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  min-width: 250px;
  max-width: 400px;
  border-left: 4px solid;
}

.toast.success {
  border-color: #10b981;
}

.toast.error {
  border-color: #ef4444;
}

.toast.warning {
  border-color: #f59e0b;
}

.toast.info {
  border-color: var(--color-accent, #635bff);
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.toast.success .toast-icon { color: #10b981; }
.toast.error .toast-icon { color: #ef4444; }
.toast.warning .toast-icon { color: #f59e0b; }
.toast.info .toast-icon { color: var(--color-accent, #635bff); }

.toast-message {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary, #0a2540);
}

/* Animations */
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
