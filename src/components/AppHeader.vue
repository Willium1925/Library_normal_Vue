<template>
  <header class="bg-indigo-700 text-white p-4 shadow-md">
    <div class="container mx-auto flex items-center justify-between">
      <router-link
        to="/"
        class="text-2xl font-bold rounded-md px-3 py-2 hover:text-indigo-200 relative overflow-hidden"
        @mouseenter="startEasterEgg"
        @mouseleave="cancelEasterEgg"
        @click="goToEasterEgg">
        <span v-if="easterEggActive" class="easter-egg-gradient">日比野線上圖書館 V3</span>
        <span v-else>日比野線上圖書館 V2</span>
      </router-link>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            type="text"
            placeholder="搜尋書籍..."
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            class="py-2 px-4 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <button
            @click="handleSearch"
            class="absolute right-0 top-0 h-full px-3 rounded-r-md bg-indigo-600 hover:bg-indigo-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>

        <router-link
          v-if="authState.isLoggedIn"
          to="/myPage"
          class="hover:text-indigo-200 transition-transform transition-colors duration-200 origin-bottom">
          個人頁面
        </router-link>

        <router-link
          to="/admin/adminPanel"
          class="hover:text-indigo-200">
          管理者頁面
        </router-link>

        <button
          @click="authState.isLoggedIn ? logout() : showLoginModal()"
          class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2">
          <svg v-if="!authState.isLoggedIn" class="lucide lucide-log-in w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" x2="3" y1="12" y2="12"/>
          </svg>
          <svg v-else class="lucide lucide-log-out w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="17 17 22 12 17 7"/>
            <line x1="22" x2="10" y1="12" y2="12"/>
          </svg>
          <span>{{ authState.isLoggedIn ? '登出' : '登入' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authState, showLoginModal, logout } from '../composables/useAuth'

const router = useRouter()
const searchKeyword = ref('')

// Easter Egg 功能
const easterEggActive = ref(false)
let easterEggTimer = null

const startEasterEgg = () => {
  easterEggTimer = setTimeout(() => {
    easterEggActive.value = true
    nextTick(() => {
      const el = document.querySelector('.easter-egg-gradient')
      if (el) el.classList.add('easter-egg-animate')
    })
  }, 5000)
}

const cancelEasterEgg = () => {
  clearTimeout(easterEggTimer)
  easterEggActive.value = false
  nextTick(() => {
    const el = document.querySelector('.easter-egg-gradient')
    if (el) el.classList.remove('easter-egg-animate')
  })
}

const goToEasterEgg = () => {
  if (easterEggActive.value) {
    console.log('被你發現了')
    window.location.href = '/other/外觀0817/0817index.html'
    //window.location.href = '/html/other/外觀0817/0817index.html'
  }
}

// 搜尋功能
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      name: 'bookQuery',
      query: { keyword: searchKeyword.value.trim() }
    })
  }
}
</script>
