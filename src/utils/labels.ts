import { ref } from 'vue'

export interface WalletMetadata {
  label: string
  notes: string
}

const STORAGE_KEY = 'orange_wallet_metadata'

// Load initial state from localStorage
const getStoredMetadata = (): Record<string, WalletMetadata> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    console.error('Failed to parse wallet metadata from localStorage:', e)
    return {}
  }
}

// Reactive store for all metadata
export const walletMetadata = ref<Record<string, WalletMetadata>>(getStoredMetadata())

// Save or update metadata for a specific address
export const saveWalletMetadata = (address: string, label: string, notes: string) => {
  const trimmedLabel = label.trim()
  const trimmedNotes = notes.trim()
  
  if (!trimmedLabel && !trimmedNotes) {
    // If both are empty, clean up the address key to save storage space
    delete walletMetadata.value[address]
  } else {
    walletMetadata.value[address] = {
      label: trimmedLabel,
      notes: trimmedNotes,
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(walletMetadata.value))
}

// Retrieve metadata for a specific address
export const getWalletMetadata = (address: string): WalletMetadata => {
  return walletMetadata.value[address] || { label: '', notes: '' }
}
