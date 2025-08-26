// 認證狀態管理
import { ref, reactive } from 'vue'
import axios from 'axios'

// 全局認證狀態
export const authState = reactive({
  isLoggedIn: false,
  currentUserId: null,
  currentUserRole: null,
  currentUsername: null,
  showLoginModal: false,
  loginForm: { account: '', password: '' },
  loginError: ''
})

// 配置Axios攔截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 檢查登入狀態
export function checkLoginStatus() {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1]
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const decodedPayload = JSON.parse(jsonPayload)

      if (decodedPayload.exp * 1000 < Date.now()) {
        console.log("Token 已過期。")
        localStorage.removeItem('jwtToken')
        resetAuthState()
        return
      }

      authState.isLoggedIn = true
      authState.currentUserId = parseInt(decodedPayload.sub)
      authState.currentUserRole = decodedPayload.role
      authState.currentUsername = decodedPayload.username
    } catch (e) {
      console.error("無法解碼 JWT:", e)
      localStorage.removeItem('jwtToken')
      resetAuthState()
    }
  } else {
    resetAuthState()
  }
}

function resetAuthState() {
  authState.isLoggedIn = false
  authState.currentUserId = null
  authState.currentUserRole = null
  authState.currentUsername = null
}

// 顯示登入模態框
export function showLoginModal() {
  authState.showLoginModal = true
  authState.loginError = ''
  authState.loginForm = { account: '', password: '' }
}

// 隱藏登入模態框
export function hideLoginModal() {
  authState.showLoginModal = false
}

// 處理登入
export async function handleLogin() {
  authState.loginError = ''
  try {
    const response = await axios.post('/api/auth/login', authState.loginForm)
    const { jwtToken } = response.data

    localStorage.setItem('jwtToken', jwtToken)
    alert('登入成功！')
    window.location.reload()
  } catch (error) {
    console.error('登入失敗:', error)
    authState.loginError = error.response?.data?.message || '帳號或密碼錯誤，請重試。'
  }
}

// 登出
export function logout() {
  localStorage.removeItem('jwtToken')
  alert('已登出。')
  window.location.reload()
}
