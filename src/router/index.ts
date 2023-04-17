import { createRouter, createWebHistory } from 'vue-router'
import { home } from './router'
export const router = createRouter({
  history: createWebHistory(),
  routes: [...home],
})
