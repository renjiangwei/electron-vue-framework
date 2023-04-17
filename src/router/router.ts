import { RouteRecordRaw } from 'vue-router'

export const home: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: 'home',
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('@/views/home/index.vue'),
  }
]
