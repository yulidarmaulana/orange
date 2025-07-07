import { useQuery } from '@tanstack/vue-query'

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

export const useWalletData = (walletAddress: string) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['walletData', walletAddress],
    queryFn: fetchWalletData,
    staleTime: 1000 * 60 * 5,
    enabled: !!walletAddress, // penting agar query jalan saat address ada
  })

  const {
    data: txs,
    isLoading: isLoadingTxs,
    error: errorTxs,
  } = useQuery({
    queryKey: ['walletTxs', walletAddress],
    queryFn: fetchWalletTxs,
    staleTime: 1000 * 60 * 5,
    enabled: !!walletAddress,
  })

  return { data, txs, isLoading, isLoadingTxs, error, errorTxs }
}