export const fetchBTCRates = async (): Promise<Record<string, number>> => {
  const currencies = 'usd,eur,idr,jpy,gbp,aud,sgd'
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencies}`)
  if (!res.ok) throw new Error('Failed to fetch BTC rates')
  const data = await res.json()
  return data.bitcoin
}
