<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <!-- 主內容區 -->
    <main class="w-full">
      <div class="bg-white rounded-lg shadow-md p-6 min-h-full">

        <!-- 訊息提示區域 -->
        <div v-if="message.text" :class="message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'" class="border px-4 py-3 rounded relative mb-6" role="alert">
          <span class="block sm:inline">{{ message.text }}</span>
        </div>

        <!-- 畫面狀態 1: 新增書籍表單 -->
        <div v-if="viewState === 'form'">
          <h1 class="text-2xl font-bold mb-6 text-gray-800">新增書籍</h1>
          <form @submit.prevent="confirmSubmission" class="space-y-6">
            <!-- Basic Information Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">書籍標題</label>
                <input type="text" v-model="newBook.title" id="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 h-12">
              </div>
              <div>
                <label for="isbn" class="block text-sm font-medium text-gray-700">ISBN</label>
                <input type="text" v-model="newBook.isbn" id="isbn" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 h-12">
              </div>
              <div>
                <label for="publishYear" class="block text-sm font-medium text-gray-700">出版年份</label>
                <input type="number" v-model.number="newBook.publishYear" id="publishYear" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 h-12">
              </div>
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700">價格</label>
                <input type="number" step="0.01" v-model.number="newBook.price" id="price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 h-12">
              </div>
              <div class="md:col-span-2">
                <label for="imageUrl" class="block text-sm font-medium text-gray-700">封面圖片 URL</label>
                <input type="url" v-model="newBook.imageUrl" id="imageUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 h-12">
              </div>
            </div>

            <!-- Relational Information Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="mainCategoryId" class="block text-sm font-medium text-gray-700">主分類</label>
                <select id="mainCategoryId" ref="mainCategorySelect" required placeholder="選擇主分類..."></select>
              </div>
              <div>
                <label for="subCategoryId" class="block text-sm font-medium text-gray-700">子分類</label>
                <select id="subCategoryId" ref="subCategorySelect" required placeholder="請先選擇主分類..."></select>
              </div>
              <div>
                <label for="publisherId" class="block text-sm font-medium text-gray-700">出版社</label>
                <select id="publisherId" ref="publisherSelect" required placeholder="選擇出版社..."></select>
              </div>
              <div>
                <label for="seriesId" class="block text-sm font-medium text-gray-700">系列 (可選)</label>
                <select id="seriesId" ref="seriesSelect" placeholder="選擇系列..."></select>
              </div>
            </div>

            <!-- Many-to-Many Section -->
            <div class="space-y-6">
              <div>
                <label for="authors" class="block text-sm font-medium text-gray-700">作者 (可搜尋或新增)</label>
                <select id="authors" ref="authorSelect" multiple placeholder="選擇或輸入新作者..."></select>
              </div>
              <div>
                <label for="tags" class="block text-sm font-medium text-gray-700">標籤 (可搜尋或新增)</label>
                <select id="tags" ref="tagSelect" multiple placeholder="選擇或輸入新標籤..."></select>
              </div>
            </div>

            <!-- Submission Button -->
            <div class="flex justify-end pt-4">
              <button type="submit" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                預覽並確認
              </button>
            </div>
          </form>
        </div>

        <!-- 畫面狀態 2: 成功新增後顯示結果 -->
        <div v-if="viewState === 'success'">
          <h1 class="text-2xl font-bold mb-6 text-gray-800">書籍新增成功</h1>
          <div class="space-y-6">
            <!-- 上框：書籍資訊 -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
              <!-- 書籍封面 -->
              <div class="flex-shrink-0 w-48 h-64 md:w-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 text-sm shadow-md">
                <img :src="createdBook.imageUrl || 'https://placehold.co/256x320/e2e8f0/64748b?text=無圖片'"
                     :alt="createdBook.title"
                     class="h-full w-auto object-contain"
                     onerror="this.onerror=null;this.src='https://placehold.co/256x320/e2e8f0/64748b?text=無圖片';" />
              </div>
              <!-- 書本詳細資訊 -->
              <div class="flex-grow text-center md:text-left">
                <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ createdBook.title }}</h1>
                <p class="text-xl text-gray-700 mb-2"><strong>作者:</strong> {{ createdBook.authors ? createdBook.authors.join(', ') : '未知作者' }}</p>
                <p class="text-lg text-gray-600 mb-2"><strong>主類別:</strong> {{ createdBook.mainCategoryTitle || '未知' }}</p>
                <p class="text-lg text-gray-600 mb-2"><strong>次類別:</strong> {{ createdBook.subCategoryTitle || '未知' }}</p>
                <p class="text-lg text-gray-600 mb-2"><strong>出版商:</strong> {{ createdBook.publisher || '未知出版商' }}</p>
                <p class="text-lg text-gray-600 mb-2"><strong>出版年份:</strong> {{ createdBook.publishYear || 'N/A' }}</p>
                <p class="text-lg text-gray-600 mb-4"><strong>ISBN:</strong> {{ createdBook.isbn || 'N/A' }}</p>
                <div v-if="createdBook.seriesTitle" class="mb-4">
                  <p class="text-lg text-gray-600"><strong>系列:</strong> {{ createdBook.seriesTitle }}</p>
                </div>
                <div v-if="createdBook.tags && createdBook.tags.length > 0" class="mb-4">
                  <p class="text-lg text-gray-600 mb-2"><strong>標籤:</strong></p>
                  <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span v-for="tag in createdBook.tags" :key="tag" class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 返回按鈕 -->
            <div class="flex justify-end pt-4">
              <router-link to="/admin/adminPanel" class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700">
                回到管理頁面
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- 確認視窗 Modal -->
    <div v-if="viewState === 'confirm'" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <h2 class="text-xl font-bold p-6 border-b">確認書籍資訊</h2>
        <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div v-for="(value, key) in confirmationData" :key="key" class="grid grid-cols-3 gap-4">
            <strong class="text-gray-600 col-span-1">{{ key }}</strong>
            <span class="text-gray-800 col-span-2 break-words">{{ value }}</span>
          </div>
        </div>
        <div class="flex justify-end space-x-4 p-6 border-t bg-gray-50 rounded-b-lg">
          <button @click="viewState = 'form'" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">返回修改</button>
          <button @click="handleCreateBook" :disabled="isSubmitting" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 inline-flex items-center">
            <span v-if="!isSubmitting">確認送出</span>
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
// 明確引入 Tom Select 及其樣式
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.css'

