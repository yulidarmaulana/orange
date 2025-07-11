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
    <div class="flex gap-2 mt-2 items-center text-center" v-if="totalPages > 1">
      <button @click="page--" :disabled="page === 1" class="px-2 py-1 bg-slate-600 rounded text-xs">Prev</button>
      <span>Page {{ page }} / {{ totalPages }}</span>
      <button @click="page++" :disabled="page === totalPages" class="px-2 py-1 bg-slate-600 rounded text-xs">Next</button>
    </div>
  </div>
</template>