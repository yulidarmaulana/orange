<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchBTCSnapshot } from '../api/coingecko'

const { data, isLoading, error, dataUpdatedAt } = useQuery({
  queryKey: ['btcSnapshot'],
  queryFn: fetchBTCSnapshot,
  staleTime: 1000 * 60,
  refetchInterval: 1000 * 60,
})

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const num0 = new Intl.NumberFormat('en-US')

const marketCap = computed(() =>
  data.value
    ? `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(data.value.marketCap)}`
    : '—'
)
const athDate = computed(() =>
  data.value
    ? new Date(data.value.athDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'
)
const daysSinceAth = computed(() =>
  data.value ? num0.format(Math.floor((Date.now() - new Date(data.value.athDate).getTime()) / 86400000)) : '—'
)
const updated = computed(() =>
  dataUpdatedAt.value ? new Date(dataUpdatedAt.value).toLocaleTimeString('en-ID', { timeZone: 'Asia/Jakarta' }) : '—'
)

const cards = computed(() => [
  { label: 'Market Cap', value: marketCap.value },
  { label: 'All-Time High', value: data.value ? usd0.format(data.value.ath) : '—' },
  { label: 'From All-Time High', value: data.value ? `${data.value.athChangePct.toFixed(1)}%` : '—', accent: true },
  { label: 'All-Time High Set On', value: athDate.value },
  { label: 'Days Since ATH', value: daysSinceAth.value },
  { label: 'Block Height', value: data.value ? num0.format(data.value.blockHeight) : '—' },
])
</script>

<template>
  <section class="max-w-5xl mx-auto text-left py-8">
    <div class="flex flex-wrap justify-between items-center gap-x-4 gap-y-1 font-mono text-[10px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase">
      <span class="text-orange-600 dark:text-orange-500">Bitcoin Snapshot</span>
      <span class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <span class="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 animate-pulse"></span>
        Updated {{ updated }}
      </span>
    </div>

    <div class="mt-2 mb-8 text-5xl sm:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white">
      <template v-if="data">{{ usd0.format(data.price) }}</template>
      <span v-else-if="isLoading" class="animate-pulse text-slate-300 dark:text-slate-700">$——,———</span>
      <span v-else class="text-2xl text-red-500">{{ (error as Error)?.message }}</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in cards"
        :key="c.label"
        class="flex flex-col justify-between h-36 sm:h-44 p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gray-950"
      >
        <div class="font-mono text-xs tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">{{ c.label }}</div>
        <div
          class="text-3xl sm:text-4xl font-bold tracking-tight"
          :class="c.accent ? 'text-orange-600 dark:text-orange-500' : 'text-slate-900 dark:text-white'"
        >
          {{ c.value }}
        </div>
      </div>
    </div>
  </section>
</template>
