<template>
  <div class="dev-tree-page">
    <header>
      <h1>Architecture Visualization</h1>
      <p>Data Flow & Component Relationships</p>
      <router-link to="/dev" class="back-link">← Back to Component Showcase</router-link>
    </header>

    <!-- View Selector -->
    <div class="view-tabs">
      <button 
        :class="{ active: activeView === 'flow' }" 
        @click="activeView = 'flow'"
      >
        📊 Flow Diagram
      </button>
      <button 
        :class="{ active: activeView === 'tree' }" 
        @click="activeView = 'tree'"
      >
        🌳 Component Tree
      </button>
    </div>

    <!-- Flow Diagram View -->
    <div v-if="activeView === 'flow'" class="view-container">
      <FlowDiagram />
    </div>

    <!-- Tree View -->
    <div v-else class="tree-container">
      <ul class="tree-root">
        <li v-for="root in rootComponents" :key="root.name">
          <TreeNode :node="root" :all-data="componentMap" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import architectureData from '@/utils/architectureData.json'
import TreeNode from '@/components/dev/TreeNode.vue'
import FlowDiagram from '@/components/dev/FlowDiagram.vue'

const activeView = ref('flow')

// Map for easy lookup
const componentMap = computed(() => {
  const map = {}
  architectureData.forEach(c => map[c.name] = c)
  return map
})

// Identify probable roots (App, layouts, or views that are not imported by others)
const rootComponents = computed(() => {
  return architectureData.filter(c => c.name === 'App')
})
</script>

<style scoped>
.dev-tree-page {
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

h1 {
  font-size: 1.8rem;
  color: #1a202c;
  margin: 0;
}

p {
  color: #718096;
  margin: 0.5rem 0;
}

.back-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.view-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.view-tabs button {
  padding: 0.6rem 1.2rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.view-tabs button:hover {
  background: #f1f5f9;
}

.view-tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.view-container {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
}

.tree-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

ul {
  list-style: none;
  padding-left: 1.5rem;
  margin: 0;
}

.tree-root {
  padding: 0;
}
</style>
