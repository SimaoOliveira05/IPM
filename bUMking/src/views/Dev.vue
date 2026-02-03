<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'

// Common Components
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseFrame from '@/components/common/BaseFrame.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseChart from '@/components/common/BaseChart.vue'
import BaseMap from '@/components/common/BaseMap.vue'
import BaseActionInput from '@/components/common/BaseActionInput.vue'
import BaseOptionGroup from '@/components/common/BaseOptionGroup.vue'
import BaseSegmentedControl from '@/components/common/BaseSegmentedControl.vue'
import ControlButton from '@/components/common/ControlButton.vue'
import ControlDropDown from '@/components/common/ControlDropDown.vue'
import ActionToolbar from '@/components/common/ActionToolbar.vue'
import HostAvatar from '@/components/common/HostAvatar.vue'
import StatCard from '@/components/common/StatCard.vue'

// Demo state
const showModal = ref(false)
const inputValue = ref('')
const selectedOption = ref('option1')
const segmentedValue = ref('tab1')
const dropdownValue = ref('opt1')

const dropdownOptions = [
  { value: 'opt1', label: 'Opção 1' },
  { value: 'opt2', label: 'Opção 2' },
  { value: 'opt3', label: 'Opção 3' }
]

const optionItems = [
  { value: 'option1', label: 'Opção A' },
  { value: 'option2', label: 'Opção B' },
  { value: 'option3', label: 'Opção C' }
]

const segmentedItems = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' }
]

const sampleListing = {
  id: '1',
  name: 'Apartamento Exemplo',
  price: 85,
  rating: 4.7,
  picture_url: 'https://a0.muscache.com/pictures/miso/Hosting-41339/original/8a4262cb-ccba-4deb-873b-1f5758925781.jpeg',
  room_type: 'Entire home/apt'
}

const mapLocations = [
  { lat: 41.1579, lng: -8.6291, label: 'Porto Centro', price: 85, rating: 4.7 }
]

const chartData = {
  labels: ['Jan', 'Fev', 'Mar'],
  datasets: [{
    label: 'Exemplo',
    data: [10, 20, 15],
    backgroundColor: '#635bff'
  }]
}
</script>

<template>
  <section class="dev-page">
    <header class="dev-header">
      <h1>📦 Component Showcase</h1>
      <p>Biblioteca de componentes reutilizáveis do bUMking</p>
    </header>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- BUTTONS & CONTROLS -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="component-section">
      <h2>🎯 Buttons & Controls</h2>
      
      <div class="component-card">
        <div class="component-header">
          <h3>BaseButton</h3>
          <span class="badge">Core</span>
        </div>
        <p class="component-desc">Botão principal da aplicação com múltiplas variantes.</p>
        <div class="component-demo">
          <BaseButton text="Primary" variant="primary" />
          <BaseButton text="Secondary" variant="secondary" />
          <BaseButton text="Plain" variant="plain" />
          <BaseButton text="Small" variant="primary" size="small" />
        </div>
        <div class="component-note">
          📌 <strong>Usado por:</strong> TopBar, DashboardHeader, todos os formulários
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>ControlButton</h3>
          <span class="badge extends">extends BaseButton</span>
        </div>
        <p class="component-desc">Botão estilizado para controlos (filtros, ordenação).</p>
        <div class="component-demo">
          <ControlButton>Filtrar</ControlButton>
          <ControlButton :active="true">Ordenar</ControlButton>
          <ControlButton variant="primary">Primário</ControlButton>
        </div>
        <div class="component-note">
          📌 <strong>Base para:</strong> ControlDropDown
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>ControlDropDown</h3>
          <span class="badge extends">uses ControlButton</span>
        </div>
        <p class="component-desc">Dropdown para seleção de opções com botão integrado.</p>
        <div class="component-demo">
          <ControlDropDown 
            v-model="dropdownValue" 
            :options="dropdownOptions"
            label="Categoria"
          />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> SearchControls, DashboardHeader (context selector)
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- LAYOUT COMPONENTS -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="component-section">
      <h2>📐 Layout Components</h2>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseFrame</h3>
          <span class="badge">Core</span>
        </div>
        <p class="component-desc">Container com padding, border-radius e elevation configuráveis.</p>
        <div class="component-demo">
          <BaseFrame padding="1.5rem" rounded="1rem" elevation="2" class="demo-frame">
            Conteúdo dentro de um BaseFrame
          </BaseFrame>
        </div>
        <div class="component-note">
          📌 <strong>Uso:</strong> Wrapper principal para cards, painéis, dashboards
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseModal</h3>
          <span class="badge">Core</span>
        </div>
        <p class="component-desc">Modal overlay para confirmações e formulários.</p>
        <div class="component-demo">
          <BaseButton text="Abrir Modal" variant="primary" @click="showModal = true" />
          <BaseModal v-model="showModal" title="Exemplo de Modal">
            <p>Conteúdo do modal aqui.</p>
          </BaseModal>
        </div>
        <div class="component-note">
          📌 <strong>Base para:</strong> SettingsOverlay, DownloadOverlay, QuickShareOverlay
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>ActionToolbar</h3>
          <span class="badge">Utility</span>
        </div>
        <p class="component-desc">Barra de ações (save, share, download) para dashboards.</p>
        <div class="component-demo">
          <ActionToolbar 
            :is-saved="false"
            @save="() => {}"
            @share="() => {}"
            @download="() => {}"
          />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> DashboardHeader
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- DATA DISPLAY -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="component-section">
      <h2>📊 Data Display</h2>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseCard</h3>
          <span class="badge">Core</span>
        </div>
        <p class="component-desc">Card para listings, hosts, ou freguesias.</p>
        <div class="component-demo">
          <BaseCard :data="sampleListing" style="max-width: 300px;" />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> ResultsPanel, Conta (saved items)
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>StatCard</h3>
          <span class="badge">Utility</span>
        </div>
        <p class="component-desc">Card para métricas individuais.</p>
        <div class="component-demo">
          <StatCard label="Receita Total" value="12,500€" />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> MetricsGrid, dashboards
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>HostAvatar</h3>
          <span class="badge">Utility</span>
        </div>
        <p class="component-desc">Avatar circular para hosts.</p>
        <div class="component-demo">
          <HostAvatar name="João Silva" size="60" :border="true" />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> HostSummaryBar, Anfitriao
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseChart</h3>
          <span class="badge">Wrapper</span>
        </div>
        <p class="component-desc">Wrapper para Chart.js com suporte a todos os tipos de gráfico.</p>
        <div class="component-demo">
          <BaseChart type="bar" :data="chartData" style="height: 150px;" />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> ListingDashboard, HostAnalytics, Freguesia
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseMap</h3>
          <span class="badge">Leaflet</span>
        </div>
        <p class="component-desc">Mapa interativo com marcadores clicáveis.</p>
        <div class="component-demo">
          <BaseMap :locations="mapLocations" height="200px" />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> Casa, Anfitriao, Freguesia, Pesquisa
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- FORM COMPONENTS -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="component-section">
      <h2>📝 Form Components</h2>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseActionInput</h3>
          <span class="badge">Form</span>
        </div>
        <p class="component-desc">Input com ação integrada (ex: pesquisa).</p>
        <div class="component-demo">
          <BaseActionInput 
            v-model="inputValue" 
            placeholder="Pesquisar..."
            action-label="Ir"
          />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> LandingPage (hero search)
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseOptionGroup</h3>
          <span class="badge">Form</span>
        </div>
        <p class="component-desc">Grupo de opções selecionáveis (radio-like).</p>
        <div class="component-demo">
          <BaseOptionGroup v-model="selectedOption" :options="optionItems" />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> FilterMenu (house types)
        </div>
      </div>

      <div class="component-card">
        <div class="component-header">
          <h3>BaseSegmentedControl</h3>
          <span class="badge">Form</span>
        </div>
        <p class="component-desc">Controlo segmentado tipo tabs.</p>
        <div class="component-demo">
          <BaseSegmentedControl v-model="segmentedValue" :options="segmentedItems" />
        </div>
        <div class="component-note">
          📌 <strong>Usado em:</strong> SignInDropdown (login/register toggle)
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- COMPONENT HIERARCHY -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="component-section">
      <div class="hierarchy-header">
        <h2>🌳 Component Hierarchy</h2>
        <BaseButton 
          text="View Live Architecture Tree" 
          variant="primary" 
          size="small"
          as="a"
          href="/dev/tree"
        />
      </div>
      
      <div class="hierarchy-tree">
        <pre>
