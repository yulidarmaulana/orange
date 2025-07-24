<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { fetchWalletData, fetchWalletTxs, fetchBTCtoUSD } from '../api/blockstream';
import PaginationTx from './PaginationTx.vue';
import Qrcode from 'qrcode.vue';

const props = defineProps<{ 
  walletAddress: string 
  txs?: any[]
  perPage?: number
 }>()

const queryKeyWallet = computed(() => ['walletData', props.walletAddress])
const queryKeyTxs = computed(() => ['walletTxs', props.walletAddress])

// Hitung final balance dalam BTC
const finalBalanceBTC = computed(() => {
  const { funded_txo_sum, spent_txo_sum } = data.value.chain_stats
  return (funded_txo_sum - spent_txo_sum) / 100000000
})

// Ambil nilai tukar BTC ke USD via TanStack
const { data: btcToUsdRate } = useQuery({
  queryKey: ['btcToUsdRate'],
  queryFn: fetchBTCtoUSD
})

// Konversi ke USD (pastikan data sudah ada)
const finalBalanceUSD = computed(() => {
  if (!btcToUsdRate.value) return 0
  return finalBalanceBTC.value * btcToUsdRate.value
})

// formatter USD
const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const { data, isLoading, error } = useQuery({
  queryKey: queryKeyWallet,
  queryFn: fetchWalletData,
  staleTime: 1000 * 60 * 5,
  enabled: computed(() => !!props.walletAddress),
})

const {
  data: txs,
  isLoading: isLoadingTxs,
  error: errorTxs,
} = useQuery({
  queryKey: queryKeyTxs,
  queryFn: fetchWalletTxs,
  staleTime: 1000 * 60 * 5,
  enabled: computed(() => !!props.walletAddress),
})

const copyAlert = ref(false)
function copyToClipboard(text: string, showAlert = false) {
  navigator.clipboard.writeText(text)
  if (showAlert) {
    copyAlert.value = true
    setTimeout(() => {
      copyAlert.value = false
    }, 1200)
  }
}

