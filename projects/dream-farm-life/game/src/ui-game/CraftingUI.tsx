// CraftingUI.tsx — Crafting menu with workstation tabs
import { useState } from 'react'
import { RECIPES, canCraft, type RecipeDef } from '../data/recipes'
import { ITEMS } from '../data/items'
import type { InventorySlot } from '../engine/types'

interface CraftingUIProps {
  inventory: InventorySlot[]
  farmingLevel: number
  onCraft: (recipeId: string) => void
  onClose: () => void
}

const WORKSTATIONS = [
  { id: 'workbench', name: 'Workbench', emoji: '🔨', unlockLevel: 1 },
  { id: 'kitchen', name: 'Kitchen', emoji: '🍳', unlockLevel: 5 },
  { id: 'forge', name: 'Forge', emoji: '🔥', unlockLevel: 10 },
  { id: 'loom', name: 'Loom', emoji: '🧵', unlockLevel: 12 },
  { id: 'alchemy', name: 'Alchemy Lab', emoji: '🧪', unlockLevel: 15 },
]

export function CraftingUI({ inventory, farmingLevel, onCraft, onClose }: CraftingUIProps) {
  const [activeWs, setActiveWs] = useState('workbench')

  const recipes = Object.values(RECIPES).filter(r =>
    r.workstation === activeWs && r.unlockLevel <= farmingLevel
  )

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-4 w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-lg font-bold">⚒️ Crafting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Workstation tabs */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
          {WORKSTATIONS.map(ws => {
            const unlocked = ws.unlockLevel <= farmingLevel
            return (
              <button
                key={ws.id}
                onClick={() => unlocked && setActiveWs(ws.id)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeWs === ws.id
                    ? 'bg-green-700 text-white'
                    : unlocked
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                }`}
              >
                {ws.emoji} {ws.name}
                {!unlocked && <span className="text-xs ml-1">🔒</span>}
              </button>
            )
          })}
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {recipes.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No recipes available at this workstation</p>
          )}
          {recipes.map(recipe => {
            const craftable = canCraft(recipe, inventory)
            return (
              <div key={recipe.id} className={`bg-gray-800 rounded-lg p-3 ${craftable ? 'border border-gray-600' : 'opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{recipe.emoji}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{recipe.name}</div>
                      <div className="text-gray-400 text-xs">{recipe.description}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onCraft(recipe.id)}
                    disabled={!craftable}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      craftable
                        ? 'bg-green-700 hover:bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Craft
                  </button>
                </div>

                {/* Ingredients */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {recipe.ingredients.map((ing, i) => {
                    const item = ITEMS[ing.itemId]
                    const have = inventory.find(s => s.itemId === ing.itemId)?.count ?? 0
                    const enough = have >= ing.count
                    return (
                      <span
                        key={i}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          enough ? 'bg-gray-700 text-gray-300' : 'bg-red-900/50 text-red-300'
                        }`}
                      >
                        {item?.emoji ?? '?'} {have}/{ing.count}
                      </span>
                    )
                  })}
                </div>

                {/* Output */}
                <div className="text-gray-500 text-xs mt-1.5">
                  → {recipe.outputCount}x {ITEMS[recipe.outputId]?.name ?? recipe.name}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-2 text-gray-500 text-xs text-center">Press [C] or [Esc] to close</div>
      </div>
    </div>
  )
}
