<script setup>
import { ref, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'register', 'clear-error'])
const { t } = useI18n()

const mode = ref('login') // 'login' or 'register'
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailInput = ref(null)
const nameInput = ref(null)
const dropdownRef = ref(null)

const isRegister = computed(() => mode.value === 'register')
const title = computed(() => isRegister.value ? t('auth.register') : t('auth.signin'))
const submitLabel = computed(() => isRegister.value ? t('auth.create_account') : t('auth.login_btn'))
const switchText = computed(() => isRegister.value ? t('auth.have_account') : t('auth.no_account'))
const switchActionText = computed(() => isRegister.value ? t('auth.action_enter') : t('auth.action_register'))

const close = () => {
  emit('update:modelValue', false)
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  name.value = ''
  mode.value = 'login'
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    close()
  }
}

const handleOutsidePointer = (event) => {
  if (!props.modelValue) return
  const dropdownEl = dropdownRef.value
  if (!dropdownEl) return

  const target = event.target

  if (target?.closest?.('[data-signin-trigger]')) {
    return
  }

  if (!dropdownEl.contains(target)) {
    close()
  }
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      resetForm()
      await nextTick()
      emailInput.value?.focus()
      document.addEventListener('keydown', handleKeydown)
      document.addEventListener('mousedown', handleOutsidePointer)
      document.addEventListener('touchstart', handleOutsidePointer)
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('mousedown', handleOutsidePointer)
      document.removeEventListener('touchstart', handleOutsidePointer)
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousedown', handleOutsidePointer)
  document.removeEventListener('touchstart', handleOutsidePointer)
})

const handleSubmit = () => {
  if (isRegister.value) {
    emit('register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
  } else {
    emit('submit', {
      email: email.value,
      password: password.value
    })
  }
}

const toggleMode = async () => {
  mode.value = isRegister.value ? 'login' : 'register'
  emit('clear-error')
  await nextTick()
  if (isRegister.value) {
    nameInput.value?.focus()
  } else {
    emailInput.value?.focus()
  }
}
</script>

<template>
  <Transition name="dropdown-fade">
    <div
      v-if="modelValue"
      ref="dropdownRef"
      class="signin-dropdown"
      role="dialog"
      aria-modal="false"
      aria-labelledby="signin-title"
      @click.stop
    >
      <div class="dropdown-header">
        <h2 id="signin-title">{{ title }}</h2>
        <p>{{ $t('auth.description') }}</p>
      </div>

      <form class="signin-form" @submit.prevent="handleSubmit">
        <template v-if="isRegister">
          <label class="sr-only" for="signin-name">{{ $t('auth.name_label') }}</label>
          <input
            id="signin-name"
            ref="nameInput"
            v-model="name"
            type="text"
            :placeholder="$t('auth.name_placeholder')"
            required
            autocomplete="name"
          />
        </template>

        <label class="sr-only" for="signin-email">{{ $t('auth.email_label') }}</label>
        <input
          id="signin-email"
          ref="emailInput"
          v-model="email"
          type="email"
          :placeholder="$t('auth.email_placeholder')"
          required
          autocomplete="username email"
        />

        <label class="sr-only" for="signin-password">{{ $t('auth.password_label') }}</label>
        <div class="password-input-wrapper">
          <input
            id="signin-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.password_placeholder')"
            required
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
          />
          <button type="button" class="password-toggle" @click="showPassword = !showPassword" :aria-label="$t('auth.toggle_password')">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        </div>

        <BaseButton class="signin-button" size="small" type="submit">
          {{ submitLabel }}
        </BaseButton>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <p class="dropdown-footer">
        {{ switchText }}
        <button type="button" class="register-link" @click="toggleMode">{{ switchActionText }}</button>
      </p>
    </div>
  </Transition>
</template>

<style scoped>
/* dropdown animation (kept) */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ---- REDUCED SIGN IN DROPDOWN STYLES (adjusted for smaller footprint) ---- */
.signin-dropdown {
  position: absolute;
  top: calc(100% + 0.6rem);
  inset-inline-end: 0;
  inset-inline-start: auto;
  transform: none;
  width: min(300px, 86vw); /* reduced width */
  padding: 1rem; /* tighter padding */
  border-radius: 1rem; /* slightly smaller radius */
  background: var(--bg-gradient);
  box-shadow: 0 14px 34px rgba(10, 37, 64, 0.14); /* lighter shadow */
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 0.6rem; /* reduced gap */
  z-index: 20;
}

.signin-dropdown::before {
  content: '';
  position: absolute;
  top: -8px;
  inset-inline-end: clamp(2rem, 6vw, 2.4rem);
  inset-inline-start: auto;
  width: 16px;
  height: 16px;
  background: var(--bg-gradient);
  transform: rotate(45deg);
  box-shadow: 0 -4px 12px rgba(10, 37, 64, 0.08);
  border-radius: 3px 0 0 0;
  z-index: -1;
}

.dropdown-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

.dropdown-header h2 {
  margin: 0;
  font-size: clamp(1.2rem, 2.6vw, 1.4rem); /* slightly smaller */
  font-weight: 700;
}

.dropdown-header p {
  margin: 0;
  font-size: 0.88rem; /* slightly smaller helper text */
  color: var(--text-secondary);
}

.error-message {
  color: #ef4444 !important;
  font-size: 0.85rem !important;
  margin: 0.5rem 0 0 0 !important;
  font-weight: 500;
  text-align: center;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.signin-button {
  width: 60%; /* smaller CTAs */
  align-self: center;
}

/* inputs reduced height and padding */
.signin-form input {
  width: 100%;
  height: 44px; /* reduced from 52px */
  padding: 0 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.98rem;
  box-sizing: border-box;
  transition: background 0.16s ease, box-shadow 0.16s ease;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.password-toggle:hover {
  color: var(--text-primary);
}

.signin-form input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-10);
}

.dropdown-footer {
  margin: 0;
  text-align: center;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.register-link {
  border: none;
  background: transparent;
  padding: 0 0.25rem;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.16s ease;
}

.register-link:hover {
  color: #1d4ed8;
}

/* accessibility helper (unchanged) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* mobile tweaks - use bottom sheet for better UX */
@media (max-width: 640px) {
  .signin-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    inset-inline-start: 0;
    inset-inline-end: 0;
    transform: none;
    width: 100%;
    max-width: 100%;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1.5rem;
    padding-bottom: 2rem;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1000;
  }

  .signin-dropdown::before {
    display: none;
  }

  .signin-button {
    width: 100%;
  }
}
</style>
