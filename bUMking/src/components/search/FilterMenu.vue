<template>
  <div ref="menuRef" class="filter-menu-wrapper">
    <ControlButton
      variant="dropdown"
      :active="open"
      :with-caret="true"
      @click="toggleMenu"
      type="button"
    >
      <template #icon>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 5h14l-5 6v4l-4 2v-6L3 5z" fill="currentColor" />
        </svg>
      </template>
      {{ $t('filters.filter_btn') }}
    </ControlButton>

    <Transition name="dropdown-fade">
      <div
        v-if="open"
        class="filter-dropdown"
        role="dialog"
        aria-label="Filtros avançados"
      >
        <header class="dropdown-header">
          <h3 class="dropdown-title">{{ $t('filters.refine_results') }}</h3>
          <button
            type="button"
            class="dropdown-close"
            aria-label="Fechar filtros"
            @click="closeMenu"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <!-- Host Filters -->
        <template v-if="category === 'hosts'">
          <div class="filter-section">
            <FilterToggle
              :label="$t('host_profile.verified')"
              v-model="verifiedFlag"
            />
          </div>

          <div class="filter-section">
            <FilterToggle
              :label="$t('host_profile.superhost')"
              v-model="superhostFlag"
            />
          </div>
        </template>

        <!-- Listings Filters -->
        <template v-else-if="category !== 'neighbourhoods'">
          <!-- House Types -->
          <div class="filter-section">
            <span class="section-label">{{ $t('filters.house_type') }}</span>
            <div class="chip-group">
              <ControlButton
                v-for="option in houseTypeOptions"
                :key="option.value"
                variant="default"
                size="small"
                :active="selectedHouseTypes.includes(option.value)"
                @click="handleToggleHouseType(option.value)"
              >
                {{ $t(getRoomTypeLabel(option.value)) }}
              </ControlButton>
            </div>
          </div>

          <!-- Anomaly Toggle -->
          <div class="filter-section">
            <FilterToggle
              :label="$t('filters.anomalies_only')"
              v-model="anomalyFlag"
            />
          </div>

          <!-- Price Range -->
          <FilterRange
            :label="$t('filters.price_range')"
            v-model="priceArray"
            :min="priceBounds.min"
            :max="priceBounds.max"
            :step="priceStep"
            :display-value="priceRangeLabel"
          />

          <!-- Rating Range -->
          <FilterRange
            :label="$t('filters.rating')"
            v-model="ratingArray"
            :min="ratingBounds.min"
            :max="ratingBounds.max"
            :step="ratingStep"
            :display-value="ratingRangeLabel"
          />
        </template>
        <!-- Neighbourhood filters (Price + Rating only) -->
        <template v-else>
           <!-- Price Range -->
           <FilterRange
            :label="$t('filters.price_range')"
            v-model="priceArray"
            :min="neighbourhoodPriceBounds.min"
            :max="neighbourhoodPriceBounds.max"
            :step="priceStep"
            :display-value="priceRangeLabel"
          />

          <!-- Rating Range -->
          <FilterRange
            :label="$t('filters.rating')"
            v-model="ratingArray"
            :min="neighbourhoodRatingBounds.min"
            :max="neighbourhoodRatingBounds.max"
            :step="ratingStep"
            :display-value="ratingRangeLabel"
          />
        </template>

        <!-- Footer Actions -->
        <footer class="dropdown-footer">
          <button 
            type="button" 
            class="secondary-button" 
            @click="handleReset"
          >
            {{ $t('filters.clear_filters') }}
          </button>
          <button 
            type="button" 
            class="primary-button" 
            @click="closeMenu"
          >
            {{ $t('filters.apply') }}
          </button>
        </footer>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/stores/searchStore'
import ControlButton from '@/components/common/ControlButton.vue'
import { getRoomTypeLabel } from '@/composables/useRoomTypeLabel'

// New Components
import FilterToggle from '@/components/search/filters/FilterToggle.vue'
import FilterRange from '@/components/search/filters/FilterRange.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  houseTypeOptions: { type: Array, default: () => [] },
  priceStep: { type: Number, default: 1 },
  ratingStep: { type: Number, default: 0.1 }
})

const emit = defineEmits(['update:open'])

