export const fetchBTCRates = async (): Promise<Record<string, number>> => {
  const currencies = 'usd,eur,idr,jpy,gbp,aud,sgd'
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencies}`)
  if (!res.ok) throw new Error('Failed to fetch BTC rates')
  const data = await res.json()
  return data.bitcoin
}


export interface BTCSnapshot {
  price: number
  marketCap: number
  ath: number
  athChangePct: number
  athDate: string
  blockHeight: number
}

export const fetchBTCChart24h = async (): Promise<number[]> => {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1')
  if (!res.ok) throw new Error('Failed to fetch BTC chart')
  const data = await res.json()
  return (data.prices as [number, number][]).map(([, price]) => price)
}

export const fetchBTCSnapshot =async (): Promise<BTCSnapshot> => {
  const [coinRes, heightRes] = await Promise.all([
    fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false'),
    fetch('https://blockstream.info/api/blocks/tip/height'),
  ])
  if (!coinRes.ok) throw new Error('Failed to fetch BTC snapshot')
  if (!heightRes.ok) throw new Error('Failed to fetch block height')
  const coin = (await coinRes.json()).market_data
  return {
    price: coin.current_price.usd,
    marketCap: coin.market_cap.usd,
    ath: coin.ath.usd,
    athChangePct: coin.ath_change_percentage.usd,
    athDate: coin.ath_date.usd,
    blockHeight: Number(await heightRes.text()),
  }
}
