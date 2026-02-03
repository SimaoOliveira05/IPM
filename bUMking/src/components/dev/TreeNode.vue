<template>
  <div class="tree-node">
    <div class="node-wrapper">
      <!-- Connection Line (Horizontal) -->
      <div v-if="depth > 0" class="connector-line"></div>
      
      <div 
        class="node-content" 
        :class="[getTypeClass(node), { 'is-open': isOpen, 'has-details': showDetails }]"
        @click.stop="toggle"
      >
        <div class="node-main">
          <span class="toggle-icon" :class="{ invisible: !hasChildren }">
            {{ isOpen ? '−' : '+' }}
          </span>
          <span class="node-icon">{{ getIcon(node) }}</span>
          <span class="node-name">{{ node.name }}</span>
        </div>
        
        <!-- Quick stats badges -->
        <div class="node-meta">
          <span v-if="node.props?.length" class="mini-badge props" :title="`${node.props.length} props`">
            ↓{{ countUniqueProps }}
          </span>
          <span v-if="node.emits?.length" class="mini-badge emits" :title="`${node.emits.length} emits`">
            ↑{{ node.emits.length }}
          </span>
          <span v-if="node.stores?.length" class="mini-badge store" title="Usa Pinia">🍍</span>
          <span v-if="node.composables?.length" class="mini-badge comp" title="Usa Composables">⚡</span>
        </div>
      </div>
    </div>

    <!-- Detail Panel -->
    <transition name="slide">
      <div v-if="isOpen && (hasDetails || getDescription(node.name))" class="node-details-panel">
        <!-- Description -->
        <div v-if="getDescription(node.name)" class="detail-section description-section">
          <p class="component-description">{{ getDescription(node.name) }}</p>
        </div>
        
        <!-- Props -->
        <div v-if="uniqueProps.length" class="detail-section">
          <strong class="detail-title">↓ Props recebidas:</strong>
          <div class="detail-list">
            <code v-for="p in uniqueProps" :key="p" class="prop-tag">:{{ p }}</code>
          </div>
        </div>
        
        <!-- Emits -->
        <div v-if="node.emits?.length" class="detail-section">
          <strong class="detail-title">↑ Eventos emitidos:</strong>
          <div class="detail-list">
            <code v-for="e in node.emits" :key="e" class="emit-tag">@{{ e }}</code>
          </div>
        </div>
        
        <!-- Stores -->
        <div v-if="node.stores?.length" class="detail-section">
          <strong class="detail-title">🍍 Stores:</strong>
          <div class="detail-list">
            <code v-for="s in node.stores" :key="s" class="store-tag">{{ s }}</code>
          </div>
        </div>
        
        <!-- Composables -->
        <div v-if="node.composables?.length" class="detail-section">
          <strong class="detail-title">⚡ Composables:</strong>
          <div class="detail-list">
            <code v-for="c in node.composables" :key="c" class="composable-tag">{{ c }}</code>
          </div>
        </div>
        
        <!-- Path -->
        <div class="detail-section path-section">
          <span class="file-path">📂 {{ node.path }}</span>
        </div>
      </div>
    </transition>

    <!-- Recursive Children -->
    <div v-if="isOpen && hasChildren" class="children-container">
      <div class="vertical-line"></div>
      <div 
        v-for="childName in node.children" 
        :key="childName"
        class="child-wrapper"
      >
        <TreeNode 
            v-if="allData[childName]" 
            :node="allData[childName]" 
            :all-data="allData" 
            :depth="depth + 1"
        />
        <!-- External/Unknown Node -->
        <div v-else class="tree-node external">
            <div class="node-wrapper">
                <div class="connector-line"></div>
                <div class="node-content external-node">
                    <span class="node-icon">📦</span>
                    <span class="node-name">{{ childName }}</span>
                    <span class="node-badge">externo</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  node: Object,
  allData: Object,
  depth: { type: Number, default: 0 }
})

const isOpen = ref(props.depth < 2)

const hasChildren = computed(() => props.node.children?.length > 0)

// Filter out duplicates and type/default/required noise from props
const uniqueProps = computed(() => {
  const noiseWords = ['type', 'default', 'required', 'validator', 'format', 'label', 'value']
  return [...new Set(props.node.props?.filter(p => !noiseWords.includes(p)) || [])]
})

const countUniqueProps = computed(() => uniqueProps.value.length)

const hasDetails = computed(() => 
  uniqueProps.value.length || 
  props.node.emits?.length || 
  props.node.stores?.length || 
  props.node.composables?.length
)

