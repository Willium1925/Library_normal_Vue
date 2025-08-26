<template>
  <div class="bg-gray-100 min-h-screen flex flex-col">
    <!-- 主要內容區塊 -->
    <main class="container mx-auto p-8 flex-grow flex flex-col gap-8">

      <!-- 精選推薦（圖片輪播牆） -->
      <section class="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
        <h2 class="text-xl font-bold mb-4 text-gray-800">精選推薦</h2>
        <div class="relative w-full h-64 overflow-hidden rounded-lg">
          <img
            :src="carouselImages[currentSlideIndex]"
            alt="Carousel Image"
            class="w-full h-full object-cover transition-opacity duration-500">
          <button
            @click="prevSlide"
            class="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
            &#10094;
          </button>
          <button
            @click="nextSlide"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
            &#10095;
          </button>
        </div>
      </section>

      <!-- 橫向分類篩選列 -->
      <section class="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 class="text-xl font-bold mb-4 text-gray-800">書籍分類</h2>
        <div class="flex flex-wrap gap-4">
          <div v-for="category in categories" :key="category.id" class="relative group">
            <div
              class="flex items-center px-4 py-2 rounded-md hover:bg-indigo-50 transition duration-150 ease-in-out cursor-pointer text-gray-700 font-medium"
              :class="{'bg-indigo-100 text-indigo-700 font-medium': filters.mainCategoryId === category.id}"
              @click="toggleMainCategoryFilter(category.id)">
              <span>{{ category.categoryTitle }}</span>
              <svg class="w-4 h-4 text-gray-500 ml-2 transform group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <!-- 次分類浮現 (hover 效果) -->
            <ul class="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible z-10">
              <li
                v-for="subCategory in category.categorySubs"
                :key="subCategory.id"
                class="p-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
                @click="goToBookSearch('subCategoryId', subCategory.id)">
                {{ subCategory.categorySubTitle }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 熱門借閱前五名 -->
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">熱門借閱</h2>
        <div class="relative">
          <button
            @click="scrollBooks('hotBorrowedBooksContainer', -264)"
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-300 bg-opacity-75 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition z-10">
            &#10094;
          </button>
          <!-- 書籍列表 -->
          <div ref="hotBorrowedBooksContainer" class="flex overflow-x-auto no-scrollbar pb-4 -mx-2 scroll-smooth">
            <div v-for="book in hotBorrowedBooks" :key="book.id" class="flex-shrink-0 w-64 px-2">
              <BookCard :book="book" @click="goToBookDetail(book.id)" />
            </div>
          </div>
          <button
            @click="scrollBooks('hotBorrowedBooksContainer', 264)"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-300 bg-opacity-75 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition z-10">
            &#10095;
          </button>
        </div>
      </section>

      <!-- 最新上架前五名 -->
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">最新上架</h2>
        <div class="relative">
          <button
            @click="scrollBooks('newArrivalBooksContainer', -264)"
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-300 bg-opacity-75 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition z-10">
            &#10094;
          </button>
          <!-- 書籍列表 -->
          <div ref="newArrivalBooksContainer" class="flex overflow-x-auto no-scrollbar pb-4 -mx-2 scroll-smooth">
            <div v-for="book in newArrivalBooks" :key="book.id" class="flex-shrink-0 w-64 px-2">
              <BookCard :book="book" @click="goToBookDetail(book.id)" />
            </div>
          </div>
          <button
            @click="scrollBooks('newArrivalBooksContainer', 264)"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-300 bg-opacity-75 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition z-10">
            &#10095;
          </button>
        </div>
      </section>

      <!-- 熱門標籤前十名 -->
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">熱門標籤</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in hotTags"
            :key="tag.id"
            class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium cursor-pointer hover:bg-indigo-200 transition"
            @click="goToBookSearch('tags', tag.id)">
            {{ tag.title }}
          </span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BookCard from '../components/BookCard.vue'

const router = useRouter()

// 響應式數據
const categories = ref([])
const hotBorrowedBooks = ref([])
const newArrivalBooks = ref([])
const hotTags = ref([])
const carouselImages = ref([
  'https://becomingatranslator.wordpress.com/wp-content/uploads/2014/01/baigaeshi2.jpg',
  'https://pic.pimg.tw/erikasky/1380365655-2901437797.jpg',
  'https://kenshin.hk/blog/2020-02/hanzawa2/02/hanzawa2-02-00.jpg',
  'https://kenshin.hk/blog/2020-02/hanzawa2/03/hanzawa2-03-00.jpg',
  'https://placehold.co/1200x400/a78bfa/ffffff?text=ADVERTISEMENT 01',
  'https://placehold.co/1200x400/818cf8/ffffff?text=ADVERTISEMENT 02',
  'https://placehold.co/1200x400/6366f1/ffffff?text=ADVERTISEMENT 03'
])
const currentSlideIndex = ref(0)
const filters = reactive({
  mainCategoryId: null
})

// refs for scrolling containers
const hotBorrowedBooksContainer = ref(null)
const newArrivalBooksContainer = ref(null)

// API 調用函數
const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories')
    categories.value = await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchHotBorrowedBooks = async () => {
  let url = '/api/books/home/top5loan'
  if (filters.mainCategoryId) {
    url += `/${filters.mainCategoryId}`
  }
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`API 請求失敗: ${response.status}`)
    hotBorrowedBooks.value = await response.json()
  } catch (error) {
    console.error('Error fetching hot borrowed books:', error)
  }
}

