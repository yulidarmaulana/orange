<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{ walletAddress: string }>()

const fetchWalletData = async ({ queryKey }: { queryKey: any }) => {
  const [_key, address] = queryKey
  const res = await fetch(`https://blockstream.info/api/address/${address}`)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

const fetchWalletTxs = async ({ queryKey }: { queryKey: any }) => {
  const [_key, address] = queryKey
  const res = await fetch(`https://blockstream.info/api/address/${address}/txs`)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

const { data, isLoading, error } = useQuery({
  queryKey: ['walletData', props.walletAddress],
  queryFn: fetchWalletData,
  staleTime: 1000 * 60 * 5,
})

const {
  data: txs,
  isLoading: isLoadingTxs,
  error: errorTxs,
} = useQuery({
  queryKey: ['walletTxs', props.walletAddress],
  queryFn: fetchWalletTxs,
  staleTime: 1000 * 60 * 5,
})
</script>

<template>
  <div class="card">
    <h3>Bitcoin Wallet Info</h3>
    <div v-if="isLoading">Loading wallet data...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <ul>
        <li><strong>Address:</strong> {{ props.walletAddress }}</li>
        <li><strong>Number of Transactions:</strong> {{ data.chain_stats.tx_count }}</li>
        <li><strong>Total Received:</strong> {{ data.chain_stats.funded_txo_sum }} satoshi</li>
        <li><strong>Total Sent:</strong> {{ data.chain_stats.spent_txo_sum }} satoshi</li>
        <li>
          <strong>Final Balance:</strong>
          {{ data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum }} satoshi
        </li>
      </ul>
      <div>
        <h4>Recent Transactions</h4>
        <div v-if="isLoadingTxs">Loading transactions...</div>
        <div v-else-if="errorTxs">Error: {{ errorTxs.message }}</div>
        <ul v-else>
          <li v-for="tx in txs?.slice(0, 5)" :key="tx.txid">
            TxID: {{ tx.txid }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}
</style>