import { createRouter, createWebHashHistory } from 'vue-router'
import { home } from './router'
export const router = createRouter({
  history: createWebHashHistory(),
  routes: home,
})