const fetchNewArrivalBooks = async () => {
  let url = '/api/books/home/top5new'
  if (filters.mainCategoryId) {
    url += `/${filters.mainCategoryId}`
  }
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`API 請求失敗: ${response.status}`)
    newArrivalBooks.value = await response.json()
  } catch (error) {
    console.error('Error fetching new arrival books:', error)
  }
}

const fetchHotTags = async () => {
  let url = '/api/tags/home/top10'
  if (filters.mainCategoryId) {
    url += `/${filters.mainCategoryId}`
  }
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`API 請求失敗: ${response.status}`)
    hotTags.value = await response.json()
  } catch (error) {
    console.error('Error fetching hot tags:', error)
  }
}

// 統一獲取首頁所有動態內容
const fetchHomepageContent = () => {
  fetchHotBorrowedBooks()
  fetchNewArrivalBooks()
  fetchHotTags()
}

// 切換主類別篩選
const toggleMainCategoryFilter = (id) => {
  filters.mainCategoryId = filters.mainCategoryId === id ? null : id
  fetchHomepageContent()
}

// 輪播功能
const startCarousel = () => {
  setInterval(nextSlide, 5000)
}

const nextSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % carouselImages.value.length
}

const prevSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value - 1 + carouselImages.value.length) % carouselImages.value.length
}

// 水平滾動書籍列表
const scrollBooks = async (containerRef, amount) => {
  await nextTick()
  const container = containerRef === 'hotBorrowedBooksContainer'
    ? hotBorrowedBooksContainer.value
    : newArrivalBooksContainer.value
  if (container) {
    container.scrollBy({ left: amount, behavior: 'smooth' })
  }
}

// 導航功能
const goToBookSearch = (filterType, id) => {
  const query = {}
  if (filterType === 'keyword') {
    query.keyword = id
  } else if (filterType === 'mainCategoryId') {
    query.mainCategoryId = id
  } else if (filterType === 'subCategoryId') {
    query.subCategoryId = id
  } else if (filterType === 'authorId') {
    query.authorId = id
  } else if (filterType === 'publisherId') {
    query.publisherId = id
  } else if (filterType === 'seriesId') {
    query.seriesId = id
  } else if (filterType === 'tags') {
    query.tagIds = id
  }
  router.push({ name: 'bookQuery', query })
}

const goToBookDetail = (bookId) => {
  router.push({ name: 'bookDetail', query: { id: bookId } })
}

// 生命週期
onMounted(() => {
  fetchCategories()
  fetchHomepageContent()
  startCarousel()
})
</script>
