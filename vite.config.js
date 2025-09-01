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

  // 建置設定 - 針對靜態部署優化
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,

    // 重要：使用較舊的 target 以確保相容性
    target: 'es2020',

    // 使用 esbuild 進行壓縮
    minify: 'esbuild',

    // CSS 代碼分割
    cssCodeSplit: true,

    // Rollup 選項
    rollupOptions: {
      output: {
        // 確保輸出格式正確
        format: 'es',

        // 檔案命名
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',

        // 手動分塊以避免模組解析問題
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'utils': ['axios']
        }
      }
    },

    // 確保模組預處理正確
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8083', // 後端
        // target: 'https://library0825-eubedfhpd3epa7bp.japaneast-01.azurewebsites.net/', // azure
        changeOrigin: true,
        secure: false,
        // 如果後端沒有 /api 前綴，可以重寫路徑
        // rewrite: (path) => path.replace(/^\/api/, '')
        headers: {
          'Access-Control-Allow-Origin': '*'
          }
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
  },

  // 確保正確的模組處理
  esbuild: {
    target: 'es2020'
  }



})
