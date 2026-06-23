// WalletUI.tsx — Wallet connect/disconnect + balance display
import type { WalletState } from '../solana/wallet'

interface WalletUIProps {
  wallet: WalletState
  onConnect: () => void
  onDisconnect: () => void
  onClose: () => void
}

export function WalletUI({ wallet, onConnect, onDisconnect, onClose }: WalletUIProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">⛓️ Wallet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {wallet.connected ? (
            <>
              {/* Connected state */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-mono text-sm">
                  {wallet.publicKey?.slice(0, 6)}...{wallet.publicKey?.slice(-4)}
                </span>
              </div>

              {/* Balances */}
              <div className="space-y-2">
                <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-gray-400">SOL Balance</span>
                  <span className="text-white font-bold">{wallet.balance.toFixed(4)} ◎</span>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-yellow-400">$DREAM Balance</span>
                  <span className="text-yellow-400 font-bold">{wallet.dreamBalance.toFixed(2)} 🌟</span>
                </div>
              </div>

              <button
                onClick={onDisconnect}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl cursor-pointer transition"
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              {/* Disconnected state */}
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🔗</div>
                <p className="text-gray-400 mb-4">Connect your Solana wallet to access on-chain features</p>
                <button
                  onClick={onConnect}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl cursor-pointer transition"
                >
                  Connect Phantom Wallet
                </button>
              </div>
              <p className="text-gray-600 text-xs text-center">
                Earn $DREAM tokens by playing · Trade items on marketplace
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
