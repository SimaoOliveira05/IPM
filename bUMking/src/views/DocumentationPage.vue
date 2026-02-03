<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BaseFrame from '@/components/common/BaseFrame.vue'

import ScoreCard from '@/components/listing-dashboard/ScoreCard.vue'

const activeSection = ref('data')
let observer = null

const setupObserver = () => {
  const options = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top/center
    threshold: 0
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, options)

  const sections = document.querySelectorAll('.doc-section')
  sections.forEach((section) => observer.observe(section))
}

onMounted(() => {
  setupObserver()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const scrollTo = (id) => {
  activeSection.value = id
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const example1 = {
  percentiles: { price: 90, occupancy: 95 },
  alignment: 'balanced',
  score: 94,
  label: 'dominant',
  anomalies: [],
  marketFit: 'excellent'
}

const example2 = {
  percentiles: { price: 20, occupancy: 30 },
  alignment: 'misaligned_low',
  score: 35,
  label: 'weak',
  anomalies: ['low_occupancy'],
  marketFit: 'needs_work'
}
</script>

<template>
  <section class="doc-page">
    <div class="doc-container">
      <aside class="sidebar">
        <BaseFrame class="nav-frame">
          <h3>{{ $t('documentation.title') }}</h3>
          <nav>
            <button 
              :class="{ active: activeSection === 'search' }" 
              @click="scrollTo('search')"
            >
              {{ $t('documentation.nav.search') }}
            </button>
            <button 
              :class="{ active: activeSection === 'data' }" 
              @click="scrollTo('data')"
            >
              {{ $t('documentation.nav.data') }}
            </button>
            <button 
              :class="{ active: activeSection === 'scoring' }" 
              @click="scrollTo('scoring')"
            >
              {{ $t('documentation.nav.scoring') }}
            </button>
            <button 
              :class="{ active: activeSection === 'revenue' }" 
              @click="scrollTo('revenue')"
            >
              {{ $t('documentation.nav.revenue') }}
            </button>
            <button 
              :class="{ active: activeSection === 'alignment' }" 
              @click="scrollTo('alignment')"
            >
              Alinhamento Preço-Ocupação
            </button>
            <button 
              :class="{ active: activeSection === 'anomalies' }" 
              @click="scrollTo('anomalies')"
            >
              {{ $t('documentation.nav.anomalies') }}
            </button>
          </nav>
        </BaseFrame>
      </aside>

      <main class="content">
        <BaseFrame id="search" class="doc-section">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            {{ $t('documentation.sections.search.title') }}
          </h2>
          <p class="section-intro">{{ $t('documentation.sections.search.intro') }}</p>

          <div class="search-guide">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ $t('documentation.sections.search.what_title') }}
            </h3>
            <p>{{ $t('documentation.sections.search.what_desc') }}</p>
            
            <div class="category-cards">
              <div class="category-card">
                <div class="category-header listings">
                  <span class="category-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
                  </span>
                  <h4>{{ $t('documentation.sections.search.categories.listings.title') }}</h4>
                </div>
                <p>{{ $t('documentation.sections.search.categories.listings.desc') }}</p>
                <div class="example-searches">
                  <span class="example-label">{{ $t('documentation.general.example') }}:</span>
                  <ul>
                    <li v-for="(example, idx) in $tm('documentation.sections.search.categories.listings.examples')" :key="idx"><code>{{ example.split(' → ')[0] }}</code> → {{ example.split(' → ')[1] }}</li>
                  </ul>
                </div>
              </div>

              <div class="category-card">
                <div class="category-header hosts">
                  <span class="category-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <h4>{{ $t('documentation.sections.search.categories.hosts.title') }}</h4>
                </div>
                <p>{{ $t('documentation.sections.search.categories.hosts.desc') }}</p>
                <div class="example-searches">
                  <span class="example-label">{{ $t('documentation.general.example') }}:</span>
                  <ul>
                    <li v-for="(example, idx) in $tm('documentation.sections.search.categories.hosts.examples')" :key="idx"><code>{{ example.split(' → ')[0] }}</code> → {{ example.split(' → ')[1] }}</li>
                  </ul>
                </div>
              </div>

              <div class="category-card">
                <div class="category-header neighbourhoods">
                  <span class="category-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  </span>
                  <h4>{{ $t('documentation.sections.search.categories.neighbourhoods.title') }}</h4>
                </div>
                <p>{{ $t('documentation.sections.search.categories.neighbourhoods.desc') }}</p>
                <div class="example-searches">
                  <span class="example-label">{{ $t('documentation.general.example') }}:</span>
                  <ul>
                    <li v-for="(example, idx) in $tm('documentation.sections.search.categories.neighbourhoods.examples')" :key="idx"><code>{{ example.split(' → ')[0] }}</code> → {{ example.split(' → ')[1] }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="search-guide">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              {{ $t('documentation.sections.search.steps_title') }}
            </h3>
            <div class="steps-list">
              <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <strong>{{ $t('documentation.sections.search.steps.choose.title') }}</strong>
                  <p>{{ $t('documentation.sections.search.steps.choose.desc') }}</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <strong>{{ $t('documentation.sections.search.steps.type.title') }}</strong>
                  <p>{{ $t('documentation.sections.search.steps.type.desc') }}</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <strong>{{ $t('documentation.sections.search.steps.click.title') }}</strong>
                  <p>{{ $t('documentation.sections.search.steps.click.desc') }}</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                  <strong>{{ $t('documentation.sections.search.steps.filter.title') }}</strong>
                  <p>{{ $t('documentation.sections.search.steps.filter.desc') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="search-guide">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              {{ $t('documentation.sections.search.tips_title') }}
            </h3>
            <div class="tips-grid">
              <div class="tip-card">
                <span class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </span>
                <p><strong>{{ $t('documentation.sections.search.tips.partial.title') }}</strong> {{ $t('documentation.sections.search.tips.partial.desc') }}</p>
              </div>
              <div class="tip-card">
                <span class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </span>
                <p><strong>{{ $t('documentation.sections.search.tips.switch.title') }}</strong> {{ $t('documentation.sections.search.tips.switch.desc') }}</p>
              </div>
              <div class="tip-card">
                <span class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </span>
                <p><strong>{{ $t('documentation.sections.search.tips.filters.title') }}</strong> {{ $t('documentation.sections.search.tips.filters.desc') }}</p>
              </div>
              <div class="tip-card">
                <span class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </span>
                <p><strong>{{ $t('documentation.sections.search.tips.sort.title') }}</strong> {{ $t('documentation.sections.search.tips.sort.desc') }}</p>
              </div>
            </div>
          </div>

          <div class="example-box">
            <span class="example-label">{{ $t('documentation.sections.search.example_label') }}</span>
            <p>{{ $t('documentation.sections.search.example_text') }}</p>
          </div>
        </BaseFrame>

        <!-- Data Organization -->
        <BaseFrame id="data" class="doc-section">
          <h2>{{ $t('documentation.sections.data.title') }}</h2>
          <p>{{ $t('documentation.sections.data.content') }}</p>
        </BaseFrame>

        <!-- Scoring System -->
        <BaseFrame id="scoring" class="doc-section">
          <h2>{{ $t('documentation.sections.scoring.title') }}</h2>
          <p class="section-intro">{{ $t('documentation.sections.scoring.description') }}</p>
          
          <div class="factors-grid">
            <div class="factor-card">
              <div class="factor-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div class="factor-content">
                <span class="factor-percentage">40%</span>
                <span class="factor-label">{{ $t('documentation.sections.scoring.factors.price') }}</span>
              </div>
            </div>
            <div class="factor-card">
              <div class="factor-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div class="factor-content">
                <span class="factor-percentage">40%</span>
                <span class="factor-label">{{ $t('documentation.sections.scoring.factors.occupancy') }}</span>
              </div>
            </div>
            <div class="factor-card">
              <div class="factor-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <div class="factor-content">
                <span class="factor-percentage">20%</span>
                <span class="factor-label">{{ $t('documentation.sections.scoring.factors.revenue') }}</span>
              </div>
            </div>
          </div>

          <div class="score-examples">
            <h4>{{ $t('documentation.sections.scoring.example') }}</h4>
            <div class="examples-grid">
              <!-- Good Example -->
              <ScoreCard
                :score="94"
                label="dominant"
                marketFit="excellent"
                :summary="example1"
                contextLabel="Exemplo 1 (Top)"
              />
              <!-- Bad Example -->
              <ScoreCard
                :score="35"
                label="weak"
                marketFit="needs_work"
                :summary="example2"
                contextLabel="Exemplo 2 (Atenção)"
              />
            </div>
          </div>
        </BaseFrame>

        <!-- Expected Revenue -->
        <BaseFrame id="revenue" class="doc-section">
          <h2>{{ $t('documentation.sections.revenue.title') }}</h2>
          <p class="section-text">{{ $t('documentation.sections.revenue.content') }}</p>
          
          <div class="example-box">
            <span class="example-label">{{ $t('documentation.general.example') }}:</span>
            <p>{{ $t('documentation.sections.revenue.example') }}</p>
          </div>
        </BaseFrame>

        <!-- Price-Occupancy Alignment -->
        <BaseFrame id="alignment" class="doc-section">
          <h2>{{ $t('documentation.sections.alignment.title') }}</h2>
          <p class="section-intro">{{ $t('documentation.sections.alignment.intro') }}</p>
          <p class="section-text">{{ $t('documentation.sections.alignment.matrix') }}</p>

          <div class="anomalies-grid">
            <div class="anomaly-card info">
              <h4>{{ $t('documentation.sections.alignment.categories.premium.label') }}</h4>
              <p>{{ $t('documentation.sections.alignment.categories.premium.desc') }}</p>
            </div>
            <div class="anomaly-card success">
              <h4>{{ $t('documentation.sections.alignment.categories.balanced.label') }}</h4>
              <p>{{ $t('documentation.sections.alignment.categories.balanced.desc') }}</p>
            </div>
            <div class="anomaly-card warning">
              <h4>{{ $t('documentation.sections.alignment.categories.undervalued.label') }}</h4>
              <p>{{ $t('documentation.sections.alignment.categories.undervalued.desc') }}</p>
            </div>
            <div class="anomaly-card danger">
              <h4>{{ $t('documentation.sections.alignment.categories.overvalued.label') }}</h4>
              <p>{{ $t('documentation.sections.alignment.categories.overvalued.desc') }}</p>
            </div>
            <div class="anomaly-card">
              <h4>{{ $t('documentation.sections.alignment.categories.misaligned.label') }}</h4>
              <p>{{ $t('documentation.sections.alignment.categories.misaligned.desc') }}</p>
            </div>
          </div>

          <div class="example-box">
            <span class="example-label">{{ $t('documentation.general.example') }}:</span>
            <p>{{ $t('documentation.sections.alignment.example') }}</p>
          </div>
        </BaseFrame>

        <!-- Anomalies -->
        <BaseFrame id="anomalies" class="doc-section">
          <h2>{{ $t('documentation.sections.anomalies.title') }}</h2>
          <p class="section-intro">{{ $t('documentation.sections.anomalies.intro') }}</p>

          <div class="anomalies-grid">
            <div class="anomaly-card warning">
              <h4>{{ $t('documentation.sections.anomalies.list.premium_price.label') }}</h4>
              <p>{{ $t('documentation.sections.anomalies.list.premium_price.desc') }}</p>
            </div>
            <div class="anomaly-card success">
              <h4>{{ $t('documentation.sections.anomalies.list.low_cost.label') }}</h4>
              <p>{{ $t('documentation.sections.anomalies.list.low_cost.desc') }}</p>
            </div>
            <div class="anomaly-card danger">
              <h4>{{ $t('documentation.sections.anomalies.list.critical_rating.label') }}</h4>
              <p>{{ $t('documentation.sections.anomalies.list.critical_rating.desc') }}</p>
            </div>
            <div class="anomaly-card danger">
              <h4>{{ $t('documentation.sections.anomalies.list.low_rating.label') }}</h4>
              <p>{{ $t('documentation.sections.anomalies.list.low_rating.desc') }}</p>
            </div>
            <div class="anomaly-card info">
              <h4>{{ $t('documentation.sections.anomalies.list.top_revenue.label') }}</h4>
              <p>{{ $t('documentation.sections.anomalies.list.top_revenue.desc') }}</p>
            </div>
            <div class="anomaly-card warning">
              <h4>{{ $t('documentation.sections.anomalies.list.low_occupancy.label') }}</h4>
              <p>{{ $t('documentation.sections.anomalies.list.low_occupancy.desc') }}</p>
            </div>
          </div>
        </BaseFrame>
      </main>
    </div>
  </section>
</template>

<style scoped>
.doc-page {
  min-height: calc(100vh - 80px); /* Adjust based on topbar height */
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: var(--bg-gradient);
}

.doc-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 100px; /* Adjust for TopBar */
}

.nav-frame {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-frame h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.nav-frame nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-frame button {
  background: none;
  border: none;
  text-align: left;
  padding: 0.75rem 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.nav-frame button:hover,
.nav-frame button.active {
  background: var(--color-primary-04);
  color: var(--color-primary);
}

.nav-frame button.active {
  font-weight: 700;
}

/* Main Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.doc-section {
  scroll-margin-top: 100px;
}

.doc-section h2 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--color-primary-10);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.doc-section p {
  line-height: 1.6;
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Scoring Factors */
.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  max-width: 100%;
}

.factor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-primary); /* Card background */
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  transition: transform 0.2s;
}

.factor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.05);
}

