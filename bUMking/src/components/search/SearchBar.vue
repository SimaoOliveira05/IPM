<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  category: { type: String, default: 'listings' }
})

const emit = defineEmits(['update:modelValue', 'update:category', 'search'])

const term = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedCategory = computed({
  get: () => props.category,
  set: (value) => emit('update:category', value)
})

const handleSubmit = () => emit('search')
</script>

<template>
  <form class="search-bar" @submit.prevent="handleSubmit">
    <input
      v-model="term"
      type="text"
      class="search-input"
      :placeholder="$t('search.location_placeholder')"
      aria-label="Pesquisar no dataset do Airbnb"
    />

    <button type="submit" class="search-button" aria-label="Pesquisar">
      <svg
        class="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </button>

    <label class="category-select">
      <select v-model="selectedCategory" aria-label="Selecionar dimensão da pesquisa">
        <option value="listings">{{ $t('search.categories.listings') }}</option>
        <option value="hosts">{{ $t('search.categories.hosts') }}</option>
        <option value="neighbourhoods">{{ $t('search.categories.neighbourhoods') }}</option>
      </select>
    </label>
  </form>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: min(666px, 100%);
  height: 70px;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: 1000px;
  padding: 0 clamp(1.25rem, 3vw, 2rem);
  box-shadow: 0 18px 38px rgba(9, 32, 77, 0.1);
  border: none;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--color-primary-40);
  font-weight: 500;
}

.search-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-accent);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.search-button:hover {
  background: var(--color-accent-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 12px var(--color-accent-30);
}

.search-button:active {
  transform: scale(0.95);
  box-shadow: none;
}

.search-icon {
  width: 20px;
  height: 20px;
  stroke: var(--color-white);
}
.category-select {
  position: relative;
  height: 50px;
  background: var(--bg-secondary);
  border-radius: 1000px;
  display: flex;
  align-items: center;
  padding: 0 clamp(1rem, 2vw, 1.5rem);
  cursor: pointer;
  box-shadow: inset 0 0 0 1px var(--border-color);
  transition: background 0.2s ease;
}

.category-select:hover {
  background: var(--color-primary-04);
}

.category-select select {
  border: none;
  background: var(--bg-secondary);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  appearance: none;
  padding-right: 1.5rem;
  cursor: pointer;
  color-scheme: light dark;
  transition: background 0.2s ease;
}

.category-select:hover select {
  background: var(--color-primary-04);
}

.category-select::after {
  content: '';
  position: absolute;
  right: clamp(0.75rem, 2vw, 1rem);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--text-primary);
  pointer-events: none;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .search-bar {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 0.75rem;
    border-radius: 1.5rem;
  }

  .search-input {
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 999px;
    padding: 0.75rem 1.25rem;
    height: 44px;
  }

  .search-input::placeholder {
    font-size: 0.85rem;
  }

  .search-button {
    width: 100%;
    height: 44px;
    border-radius: 999px;
    border: none;
    outline: none;
  }

  .category-select {
    width: 100%;
    justify-content: center;
  }

  .category-select select {
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
  }
}

@media (max-width: 400px) {
  .search-bar {
    padding: 0.75rem;
  }

  .search-button {
    height: 40px;
  }
}

</style>