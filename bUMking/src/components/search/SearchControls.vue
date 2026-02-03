<script setup>
import { computed } from 'vue'
import ControlDropDown from '@/components/common/ControlDropDown.vue'
import FilterMenu from './FilterMenu.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  category: { type: String, default: '' },
  categories: { type: Array, default: () => [] },
  filterOpen: { type: Boolean, default: false },
  sortOpen: { type: Boolean, default: false },
  categoryOpen: { type: Boolean, default: false },
  sortValue: { type: String, default: '' },
  sortOptions: { type: Array, default: () => [] },
  houseTypeOptions: { type: Array, default: () => [] },
  priceStep: { type: Number, default: 1 },
  ratingStep: { type: Number, default: 0.1 }
})

const emit = defineEmits([
  'update:modelValue',
  'update:category',
  'update:sortValue',
  'toggle-filter',
  'toggle-sort',
  'toggle-category'
])

// Computed v-models
const locationTerm = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedCategory = computed({
  get: () => props.category,
  set: (value) => emit('update:category', value)
})

const selectedSort = computed({
  get: () => props.sortValue,
  set: (value) => emit('update:sortValue', value)
})

// Category options mapping
const categoryOptions = computed(() =>
    props.categories.map((value) => {
    let label = t('search.categories.listings')
    if (value === 'hosts') label = t('search.categories.hosts')
    else if (value === 'neighbourhoods') label = t('search.categories.neighbourhoods')
    
    return { value, label }
  })
)

// Use prop for open state
const categoryDropdownOpen = computed({
  get: () => props.categoryOpen,
  set: () => emit('toggle-category')
})

const filterDropdownOpen = computed({
  get: () => props.filterOpen,
  set: () => emit('toggle-filter')
})


</script>

<template>
  <div class="search-controls">
    <form class="search-form" @submit.prevent>
      <!-- Location Search -->
      <div class="field-group location-field">
        <label class="field-label" for="search-location">{{ $t('search.location_label') }}</label>
        <div class="field-input">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M21 21l-4.35-4.35m1.02-4.41a6.28 6.28 0 11-12.56 0 6.28 6.28 0 0112.56 0z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            id="search-location"
            v-model="locationTerm"
            type="text"
            :placeholder="$t('search.location_placeholder')"
          />
        </div>
      </div>

      <!-- Category Dropdown -->
      <div class="field-group">
        <label class="field-label" for="category-dropdown">{{ $t('search.type_label') }}</label>
        <ControlDropDown
          id="category-dropdown"
          v-model="selectedCategory"
          :open="categoryDropdownOpen"
          @update:open="$emit('toggle-category')"
          :options="categoryOptions"
          button-icon="M6 4h8M6 10h8M6 16h8"
          :placeholder="$t('search.type_placeholder')"
          :dropdown-title="$t('search.type_title')"
          min-width="220px"
        />
      </div>

      <!-- Quick Actions -->
      <div class="field-group actions-field">
        <span class="field-label">{{ $t('search.quick_actions') }}</span>
        <div class="action-buttons">
          <!-- Filter Menu -->
          <FilterMenu
            :open="filterDropdownOpen"
            :house-type-options="houseTypeOptions"
            :price-step="priceStep"
            :rating-step="ratingStep"
            @update:open="emit('toggle-filter')"
          />

          <!-- Sort Dropdown -->
          <ControlDropDown
            v-model="selectedSort"
            :open="sortOpen"
            @update:open="$emit('toggle-sort')"
            :options="sortOptions"
            button-icon="M7 4h10M7 10h6M7 16h2M3 4v12l3-3"
            :placeholder="$t('search.sort_placeholder')"
            :dropdown-title="$t('search.sort_title')"
            min-width="240px"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.search-controls {
  background: var(--bg-primary);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 16px 32px var(--color-primary-08);
}

.search-form {
  display: grid;
  grid-template-columns: minmax(300px, 2fr) minmax(160px, 1fr) auto;
  align-items: end;
  gap: 1.25rem;
  --control-height: clamp(2.4rem, 3.8vw, 2.8rem);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-primary-60);
  padding-left: 0.25rem;
}

/* Location Field */
.location-field {
  flex: 1;
  min-width: 0;
}

.field-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-primary-04);
  border-radius: 1rem;
  height: var(--control-height);
  padding: 0 1.25rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.field-input:focus-within {
  background: var(--color-primary-05);
  border-color: var(--color-accent-30);
}

.field-input svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary-50);
  flex-shrink: 0;
}

.field-input input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  outline: none;
}

.field-input input::placeholder {
  color: var(--color-primary-45);
}

/* Actions Field */
.actions-field {
  justify-self: end;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 1520px) {
  .search-form {
    grid-template-columns: 1fr 1fr;
  }

  .actions-field {
    grid-column: 1 / -1;
    justify-self: stretch;
  }

  .action-buttons {
    justify-content: flex-start;
  }
}

@media (max-width: 850px) {
  .search-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .search-controls {
    padding: 1.25rem;
    border-radius: 1.25rem;
  }

  .search-form {
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons > * {
    width: 100%;
  }

  .action-buttons :deep(.control-button),
  .action-buttons :deep(.filter-menu-wrapper) {
    width: 100%;
  }

  .action-buttons :deep(.control-button) {
    justify-content: space-between;
  }
}

@media (max-width: 460px) {
  .search-form {
    --control-height: 2.6rem;
  }

  .field-input {
    padding: 0 1rem;
  }
}
</style>