<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import CardHero from './components/CardHero.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import { Search } from 'lucide-vue-next'

const searchInput = ref('')
const activeAddress = ref('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')

function handleSearch() {
  const trimmed = searchInput.value.trim()
  activeAddress.value = trimmed || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
}

</script>

<template>
  <div>
    <div class="flex justify-between align-center">
      <HelloWorld />
      <DarkModeToggle />
    </div>
    <div class="mb-4 bg-slate-50 dark:bg-slate-700 text-white p-2 rounded-lg shadow-xs flex gap-2">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Enter Bitcoin wallet address"
        class="border border-slate-300 rounded px-2 py-1 flex-grow bg-slate-200 text-slate-800 focus:outline-none focus:border-orange-500"
        @keyup.enter="handleSearch"
      />
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
</style>
