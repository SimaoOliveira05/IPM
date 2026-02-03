import { computed, ref, watch } from 'vue'

/**
 * usePagination composable
 * @param {import('vue').Ref<Array>} items
 * @param {import('vue').Ref<number>} pageSize
 * @returns {Object} currentPage, totalPages, paginatedItems, pageNumbers, pageRangeLabel, goToPage, goToPreviousPage, goToNextPage, jumpPages
 */
export function usePagination({ items, pageSize }) {
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize.value)))

  const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    return items.value.slice(startIndex, startIndex + pageSize.value)
  })

  const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

  const pageRangeLabel = computed(() => {
    if (!items.value.length) return '0 de 0'
    const start = (currentPage.value - 1) * pageSize.value + 1
    const end = Math.min(currentPage.value * pageSize.value, items.value.length)
    return `${start}-${end} de ${items.value.length}`
  })

  function goToPage(p) {
    if (p >= 1 && p <= totalPages.value) currentPage.value = p
  }
  function goToPreviousPage() {
    if (currentPage.value > 1) currentPage.value -= 1
  }
  function goToNextPage() {
    if (currentPage.value < totalPages.value) currentPage.value += 1
  }
  function jumpPages(offset) {
    if (!Number.isFinite(offset)) return
    const target = Math.min(Math.max(1, currentPage.value + offset), totalPages.value)
    if (target !== currentPage.value) currentPage.value = target
  }

  // Only clamp currentPage if it exceeds totalPages (e.g., after filtering reduces results)
  watch(totalPages, (val) => { 
    if (currentPage.value > val) {
      currentPage.value = val
    }
  })

  return {
    currentPage,
    totalPages,
    paginatedItems,
    pageNumbers,
    pageRangeLabel,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    jumpPages
  }
}
