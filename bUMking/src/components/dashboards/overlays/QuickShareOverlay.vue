<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseActionInput from '@/components/common/BaseActionInput.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  link: { type: String, required: true }
})

defineEmits(['update:modelValue'])

const copied = ref(false)
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.link)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}
</script>

<template>
  <BaseModal 
    :model-value="modelValue" 
    title="Partilhar"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <BaseActionInput 
      :model-value="link"
      readonly
      @action="copyLink"
    >
      <template #icon>
        <svg v-if="!copied" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </template>
    </BaseActionInput>
  </BaseModal>
</template>
