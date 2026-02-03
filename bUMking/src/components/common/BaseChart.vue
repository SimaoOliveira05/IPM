<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  type: { type: String, required: true },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
})

const canvasRef = ref(null)
let chartInstance = null

const renderChart = () => {
  if (!canvasRef.value) return
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(canvasRef.value, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...props.options
    }
  })
}

watch(() => props.data, renderChart, { deep: true })

onMounted(renderChart)

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <div class="base-chart-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.base-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
