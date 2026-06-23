// InventoryPanel.tsx — Full inventory overlay
import { ITEMS } from '../data/items'
import type { InventorySlot } from '../engine/types'

interface InventoryPanelProps {
  inventory: InventorySlot[]
  onClose: () => void
}

export function InventoryPanel({ inventory, onClose }: InventoryPanelProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-4 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-lg font-bold">🎒 Inventory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="grid grid-cols-6 gap-2 max-h-80 overflow-y-auto">
          {inventory.map((slot, i) => {
            const item = ITEMS[slot.itemId]
            if (!item) return null
            return (
              <div
                key={`${slot.itemId}-${i}`}
                className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors cursor-default"
                title={`${item.name}\n${item.description}\n${item.rarity}`}
              >
                <span className="text-xl">{item.emoji}</span>
                {slot.count > 1 && (
                  <span className="text-white/70 text-xs mt-0.5">{slot.count}</span>
                )}
              </div>
            )
          })}
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 24 - inventory.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-800/50 rounded-lg p-2 h-12" />
          ))}
        </div>

        <div className="mt-3 text-gray-500 text-xs text-center">
          Press [I] or [Tab] to close
        </div>
      </div>
    </div>
  )
}
