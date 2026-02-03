import { createI18n } from 'vue-i18n'
import pt from './locales/pt'
import en from './locales/en'

const savedLocale = localStorage.getItem('lang') || 'pt'

// Set the HTML lang attribute for accessibility
document.documentElement.lang = savedLocale

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: savedLocale,
  fallbackLocale: 'pt',
  messages: {
    pt,
    en
  }
})

export default i18n

