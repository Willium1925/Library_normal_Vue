<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] cursor-pointer flex flex-col"
    style="width: 300px; height: 500px; margin: 0 0 24px 0;"
    @click="$emit('click')">
    <!-- 圖片區塊 (固定高度為350px, 約為整體高度的3/5) -->
    <div class="h-[350px] bg-gray-200 flex items-center justify-center overflow-hidden">
      <img :src="book.imageUrl"
           :alt="book.title + '封面'"
           class="h-full w-auto object-contain"
           @error="handleImageError">
    </div>

    <!-- 詳情區塊 (固定高度為170px，約為整體高度的2/5) -->
    <div class="p-4 h-[170px] flex flex-col">
      <!-- 標題（兩行） -->
      <h3 class="font-bold text-lg text-gray-900 line-clamp-2 mb-2">{{ book.title }}</h3>

      <!-- 系列（即便沒有也保持空白一行） -->
      <div class="text-sm font-medium text-indigo-600 h-6 mb-1">
        <div v-if="book.series" class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1">
            <path fill-rule="evenodd" d="M3.75 6.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM4.5 18a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z" clip-rule="evenodd" />
          </svg>
          <span>{{ book.seriesTitle }}系列</span>
        </div>
      </div>

      <!-- 可否借閱/點擊查看（一行） -->
      <div class="my-1">
        <!-- 系列作的點擊查看按鈕 -->
        <button v-if="book.series && book.displayType === 'DTO點擊查看'"
                class="px-3 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition"
                @click.stop="$emit('view-series', book.seriesId)">
          查看系列
        </button>

        <!-- 系列作可借閱狀態 -->
        <div v-else-if="book.series && book.displayType === 'DTO單集可借閱'"
             class="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1">
            <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd" />
          </svg>
          <span>單集可借閱</span>
        </div>

        <!-- 系列作不可借閱狀態 -->
        <div v-else-if="book.series && book.displayType === 'DTO單集不可借閱'"
             class="inline-flex items-center px-3 py-1 rounded-md bg-red-600 text-white text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
          <span>單集不可借閱</span>
        </div>

        <!-- 單行本可借閱狀態 -->
        <div v-else-if="book.displayType === '可借閱'"
             class="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1">
            <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd" />
          </svg>
          <span>可借閱</span>
        </div>

        <!-- 單行本不可借閱狀態 -->
        <div v-else-if="book.displayType === '不可借閱'"
             class="inline-flex items-center px-3 py-1 rounded-md bg-red-600 text-white text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
          <span>不可借閱</span>
        </div>
      </div>

      <!-- 作者（一行） -->
      <div class="text-sm text-gray-700 flex items-center mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1 text-gray-500 flex-shrink-0">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
        </svg>
        <span class="line-clamp-1">{{ book.authors ? book.authors.join(', ') : '未知作者' }}</span>
      </div>

      <!-- 出版商（一行） -->
      <div class="text-sm text-gray-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1 text-gray-500 flex-shrink-0">
          <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
          <path fill-rule="evenodd" d="M5.25 10.5A.75.75 0 0 1 6 9.75v10.5a.75.75 0 0 1-1.5 0V9.75a.75.75 0 0 1 .75-.75Zm2.25 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H9v8.25a.75.75 0 0 1-1.5 0v-9Zm4.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H13.5v2.25h2.25a.75.75 0 0 1 0 1.5H13.5v3.75a.75.75 0 0 1-1.5 0v-9Z" clip-rule="evenodd" />
        </svg>
        <span class="line-clamp-1">{{ book.publisherName || '未知出版商' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
})

defineEmits(['click', 'view-series'])

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=無圖片'
}
</script>
