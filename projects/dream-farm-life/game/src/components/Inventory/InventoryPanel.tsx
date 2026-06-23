import { useGameActions } from '../../hooks/useGameActions'
import { useGameStore } from '../../store/gameStore'
import { CROPS_COMPAT as CROPS } from '../../types'
import { PRODUCTS } from '../../data/products'
import { InventoryItem } from '../../types'

export default function InventoryPanel() {
  const inventory = useGameStore((s) => s.inventory)
  const { sellItem } = useGameActions()

  const items = Object.entries(inventory).filter(([_, count]) => count > 0) as [InventoryItem, number][]

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <span className="text-5xl">🎒</span>
        <p className="text-green-400 mt-3">Your bag is empty!</p>
        <p className="text-green-500 text-xs mt-1">Harvest crops or collect animal products</p>
      </div>
    )
  }

  const getItemInfo = (id: InventoryItem) => {
    if (CROPS[id]) {
      return {
        emoji: CROPS[id].emoji,
        name: CROPS[id].name,
        sellPrice: CROPS[id].sellPrice,
        type: 'crop' as const,
      }
    }
    if (PRODUCTS[id]) {
      return {
        emoji: PRODUCTS[id].emoji,
        name: PRODUCTS[id].name,
        sellPrice: PRODUCTS[id].sellPrice,
        type: 'product' as const,
      }
    }
    return null
  }

  const totalValue = items.reduce((sum, [id, count]) => {
    const info = getItemInfo(id)
    return sum + (info ? info.sellPrice * count : 0)
  }, 0)

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">🎒 Bag</h2>
        <div className="text-sm text-yellow-300">Total: {totalValue} 🪙</div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {items.map(([id, count]) => {
          const info = getItemInfo(id)
          if (!info) return null

          return (
            <div key={id} className="card flex items-center gap-3">
              <span className="text-2xl">{info.emoji}</span>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">{info.name}</div>
                <div className="text-green-400 text-xs">
                  x{count} • {info.sellPrice} 🪙 each
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => sellItem(id, 1)}
                  className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-2 rounded"
                >
                  Sell 1
                </button>
                {count > 1 && (
                  <button
                    onClick={() => sellItem(id, count)}
                    className="text-xs bg-yellow-700 hover:bg-yellow-600 text-white py-1 px-2 rounded"
                  >
                    All
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sell all button */}
      <button
        onClick={() => items.forEach(([id, count]) => sellItem(id, count))}
        className="btn-primary w-full mt-3"
      >
        💰 Sell Everything ({totalValue} 🪙)
      </button>
    </div>
  )
}
