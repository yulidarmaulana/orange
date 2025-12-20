<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  updateTheme()
}

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
  } else {
    isDark.value = false
  }
  updateTheme()
})
</script>

<template>
  <button
    @click="toggleDarkMode"
    class="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
    aria-label="Toggle Dark Mode"
  >
    <!-- Show Moon in Light Mode (to switch to Dark) -->
    <Moon v-if="!isDark" class="w-6 h-6 text-slate-700" />
    <!-- Show Sun in Dark Mode (to switch to Light) -->
    <Sun v-else class="w-6 h-6 text-yellow-400" />
  </button>
</template>
