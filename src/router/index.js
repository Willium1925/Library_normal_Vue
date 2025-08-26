import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BookQuery from '../views/BookQuery.vue'
import BookDetail from '../views/BookDetail.vue'
import MyPage from '../views/MyPage.vue'
import Register from '../views/Register.vue'
import AdminPanel from '../views/admin/AdminPanel.vue'
import AdminCreateBook from '../views/admin/AdminCreateBook.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/bookQuery',
      name: 'bookQuery',
      component: BookQuery
    },
    {
      path: '/oneBook',
      name: 'bookDetail',
      component: BookDetail
    },
    {
      path: '/myPage',
      name: 'myPage',
      component: MyPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/admin/adminPanel',
      name: 'adminPanel',
      component: AdminPanel,
      /*meta: { requiresAuth: true, requiresAdmin: true }*/
    },
    {
      path: '/admin/adminCreateBook',
      name: 'adminCreateBook',
      component: AdminCreateBook,
      /*meta: { requiresAuth: true, requiresAdmin: true }*/
    }
  ]
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwtToken')
  const isLoggedIn = !!token

  // 檢查是否需要登入
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      // 重定向到首頁並顯示登入模態框
      next({ name: 'home', query: { showLogin: 'true' } })
      return
    }

    // 檢查是否需要管理員權限
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      try {
        const payloadBase64 = token.split('.')[1]
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        const decodedPayload = JSON.parse(jsonPayload)

        if (decodedPayload.role !== 'ADMIN') {
          next({ name: 'home' })
          return
        }
      } catch (e) {
        next({ name: 'home' })
        return
      }
    }
  }

  next()
})

export default router