const searchStore = useSearchStore()
const { filters, priceBounds, neighbourhoodPriceBounds, neighbourhoodRatingBounds, category } = storeToRefs(searchStore)

const menuRef = ref(null)

// Computed bindings to store
const selectedHouseTypes = computed(() => filters.value.houseTypes)

const anomalyFlag = computed({
  get: () => filters.value.anomalyOnly,
  set: (value) => filters.value.anomalyOnly = value
})

const verifiedFlag = computed({
  get: () => filters.value.verified,
  set: (value) => filters.value.verified = value
})

const superhostFlag = computed({
  get: () => filters.value.superhost,
  set: (value) => filters.value.superhost = value
})

// Price Range
const priceArray = computed({
  get: () => [filters.value.priceRange.min, filters.value.priceRange.max],
  set: (val) => {
    if (Array.isArray(val) && val.length === 2) {
      filters.value.priceRange = { min: val[0], max: val[1] }
    }
  }
})

const priceRangeLabel = computed(() => (
  Number.isFinite(filters.value.priceRange.min) && Number.isFinite(filters.value.priceRange.max)
    ? `${filters.value.priceRange.min}€ — ${filters.value.priceRange.max}€`
    : ''
))

// Rating Range
const ratingArray = computed({
  get: () => [filters.value.ratingRange.min, filters.value.ratingRange.max],
  set: (val) => {
    if (Array.isArray(val) && val.length === 2) {
      // Round to 1 decimal to match previous logic
      filters.value.ratingRange = { 
        min: Number(val[0].toFixed(1)), 
        max: Number(val[1].toFixed(1)) 
      }
    }
  }
})

const ratingBounds = { min: 0, max: 5 }

const ratingRangeLabel = computed(() => (
  Number.isFinite(filters.value.ratingRange.min) && Number.isFinite(filters.value.ratingRange.max)
    ? `${filters.value.ratingRange.min.toFixed(1)} — ${filters.value.ratingRange.max.toFixed(1)}`
    : ''
))

const toggleMenu = () => {
  emit('update:open', !props.open)
}
const closeMenu = () => {
  if (props.open) {
    emit('update:open', false)
  }
}
const handleToggleHouseType = (value) => searchStore.toggleHouseType(value)
const handleReset = () => searchStore.resetFilters()

const handleClickOutside = (event) => {
  if (!props.open || !menuRef.value) return
  
  const path = event.composedPath?.() || []
  const isInside = path.includes(menuRef.value) || menuRef.value.contains(event.target)
  
  if (!isInside) closeMenu()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.open) {
    closeMenu()
    event.stopPropagation()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.filter-menu-wrapper {
  position: relative;
  display: inline-flex;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 0.65rem);
  left: 0;
  width: min(380px, calc(100vw - 2rem));
  background: var(--bg-primary);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 24px 48px rgba(10, 37, 64, 0.16),
              0 0 0 1px rgba(10, 37, 64, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 100;
  max-height: min(80vh, 600px);
  overflow-y: auto;
}

/* Dropdown Animation */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Header */
.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(10, 37, 64, 0.08);
}

.dropdown-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.dropdown-close {
  border: none;
  background: rgba(10, 37, 64, 0.06);
  color: #0a2540;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.4rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-close:hover {
  background: rgba(10, 37, 64, 0.12);
  transform: scale(1.05);
}

/* Filter Sections */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(10, 37, 64, 0.6);
}

/* Chip Buttons */
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Footer */
.dropdown-footer {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(10, 37, 64, 0.08);
}

.secondary-button,
.primary-button {
  flex: 1;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.secondary-button {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--color-primary-16);
}

.secondary-button:hover {
  background: rgba(10, 37, 64, 0.06);
  border-color: rgba(10, 37, 64, 0.24);
}

.primary-button {
  background: var(--bg-accent-gradient);
  color: var(--color-white);
  box-shadow: 0 4px 12px var(--color-accent-30);
}

.primary-button:hover {
  box-shadow: 0 6px 16px var(--color-accent-40);
  transform: translateY(-1px);
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .filter-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1.5rem;
    max-height: 80vh;
    z-index: 1000;
  }

  .dropdown-footer {
    flex-direction: column;
  }

  .secondary-button,
  .primary-button {
    width: 100%;
  }
}
</style>