<script setup>
import ControlButton from '@/components/common/ControlButton.vue'

defineProps({
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

defineEmits(['save', 'share', 'download'])
</script>

<template>
  <div class="action-toolbar">
    <ControlButton v-if="showSave" :title="isSaved ? 'Remover dos favoritos' : 'Guardar'" @click="$emit('save')" :active="isSaved">
      <template #icon>
        <svg v-if="isSaved" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" class="heart-filled">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </template>
    </ControlButton>

    <ControlButton v-if="showShare" title="Partilhar" @click="$emit('share')">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </template>
    </ControlButton>

    <ControlButton v-if="showDownload" title="Download PDF" @click="$emit('download')">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </template>
    </ControlButton>
  </div>
</template>

<style scoped>
.action-toolbar {
  display: flex;
  gap: 0.5rem;
}
</style>
