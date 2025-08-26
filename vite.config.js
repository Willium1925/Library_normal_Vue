import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],

  // 基礎路徑設定 - 重要！
  base: './', // 使用相對路徑，適用於 Azure Static Web Apps

  server: {
    proxy: {
      '/api': {
        //target: 'http://localhost:8083', // 您的後端伺服器地址
        target: 'https://library0825-eubedfhpd3epa7bp.japaneast-01.azurewebsites.net/', // 您的後端伺服器地址
        changeOrigin: true,
        secure: false,
        // 可選：如果後端沒有 /api 前綴，可以重寫路徑
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
