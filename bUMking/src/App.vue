<template>
  <div id="app">
    <TopBar />
    <main class="content">
      <router-view />
    </main>
    <ToastNotification />
  </div>
</template>

<script setup>
import TopBar from './components/TopBar.vue'
import ToastNotification from './components/common/ToastNotification.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Theme management
const currentTheme = ref('default')

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'default' ? 'dark' : 'default'
  localStorage.setItem('theme', currentTheme.value)
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

// Keyboard shortcuts
const handleKeydown = (e) => {
  // "/" to open search (when not in input)
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    e.preventDefault()
    router.push('/pesquisa')
  }
  // "Escape" to go back
  if (e.key === 'Escape') {
    // Close any modals first (handled by components)
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'default'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
  
  // Add keyboard listener
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Expose toggle function for components
defineExpose({ toggleTheme })
</script>

<style>
@import './styles/themes.css';

/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
}

.content {
  margin-top: 60px; /* espaço para a topbar fixa */
  padding: 2rem;
}
</style>
