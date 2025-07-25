<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  txs: any[]
  perPage?: number
}>()

const perPage = props.perPage ?? 5
const page = ref(1)
const totalPages = computed(() => Math.ceil(props.txs.length / perPage))

const pagedTxs = computed(() =>
  props.txs.slice((page.value - 1) * perPage, page.value * perPage)
)

watch(
  () => props.txs,
  () => { page.value = 1 }
)
</script>

<template>
  <div>
    <ul class="text-start">
      <li v-for="tx in pagedTxs" :key="tx.txid">
        <slot :tx="tx" />
      </li>
    </ul>
    <div class="flex gap-2 mt-2 items-center text-center justify-center" v-if="totalPages > 1">
      <button @click="page--" :disabled="page === 1" class="px-2 py-1 text-xs font-medium text-center text-white bg-neutral-400 rounded-lg hover:bg-neutral-800 focus:ring-4 focus:outline-none focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800">Prev</button>
      <span class="text-orange-950">Page {{ page }} / {{ totalPages }}</span>
      <button @click="page++" :disabled="page === totalPages" class="px-2 py-1 text-xs font-medium text-center text-white bg-neutral-400 rounded-lg hover:bg-neutral-800 focus:ring-4 focus:outline-none focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800">Next</button>
    </div>
  </div>
</template>