src/components/
├── common/                    # Reusable base components
│   ├── BaseButton.vue         # ← Core button, used everywhere
│   ├── BaseCard.vue           # ← Listing/Host/Neighbourhood cards
│   ├── BaseFrame.vue          # ← Container wrapper
│   ├── BaseModal.vue          # ← Modal overlay base
│   ├── BaseChart.vue          # ← Chart.js wrapper
│   ├── BaseMap.vue            # ← Leaflet map wrapper
│   ├── ControlButton.vue      # ← Extends BaseButton styling
│   ├── ControlDropDown.vue    # ← Uses ControlButton internally
│   └── ...
│
├── dashboards/                # Dashboard-specific components
│   ├── DashboardHeader.vue    # ← Uses ActionToolbar, ControlDropDown
│   ├── ListingDashboard.vue   # ← Uses BaseChart, MetricsGrid
│   ├── HostAnalytics.vue      # ← Uses BaseChart
│   └── overlays/              # ← All use BaseModal as base
│
├── search/                    # Search page components
│   ├── SearchControls.vue     # ← Uses ControlDropDown, FilterMenu
│   ├── ResultsPanel.vue       # ← Uses BaseCard
│   └── filters/               # ← Filter-specific components
│
└── listing-details/           # Listing page components
    ├── ListingHeader.vue
    ├── ListingGallery.vue
    └── HostSummaryBar.vue     # ← Uses HostAvatar
        </pre>
      </div>
    </section>
  </section>
</template>

<style scoped>
.dev-page {
  min-height: 100vh;
  padding: 2rem;
  padding-top: 100px;
  background: var(--bg-gradient);
  max-width: 1200px;
  margin: 0 auto;
}

.dev-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dev-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--color-accent) 0%, #00a3ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dev-header p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.component-section {
  margin-bottom: 3rem;
}

.component-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-primary-10);
  color: var(--text-primary);
}

.component-card {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 12px var(--color-primary-08);
}

.component-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.component-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: var(--color-accent-10);
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge.extends {
  background: #fef3c7;
  color: #92400e;
}

.component-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.component-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
}

.component-note {
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding: 0.5rem 0.75rem;
  background: var(--color-primary-04);
  border-radius: 0.5rem;
  border-left: 3px solid var(--color-accent);
}

.demo-frame {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.hierarchy-tree {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px var(--color-primary-08);
}

.hierarchy-tree pre {
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.hierarchy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--color-primary-10);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
}

.hierarchy-header h2 {
  border-bottom: none;
  margin: 0;
  padding: 0;
}
</style>
