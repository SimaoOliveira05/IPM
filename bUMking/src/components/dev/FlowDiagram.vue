<template>
  <div class="flow-diagram">
    <!-- Legend -->
    <div class="flow-legend">
      <span class="legend-item"><span class="arrow down">↓</span> Props (dados para baixo)</span>
      <span class="legend-item"><span class="arrow up">↑</span> Emits (eventos para cima)</span>
      <span class="legend-item"><span class="badge store">🍍</span> Pinia Store</span>
    </div>

    <!-- Explanation Section -->
    <div class="info-box">
      <h4>📘 Como funciona?</h4>
      <p><strong>Props</strong> (↓) são dados que o componente pai passa para o filho. Ex: <code>:listings="data"</code></p>
      <p><strong>Emits</strong> (↑) são eventos que o filho envia para o pai. Ex: <code>@click="handleClick"</code></p>
      <p><strong>Stores</strong> (🍍) são estados globais partilhados entre componentes via Pinia.</p>
    </div>

    <!-- Flow Sections -->
    <div v-for="flow in flows" :key="flow.name" class="flow-section">
      <h3 class="flow-title">{{ flow.name }}</h3>
      <p class="flow-desc">{{ flow.description }}</p>
      
      <div class="flow-chain">
        <template v-for="(node, idx) in flow.nodes" :key="node.name">
          <!-- Node -->
          <div class="flow-node" :class="getNodeClass(node)">
            <div class="node-header">
              <span class="node-icon">{{ getIcon(node) }}</span>
              <span class="node-name">{{ node.name }}</span>
            </div>
            <div v-if="node.stores?.length" class="node-stores">
              <span v-for="s in node.stores" :key="s" class="badge store">🍍 {{ s }}</span>
            </div>
          </div>

          <!-- Connection Arrow -->
          <div v-if="idx < flow.nodes.length - 1" class="flow-connection">
            <div class="connection-line"></div>
            <div class="connection-labels">
              <!-- Props going down -->
              <div v-if="flow.connections?.[idx]?.props?.length" class="props-label">
                <span class="arrow down">↓</span>
                <span v-for="p in flow.connections[idx].props.slice(0, 3)" :key="p" class="prop-name">{{ p }}</span>
                <span v-if="flow.connections[idx].props.length > 3">+{{ flow.connections[idx].props.length - 3 }}</span>
              </div>
              <!-- Emits going up -->
              <div v-if="flow.connections?.[idx]?.emits?.length" class="emits-label">
                <span class="arrow up">↑</span>
                <span v-for="e in flow.connections[idx].emits" :key="e" class="emit-name">@{{ e }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Connection Explanations -->
      <div class="connection-details">
        <h4>Explicação das ligações:</h4>
        <div v-for="(conn, idx) in flow.connections" :key="idx" class="detail-row">
          <strong>{{ flow.nodes[idx].name }} → {{ flow.nodes[idx + 1]?.name }}</strong>
          <ul v-if="conn.propsDesc">
            <li v-for="(desc, prop) in conn.propsDesc" :key="prop">
              <code class="prop">:{{ prop }}</code> — {{ desc }}
            </li>
          </ul>
          <ul v-if="conn.emitsDesc">
            <li v-for="(desc, emit) in conn.emitsDesc" :key="emit">
              <code class="emit">@{{ emit }}</code> — {{ desc }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const flows = [
  {
    name: '🔍 Search Flow',
    description: 'Utilizador pesquisa anúncios → filtra → vê resultados',
    nodes: [
      { name: 'Pesquisa', type: 'view', stores: ['searchStore'] },
      { name: 'SearchControls', type: 'component' },
      { name: 'ResultsPanel', type: 'component' },
      { name: 'BaseCard', type: 'common' }
    ],
    connections: [
      { 
        props: ['v-model', 'category', 'sortValue'], 
        emits: ['toggle-filter', 'toggle-sort'],
        propsDesc: {
          'v-model': 'Texto da pesquisa de localização (ex: "Porto")',
          'category': 'Tipo de pesquisa: listings, hosts, ou neighbourhoods',
          'sortValue': 'Ordenação atual (ex: "price-asc")'
        },
        emitsDesc: {
          'toggle-filter': 'Abre/fecha o menu de filtros',
          'toggle-sort': 'Abre/fecha o menu de ordenação'
        }
      },
      { 
        props: ['listings', 'currentPage', 'pageSize'], 
        emits: ['go-to-page', 'next-page'],
        propsDesc: {
          'listings': 'Array com os anúncios filtrados e ordenados',
          'currentPage': 'Página atual (ex: 1, 2, 3...)',
          'pageSize': 'Quantos resultados por página (25 ou 50)'
        },
        emitsDesc: {
          'go-to-page': 'Navegar para uma página específica',
          'next-page': 'Ir para a próxima página'
        }
      },
      { 
        props: ['data'], 
        emits: ['click'],
        propsDesc: {
          'data': 'Objeto com info do anúncio (nome, preço, rating, imagem)'
        },
        emitsDesc: {
          'click': 'Quando o utilizador clica no card, navega para Casa/:id'
        }
      }
    ]
  },
  {
    name: '🎛️ Filter Flow',
    description: 'Utilizador aplica filtros → dados são filtrados → URL atualizado',
    nodes: [
      { name: 'SearchControls', type: 'component' },
      { name: 'FilterMenu', type: 'component' },
      { name: 'FilterToggle', type: 'common' },
      { name: 'FilterRange', type: 'common' }
    ],
    connections: [
      { 
        props: ['filterOpen', 'houseTypeOptions'], 
        emits: ['toggle-filter'],
        propsDesc: {
          'filterOpen': 'Se o menu de filtros está aberto',
          'houseTypeOptions': 'Opções: Entire home, Private room, Shared room'
        },
        emitsDesc: {
          'toggle-filter': 'Abre/fecha o painel de filtros'
        }
      },
      { 
        props: ['modelValue', 'label'], 
        emits: ['update:modelValue'],
        propsDesc: {
          'modelValue': 'Valor atual do toggle (true/false)',
          'label': 'Texto do toggle (ex: "Apenas com anomalias")'
        },
        emitsDesc: {
          'update:modelValue': 'Quando toggle muda, atualiza o store'
        }
      },
      { 
        props: ['min', 'max', 'step'], 
        emits: ['update:modelValue'],
        propsDesc: {
          'min': 'Valor mínimo do range (ex: 0)',
          'max': 'Valor máximo do range (ex: 1000)',
          'step': 'Incremento do slider (ex: 10)'
        },
        emitsDesc: {
          'update:modelValue': 'Novo range selecionado [min, max]'
        }
      }
    ]
  },
  {
    name: '🏠 Listing Details Flow',
    description: 'Utilizador vê detalhes de um anúncio com analytics',
    nodes: [
      { name: 'Casa', type: 'view', stores: ['userStore'] },
      { name: 'ListingAnalytics', type: 'dashboard', stores: ['userStore'] },
      { name: 'ScoreCard', type: 'component' },
      { name: 'MetricsGrid', type: 'component' }
    ],
    connections: [
      { 
        props: ['listing'], 
        emits: [],
        propsDesc: {
          'listing': 'Objeto completo do anúncio (preço, ocupação, avaliação, etc.)'
        }
      },
      { 
        props: ['score', 'label', 'marketFit'], 
        emits: [],
        propsDesc: {
          'score': 'Pontuação de competitividade (0-100)',
          'label': 'Categoria (Dominant, Strong, Medium, Weak)',
          'marketFit': 'Indicador de adequação ao mercado'
        }
      },
      { 
        props: ['metrics', 'listing'], 
        emits: [],
        propsDesc: {
          'metrics': 'Estatísticas calculadas (percentis, médias)',
          'listing': 'Dados do anúncio para comparação'
        }
      }
    ]
  },
  {
    name: '🏘️ Neighbourhood Flow',
    description: 'Utilizador vê estatísticas de uma freguesia/bairro',
    nodes: [
      { name: 'Bairro', type: 'view' },
      { name: 'MarketOverview', type: 'dashboard' },
      { name: 'BaseChart', type: 'common' }
    ],
    connections: [
      { 
        props: ['neighbourhoodData'], 
        emits: [],
        propsDesc: {
          'neighbourhoodData': 'Estatísticas agregadas da freguesia (preço médio, nº anúncios, etc.)'
        }
      },
      { 
        props: ['type', 'data'], 
        emits: [],
        propsDesc: {
          'type': 'Tipo de gráfico: "bar" para distribuição, "line" para evolução',
          'data': 'Dados formatados: labels (eixo X), datasets (valores)'
        }
      }
    ]
  },
  {
    name: '👤 Host Flow',
    description: 'Utilizador vê perfil de anfitrião e os seus anúncios',
    nodes: [
      { name: 'Anfitriao', type: 'view' },
      { name: 'HostAnalytics', type: 'dashboard' },
      { name: 'BaseChart', type: 'common' }
    ],
    connections: [
      { 
        props: ['listings'], 
        emits: [],
        propsDesc: {
          'listings': 'Lista de todos os anúncios deste anfitrião'
        }
      },
      { 
        props: ['type', 'data', 'options'], 
        emits: [],
        propsDesc: {
          'type': 'Tipo de gráfico: "bar", "pie", "doughnut"',
          'data': 'Dados formatados para Chart.js',
          'options': 'Configurações visuais do gráfico'
        }
      }
    ]
  },
  {
    name: '🔐 Auth Flow',
    description: 'Utilizador faz login/registo → dados guardados no store',
    nodes: [
      { name: 'TopBar', type: 'component', stores: ['userStore'] },
      { name: 'SignInDropdown', type: 'component' },
      { name: 'BaseButton', type: 'common' }
    ],
    connections: [
      { 
        props: ['modelValue', 'errorMessage'], 
        emits: ['submit', 'register'],
        propsDesc: {
          'modelValue': 'Se o dropdown está aberto (true/false)',
          'errorMessage': 'Mensagem de erro (ex: "Email inválido")'
        },
        emitsDesc: {
          'submit': 'Envia dados de login (email, password) para o store',
          'register': 'Envia dados de registo (nome, email, password)'
        }
      },
      { 
        props: ['text', 'variant', 'disabled'], 
        emits: ['click'],
        propsDesc: {
          'text': 'Texto do botão (ex: "Entrar")',
          'variant': 'Estilo: "primary", "secondary", "outline"',
          'disabled': 'Se o botão está desativado'
        },
        emitsDesc: {
          'click': 'Submete o formulário'
        }
      }
    ]
  },
  {
    name: '📊 Dashboard Actions',
    description: 'Fluxo de ações: guardar, partilhar, download',
    nodes: [
      { name: 'DashboardHeader', type: 'component' },
      { name: 'ActionToolbar', type: 'component' },
      { name: 'ControlButton', type: 'common' }
    ],
    connections: [
      { 
        props: ['isSaved'], 
        emits: ['save', 'share', 'download'],
        propsDesc: {
          'isSaved': 'Se o dashboard está guardado nos favoritos'
        },
        emitsDesc: {
          'save': 'Guardar/remover dos favoritos',
          'share': 'Abrir modal de partilha com link',
          'download': 'Abrir modal de download (PNG/PDF)'
        }
      },
      { 
        props: ['variant', 'active'], 
        emits: [],
        propsDesc: {
          'variant': 'Estilo visual: "primary", "outline", "ghost"',
          'active': 'Se o botão está ativo/pressionado'
        }
      }
    ]
  },
  {
    name: '💾 Overlays Flow',
    description: 'Modais para partilha, download e definições',
    nodes: [
      { name: 'ActionToolbar', type: 'component' },
      { name: 'QuickShareOverlay', type: 'component' },
      { name: 'DownloadOverlay', type: 'component' }
    ],
    connections: [
      { 
        props: ['modelValue', 'link'], 
        emits: [],
        propsDesc: {
          'modelValue': 'Se o overlay está visível (v-model)',
          'link': 'URL para partilhar (ex: "https://bumking.com/casa/123")'
        }
      },
      { 
        props: ['modelValue', 'defaultFilename'], 
        emits: ['download'],
        propsDesc: {
          'modelValue': 'Se o overlay está visível',
          'defaultFilename': 'Nome sugerido para o ficheiro (ex: "dashboard-porto")'
        },
        emitsDesc: {
          'download': 'Inicia download com formato escolhido (PNG/PDF)'
        }
      }
    ]
  }
]

const getNodeClass = (node) => `type-${node.type}`

const getIcon = (node) => {
  switch (node.type) {
    case 'view': return '📑'
    case 'dashboard': return '📊'
    case 'common': return '🧱'
    default: return '🧩'
  }
}
</script>

<style scoped>
.flow-diagram {
  font-family: 'Inter', system-ui, sans-serif;
}

.flow-legend {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
}

.info-box h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  color: #1e40af;
}

.info-box p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: #1e3a8a;
}

