<template>
  <div class="bg-gray-100 min-h-screen flex flex-col">
    <!-- 主要內容容器 -->
    <main class="container mx-auto p-4 md:p-8 flex-grow">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左側篩選面板 -->
        <div class="lg:w-1/4 flex flex-col gap-4 sidebar" style="width: 300px; min-width: 300px;">
          <!-- 顯示模式 -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">顯示模式</h3>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="seriesDisplay" :value="1" class="form-radio text-indigo-600" @change="changeSeriesDisplay">
                <span class="ml-2">顯示系列代表作</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="seriesDisplay" :value="0" class="form-radio text-indigo-600" @change="changeSeriesDisplay">
                <span class="ml-2">顯示所有書籍</span>
              </label>
            </div>
          </div>

          <!-- 關鍵字搜尋 -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <label for="keyword" class="block text-sm font-medium text-gray-700 mb-1">關鍵字</label>
            <input v-model.lazy="keyword" @keyup.enter="applyKeyword" type="text" id="keyword" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>

          <!-- 動態篩選區塊 -->
          <!-- 主類別 -->
          <div v-if="stats.categories && stats.categories.length > 0" class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">主類別</h3>
            <ul class="space-y-1">
              <li v-for="item in stats.categories" :key="item.id"
                  class="flex items-center justify-between p-2 rounded-md transition duration-150 ease-in-out cursor-pointer"
                  :class="{'bg-indigo-100 text-indigo-700 font-medium': filters.mainCategoryId === item.id, 'hover:bg-gray-50': filters.mainCategoryId !== item.id}"
                  @click="toggleSingleFilter('mainCategoryId', item.id)">
                <span>{{ item.name }}</span>
                <span class="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">{{ item.count }}</span>
              </li>
            </ul>
          </div>

          <!-- 次類別 -->
          <div v-if="stats.subCategories && stats.subCategories.length > 0" class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">次類別</h3>
            <ul class="space-y-1">
              <li v-for="item in stats.subCategories" :key="item.id"
                  class="flex items-center justify-between p-2 rounded-md transition duration-150 ease-in-out cursor-pointer"
                  :class="{'bg-indigo-100 text-indigo-700 font-medium': filters.subCategoryId === item.id, 'hover:bg-gray-50': filters.subCategoryId !== item.id}"
                  @click="toggleSingleFilter('subCategoryId', item.id)">
                <span>{{ item.name }}</span>
                <span class="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">{{ item.count }}</span>
              </li>
            </ul>
          </div>

          <!-- 作者 -->
          <div v-if="stats.authors && stats.authors.length > 0" class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">作者</h3>
            <ul class="space-y-1">
              <li v-for="item in stats.authors" :key="item.id"
                  class="flex items-center justify-between p-2 rounded-md transition duration-150 ease-in-out cursor-pointer"
                  :class="{'bg-indigo-100 text-indigo-700 font-medium': filters.authorId === item.id, 'hover:bg-gray-50': filters.authorId !== item.id}"
                  @click="toggleSingleFilter('authorId', item.id)">
                <span>{{ item.name }}</span>
                <span class="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">{{ item.count }}</span>
              </li>
            </ul>
          </div>

          <!-- 出版商 -->
          <div v-if="stats.publishers && stats.publishers.length > 0" class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">出版商</h3>
            <ul class="space-y-1">
              <li v-for="item in stats.publishers" :key="item.id"
                  class="flex items-center justify-between p-2 rounded-md transition duration-150 ease-in-out cursor-pointer"
                  :class="{'bg-indigo-100 text-indigo-700 font-medium': filters.publisherId === item.id, 'hover:bg-gray-50': filters.publisherId !== item.id}"
                  @click="toggleSingleFilter('publisherId', item.id)">
                <span>{{ item.name }}</span>
                <span class="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">{{ item.count }}</span>
              </li>
            </ul>
          </div>

          <!-- 系列 -->
          <div v-if="stats.series && stats.series.length > 0" class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">系列</h3>
            <ul class="space-y-1">
              <li v-for="item in stats.series" :key="item.id"
                  class="flex items-center justify-between p-2 rounded-md transition duration-150 ease-in-out cursor-pointer"
                  :class="{'bg-indigo-100 text-indigo-700 font-medium': filters.seriesId === item.id, 'hover:bg-gray-50': filters.seriesId !== item.id}"
                  @click="toggleSingleFilter('seriesId', item.id)">
                <span>{{ item.name }}</span>
                <span class="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">{{ item.count }}</span>
              </li>
            </ul>
          </div>

          <!-- 標籤 -->
          <div v-if="stats.tags && stats.tags.length > 0" class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">標籤</h3>
            <ul class="space-y-1">
              <li v-for="item in stats.tags.filter(tag => tag.name)" :key="item.id"
                  class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                  :class="{'bg-indigo-100 text-indigo-700 font-medium': filters.tagIds.includes(item.id)}"
                  @click="toggleTagFilter(item.id)">
                <span>{{ item.name }}</span>
                <span class="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">{{ item.count }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右側書籍顯示區 -->
        <div class="lg:w-3/4 flex flex-col space-y-6">
          <div class="bg-white p-6 rounded-lg shadow-md text-gray-700">
            <span class="font-medium">總計書籍：</span>
            <span class="text-indigo-600 font-bold">{{ totalElements }}</span>
          </div>

          <!-- 加載中/錯誤訊息 -->
          <div v-if="loading" class="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>加載中...</span>
          </div>
          <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg shadow-md">{{ error }}</div>

          <!-- 書籍列表 -->
          <div class="flex flex-wrap justify-start gap-6">
            <BookCard
              v-for="book in books"
              :key="book.id"
              :book="book"
              @click="goToBookDetail(book.id)"
              @view-series="toggleSingleFilter('seriesId', $event)" />
          </div>

          <!-- 分頁導航 -->
          <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center space-x-2">
            <button @click="prevPage" :disabled="currentPage === 0" class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
              上一頁
            </button>
            <span class="text-sm font-medium text-gray-700">
              頁數 {{ currentPage + 1 }} / {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages - 1" class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
              下一頁
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookCard from '../components/BookCard.vue'
import { authState } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()

// 響應式數據
const books = ref([])
const stats = ref({
  categories: [],
  subCategories: [],
  authors: [],
  publishers: [],
  series: [],
  tags: []
})

const filters = reactive({
  mainCategoryId: null,
  subCategoryId: null,
  authorId: null,
  publisherId: null,
  seriesId: null,
  tagIds: []
})

const keyword = ref('')
const seriesDisplay = ref(1)
const currentPage = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)
const pageSize = 10
const loading = ref(false)
const error = ref(null)

// 初始化篩選條件
const initFiltersFromUrl = () => {
  const query = route.query

  // 主類別
  if (query.mainCategoryId) {
    filters.mainCategoryId = parseInt(query.mainCategoryId)
  }

  // 次類別
  if (query.subCategoryId) {
    filters.subCategoryId = parseInt(query.subCategoryId)
  }

  // 作者
  if (query.authorId) {
    filters.authorId = parseInt(query.authorId)
  }

  // 出版商
  if (query.publisherId) {
    filters.publisherId = parseInt(query.publisherId)
  }

  // 系列
  if (query.seriesId) {
    filters.seriesId = parseInt(query.seriesId)
  }

  // 標籤
  if (query.tagIds) {
    // 處理標籤可能是單個值或陣列的情況
    filters.tagIds = Array.isArray(query.tagIds)
      ? query.tagIds.map(id => parseInt(id))
      : [parseInt(query.tagIds)]
  }

  // 關鍵字
  if (query.keyword) {
    keyword.value = query.keyword
  }

  // 顯示模式
  if (query.seriesDisplay) {
    seriesDisplay.value = parseInt(query.seriesDisplay)
  }
}

// 獲取書籍列表
const fetchDataAndStats = async () => {
  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    params.append('page', currentPage.value)
    params.append('size', pageSize)
    params.append('seriesDisplay', seriesDisplay.value)

    if (keyword.value) params.append('keyword', keyword.value)
    if (filters.mainCategoryId) params.append('mainCategoryId', filters.mainCategoryId)
    if (filters.subCategoryId) params.append('subCategoryId', filters.subCategoryId)
    if (filters.authorId) params.append('authorId', filters.authorId)
    if (filters.publisherId) params.append('publisherId', filters.publisherId)
    if (filters.seriesId) params.append('seriesId', filters.seriesId)
    filters.tagIds.forEach(id => params.append('tags', id))

    const response = await fetch(`/api/books?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`)
    }

    const data = await response.json()
    books.value = data.bookPage.content || []
    currentPage.value = data.bookPage.currentPage
    totalPages.value = data.bookPage.totalPages
    totalElements.value = data.bookPage.totalElements
    stats.value = data.stats
  } catch (err) {
    console.error('獲取書籍資料失敗:', err)
    error.value = '無法獲取書籍資料，請稍後再試。'
  } finally {
    loading.value = false
  }
}

