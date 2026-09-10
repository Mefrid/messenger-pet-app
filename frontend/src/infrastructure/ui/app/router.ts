import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../pages/home/HomePage.vue'
import LoginPage from '../pages/login/LoginPage.vue'
import ChatPage from '../pages/chat/ChatPage.vue'
import { ROUTE_NAMES } from '@/application/ports/router.ts'
import { ref } from 'vue'
import SettingsPage from '../pages/settings/SettingsPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomePage,
    name: ROUTE_NAMES.HOME,
  },
  {
    path: '/login',
    component: LoginPage,
    name: ROUTE_NAMES.LOGIN,
  },
  {
    path: '/settings',
    component: SettingsPage,
    name: ROUTE_NAMES.SETTINGS,
  },
  {
    path: '/chats/:id',
    component: ChatPage,
    name: ROUTE_NAMES.CHAT,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const isInitialLoad = ref(true)

let isBrowserNavigation = false

window.addEventListener('popstate', () => {
  isBrowserNavigation = true
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    const wasBrowserNavigation = isBrowserNavigation
    isBrowserNavigation = false

    const toDepth = to.path.split('/').filter(Boolean).length
    const fromDepth = from.path.split('/').filter(Boolean).length
    const fromLoginPage = from.name === ROUTE_NAMES.LOGIN
    const transitionType = toDepth >= fromDepth || fromLoginPage ? 'forward' : 'back'

    const isMobile = window.matchMedia('(pointer: coarse)').matches
    const disableViewAnimation = isMobile && wasBrowserNavigation && transitionType === 'back'

    if (!document.startViewTransition || disableViewAnimation || isInitialLoad.value) {
      isInitialLoad.value = false
      next()
      return
    }

    document.startViewTransition({
      update: () => next(),
      types: [transitionType],
    })
  }, 0)
})

export default router
