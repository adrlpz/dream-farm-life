import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWalletStore } from '../../store/walletStore'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { balance } = useWalletStore()

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : ''

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58())
    }
  }

  const openExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`,
        '_blank'
      )
    }
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2 bg-green-900/30 border border-green-600/40 rounded-lg px-3 py-1.5 text-sm">
        <div className="flex flex-col items-end">
          <span className="text-green-400 font-mono text-xs">{shortAddress}</span>
          <span className="text-yellow-300 text-xs">◎ {balance.toFixed(4)} SOL</span>
        </div>
        <button
          onClick={copyAddress}
          className="p-1 hover:bg-white/10 rounded transition"
          title="Copy address"
        >
          <Copy size={14} className="text-gray-400" />
        </button>
        <button
          onClick={openExplorer}
          className="p-1 hover:bg-white/10 rounded transition"
          title="View on Explorer"
        >
          <ExternalLink size={14} className="text-gray-400" />
        </button>
        <button
          onClick={disconnect}
          className="p-1 hover:bg-red-500/20 rounded transition"
          title="Disconnect"
        >
          <LogOut size={14} className="text-red-400" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
    >
      <Wallet size={16} />
      Connect Wallet
    </button>
  )
}