.info-box code {
  background: #dbeafe;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.arrow {
  font-weight: bold;
  font-size: 1rem;
}

.arrow.down { color: #3b82f6; }
.arrow.up { color: #10b981; }

.flow-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.flow-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1e293b;
}

.flow-desc {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

.flow-chain {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.flow-node {
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: white;
  border: 2px solid #e2e8f0;
  min-width: 120px;
  text-align: center;
}

.flow-node:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
  transition: all 0.2s;
}

.type-view { border-left: 4px solid #3b82f6; background: #eff6ff; }
.type-dashboard { border-left: 4px solid #8b5cf6; background: #f5f3ff; }
.type-common { border-left: 4px solid #10b981; background: #ecfdf5; }
.type-component { border-left: 4px solid #64748b; }

.node-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.node-icon {
  font-size: 1rem;
}

.node-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
}

.node-stores {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
}

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.badge.store {
  background: #fef3c7;
  color: #92400e;
}

.flow-connection {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  flex-shrink: 0;
}

.connection-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #cbd5e1, #94a3b8, #cbd5e1);
  position: relative;
}

.connection-line::after {
  content: '▶';
  position: absolute;
  right: -8px;
  top: -8px;
  color: #94a3b8;
  font-size: 0.8rem;
}

.connection-labels {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.7rem;
}

.props-label, .emits-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.prop-name {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}

.emit-name {
  background: #d1fae5;
  color: #065f46;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}

/* Connection Details */
.connection-details {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
}

.connection-details h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #475569;
}

.detail-row {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
}

.detail-row strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #334155;
}

.detail-row ul {
  margin: 0;
  padding-left: 1.25rem;
}

.detail-row li {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.detail-row code.prop {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

.detail-row code.emit {
  background: #d1fae5;
  color: #065f46;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.75rem;
}
</style>
