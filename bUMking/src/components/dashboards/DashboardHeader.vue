<script setup>
import ControlDropDown from '@/components/common/ControlDropDown.vue'
import ActionToolbar from '@/components/common/ActionToolbar.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  comparisonOptions: {
    type: Array,
    default: () => []
  },
  dropdownMinWidth: {
    type: String,
    default: '200px'
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  showSave: {
    type: Boolean,
    default: true
  },
  showShare: {
    type: Boolean,
    default: true
  },
  showDownload: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue', 'save', 'share', 'download'])
</script>

<template>
  <header class="dashboard-header">
    <div class="header-left">
      <h2>{{ title }}</h2>
      <slot name="controls">
        <div v-if="comparisonOptions && comparisonOptions.length" class="comparison-control">
          <span class="label">{{ $t('location.compare_with') }}</span>
          <ControlDropDown 
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            :options="comparisonOptions"
            :min-width="dropdownMinWidth"
          />
        </div>
      </slot>
      <!-- Slot for extra controls like Year Selector -->
      <slot name="append-controls" />
    </div>
    
    <div class="header-actions">
      <ActionToolbar 
        :is-saved="isSaved"
        :show-save="showSave"
        :show-share="showShare"
        :show-download="showDownload"
        @save="$emit('save')"
        @share="$emit('share')"
        @download="$emit('download')"
      />
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.dashboard-header h2 {
  margin: 0;
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  color: var(--text-primary);
  font-weight: 700;
}

.comparison-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.comparison-control .label {
  font-size: 0.9rem;
  color: var(--color-primary-60);
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .header-left {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-actions {
    width: 100%;
  }
}
</style>