.factor-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-04);
  border-radius: 12px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.example-box {
  background: var(--color-primary-04);
  padding: 1.25rem;
  border-radius: 0.75rem;
  border-left: 4px solid var(--color-primary);
  font-style: italic;
  margin-top: 1rem;
}

.section-text {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.factor-content {
  display: flex;
  flex-direction: column;
}

.factor-percentage {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text-primary);
}

.factor-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Remove unused factor-bar */
.factor-bar {
  display: none;
}

.revenue-note {
  background: var(--color-primary-04);
  border: 1px solid var(--color-primary-10);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-top: 1.5rem;
}

.note-icon {
  font-size: 1.25rem;
}

.revenue-note p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.score-examples {
  margin-top: 3rem;
}

.score-examples h4 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.examples-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Anomalies */
.anomalies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.anomaly-card {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.anomaly-card h4 {
  margin: 0 0 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.anomaly-card.warning h4 { color: var(--color-warning); }
.anomaly-card.danger h4 { color: var(--color-error); }
.anomaly-card.success h4 { color: var(--color-success); }
.anomaly-card.info h4 { color: var(--color-accent); }

.anomaly-card p {
  font-size: 0.9rem;
  margin: 0;
}

/* Search Documentation Styles */
.search-guide {
  margin-top: 2rem;
}

.search-guide h3 {
  margin: 0 0 1rem;
  font-size: 1.15rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon {
  color: var(--color-accent);
  vertical-align: middle;
  margin-right: 0.5rem;
}

.section-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.category-card {
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.category-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon svg {
  width: 24px;
  height: 24px;
}

.category-header.listings .category-icon { color: var(--color-accent); }
.category-header.hosts .category-icon { color: #10b981; }
.category-header.neighbourhoods .category-icon { color: #8b5cf6; }

.category-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.category-header.listings h4 { color: var(--color-accent); }
.category-header.hosts h4 { color: #10b981; }
.category-header.neighbourhoods h4 { color: #8b5cf6; }

.category-card > p {
  margin: 0 0 1rem;
  font-size: 0.9rem;
}

.example-searches {
  background: var(--color-primary-04);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.example-searches .example-label {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.example-searches ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
}

.example-searches li {
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.example-searches code {
  background: var(--color-accent-10);
  color: var(--color-accent);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--color-accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.step-content p {
  margin: 0;
  font-size: 0.9rem;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.tip-card {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
}

.tip-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.tip-card p {
  margin: 0;
  font-size: 0.9rem;
}

.example-box code {
  background: var(--color-accent-10);
  color: var(--color-accent);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .doc-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
    margin-bottom: 2rem;
  }
}
</style>
