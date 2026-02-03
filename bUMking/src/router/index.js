import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Pesquisa from '../views/Pesquisa.vue'
import Conta from '../views/Conta.vue'
import Casa from '../views/Casa.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/pesquisa', component: Pesquisa },
    { path: '/casa/:id', component: Casa },
    { path: '/conta', component: Conta },
    {
      path: '/anfitriao/:id',
      name: 'host',
      component: () => import('../views/Anfitriao.vue')
    },
    { path: '/freguesia/:name', component: () => import('../views/Bairro.vue') },
    {
      path: '/ajuda',
      name: 'documentation',
      component: () => import('../views/DocumentationPage.vue')
    },
    {
      path: '/dev',
      name: 'dev',
      component: () => import('../views/Dev.vue')
    },
    {
      path: '/dev/tree',
      name: 'dev-tree',
      component: () => import('../views/DevArchitecture.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // Don't scroll to top if only query params changed (same path)
    if (to.path === from.path) {
      return false
    }
    return { top: 0 }
  }
})

export default router