const showDetails = computed(() => isOpen.value && hasDetails.value)

const toggle = () => {
  isOpen.value = !isOpen.value
}

// Component descriptions
const descriptions = {
  // Views
  'App': '🚀 Componente raiz da aplicação. Contém o TopBar e o router-view.',
  'Pesquisa': '🔍 Página de pesquisa. Mostra resultados filtráveis de listings, hosts ou bairros.',
  'Casa': '🏠 Página de detalhes de um anúncio. Mostra galeria, info e analytics.',
  'Anfitriao': '👤 Página de perfil de anfitrião. Mostra info do host e os seus anúncios.',
  'Bairro': '🏘️ Página de estatísticas de uma freguesia. Mostra gráficos de mercado.',
  'Conta': '👤 Página da conta do utilizador. Mostra favoritos guardados.',
  'LandingPage': '🏠 Página inicial. Hero section, stats, e insights.',
  'DocumentationPage': '📚 Página de documentação. Explica o sistema de scoring e anomalias.',
  'Dev': '🛠️ Showcase de componentes para desenvolvimento.',
  'DevArchitecture': '🌳 Visualização da arquitetura da aplicação (esta página!).',
  'NotFound': '❌ Página 404 quando a rota não existe.',
  
  // Common Components
  'BaseButton': '🔘 Botão reutilizável. Suporta variantes (primary, secondary, outline, ghost).',
  'BaseCard': '🃏 Card para mostrar um anúncio/host/bairro na lista de resultados.',
  'BaseFrame': '📦 Container com padding, sombra e border-radius. Base para muitos layouts.',
  'BaseChart': '📈 Wrapper para Chart.js. Suporta bar, line, pie, doughnut.',
  'BaseModal': '💬 Modal/overlay genérico. Usado para settings, download, share.',
  'BaseMap': '🗺️ Mapa Leaflet para mostrar localizações de anúncios.',
  'BaseSegmentedControl': '🔀 Toggle buttons em grupo (ex: Light/Dark mode).',
  'BaseOptionGroup': '☑️ Grupo de checkboxes/radios (ex: escolher formato de download).',
  'BaseActionInput': '📋 Input com botão de ação (ex: copiar link para clipboard).',
  'ControlButton': '🎛️ Botão de controlo com suporte para caret (dropdown arrow).',
  'ControlDropDown': '📋 Dropdown para seleção (ex: categoria, ordenação, contexto).',
  'HostAvatar': '👤 Avatar circular do anfitrião com fallback para iniciais.',
  'StatCard': '📊 Card pequeno para uma métrica (ex: "Preço Médio: €85").',
  'ToastNotification': '🔔 Notificação toast que aparece temporariamente.',
  
  // Search Components
  'SearchControls': '🎛️ Barra de controlos de pesquisa: input, category, sort, filters.',
  'SearchBar': '🔍 Input de pesquisa com autocomplete de localizações.',
  'ResultsPanel': '📋 Painel de resultados com paginação e cards.',
  'FilterMenu': '🎚️ Menu de filtros: tipo de casa, preço, rating, anomalias.',
  'FilterToggle': '🔘 Toggle switch para filtros booleanos (ex: "Apenas com anomalias").',
  'FilterRange': '📏 Slider de range para filtros numéricos (ex: preço min-max).',
  
  // Dashboard Components
  'DashboardHeader': '📊 Header de dashboard com título, contexto dropdown e actions.',
  'ActionToolbar': '🔧 Toolbar com botões de Save, Share, Download.',
  'ListingAnalytics': '📈 Dashboard de analytics para um anúncio específico.',
  'HostAnalytics': '📊 Dashboard de analytics para um anfitrião.',
  'MarketOverview': '📊 Dashboard de mercado para uma localização.',
  'HostsDashboard': '👥 Dashboard agregado de hosts de uma região.',
  'GlobalDashBoard': '🌍 Dashboard global com estatísticas gerais.',
  
  // Listing Dashboard Cards
  'ScoreCard': '🏆 Card de score de competitividade (0-100) com indicador visual.',
  'MetricsGrid': '📊 Grid de métricas com comparação (preço, ocupação, rating).',
  'AlignmentCard': '🎯 Card de alinhamento preço-ocupação com gráfico.',
  'RevenueCard': '💰 Card de receita esperada vs atual.',
  
  // Listing Details
  'ListingHeader': '📝 Header de anúncio com nome, rating e localização.',
  'ListingGallery': '🖼️ Galeria de imagens do anúncio.',
  'ListingInfoCard': '📋 Card com detalhes: quartos, camas, capacidade.',
  'HostSummaryBar': '👤 Barra resumo do anfitrião com link para perfil.',
  
  // Overlays
  'SettingsOverlay': '⚙️ Modal de definições: tema e idioma.',
  'DownloadOverlay': '💾 Modal para download de dashboard em PNG/PDF.',
  'QuickShareOverlay': '🔗 Modal para copiar link de partilha.',
  'DocumentationOverlay': '📚 Modal com documentação inline.',
  
  // TopBar
  'TopBar': '🔝 Barra de navegação principal com logo, search e account.',
  'SignInDropdown': '🔐 Dropdown de login/registo com formulário.',
  
  // Insights
  'InsightsPanel': '💡 Painel de insight com imagem e CTA.',
  'InsightsGrid': '💡 Grid de insights cards na landing page.'
}

