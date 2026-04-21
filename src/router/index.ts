import { LOGIN_TOKEN } from '@/global/constants'
import { sessionCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/views/main/Mian.vue'),
    children: [
      {
        path: '/main/overview',
        name: 'overview',
        component: () => import('@/views/main/overview/overview.vue')
      },
      {
        path: '/main/article/:id?', // ? 表示 id 可选
        name: 'article-form',
        component: () => import('@/views/main/new-article/index.vue')
      },
      // {
      //   path: '/main/article/cread',
      //   name: 'new-article',
      //   component: () => import('@/views/main/new-article/index.vue')
      // },
      // {
      //   path: '/main/article/edit/:id',
      //   name: 'edit-article',
      //   component: () => import('@/views/main/new-article/index.vue')
      // },
      {
        path: '/main/article-list',
        name: 'article-list',
        component: () => import('@/views/main/article-list/index.vue')
      },
      {
        path: '/main/echart',
        name: 'echart',
        component: () => import('@/views/main/echart/echart.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/views/not-found/NotFound.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 可选的滚动行为配置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
// router/index.ts
router.beforeEach((to, from, next) => {
  const token = sessionCache.getCache(LOGIN_TOKEN)
  if (to.path !== '/login' && !token) {
    next('/login') // 如果没有 token，强制跳回登录页
  } else {
    next()
  }
})

// 导出路由实例
export default router
