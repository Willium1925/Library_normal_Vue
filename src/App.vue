<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LoginModal from './components/LoginModal.vue'
import { checkLoginStatus, showLoginModal } from './composables/useAuth'

const route = useRoute()

// 檢查URL參數是否需要顯示登入模態框
onMounted(() => {
  checkLoginStatus()

  if (route.query.showLogin === 'true') {
    showLoginModal()
  }
})
</script>

<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <AppFooter />
    <LoginModal />
  </div>
</template>

<style>
/* 全局樣式已在 style.css 中定義 */
</style>
