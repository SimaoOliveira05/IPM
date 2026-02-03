<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import SignInDropdown from '@/components/SignInDropdown.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import SettingsOverlay from '@/components/dashboards/overlays/SettingsOverlay.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const showSignInMenu = ref(false)
const showUserMenu = ref(false)
const currentTheme = ref('default')
const userMenuRef = ref(null)
const signInError = ref('')
const showSettings = ref(false)

const currentUser = computed(() => userStore.currentUser)

const handleSettings = () => {
  showSettings.value = true
}

const handleThemeSync = (theme) => {
  currentTheme.value = theme
}



const toggleSignInMenu = () => {
  showSignInMenu.value = !showSignInMenu.value
  if (showSignInMenu.value) {
    showUserMenu.value = false
    signInError.value = ''
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) showSignInMenu.value = false
}

const handleSignInSubmit = async (credentials) => {
  try {
    signInError.value = ''
    const name = credentials.email.split('@')[0]
    await userStore.login({ name, email: credentials.email, password: credentials.password })
    showSignInMenu.value = false
  } catch {
    signInError.value = t('auth.error_credentials')
  }
}

const handleSignInRegister = async (userData) => {
  try {
    signInError.value = ''
    await userStore.register({ name: userData.name, email: userData.email, password: userData.password })
    showSignInMenu.value = false
  } catch (err) {
    signInError.value = err.message || 'Error creating account'
  }
}

const handleUserAction = (action) => {
  showUserMenu.value = false
  if (action === 'logout') {
    userStore.logout()
    router.push('/')
  } else if (action === 'account') {
    router.push('/conta')
  }
}

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'default'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="topbar">
    <nav class="nav">
      <div class="logo" @click="$router.push('/')">
        <button class="nav-home-button" aria-label="Ir para a página inicial">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
      </div>

      <div class="site-name" @click="$router.push('/')">
        <span class="site-name-text">bUMking</span>
      </div>

      <div class="nav-actions">
        <BaseButton 
          class="nav-button nav-button--ghost nav-button--icon-only"
          variant="plain" 
          size="small"
          :aria-label="$t('settings.title')"
          :title="$t('settings.title')"
          @click="handleSettings" 
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </template>
        </BaseButton>

        <BaseButton 
          class="nav-button nav-button--ghost nav-button--docs"
          :text="$t('documentation.title')" 
          variant="plain" 
          size="small"
          :aria-label="$t('documentation.title')"
          @click="router.push('/ajuda')"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </template>
        </BaseButton>
        
        <!-- User Menu when Logged In -->
        <div v-if="currentUser" class="nav-user" ref="userMenuRef">
          <BaseButton 
            class="nav-button nav-button--ghost"
            :text="currentUser.name || 'User'"
            variant="plain" 
            size="small"
            @click="toggleUserMenu"
          >
            <template #icon-right>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </template>
          </BaseButton>

          <Transition name="dropdown-fade">
            <div v-if="showUserMenu" class="user-dropdown-menu">
              <button class="menu-item" @click="handleUserAction('account')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {{ $t('auth.my_account') }}
              </button>
              <button class="menu-item destructive" @click="handleUserAction('logout')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                {{ $t('auth.logout') }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Sign In Button when Logged Out -->
        <div v-else class="nav-signin">
          <BaseButton 
            class="nav-button nav-button--filled"
            :class="{ 'nav-button--active': showSignInMenu }"
            :text="$t('auth.signin')" 
            variant="primary" 
            size="small"
            data-signin-trigger
            @click.stop="toggleSignInMenu"
            @mousedown.stop
            @touchstart.stop
          />

          <SignInDropdown
            v-model="showSignInMenu"
            :error-message="signInError"
            @submit="handleSignInSubmit"
            @register="handleSignInRegister"
            @clear-error="signInError = ''"
          />
        </div>
      </div>
    </nav>
    <SettingsOverlay 
      v-model="showSettings" 
      @theme-changed="handleThemeSync"
    />
  </header>
</template>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: var(--bg-topbar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.topbar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -20px;
  height: 20px;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--bg-topbar), transparent);
}

.nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.site-name {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: default;
}

.site-name-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent) 0%, #00a3ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.nav-home-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid rgba(0,0,0,0.05);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-home-button:hover {
  background: var(--color-white);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: var(--color-accent);
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-signin, .nav-user {
  position: relative;
  display: flex;
  align-items: center;
}

/* User Dropdown Menu */
.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 200px;
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 1001;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.menu-item.destructive {
  color: #ef4444;
}

.menu-item.destructive:hover {
  background: rgba(239, 68, 68, 0.08);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

:deep(.nav-button) {
  width: auto !important;
  min-width: 0;
  height: 44px;
  padding: 0 1.25rem;
  font-size: 15px;
  letter-spacing: 0.01em;
  --btn-shadow: none;
}

:deep(.nav-button span) {
  white-space: nowrap;
}

:deep(.nav-button--ghost) {
  --btn-bg: var(--bg-secondary);
  --btn-hover-bg: var(--bg-primary);
  --btn-active-bg: var(--bg-primary);
  --btn-border: 1px solid var(--color-primary-10);
  --btn-color: var(--text-primary);
  backdrop-filter: blur(10px);
}

:deep(.nav-button--ghost:hover) {
  transform: translateY(-1px);
}

:deep(.nav-button--filled) {
  --btn-bg: linear-gradient(135deg, #007bff 0%, #00a3ff 100%);
  --btn-hover-bg: linear-gradient(135deg, #0070f0 0%, #0095ff 100%);
  --btn-active-bg: linear-gradient(135deg, #0065e5 0%, #008be8 100%);
  --btn-color: #ffffff;
  --btn-shadow: none;
}

:deep(.nav-button--filled:hover) {
  transform: translateY(-1px);
}

:deep(.nav-button--active) {
  --btn-bg: linear-gradient(135deg, #0a62d0 0%, #0081ff 100%);
  box-shadow: 0 20px 36px rgba(0, 123, 255, 0.25);
}

:deep(.nav-button--icon-only) {
  padding: 0 !important;
  width: 44px !important;
  min-width: 44px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.nav-button--icon-only .btn__icon) {
  margin: 0 !important;
}

:deep(.nav-button--icon-only .btn__content) {
  display: none !important;
}

.menu {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.menu a {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
}

.menu a.router-link-active {
  color: var(--color-accent);
  border-bottom: 2px solid var(--color-accent);
}

/* Responsive: First collapse Documentation text */
@media (max-width: 900px) {
  :deep(.nav-button--docs) {
    padding: 0 !important;
    width: 44px !important;
    min-width: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  :deep(.nav-button--docs .btn__icon) {
    margin: 0 !important;
  }

  :deep(.nav-button--docs .btn__content) {
    display: none !important;
  }
}

/* Responsive: Then collapse bUMking text */
@media (max-width: 600px) {
  .site-name {
    display: none;
  }
}
</style>