const getDescription = (name) => descriptions[name] || null

const getTypeClass = (node) => {
  if (node.path?.includes('views/')) return 'type-view'
  if (node.path?.includes('dashboards/')) return 'type-dashboard'
  if (node.path?.includes('common/')) return 'type-common'
  if (node.path?.includes('listing-')) return 'type-listing'
  if (node.path?.includes('search/')) return 'type-search'
  return 'type-component'
}

const getIcon = (node) => {
  if (node.path?.includes('views/')) return '📑'
  if (node.path?.includes('dashboards/')) return '📊'
  if (node.path?.includes('common/')) return '🧱'
  if (node.path?.includes('listing-')) return '🏠'
  if (node.path?.includes('search/')) return '🔍'
  return '🧩'
}
</script>

<style scoped>
.tree-node {
  position: relative;
  margin-left: 0;
}

.node-wrapper {
  display: flex;
  align-items: flex-start;
  padding: 4px 0;
}

/* Connectors */
.connector-line {
  width: 24px;
  height: 1px;
  background-color: #cbd5e0;
  margin-right: 8px;
  margin-top: 14px;
  flex-shrink: 0;
}

.children-container {
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  position: relative;
  padding-left: 12px;
}

.vertical-line {
  position: absolute;
  top: 0;
  bottom: 16px;
  left: 0;
  width: 1px;
  background-color: #cbd5e0;
}

/* Node Styling */
.node-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: relative;
  z-index: 2;
}

.node-content:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  border-color: #94a3b8;
}

.node-content.is-open {
  border-color: #3b82f6;
  background: #f0f9ff;
}

/* Types */
.type-view { border-left: 4px solid #3b82f6; }
.type-dashboard { border-left: 4px solid #8b5cf6; }
.type-common { border-left: 4px solid #10b981; }
.type-component { border-left: 4px solid #64748b; }
.type-listing { border-left: 4px solid #f59e0b; }
.type-search { border-left: 4px solid #ec4899; }

.node-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  font-family: monospace;
  font-weight: bold;
  color: #64748b;
  width: 14px;
  display: inline-block;
  text-align: center;
  font-size: 1rem;
}

.toggle-icon.invisible { opacity: 0; }

.node-icon {
  font-size: 0.9rem;
}

.node-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
}

/* Badges */
.node-meta {
  display: flex;
  gap: 6px;
  align-items: center;
}

.mini-badge {
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 4px;
  font-weight: 600;
}

.mini-badge.props {
  background: #dbeafe;
  color: #1e40af;
}

.mini-badge.emits {
  background: #d1fae5;
  color: #065f46;
}

.mini-badge.store {
  background: #fef3c7;
}

.mini-badge.comp {
  background: #fae8ff;
}

/* Details Panel */
.node-details-panel {
  margin-left: 36px;
  margin-top: 4px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
  font-size: 0.8rem;
}

.detail-section {
  margin-bottom: 8px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-title {
  font-size: 0.75rem;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.detail-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.prop-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.emit-tag {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.store-tag {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.composable-tag {
  background: #fae8ff;
  color: #86198f;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.description-section {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 10px;
}

.component-description {
  margin: 0;
  font-size: 0.8rem;
  color: #166534;
  line-height: 1.4;
}

.path-section {
  padding-top: 6px;
  border-top: 1px solid #e2e8f0;
}

.file-path {
  font-size: 0.7rem;
  color: #94a3b8;
  font-family: monospace;
}

.external-node {
  opacity: 0.6;
  border-style: dashed;
  background: #f7fafc;
}

.node-badge {
  font-size: 0.6rem;
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  color: #64748b;
  margin-left: 8px;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
