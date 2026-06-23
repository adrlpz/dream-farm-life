import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PublicKey } from '@solana/web3.js'

interface WalletState {
  // Wallet connection
  connected: boolean
  publicKey: string | null // base58 encoded
  balance: number // SOL balance

  // On-chain farm state
  farmPda: string | null
  dreamBalance: number
  nfts: NFTItem[]

  // Tx queue
  pendingTxs: PendingTx[]

  // Actions
  setConnected: (pubkey: string) => void
  setDisconnected: () => void
  setBalance: (balance: number) => void
  setFarmPda: (pda: string) => void
  setDreamBalance: (balance: number) => void
  setNfts: (nfts: NFTItem[]) => void
  addPendingTx: (tx: PendingTx) => void
  confirmTx: (signature: string) => void
  failTx: (signature: string, error: string) => void
}

export interface NFTItem {
  mint: string
  name: string
  image: string
  type: 'land' | 'animal' | 'building' | 'crop'
  attributes: Record<string, string>
}

export interface PendingTx {
  signature: string | null
  type: 'plant' | 'harvest' | 'mint_reward' | 'mint_nft' | 'settle_batch' | 'list_nft' | 'buy_nft'
  description: string
  status: 'pending' | 'confirming' | 'confirmed' | 'failed'
  error?: string
  createdAt: number
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      connected: false,
      publicKey: null,
      balance: 0,
      farmPda: null,
      dreamBalance: 0,
      nfts: [],
      pendingTxs: [],

      setConnected: (pubkey) => set({ connected: true, publicKey: pubkey }),
      setDisconnected: () => set({
        connected: false,
        publicKey: null,
        balance: 0,
        farmPda: null,
        dreamBalance: 0,
        nfts: [],
      }),
      setBalance: (balance) => set({ balance }),
      setFarmPda: (pda) => set({ farmPda: pda }),
      setDreamBalance: (balance) => set({ dreamBalance: balance }),
      setNfts: (nfts) => set({ nfts }),

      addPendingTx: (tx) => set((s) => ({
        pendingTxs: [...s.pendingTxs, tx],
      })),

      confirmTx: (signature) => set((s) => ({
        pendingTxs: s.pendingTxs.map((tx) =>
          tx.signature === signature
            ? { ...tx, status: 'confirmed' as const }
            : tx
        ),
      })),

      failTx: (signature, error) => set((s) => ({
        pendingTxs: s.pendingTxs.map((tx) =>
          tx.signature === signature
            ? { ...tx, status: 'failed' as const, error }
            : tx
        ),
      })),
    }),
    {
      name: 'dream-farm-wallet',
      partialize: (state) => ({
        farmPda: state.farmPda,
        nfts: state.nfts,
      }),
    }
  )
)
