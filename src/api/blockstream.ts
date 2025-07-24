export const fetchWalletData = async ({ queryKey }: { queryKey: any }) => {
  const [_key, address] = queryKey
  const res = await fetch(`https://blockstream.info/api/address/${address}`)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export const fetchWalletTxs = async ({ queryKey }: { queryKey: any }) => {
  const [_key, address] = queryKey
  const res = await fetch(`https://blockstream.info/api/address/${address}/txs`)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export const fetchBTCtoUSD = async (): Promise<number> => {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
  if (!res.ok) throw new Error('Failed to fetch BTC to USD rate')
  const data = await res.json()
  return data.bitcoin.usd
}