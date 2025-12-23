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

export const fetchBTCRates = async (): Promise<Record<string, number>> => {
  const currencies = 'usd,eur,idr,jpy,gbp,aud,cad,sgd,myr,thb'
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencies}`)
  if (!res.ok) throw new Error('Failed to fetch BTC rates')
  const data = await res.json()
  return data.bitcoin
}