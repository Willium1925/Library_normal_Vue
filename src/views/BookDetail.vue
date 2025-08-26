<template>
  <div class="bg-gray-100 min-h-screen flex flex-col">
    <!-- 主要內容容器 -->
    <main class="container mx-auto p-4 md:p-8 flex-grow">
      <!-- 導航區 -->
      <div class="mb-6">
        <button @click="goBack"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center space-x-2">
          <svg class="lucide lucide-arrow-left w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          <span>返回上一頁</span>
        </button>
      </div>

      <!-- 加載中/錯誤訊息 -->
      <div v-if="loading" class="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>加載中...</span>
      </div>

      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg shadow-md mb-6">
        {{ error }}
      </div>

      <!-- 書籍詳情內容 -->
      <div v-if="!loading && !error" class="flex flex-col space-y-6">

        <!-- 上框：書籍資訊 -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          <!-- 書籍封面 -->
          <div class="flex-shrink-0 w-48 h-64 md:w-80 md:h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 text-sm shadow-md">
            <img :src="bookDetails.imageUrl || 'https://placehold.co/256x320/e2e8f0/64748b?text=無圖片'"
                 :alt="bookDetails.title"
                 class="h-full w-auto object-contain"
                 @error="handleImageError" />
          </div>

          <!-- 書本詳細資訊 -->
          <div class="flex-grow text-center md:text-left">
            <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ bookDetails.title || '載入中...' }}</h1>
            <div v-if="bookDetails.id">
              <p class="text-xl text-gray-700 mb-2"><strong>作者:</strong> {{ bookDetails.authors ? bookDetails.authors.join(', ') : '未知作者' }}</p>
              <p class="text-lg text-gray-600 mb-2"><strong>主類別:</strong> {{ bookDetails.mainCategoryTitle || '未知' }}</p>
              <p class="text-lg text-gray-600 mb-2"><strong>次類別:</strong> {{ bookDetails.subCategoryTitle || '未知' }}</p>
              <p class="text-lg text-gray-600 mb-2"><strong>出版商:</strong> {{ bookDetails.publisher || '未知出版商' }}</p>
              <p class="text-lg text-gray-600 mb-2"><strong>出版年份:</strong> {{ bookDetails.publishYear || 'N/A' }}</p>
              <p class="text-lg text-gray-600 mb-4"><strong>ISBN:</strong> {{ bookDetails.isbn || 'N/A' }}</p>

              <!-- 系列資訊 -->
              <div v-if="bookDetails.seriesTitle" class="mb-4">
                <p class="text-lg text-gray-600"><strong>系列:</strong> {{ bookDetails.seriesTitle }}</p>
              </div>

              <!-- 標籤 -->
              <div class="mb-4">
                <p class="text-lg text-gray-600 mb-2"><strong>標籤:</strong></p>
                <div class="flex flex-wrap gap-2">
                  <template v-if="bookDetails.tags && bookDetails.tags.length > 0">
                    <span v-for="tag in bookDetails.tags" :key="tag.id"
                          class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium cursor-pointer hover:bg-indigo-200 transition">
                      {{ tag }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="px-3 py-1 bg-gray-200 text-gray-500 text-sm rounded-full">無</span>
                  </template>
                </div>
              </div>

              <h3 class="text-xl font-semibold text-gray-800 mb-3">書籍簡介</h3>
              <p class="text-gray-600 leading-relaxed mb-4">{{ bookDetails.description || '暫無簡介。' }}</p>

              <p class="text-lg text-gray-800 font-semibold">
                可借閱: <span class="text-indigo-600">{{ bookDetails.availableCopies || 0 }}</span> / 總數: {{ bookDetails.totalCopies || '尚未引進副本' }}
              </p>
            </div>
            <div v-else class="text-gray-500 text-center py-10">
              載入書籍資訊中...
            </div>
          </div>
        </div>

        <!-- 下框：借閱狀況 -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">借閱狀況</h3>
          <div v-if="bookCopies.length > 0">
            <ul class="space-y-3">
              <li v-for="copy in bookCopies" :key="copy.id" class="flex items-center text-gray-700">
                <span :class="['status-dot', {
                  'status-available': copy.statusDescription === '可借閱',
                  'status-borrowed': copy.statusDescription === '已借出',
                  'status-reserved': copy.statusDescription === '已預約',
                  'status-other': !['可借閱', '已借出', '已預約'].includes(copy.statusDescription)
                }]"></span>
                <span>書籍編號: <strong>{{ copy.uniqueCode }}</strong> - 狀態: {{ copy.statusDescription }}</span>
                <span v-if="copy.statusDescription === '已借出' && copy.dueDate" class="ml-4 text-sm text-red-600">
                  (到期日: {{ formatDate(copy.dueDate) }})
                </span>
              </li>
            </ul>
          </div>
          <div v-else class="text-gray-500">
            無借閱副本資訊。
          </div>

          <!-- 借閱按鈕 -->
          <div class="mt-6 text-right">
            <button @click="borrowBook(bookDetails.id)"
                    v-if="(bookDetails.availableCopies || 0) > 0 && authState.isLoggedIn"
                    class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-5 rounded-md shadow-lg transition-all duration-200">
              借閱此書 (剩餘: {{ bookDetails.availableCopies || 0 }})
            </button>
            <button v-else-if="!authState.isLoggedIn"
                    @click="showLoginModal()"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md shadow-lg transition-all duration-200">
              登入後借閱
            </button>
            <button v-else
                    class="bg-gray-400 text-white font-semibold py-2 px-5 rounded-md cursor-not-allowed">
              暫無可借閱副本
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 借閱確認模態框 -->
    <div v-if="showBorrowConfirmModal" class="modal-overlay" @click.self="hideBorrowConfirmModal">
      <div class="modal-content">
        <button class="close-button" @click="hideBorrowConfirmModal">&times;</button>
        <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">確認借閱</h2>
        <p class="text-gray-700 text-center mb-6">您確定要借閱 <strong>{{ borrowingBookTitle }}</strong> 嗎？</p>
        <div class="flex justify-around space-x-4">
          <button @click="confirmBorrow"
                  class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200">
            確定
          </button>
          <button @click="hideBorrowConfirmModal"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors duration-200">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authState, showLoginModal } from '../composables/useAuth'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// 響應式數據
