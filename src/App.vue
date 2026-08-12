<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import CardHero from './components/CardHero.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import { Search, Star, Bookmark, Trash2, X } from 'lucide-vue-next'
import { getWalletMetadata } from './utils/labels'

const searchInput = ref('')
const activeAddress = ref('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
const watchlist = ref<string[]>(JSON.parse(localStorage.getItem('orange_watchlist') || '[]'))
const isWatchlistModalOpen = ref(false)

function handleSearch() {
  const trimmed = searchInput.value.trim()
  activeAddress.value = trimmed || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
}

function saveWatchlist() {
  localStorage.setItem('orange_watchlist', JSON.stringify(watchlist.value))
}

function toggleWatchlist(addr: string) {
  const index = watchlist.value.indexOf(addr)
  if (index > -1) {
    watchlist.value.splice(index, 1)
  } else {
    watchlist.value.push(addr)
  }
  saveWatchlist()
}

function isInWatchlist(addr: string): boolean {
  return watchlist.value.includes(addr)
}

function clearWatchlist() {
  watchlist.value = []
  saveWatchlist()
}

function selectWatchlistAddress(addr: string) {
  activeAddress.value = addr
  searchInput.value = addr
  isWatchlistModalOpen.value = false
}

</script>

<template>
  <div class="relative">
    <!-- Watchlist Modal Overlay and Content -->
    <transition name="modal-fade">
      <div 
        v-if="isWatchlistModalOpen" 
        class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        @click.self="isWatchlistModalOpen = false"
      >
        <div 
          class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col modal-content"
        >
          <!-- Modal Header -->
          <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-2">
              <Bookmark class="text-orange-600 dark:text-orange-400" :size="20" />
              <span class="font-bold text-slate-800 dark:text-slate-100">Wallet Watchlist</span>
            </div>
            <button 
              @click="isWatchlistModalOpen = false"
              class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-4 max-h-[300px] overflow-y-auto">
            <div v-if="watchlist.length === 0" class="p-8 text-center text-slate-400 dark:text-slate-500">
              <Bookmark class="mx-auto mb-2 text-slate-300 dark:text-slate-600" :size="32" />
              <p class="text-sm">No wallets in your watchlist yet.</p>
              <p class="text-xs mt-1">Bookmark wallets to easily track them later.</p>
            </div>
            <ul v-else class="divide-y divide-slate-100 dark:divide-slate-700/60">
              <li 
                v-for="addr in watchlist" 
                :key="addr" 
                class="flex items-center justify-between py-3 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors px-2 rounded-lg"
              >
                <div class="flex-1 min-w-0 mr-3">
                  <button 
                    @click="selectWatchlistAddress(addr)"
                    class="text-left w-full cursor-pointer hover:text-orange-500 dark:hover:text-orange-400 group"
                  >
                    <div v-if="getWalletMetadata(addr).label" class="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                      {{ getWalletMetadata(addr).label }}
                    </div>
                    <div 
                      class="font-mono text-xs text-slate-500 dark:text-slate-400"
                      :class="getWalletMetadata(addr).label ? 'mt-0.5' : 'text-sm font-medium py-1'"
                    >
                      {{ addr.substring(0, 12) }}...{{ addr.substring(addr.length - 12) }}
                    </div>
                  </button>
                </div>
                <button 
                  @click="toggleWatchlist(addr)"
                  class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer flex-shrink-0"
                  title="Remove from watchlist"
                >
                  <Trash2 :size="14" />
                </button>
              </li>
            </ul>
          </div>

          <!-- Modal Footer -->
          <div 
            v-if="watchlist.length > 0"
            class="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs"
          >
            <span class="text-slate-500 dark:text-slate-400">{{ watchlist.length }} wallets saved</span>
            <button 
              @click="clearWatchlist"
              class="text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer font-semibold px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="flex justify-between items-center mb-4">
      <HelloWorld />
      
      <div class="flex items-center gap-2 relative">
        <button 
          @click="isWatchlistModalOpen = true"
          class="relative p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer text-slate-700 dark:text-slate-200 shadow-xs"
          title="Watchlist"
        >
          <Bookmark :size="18" />
          <span 
            v-if="watchlist.length > 0" 
            class="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-orange-600 text-white rounded-full flex items-center justify-center border border-white dark:border-slate-700 leading-none"
          >
            {{ watchlist.length }}
          </span>
        </button>

        <DarkModeToggle />
      </div>
    </div>
    
    <div class="mb-4 bg-slate-50 dark:bg-slate-700 text-white p-2 rounded-lg shadow-xs flex gap-2">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Enter Bitcoin wallet address"
        class="border border-slate-300 rounded px-2 py-1 flex-grow bg-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
        @keyup.enter="handleSearch"
      />
      
      <!-- Star/Bookmark Button -->
      <button
        @click="toggleWatchlist(activeAddress)"
        class="p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800"
        :class="isInWatchlist(activeAddress) ? 'text-yellow-500 hover:text-yellow-600' : 'text-slate-400 hover:text-slate-500'"
        title="Bookmark active address"
      >
        <Star :size="16" :fill="isInWatchlist(activeAddress) ? 'currentColor' : 'none'" />
      </button>

      <button
        @click="handleSearch"
        class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Search :size="16" />
        Search
      </button>
    </div>
    <CardHero :wallet-address="activeAddress" />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}

/* Modal Fade and Scale transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