const router = useRouter()

// --- 組態設定 ---
const API_BASE_URL = '/api'
const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/categories`,
  publishers: `${API_BASE_URL}/publishers`,
  series: `${API_BASE_URL}/series`,
  authors: `${API_BASE_URL}/authors`,
  tags: `${API_BASE_URL}/tags`,
  createBook: `${API_BASE_URL}/admin/books`
}

// --- 狀態管理 (State Management) ---
const viewState = ref('form')
const isSubmitting = ref(false)
const confirmationData = ref({})
const createdBook = ref({})
const message = reactive({ text: '', type: 'success' })
const allCategories = ref([])
let payload = {}

// --- 表單狀態 (Form State) ---
const newBook = reactive({
  title: '',
  isbn: '',
  publishYear: null,
  price: null,
  imageUrl: '',
})

// Tom Select 實例
const tomSelectInstances = {}
// 建立對應模板中 <select> 元素的 ref
const mainCategorySelect = ref(null)
const subCategorySelect = ref(null)
const publisherSelect = ref(null)
const seriesSelect = ref(null)
const authorSelect = ref(null)
const tagSelect = ref(null)

// --- 方法定義 (Methods) ---
/**
 * 顯示全域提示訊息。
 */
const showMessage = (text, type = 'success') => {
  message.text = text
  message.type = type
  setTimeout(() => message.text = '', 5000)
}

/**
 * 處理多對多關聯欄位的輸入值。
 */
const processManyToManyInput = (values) => {
  const result = { existingIds: [], newNames: [] }
  if (!values) return result
  values.forEach(val => {
    if (/^\d+$/.test(val)) {
      result.existingIds.push(parseInt(val, 10))
    } else {
      result.newNames.push(val)
    }
  })
  return result
}

/**
 * 異步載入資料並初始化一個 Tom Select 下拉選單。
 */
const initializeSelect = async (elementRef, url, options = {}) => {
  try {
    const response = await axios.get(url)
    const data = response.data.map(item => ({
      value: item.id,
      text: item.name || item.title || item.pubName || item.categoryTitle || item.categorySubTitle || item.publisherName || item.seriesName
    }))

    const elementId = elementRef.value.id
    tomSelectInstances[elementId] = new TomSelect(elementRef.value, { options: data, ...options })
    return tomSelectInstances[elementId]
  } catch (error) {
    console.error(`無法載入 ${elementRef.value.id} 的資料:`, error)
    showMessage(`無法載入 ${elementRef.value.id} 的資料。`, 'error')
  }
}

/**
 * 根據選擇的主分類 ID，動態更新子分類的選項。
 */
const updateSubCategoryOptions = (mainCategoryId) => {
  const subCategoryTomSelect = tomSelectInstances['subCategoryId']
  if (!subCategoryTomSelect) return

  subCategoryTomSelect.clear()
  subCategoryTomSelect.clearOptions()

  if (mainCategoryId) {
    const selectedCategory = allCategories.value.find(cat => cat.id == mainCategoryId)
    if (selectedCategory && selectedCategory.categorySubs) {
      const subOptions = selectedCategory.categorySubs.map(sub => ({
        value: sub.id,
        text: sub.categorySubTitle
      }))
      subCategoryTomSelect.addOptions(subOptions)
      subCategoryTomSelect.enable()
    }
  } else {
    subCategoryTomSelect.disable()
  }
}

/**
 * 當使用者點擊 "預覽並確認" 按鈕時觸發。
 */
const confirmSubmission = () => {
  const getSelectText = (instance) => instance ? instance.items.map(id => instance.options[id].text).join(', ') : '未選擇'

  confirmationData.value = {
    '書籍標題': newBook.title,
    '出版年份': newBook.publishYear || '未填寫',
    '價格': newBook.price || '未填寫',
    '圖片URL': newBook.imageUrl || '未填寫',
    'ISBN': newBook.isbn,
    '出版社': getSelectText(tomSelectInstances['publisherId']),
    '子分類': getSelectText(tomSelectInstances['subCategoryId']),
    '系列': getSelectText(tomSelectInstances['seriesId']),
    '作者': getSelectText(tomSelectInstances['authors']),
    '標籤': getSelectText(tomSelectInstances['tags']),
  }

  payload = {
    ...newBook,
    publisherId: parseInt(tomSelectInstances['publisherId']?.getValue()),
    categorySubId: parseInt(tomSelectInstances['subCategoryId']?.getValue()),
    seriesId: tomSelectInstances['seriesId']?.getValue() ? parseInt(tomSelectInstances['seriesId'].getValue()) : null,
    authors: processManyToManyInput(tomSelectInstances['authors']?.getValue()),
    tags: processManyToManyInput(tomSelectInstances['tags']?.getValue())
  }

  viewState.value = 'confirm'
}

/**
 * 當使用者在確認視窗點擊 "確認送出" 按鈕時觸發。
 */
const handleCreateBook = async () => {
  isSubmitting.value = true
  message.text = ''

  try {
    const response = await axios.post(API_ENDPOINTS.createBook, payload)
    if (response.status === 201) {
      createdBook.value = response.data
      viewState.value = 'success'
    }
  } catch (error) {
    console.error('新增書籍時發生錯誤:', error)
    const errorMessage = error.response?.data?.message || '新增書籍失敗，請檢查輸入或聯絡管理員。'
    showMessage(errorMessage, 'error')
    viewState.value = 'form'
  } finally {
    isSubmitting.value = false
  }
}

// --- 生命週期鉤子 (Lifecycle Hooks) ---
onMounted(() => {
  nextTick(async () => {
    // 1. 初始化靜態下拉選單
    initializeSelect(publisherSelect, API_ENDPOINTS.publishers)
    initializeSelect(seriesSelect, API_ENDPOINTS.series, { allowEmptyOption: true })

    // 設定作者和標籤可新增
    const createOption = {
      create: true,
      persist: false,
      createOnBlur: true,
      render: {
        option_create: (data, escape) => `<div class="create">新增 <strong>${escape(data.input)}</strong>&hellip;</div>`,
      }
    }
    initializeSelect(authorSelect, API_ENDPOINTS.authors, createOption)
    initializeSelect(tagSelect, API_ENDPOINTS.tags, createOption)

    // 2. 初始化子分類下拉選單
    tomSelectInstances['subCategoryId'] = new TomSelect(subCategorySelect.value, {})
    tomSelectInstances['subCategoryId'].disable()

    // 3. 獲取所有分類資料，初始化主分類下拉選單
    try {
      const response = await axios.get(API_ENDPOINTS.categories)
      allCategories.value = response.data
      const mainCategoryOptions = allCategories.value.map(cat => ({
        value: cat.id,
        text: cat.categoryTitle
      }))
      const mainCategoryTomSelect = new TomSelect(mainCategorySelect.value, {
        options: mainCategoryOptions,
        onChange: updateSubCategoryOptions
      })
      tomSelectInstances['mainCategoryId'] = mainCategoryTomSelect
    } catch (error) {
      showMessage('無法載入分類資料', 'error')
    }
  })
})
</script>

<style scoped>
/* 自定義滾動條樣式 */
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* Custom styles for Tom Select to match Tailwind's aesthetic */
:deep(.ts-control) {
  border-radius: 0.375rem;
  border-color: #D1D5DB;
  padding: 0.6rem 0.75rem;
  min-height: 48px;
}
:deep(.ts-control .item) {
  background-color: #4f46e5;
  color: white;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}
:deep(.ts-wrapper.multi .ts-control > div) {
  cursor: text;
  margin: 0 0.25rem 0.25rem 0;
}
</style>
