<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseSegmentedControl from '@/components/common/BaseSegmentedControl.vue'
import { useI18n } from 'vue-i18n'

defineProps({
  modelValue: { type: Boolean, required: true }
})

const emit = defineEmits(['update:modelValue', 'theme-changed'])

const { t, locale } = useI18n()
const currentTheme = ref('default')
const currentLang = ref(locale.value)

const themeOptions = computed(() => [
  { label: t('settings.theme.day'), value: 'default', icon: '☀️' },
  { label: t('settings.theme.night'), value: 'dark', icon: '🌙' }
])

const langOptions = computed(() => [
  { label: t('settings.lang.pt'), value: 'pt', icon: '🇵🇹' },
  { label: t('settings.lang.en'), value: 'en', icon: '🇬🇧' }
])

onMounted(() => {
  currentTheme.value = localStorage.getItem('theme') || 'default'
})

const setTheme = (theme) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  emit('theme-changed', theme)
}

const setLang = (lang) => {
  currentLang.value = lang
  locale.value = lang
  localStorage.setItem('lang', lang)
  document.documentElement.lang = lang
}
</script>

<template>
  <BaseModal 
    :model-value="modelValue" 
    :title="$t('settings.title')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="settings-container">
      <!-- Theme Selection -->
      <div class="setting-group">
        <h3>{{ $t('settings.appearance') }}</h3>
        <BaseSegmentedControl
          v-model="currentTheme"
          :options="themeOptions"
          width="60%"
          class="center-control"
          @update:model-value="setTheme"
        />
      </div>

      <!-- Language Selection -->
      <div class="setting-group">
        <h3>{{ $t('settings.language') }}</h3>
        <BaseSegmentedControl
          v-model="currentLang"
          :options="langOptions"
          width="60%"
          class="center-control"
          @update:model-value="setLang"
        />
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
  text-align: center;
}

.setting-group h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.center-control {
  margin: 0 auto;
}
</style>
