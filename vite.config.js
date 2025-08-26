import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss() // 確保 Tailwind 插件在 Vue 之後
  ],

  // 基礎路徑設定 - 重要！
  base: './', // 使用相對路徑，適用於 Azure Static Web Apps

  // 明確的建置設定
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'esnext', // 嘗試使用更新的 target
    minify: 'esbuild', // 改用 esbuild 壓縮

    rollupOptions: {
      external: [], // 確保沒有外部相依性被排除
      output: {
        format: 'es', // 明確指定 ES 模組格式
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },

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
  },

  // 解析設定
  resolve: {
    alias: {
      '@': '/src'
    }
  },

  // 優化設定
  optimizeDeps: {
    include: ['vue'] // 明確包含 Vue
  }


})
