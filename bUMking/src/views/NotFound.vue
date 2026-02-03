<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <section class="not-found-page">
    <div class="content">
      <div class="error-code">404</div>
      <h1>Página não encontrada</h1>
      <p>A página que procuras não existe ou foi movida.</p>
      
      <div class="actions">
        <BaseButton 
          text="Voltar ao Início" 
          variant="primary" 
          @click="router.push('/')"
        />
        <BaseButton 
          text="Pesquisar" 
          variant="secondary" 
          @click="router.push('/pesquisa')"
        />
      </div>

      <div class="suggestions">
        <h3>Páginas úteis:</h3>
        <ul>
          <li><router-link to="/">Página Inicial</router-link></li>
          <li><router-link to="/pesquisa">Pesquisa de Alojamentos</router-link></li>
          <li><router-link to="/ajuda">Documentação</router-link></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-gradient);
}

.content {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--color-accent) 0%, #00a3ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0 0 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.suggestions {
  text-align: left;
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px var(--color-primary-08);
}

.suggestions h3 {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.suggestions a {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.suggestions a:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>
