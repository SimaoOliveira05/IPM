<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'

const router = useRouter()

const props = defineProps({
  metaLabel: { type: String, default: '' },
  resultsCount: { type: Number, default: 0 },
  listings: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 0 },
  pageSizeOptions: { type: Array, default: () => [] },
  pageRangeLabel: { type: String, default: '' },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 }
})

const emit = defineEmits([
  'update:pageSize',
  'go-to-page',
  'next-page',
  'previous-page',
  'jump-pages'
])

const handlePageSizeChange = (event) => {
  emit('update:pageSize', Number(event.target.value))
} 

const handleGoToPage = (page) => emit('go-to-page', page)
const handleNext = () => emit('next-page')
const handlePrevious = () => emit('previous-page')
const handleJump = (offset) => emit('jump-pages', offset)

const viewItem = (id, isHost, isNeighbourhood) => {
  const goToHost = (itemId) => {
    router.push(`/anfitriao/${itemId}`)
  }
  const goToNeighbourhood = (name) => {
    router.push(`/freguesia/${name}`)
  }

  if (isHost) {
    goToHost(id)
  } else if (isNeighbourhood) {
    goToNeighbourhood(id)
  } else {
    router.push(`/casa/${id}`)
  }
}

const pageNumbers = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  
  if (props.totalPages <= maxVisiblePages) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Sempre adiciona a primeira página
    pages.push(1)
    
    // Define as páginas do meio baseado na página atual
    let middlePages = []
    
    if (props.currentPage === 1) {
      // Na primeira página: mostra só a próxima
      middlePages.push(2)
    } else if (props.currentPage === props.totalPages) {
      // Na última página: mostra só a anterior
      middlePages.push(props.totalPages - 1)
    } else {
      // No meio: mostra anterior, atual e próxima
      middlePages.push(props.currentPage - 1)
      middlePages.push(props.currentPage)
      middlePages.push(props.currentPage + 1)
    }
    
    // Adiciona as páginas do meio (evitando duplicatas com primeira e última)
    middlePages.forEach(page => {
      if (page !== 1 && page !== props.totalPages) {
        pages.push(page)
      }
    })
    
    // Sempre adiciona a última página
    pages.push(props.totalPages)
  }
  
  return pages
})

</script>

<template>
  <section class="results-panel">
    <header class="results-header">
      <div>
        <p class="results-meta">{{ metaLabel }}</p>
        <h2>{{ resultsCount }} {{ $t('results.count_label') }}</h2>
      </div>
    </header>

    <template v-if="resultsCount">
      <div class="results-grid">
        <BaseCard
          v-for="item in listings"
          :key="item.id || item.host_id"
          :data="item"
          @click="viewItem(item.id || item.host_id, !!item.host_name, !!item.is_neighbourhood)"
        />
      </div>

      <div class="results-pagination" aria-label="Controlo de paginação">
        <div class="page-size-control">
          <label for="page-size-select">{{ $t('results.per_page') }}</label>
          <div class="select-wrapper">
            <select id="page-size-select" :value="pageSize" @change="handlePageSizeChange">
              <option v-for="option in pageSizeOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <div class="pagination-meta">
          <span>{{ pageRangeLabel }}</span>
        </div>

        <nav class="pagination-nav" aria-label="Paginação de resultados">
          <button
            type="button"
            class="page-nav-button jump-five"
            :disabled="currentPage === 1"
            @click="handleJump(-5)"
            aria-label="Retroceder cinco páginas"
          >
            &lt;&lt;
          </button>

          <button
            type="button"
            class="page-nav-button"
            :disabled="currentPage === 1"
            @click="handlePrevious"
            aria-label="Página anterior"
          >
            &lt;
          </button>

          <ul class="page-list" role="list">
            <li v-for="page in pageNumbers" :key="page">
              <button
                type="button"
                :class="['page-button', { active: page === currentPage }]"
                @click="handleGoToPage(page)"
              >
                {{ page }}
              </button>
            </li>
          </ul>

          <button
            type="button"
            class="page-nav-button"
            :disabled="currentPage === totalPages"
            @click="handleNext"
            aria-label="Próxima página"
          >
            &gt;
          </button>

          <button
            type="button"
            class="page-nav-button jump-five"
            :disabled="currentPage === totalPages"
            @click="handleJump(5)"
            aria-label="Avançar cinco páginas"
          >
            &gt;&gt;
          </button>
        </nav>
      </div>
    </template>

    <div v-else class="empty-state">
      <h3>{{ $t('results.empty_title') }}</h3>
      <p>{{ $t('results.empty_description') }}</p>
    </div>
  </section>
</template>

<style scoped>
.results-panel {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  background: var(--bg-primary);
  border-radius: clamp(1.25rem, 3vw, 1.9rem);
  padding: clamp(1.4rem, 3vw, 2rem);
  box-shadow: 0 18px 36px var(--color-primary-08);
}

.results-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.results-meta {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-primary-55);
}

.results-header h2 {
  margin: 0.15rem 0 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 700;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: clamp(1rem, 3vw, 1.6rem);
}

.results-pagination {
  margin-top: clamp(1rem, 3vw, 1.5rem);
  padding-top: clamp(0.8rem, 2vw, 1.2rem);
  border-top: 1px solid var(--color-primary-08);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: clamp(0.85rem, 2vw, 1.5rem);
  align-items: center;
}

.page-size-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-primary-70);
}

.page-size-control label {
  font-weight: 600;
  letter-spacing: 0.03em;
}

.select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: var(--color-primary-05);
  border-radius: 999px;
  padding: 0 1.25rem 0 0.85rem;
}

.select-wrapper select {
  appearance: none;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.6rem 0.8rem 0.6rem 0;
  color: var(--text-primary);
  cursor: pointer;
  width: 100%;
  line-height: 1.1;
}

.select-wrapper svg {
  position: absolute;
  right: 0.75rem;
  width: 16px;
  height: 16px;
  color: var(--color-primary-45);
  pointer-events: none;
}

.pagination-meta span {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-primary-60);
}

.pagination-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-nav-button {
  border: none;
  background: var(--color-primary-06);
  color: var(--text-primary);
  font-weight: 600;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  min-width: 2.4rem;
  text-align: center;
}

.page-nav-button.jump-five {
  font-weight: 700;
}

.page-nav-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-nav-button:not(:disabled):hover {
  background: var(--color-primary-12);
  transform: translateY(-1px);
}

.page-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0;
  margin: 0;
  list-style: none;
  justify-content: center;
}

.page-button {
  border: none;
  background: var(--color-primary-05);
  color: var(--text-primary);
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.page-button:hover {
  background: var(--color-accent-15);
  transform: translateY(-1px);
}

.page-button.active {
  background: var(--color-accent-18);
  color: var(--color-accent-hover);
  box-shadow: inset 0 0 0 1px var(--color-accent-35);
}

.empty-state {
  padding: 2rem;
  border: 1px dashed var(--color-primary-18);
  border-radius: 1.25rem;
  text-align: center;
  background: rgba(246, 248, 251, 0.6);
}

.empty-state h3 {
  margin: 0;
  font-size: 1.2rem;
}

.empty-state p {
  margin: 0.75rem 0 0;
  color: var(--color-primary-60);
}

@media (max-width: 900px) {
  .results-pagination {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.75rem;
  }

  .page-size-control {
    flex-direction: column;
    align-items: center;
  }

  .pagination-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>