import { useMemo, ReactNode } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter default styles
import '@solana/wallet-adapter-react-ui/styles.css'

// Use devnet for development, mainnet for production
const NETWORK = import.meta.env.VITE_SOLANA_NETWORK || 'devnet'
const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(NETWORK as any)

interface Props {
  children: ReactNode
}

export function SolanaWalletProvider({ children }: Props) {
  const endpoint = useMemo(() => RPC_URL, [])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