// 更新 URL
const updateUrlFromFilters = () => {
  const query = {}

  if (filters.mainCategoryId) query.mainCategoryId = filters.mainCategoryId
  if (filters.subCategoryId) query.subCategoryId = filters.subCategoryId
  if (filters.authorId) query.authorId = filters.authorId
  if (filters.publisherId) query.publisherId = filters.publisherId
  if (filters.seriesId) query.seriesId = filters.seriesId
  if (filters.tagIds.length > 0) query.tagIds = filters.tagIds[0] // 保持與原始行為一致
  if (keyword.value) query.keyword = keyword.value
  if (seriesDisplay.value !== 1) query.seriesDisplay = seriesDisplay.value

  router.replace({ query })
}

// 篩選控制
const toggleSingleFilter = (filterType, id) => {
  if (filters[filterType] === id) {
    filters[filterType] = null
  } else {
    filters[filterType] = id
  }
  currentPage.value = 0
  updateUrlFromFilters()
  fetchDataAndStats()
}

const toggleTagFilter = (id) => {
  const index = filters.tagIds.indexOf(id)
  if (index > -1) {
    filters.tagIds.splice(index, 1)
  } else {
    filters.tagIds.push(id)
  }
  currentPage.value = 0
  updateUrlFromFilters()
  fetchDataAndStats()
}

const applyKeyword = () => {
  currentPage.value = 0
  updateUrlFromFilters()
  fetchDataAndStats()
}

const changeSeriesDisplay = () => {
  currentPage.value = 0
  updateUrlFromFilters()
  fetchDataAndStats()
}

// 分頁控制
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchDataAndStats()
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchDataAndStats()
  }
}

// 導航
const goToBookDetail = (bookId) => {
  router.push({ name: 'bookDetail', query: { id: bookId } })
}

// 生命週期
onMounted(() => {
  initFiltersFromUrl()
  fetchDataAndStats()

  // 監聽路由變化
  window.addEventListener('popstate', () => {
    initFiltersFromUrl()
    fetchDataAndStats()
  })
})
</script>
