import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/shared/config/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTES.HOME,
    component: () => import('@/pages/WelcomePage.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/users',
    name: ROUTES.USERS,
    component: () => import('@/pages/UsersPage.vue'),
    meta: { title: 'Users' },
  },
  {
    path: '/users/:id',
    name: ROUTES.USER_DETAIL,
    component: () => import('@/pages/UserPage.vue'),
    meta: { title: 'User Detail' },
  },
  {
    path: '/faq',
    name: ROUTES.FAQ,
    component: () => import('@/pages/FaqPage.vue'),
    meta: { title: 'FAQ' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
