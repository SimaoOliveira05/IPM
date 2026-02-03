<template>
  <div class="filter-section">
    <div class="section-top">
      <span class="section-label">{{ label }}</span>
      <span class="section-value">{{ displayValue }}</span>
    </div>
    <div class="slider-wrapper">
      <VueSlider
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :min="min"
        :max="max"
        :interval="step"
        :enable-cross="false"
        :lazy="true"
        :tooltip="'active'"
        :process-style="{
          background: 'linear-gradient(90deg,#2563eb,#3b82f6)',
          boxShadow: '0 6px 16px rgba(37,99,235,0.25)'
        }"
        :rail-style="{ background: 'rgba(10,37,64,0.12)' }"
        :height="6"
        :dot-size="18"
        :aria-label="label"
      />
    </div>
    <div class="range-values">
      <span>{{ formatMin(modelValue[0]) }}</span>
      <span>{{ formatMax(modelValue[1]) }}</span>
    </div>
  </div>
</template>

<script setup>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Array, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 1 },
  displayValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])

const formatMin = (v) => props.label.toLowerCase().includes('preço') || props.label.toLowerCase().includes('price') ? `${v}€` : v.toFixed(1)
const formatMax = (v) => props.label.toLowerCase().includes('preço') || props.label.toLowerCase().includes('price') ? `${v}€` : v.toFixed(1)
</script>

<style scoped>
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(10, 37, 64, 0.6);
}

.section-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2563eb;
}

.slider-wrapper {
  padding: 1rem 0.25rem 0.5rem;
}

.range-values {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(10, 37, 64, 0.65);
  margin-top: 0.5rem;
}
</style>
