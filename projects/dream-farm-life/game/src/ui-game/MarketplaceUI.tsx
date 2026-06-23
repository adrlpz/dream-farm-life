// MarketplaceUI.tsx — Buy/sell items with $DREAM
import { MARKETPLACE_PRICES, type TokenPrice } from '../solana/token'
import type { WalletState } from '../solana/wallet'

interface MarketplaceUIProps {
  wallet: WalletState
  inventory: { itemId: string; count: number }[]
  onBuy: (itemId: string) => void
  onSell: (itemId: string) => void
  onClose: () => void
}

const ITEM_EMOJIS: Record<string, string> = {
  seed_wheat: '🌾', seed_carrot: '🥕', seed_tomato: '🍅', seed_strawberry: '🍓', seed_orchid: '🌸',
  tool_axe_stone: '🪓', tool_pickaxe_stone: '⛏️', tool_axe_iron: '🪓', tool_pickaxe_iron: '⛏️', tool_axe_gold: '🪓',
  ancient_coin: '🪙', crystal_shard: '💎', star_fragment: '⭐',
  mat_wood: '🪵', mat_stone: '🪨', mat_iron: '🔩', mat_gold: '🥇',
}

export function MarketplaceUI({ wallet, inventory, onBuy, onSell, onClose }: MarketplaceUIProps) {
  const categories = ['Seeds', 'Tools', 'Rare Items', 'Materials']

  const getCategoryItems = (cat: string): TokenPrice[] => {
    switch (cat) {
      case 'Seeds': return MARKETPLACE_PRICES.filter(p => p.item.startsWith('seed_'))
      case 'Tools': return MARKETPLACE_PRICES.filter(p => p.item.startsWith('tool_'))
      case 'Rare Items': return MARKETPLACE_PRICES.filter(p => p.item.startsWith('ancient_') || p.item.startsWith('crystal_') || p.item.startsWith('star_'))
      case 'Materials': return MARKETPLACE_PRICES.filter(p => p.item.startsWith('mat_'))
      default: return []
    }
  }

  const getInventoryCount = (itemId: string): number => {
    return inventory.find(i => i.itemId === itemId)?.count ?? 0
  }

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">🏪 Marketplace</h2>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 text-sm font-mono">{wallet.dreamBalance.toFixed(2)} 🌟</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer">✕</button>
          </div>
        </div>

        {!wallet.connected ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-gray-400">Connect wallet to access marketplace</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {categories.map(cat => (
              <div key={cat}>
                <h3 className="text-gray-400 text-xs uppercase font-bold mb-2">{cat}</h3>
                <div className="space-y-1.5">
                  {getCategoryItems(cat).map(item => {
                    const owned = getInventoryCount(item.item)
                    const canBuy = wallet.dreamBalance >= item.dreamPrice
                    return (
                      <div key={item.item} className="bg-gray-800/50 rounded-lg px-3 py-2 flex items-center gap-3">
                        <span className="text-lg">{ITEM_EMOJIS[item.item] ?? '📦'}</span>
                        <div className="flex-1">
                          <span className="text-white text-sm">{item.item.replace(/_/g, ' ')}</span>
                          {owned > 0 && <span className="text-gray-500 text-xs ml-2">(x{owned})</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm font-mono">{item.dreamPrice} 🌟</span>
                          <button
                            onClick={() => onBuy(item.item)}
                            disabled={!canBuy}
                            className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition ${
                              canBuy ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 text-gray-500'
                            }`}
                          >
                            Buy
                          </button>
                          {owned > 0 && (
                            <button
                              onClick={() => onSell(item.item)}
                              className="px-2 py-1 rounded text-xs font-bold cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition"
                            >
                              Sell
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