const bookDetails = ref({})
const bookCopies = ref([])
const loading = ref(false)
const error = ref(null)

// 借閱確認模態框狀態
const showBorrowConfirmModal = ref(false)
const borrowingBookId = ref(null)
const borrowingBookTitle = ref('')

// 獲取書籍詳情
const fetchBookDetails = async (bookId) => {
  if (!bookId) {
    error.value = '無效的書籍 ID'
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(`/api/books/${bookId}`)
    if (!response.ok) {
      throw new Error(`無法獲取書籍詳情: ${response.status}`)
    }

    const data = await response.json()
    bookDetails.value = data
    bookCopies.value = data.bookCopies || []

    console.log('成功獲取書籍詳情:', data)
  } catch (err) {
    console.error('獲取書籍詳情失敗:', err)
    error.value = '無法獲取書籍詳情，請稍後再試。'
  } finally {
    loading.value = false
  }
}

// 處理圖片加載錯誤
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/256x320/e2e8f0/64748b?text=無圖片'
}

// 借閱書籍按鈕點擊事件 (顯示確認模態框)
const borrowBook = (bookId) => {
  if (!authState.isLoggedIn) {
    alert('請先登入才能借閱書籍！')
    showLoginModal()
    return
  }

  // 設定要借閱的書籍ID和標題，然後顯示模態框
  borrowingBookId.value = bookId
  borrowingBookTitle.value = bookDetails.value.title

  console.log('設定 borrowingBookId.value 為:', borrowingBookId.value)
  console.log('設定 borrowingBookTitle.value 為:', borrowingBookTitle.value)
  showBorrowConfirmModal.value = true
}

// 隱藏借閱確認模態框
const hideBorrowConfirmModal = () => {
  showBorrowConfirmModal.value = false
  borrowingBookId.value = null
  borrowingBookTitle.value = ''
}

// 確定借閱 (發送請求到後端)
const confirmBorrow = async () => {
  if (authState.currentUserId === null) {
    alert('無法獲取使用者ID，請重新登入。')
    showLoginModal()
    return
  }

  try {
    const response = await axios.post('/api/loans/borrow0822', {
      bookId: borrowingBookId.value
    })

    if (response.data.success) {
      alert(`借閱成功！\n書籍副本唯一碼: ${response.data.borrowedBookUniqueCode}\n借閱記錄ID: ${response.data.loanId}`)
      // 借閱成功後，刷新書籍詳情以更新可借閱數量和副本狀態
      await fetchBookDetails(borrowingBookId.value)
    } else {
      alert(`借閱失敗: ${response.data.message}`)
      await fetchBookDetails(borrowingBookId.value)
    }
  } catch (error) {
    console.error('借閱請求失敗:', error)
    if (error.response && error.response.data && error.response.data.message) {
      alert(`借閱失敗: ${error.response.data.message}`)
    } else {
      alert('借閱時發生錯誤，請稍後再試。')
    }
  } finally {
    hideBorrowConfirmModal()
  }
}

// 返回上一頁
const goBack = () => {
  if (document.referrer && document.referrer.includes(window.location.origin)) {
    router.go(-1)
  } else {
    router.push({ name: 'bookQuery' })
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW')
}

// 生命週期鉤子
onMounted(() => {
  const bookId = route.query.id
  if (bookId) {
    fetchBookDetails(bookId)
  } else {
    error.value = '未提供書籍 ID'
  }
})
</script>
