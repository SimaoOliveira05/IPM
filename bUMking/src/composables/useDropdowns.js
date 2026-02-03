import { ref } from 'vue'

/**
 * useDropdowns composable
 * Centraliza o estado de abertura dos dropdowns (filter, sort, category) e garante que só um está aberto de cada vez.
 * @returns {Object} filterOpen, sortOpen, categoryOpen, openDropdown
 */
export function useDropdowns() {
  const filterOpen = ref(false)
  const sortOpen = ref(false)
  const categoryOpen = ref(false)

  function openDropdown(type) {
    filterOpen.value = false
    sortOpen.value = false
    categoryOpen.value = false
    if (type === 'filter') filterOpen.value = true
    if (type === 'sort') sortOpen.value = true
    if (type === 'category') categoryOpen.value = true
  }

  function toggleDropdown(type) {
    if (type === 'filter') {
      filterOpen.value = !filterOpen.value
      if (filterOpen.value) openDropdown('filter')
    } else if (type === 'sort') {
      sortOpen.value = !sortOpen.value
      if (sortOpen.value) openDropdown('sort')
    } else if (type === 'category') {
      categoryOpen.value = !categoryOpen.value
      if (categoryOpen.value) openDropdown('category')
    }
  }

  return {
    filterOpen,
    sortOpen,
    categoryOpen,
    openDropdown,
    toggleDropdown
  }
}
