<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseActionInput from '@/components/common/BaseActionInput.vue'
import BaseOptionGroup from '@/components/common/BaseOptionGroup.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  defaultFilename: { type: String, default: 'analysis_stats' }
})

const emit = defineEmits(['update:modelValue', 'download'])

const filename = ref(props.defaultFilename)
const fileType = ref('json')

const fileTypes = [
  { label: 'JSON', value: 'json' },
  { label: 'TXT', value: 'txt' }
]

const handleDownload = () => {
  emit('download', {
    filename: filename.value,
    type: fileType.value
  })
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal 
    :model-value="modelValue" 
    title="Download"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <BaseActionInput 
      v-model="filename"
      @action="handleDownload"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </template>
    </BaseActionInput>

    <BaseOptionGroup 
      v-model="fileType" 
      label="Tipo de ficheiro"
      :options="fileTypes"
    />
  </BaseModal>
</template>