function exportTxsToCSV(txs: any[]) {
  if (!txs?.length) return
  const header = ['txid', 'block_time', 'confirmations', 'total_output_satoshi']
  const rows = txs.map(tx => [
    tx.txid,
    tx.status.block_time ? new Date(tx.status.block_time * 1000).toLocaleString() : '-',
    tx.status.confirmed ? 'Yes' : 'No',
    tx.vout.reduce((sum: number, vout: any) => sum + vout.value, 0)
  ])
  const csv = [header, ...rows].map(e => e.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function exportTxsToJSON(txs: any[]) {
  if (!txs?.length) return
  const blob = new Blob([JSON.stringify(txs, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <Suspense>
    <template #default>
      <div class="bg-slate-50 text-white p-4 rounded-lg shadow-md">
        <!-- <h3>Bitcoin Wallet Info</h3> -->
        <div v-if="isLoading">
          <ul class="text-start">
            <li class="skeleton skeleton-line w-2/3"></li>
            <li class="skeleton skeleton-line w-1/2"></li>
            <li class="skeleton skeleton-line w-1/2"></li>
            <li class="skeleton skeleton-line w-1/3"></li>
            <li class="skeleton skeleton-line w-1/3"></li>
          </ul>
          <h3 class="text-orange-950">Latest Transactions</h3>
          <div class="transactions-scroll">
            <ul class="text-start">
              <li v-for="n in 5" :key="n">
                <div class="p-2 mb-2 bg-gray-700 rounded">
                  <div class="skeleton skeleton-line w-5/6 mb-1"></div>
                  <div class="skeleton skeleton-line w-2/3 mb-1"></div>
                  <div class="skeleton skeleton-line w-1/2 mb-1"></div>
                  <div class="skeleton skeleton-line w-1/2 mb-1"></div>
                  <div class="skeleton skeleton-line w-1/3 mb-1"></div>
                  <div class="skeleton skeleton-line w-1/3 mb-1"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else>
          <ul class="text-start flex flex-col">
            <div class="">
            <li>
              <strong class="text-orange-950">Address:</strong> 
                <br>
               <span class="text-orange-950">{{ props.walletAddress }}</span>              
                <span
                @click="copyToClipboard(props.walletAddress, true)"
                class="ml-2 px-2 py-1 bg-slate-600 rounded text-xs hover:bg-slate-500 cursor-pointer"
                title="Copy Address"
                >Copy</span>
            </li>
            
            </div>
          </ul>

          <div class="flex flex-row gap-2">
            <div class="">
              <div class="flex justify-start p-2 border border-gray-300 w-fit rounded-lg">
              <Qrcode :value="props.walletAddress" :size="120" class="rounded-lg shadow-md" />
              </div>
            </div>

            <div class="basis-full">
              <div class="border border-gray-300 rounded-lg p-2 flex flex-col text-start">
                <strong class="text-orange-950">Final Balance </strong> <span class="text-orange-950"> <span class="text-orange-300 font-bold">{{ ((data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000).toFixed(8) }}</span> BTC |  {{ formatUSD(finalBalanceUSD) }}</span>
              </div>

              <div class="grid grid-cols-3 gap-3 mt-3">
                <div class="border border-gray-300 rounded-lg py-2 text-center mb-0 flex flex-col">
                  <!-- {{ data.chain_stats.funded_txo_sum }} satoshi -->
                  <strong class="text-xs text-orange-950">Total Received</strong>
                    <span class="text-md text-orange-950">{{ (data.chain_stats.funded_txo_sum / 100000000).toFixed(8) }} BTC</span> 
                </div>
              <div class="border border-gray-300 rounded-lg py-2 text-center flex flex-col">
                <strong class="text-xs text-orange-950">Transactions</strong>
                <span class="text-orange-950">{{ data.chain_stats.tx_count }}</span> 
              </div>
            
              <div class="border border-gray-300 rounded-lg py-2 text-center flex flex-col">
                <strong class="text-xs text-orange-950">Total Sent</strong>
                <span class="text-orange-950">{{ (data.chain_stats.spent_txo_sum / 100000000).toFixed(8) }} BTC</span> 
              </div>
            </div>
            </div>
          </div>

          <div class="flex gap-2 my-2 justify-end">
            <button
              @click="exportTxsToCSV(txs)"
              class="px-1 py-1 bg-slate-100 dark:bg-amber-400 rounded text-xs hover:bg-slate-500"
            >Export CSV</button>
            <button
              @click="exportTxsToJSON(txs)"
              class="px-1 py-1 bg-slate-100 dark:bg-amber-400 rounded text-xs hover:bg-slate-500"
            >Export JSON</button>
          </div>

          <hr class="my-4 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

          <h3 class="mt-6 text-orange-950">Latest Transactions</h3>
          <div v-if="isLoadingTxs">
            <div class="transactions-scroll">
              <ul class="text-start">
                <li v-for="n in 5" :key="n">
                  <div class="p-2 mb-2 bg-gray-700 rounded">
                    <div class="skeleton skeleton-line w-5/6 mb-1"></div>
                    <div class="skeleton skeleton-line w-2/3 mb-1"></div>
                    <div class="skeleton skeleton-line w-1/2 mb-1"></div>
                    <div class="skeleton skeleton-line w-1/2 mb-1"></div>
                    <div class="skeleton skeleton-line w-1/3 mb-1"></div>
                    <div class="skeleton skeleton-line w-1/3 mb-1"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div v-else-if="errorTxs">Error: {{ errorTxs.message }}</div>
          <div v-else class="transactions-scroll">
            <ul class="text-start">
              <PaginationTx :txs="txs" :perPages="3" v-slot="{tx}">
                <div class="p-2 mb-2 bg-gray-700 rounded">
                  <strong>TxID:</strong> <a :href="`https://blockstream.info/tx/${tx.txid}`" target="_blank" rel="noopener" class="no-underline text-blue-300">{{ tx.txid }}</a><br>
                  <strong>Confirmations:</strong> {{ tx.status.confirmed ? 'Confirm' : 'Deny' }}<br>
                  <strong>Received Time: </strong>
                  <span v-if="tx.status.block_time">
                     {{
                      new Date(tx.status.block_time * 1000).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })
                    }}
                  </span>
                    
                  <!-- <strong>Block Height:</strong> {{ tx.status.block_height || '-' }}<br> -->
                  <!-- <strong>Input Count:</strong> {{ tx.vin.length }}<br> -->
                  <!-- <strong>Input Addresses:</strong> -->
                  <!-- <ul>
                    <li v-for="(vin, idx) in tx.vin" :key="idx">
                      {{ vin.prevout?.scriptpubkey_address || '-' }}
                    </li>
                  </ul> -->
                  <!-- <strong>Output Count:</strong> {{ tx.vout.length }}<br> -->
                  <!-- <strong>Output Addresses:</strong> -->
                  <!-- <ul class="bg-slate-600 rounded">
                    <div class="p-2">
                      <li v-for="(vout, idx) in tx.vout" :key="idx" class="p-0">
                        {{ vout.scriptpubkey_address || '-' }}
                      </li>
                    </div>
                  </ul> -->


                  <!-- <strong>Total Output Value:</strong>
                  {{tx.vout.reduce((sum: number, vout: any) => sum + vout.value, 0)}} satoshi<br> -->
                  <!-- <strong>Total Input Value:</strong>
                  {{tx.vin.reduce((sum: number, vin: any) => sum + (vin.prevout?.value || 0), 0)}} satoshi<br> -->
                  <!-- <strong>Fee:</strong>
                  {{tx.vin.reduce((sum: number, vin: any) => sum + (vin.prevout?.value || 0), 0) - tx.vout.reduce((sum:
                    number, vout: any) => sum + vout.value, 0) }} satoshi -->
                </div>
              </PaginationTx>
            </ul>

             <transition name="fade">
              <div v-if="copyAlert" class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
                TxID copied!
              </div>
             </transition>
          </div>
        </div>
      </div>
      
    </template>
    <template #fallback>
      <div class="p-4 bg-slate-700 text-white rounded">Loading wallet info...</div>
    </template>
  </Suspense>
</template>

<style scoped>
.transactions-scroll {
  max-height: 400px;
  /* height: 100vh; */
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 8px;
}
.skeleton {
  background-color: #475569;
  border-radius: 4px;
  min-height: 1.2em;
  display: block;
  animation: pulse 1.5s infinite;
}
.skeleton-line {
  height: 1.2em;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  background-color: blueviolet;
}
h3 {
  margin-bottom: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
  word-break: break-all;
}
</style>