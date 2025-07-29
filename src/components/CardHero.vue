<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { fetchWalletData, fetchWalletTxs, fetchBTCtoUSD } from '../api/blockstream';
import PaginationTx from './PaginationTx.vue';
import Qrcode from 'qrcode.vue';
import ModalTransaction from './ModalTransaction.vue';
import { FileDown, FileJson, Copy, ExternalLink } from 'lucide-vue-next';

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

// formatter BTC
const formatBTC = (satoshi: number): string => {
  return (satoshi / 100000000).toFixed(8)
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

// Calculate transaction totals
function getTxInputTotal(tx: any): number {
  return tx.vin?.reduce((sum: number, input: any) => sum + (input.prevout?.value || 0), 0) || 0
}

function getTxOutputTotal(tx: any): number {
  return tx.vout?.reduce((sum: number, output: any) => sum + output.value, 0) || 0
}

function getTxFee(tx: any): number {
  return getTxInputTotal(tx) - getTxOutputTotal(tx)
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

          <div class="flex flex-col md:flex-row gap-2">
            <div class="">
              <div class="flex justify-center p-2 border border-gray-300 rounded-lg">
              <Qrcode :value="props.walletAddress" :size="120" class="rounded-lg shadow-md" />
              </div>
            </div>

            <div class="basis-full">
                <div class="border border-gray-300 rounded-lg p-2 flex flex-col text-start">
                  <strong class="text-orange-950">Final Balance </strong> <span class="text-orange-950"> <span class="text-orange-500 font-bold">{{ ((data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000).toFixed(8) }}</span> BTC |  {{ formatUSD(finalBalanceUSD) }}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div class="border border-gray-300 rounded-lg py-2 text-center mb-0 flex flex-col">
                    <strong class="text-xs text-orange-950">Total Received</strong>
                      <span class="text-md text-orange-950 px-2">{{ (data.chain_stats.funded_txo_sum / 100000000).toFixed(8) }} BTC</span> 
                  </div>
                  <div class="border border-gray-300 rounded-lg py-2 text-center flex flex-col">
                    <strong class="text-xs text-orange-950">Transactions</strong>
                    <span class="text-orange-950 px-2">{{ data.chain_stats.tx_count }}</span> 
                  </div>
              
                  <div class="border border-gray-300 rounded-lg py-2 text-center flex flex-col">
                    <strong class="text-xs text-orange-950">Total Sent</strong>
                    <span class="text-orange-950 px-2">{{ (data.chain_stats.spent_txo_sum / 100000000).toFixed(8) }} BTC</span> 
                  </div>
          </div>
            </div>
          
          </div>

          

          <div class="flex gap-2 my-2 justify-start">
            <button
              @click="exportTxsToCSV(txs)"
              class="px-3 py-2 text-xs font-medium text-center flex gap-1 items-center align-middle text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
            <FileDown :size="16" />
            Export CSV
            </button>
            <button
              @click="exportTxsToJSON(txs)"
              class="px-3 py-2 text-xs font-medium text-center flex gap-1 text-white bg-yellow-700 rounded-lg hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
            >
            <FileJson :size="16" />
            Export JSON
          </button>
          </div>

          <hr class="my-4 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

          <h3 class="mt-6 text-orange-950 text-start">Latest Transactions</h3>
          <div v-if="isLoadingTxs">
            <div class="transactions-scroll">
              <ul class="text-start">
                <li v-for="n in 5" :key="n">
                  <div class="p-2 mb-2 bg-slate-200 rounded">
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
              <PaginationTx :txs="txs" :perPages="5" v-slot="{tx}">
                <div class="p-2 mb-2 bg-slate-100 rounded-md">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <strong class="text-orange-950">TxID:</strong> 
                      <a :href="`https://blockstream.info/tx/${tx.txid}`" target="_blank" rel="noopener" class="no-underline text-blue-600 hover:text-blue-800">
                        {{ tx.txid.substring(0, 30) }}...
                      </a>
                    </div>
                  </div>
                  
                  <strong class="text-orange-950">Status:</strong> 
                  <span :class="tx.status.confirmed ? 'text-green-600' : 'text-orange-600'">
                    {{ tx.status.confirmed ? 'Confirmed' : 'Unconfirmed' }}
                  </span><br>
                  
                  <div class="flex">
                    <strong class="text-orange-950">Time: </strong>
                      <span class="text-orange-900 ms-1" v-if="tx.status.block_time">
                      {{
                        new Date(tx.status.block_time * 1000).toLocaleString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      }}
                      </span>
                    <span v-else class="text-gray-500">Pending</span>
                    <!-- <span v-if="tx.status.block_size" class="text-orange-900 ms-1">{{ tx.status.block_size }} bytes</span> -->
                  </div>
                  

                   <!-- Modal Component Integration -->
                    <ModalTransaction>
                      <!-- Content inside modal -->
                      <div class="space-y-4">
                        <!-- Basic Info -->
                        <div class="border-b pb-4">
                          <div class="mb-2">
                            <span class="text-sm font-medium text-gray-700">Transaction ID:</span>
                            <div class="flex items-center gap-2 mt-1">
                              <code class="text-xs bg-gray-100 p-2 rounded font-mono break-all w-full">{{ tx.txid }}</code>
                              <button @click="copyToClipboard(tx.txid, true)" class="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                                <Copy :size="16" class="text-gray-600" />
                              </button>
                            </div>
                          </div>
                          
                          <div class="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span class="font-medium text-gray-700">Status:</span>
                              <span :class="tx.status.confirmed ? 'text-green-600' : 'text-orange-600'" class="ml-2">
                                {{ tx.status.confirmed ? 'Confirmed' : 'Unconfirmed' }}
                              </span>
                            </div>

                            <div v-if="tx.status.block_height">
                              <span class="font-medium text-gray-700">Block:</span>
                              <span class="ml-2">{{ tx.status.block_height.toLocaleString() }}</span>
                            </div>

                            <div v-if="tx.size">
                              <span class="font-medium text-gray-700">Size:</span>
                              <span class="ml-2">{{ tx.size }} bytes</span>
                            </div>
                          </div>

                          <div class="" v-if="tx.version">
                            <span class="font-medium text-gray-700">Version:</span>
                            <span class="ml-1">{{ tx.version }}</span>
                          </div>

                          <div v-if="tx.status.block_time" class="text-sm mt-2">
                            <span class="font-medium text-gray-700">Time:</span>
                            <span class="ml-1">{{ new Date(tx.status.block_time * 1000).toLocaleString() }}</span>
                          </div>

                          <div v-if="tx.weight" class="text-sm mt-2">
                            <span class="font-medium text-gray-700">Weight:</span>
                            <span class="ml-1">{{ tx.weight }} Units</span>
                          </div>

                          <!-- <div v-if="tx.status.block_hash" class="text-sm mt-2">
                            <span class="font-medium text-gray-700">Block Hash:</span>
                            <span class="ml-1">{{ tx.status.block_hash }}</span>
                          </div> -->
                        </div>

                        <!-- Transaction Summary -->
                        <div class="grid grid-cols-3 gap-3">
                          <div class="bg-blue-50 p-3 rounded text-center">
                            <div class="text-xs text-blue-600 font-medium">Input</div>
                            <div class="text-sm font-bold">{{ formatBTC(getTxInputTotal(tx)) }} BTC</div>
                          </div>
                          <div class="bg-green-50 p-3 rounded text-center">
                            <div class="text-xs text-green-600 font-medium">Output</div>
                            <div class="text-sm font-bold text-green-800">{{ formatBTC(getTxOutputTotal(tx)) }} BTC</div>
                          </div>
                          <div class="bg-orange-50 p-3 rounded text-center">
                            <div class="text-xs text-orange-600 font-medium">Fee</div>
                            <div class="text-sm font-bold text-orange-800">{{ formatBTC(getTxFee(tx)) }} BTC</div>
                          </div>
                        </div>

                        <!-- Inputs -->
                        <div v-if="tx.vin && tx.vin.length > 0">
                          <h4 class="font-medium text-gray-900 mb-2">Inputs ({{ tx.vin.length }})</h4>
                          <div class="max-h-32 overflow-y-auto space-y-2">
                            <div v-for="(input, index) in tx.vin.slice(0, 3)" :key="index" class="bg-gray-50 p-2 rounded text-xs">
                              <div class="font-mono break-all">{{ input.txid }}:{{ input.vout }}</div>
                              <div v-if="input.prevout" class="mt-1">
                                <div class="text-gray-600">{{ input.prevout.scriptpubkey_address || 'N/A' }}</div>
                                  <div class="font-medium">{{ formatBTC(input.prevout.value) }} BTC | <span class="text-gray-500">{{ formatUSD(input.prevout.value / 100000000 * (btcToUsdRate || 0)) }}</span></div>
                              </div>
                            </div>
                            <div v-if="tx.vin.length > 3" class="text-xs text-gray-500 text-center">
                              ... and {{ tx.vin.length - 3 }} more inputs
                            </div>
                          </div>
                        </div>

                        <!-- Outputs -->
                        <div v-if="tx.vout && tx.vout.length > 0">
                          <h4 class="font-medium text-gray-900 mb-2">Outputs ({{ tx.vout.length }})</h4>
                          <div class="max-h-32 overflow-y-auto space-y-2">
                            <div v-for="(output, index) in tx.vout.slice(0, 3)" :key="index" class="bg-gray-50 p-2 rounded text-xs">
                              <div class="flex justify-between items-start">
                                <div class="flex-1">
                                  <div class="font-mono break-all">{{ output.scriptpubkey_address || 'N/A' }}</div>
                                  <div class="text-gray-600">{{ output.scriptpubkey_type || 'Unknown' }}</div>
                                </div>
                                <div class="text-right ml-2">
                                  <div class="font-medium"><span class="text-orange-500">{{ formatBTC(output.value) }}</span> BTC</div>
                                  <div class="text-gray-500">{{ formatUSD(output.value / 100000000 * (btcToUsdRate || 0)) }}</div>
                                </div>
                              </div>
                            </div>
                            <div v-if="tx.vout.length > 3" class="text-xs text-gray-500 text-center">
                              ... and {{ tx.vout.length - 3 }} more outputs
                            </div>
                          </div>
                        </div>

                        <!-- External Link -->
                        <div class="pt-4 border-t">
                          <a :href="`https://blockstream.info/tx/${tx.txid}`" target="_blank" 
                             class="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 text-sm">
                            <ExternalLink :size="16" />
                            View on Blockstream Explorer
                          </a>
                        </div>
                      </div>
                    </ModalTransaction>
                </div>
              </PaginationTx>
            </ul>

             <transition name="fade">
              <div v-if="copyAlert" class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
                Copied to clipboard!
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
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