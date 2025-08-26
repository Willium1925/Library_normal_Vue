<template>
  <div v-if="authState.showLoginModal" class="modal-overlay" @click.self="hideLoginModal">
    <div class="modal-content">
      <button class="close-button" @click="hideLoginModal">&times;</button>
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">登入</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="account" class="block text-gray-700 text-sm font-bold mb-2">帳號:</label>
          <input
            type="text"
            id="account"
            v-model="authState.loginForm.account"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">密碼:</label>
          <input
            type="password"
            id="password"
            v-model="authState.loginForm.password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required>
        </div>
        <div v-if="authState.loginError" class="text-red-500 text-sm mb-4 text-center">
          {{ authState.loginError }}
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-200">
            登入
          </button>
        </div>
      </form>
      <div class="mt-4 text-center">
        <router-link
          to="/register"
          class="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
          @click="hideLoginModal">
          還沒有帳號？加入會員
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authState, hideLoginModal, handleLogin } from '../composables/useAuth'
</script>
