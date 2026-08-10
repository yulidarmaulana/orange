export const fetchWalletData = async ({ queryKey }: { queryKey: any }) => {
  const [_key, address] = queryKey
  const res = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`)
  if (!res.ok) throw new Error('Network response was not ok')
  const data = await res.json()
  
  // Map Blockcypher balance response to Blockstream Esplora response structure
  return {
    address: data.address,
    chain_stats: {
      funded_txo_sum: data.total_received,
      spent_txo_sum: data.total_sent,
      tx_count: data.n_tx,
    },
  }
}

export const fetchWalletTxs = async ({ queryKey }: { queryKey: any }) => {
  const [_key, address] = queryKey
  // Retrieve the 50 most recent transactions
  const res = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=50`)
  if (!res.ok) throw new Error('Network response was not ok')
  const data = await res.json()
  
  const txs = data.txs || []
  
  // Map Blockcypher txs to Blockstream structure
  return txs.map((tx: any) => {
    return {
      txid: tx.hash,
      version: tx.ver,
      size: tx.size,
      weight: tx.vsize ? tx.vsize * 4 : tx.size * 4,
      fee: tx.fees,
      status: {
        confirmed: tx.confirmations > 0,
        block_height: tx.block_height,
        block_hash: tx.block_hash,
        block_time: tx.confirmed ? Math.floor(new Date(tx.confirmed).getTime() / 1000) : null,
      },
      vin: (tx.inputs || []).map((input: any) => ({
        txid: input.prev_hash,
        vout: input.output_index,
        prevout: {
          scriptpubkey_address: input.addresses?.[0] || 'N/A',
          scriptpubkey_type: input.script_type || 'Unknown',
          value: input.output_value || 0,
        },
      })),
      vout: (tx.outputs || []).map((output: any) => ({
        scriptpubkey_address: output.addresses?.[0] || 'N/A',
        scriptpubkey_type: output.script_type || 'Unknown',
        value: output.value || 0,
      })),
    }
  })
}