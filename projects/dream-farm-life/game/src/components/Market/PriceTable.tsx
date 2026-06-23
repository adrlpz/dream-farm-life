import { CROPS_COMPAT as CROPS } from '../../types'
import { PRODUCTS } from '../../data/products'
import { ANIMALS_COMPAT as ANIMALS } from '../../types'
import { BUILDINGS, getBuildingCost } from '../../data/buildings'
import { CropDef, AnimalDef, ProductDef, BuildingDef } from '../../types'
import { useGameStore } from '../../store/gameStore'
import { useState } from 'react'

type Tab = 'crops' | 'animals' | 'products' | 'buildings'

export default function PriceTable({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('crops')
  const level = useGameStore((s) => s.player.level)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'crops', label: 'Crops', icon: '🌱' },
    { id: 'animals', label: 'Animals', icon: '🐄' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'buildings', label: 'Buildings', icon: '🏠' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-[85] p-4" onClick={onClose}>
      <div className="card max-w-md w-full max-h-[75vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-green-800/40">
          <h2 className="text-lg font-bold text-white">📊 Price Guide</h2>
          <button onClick={onClose} className="text-green-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex gap-1 px-4 py-2 border-b border-green-800/30">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                activeTab === t.id ? 'bg-green-700/50 text-white' : 'text-green-400 hover:text-green-200'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {activeTab === 'crops' && (
            <div className="space-y-1.5">
              {(Object.values(CROPS) as CropDef[]).map((crop) => {
                const unlocked = level >= crop.unlockLevel
                const profit = crop.sellPrice - crop.seedCost
                const roi = ((profit / crop.seedCost) * 100).toFixed(0)
                const growMin = Math.floor(crop.growTimeMs / 60000)
                const growSec = Math.floor((crop.growTimeMs % 60000) / 1000)
                const timeStr = growMin > 0 ? `${growMin}m${growSec > 0 ? `${growSec}s` : ''}` : `${growSec}s`

                return (
                  <div key={crop.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${unlocked ? 'bg-green-900/20 border-green-800/30' : 'bg-gray-900/30 border-gray-700/30'}`}>
                    <span className={`text-2xl ${unlocked ? '' : 'grayscale opacity-40'}`}>{crop.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-500'}`}>{crop.name}</span>
                        {!unlocked && <span className="text-[9px] bg-gray-700 text-gray-400 px-1 rounded">Lv{crop.unlockLevel}</span>}
                      </div>
                      <div className="flex gap-3 text-[10px] mt-0.5">
                        <span className="text-gray-400">Seed: 🪙{crop.seedCost}</span>
                        <span className="text-yellow-400">Sell: 🪙{crop.sellPrice}</span>
                        <span className={profit > 0 ? 'text-green-400' : 'text-red-400'}>Profit: 🪙{profit} ({roi}%)</span>
                      </div>
                      <div className="flex gap-3 text-[10px]">
                        <span className="text-blue-400">⏱️ {timeStr}</span>
                        <span className="text-purple-400">+{crop.xp} XP</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'animals' && (
            <div className="space-y-1.5">
              {(Object.values(ANIMALS) as AnimalDef[]).map((animal) => {
                const unlocked = level >= animal.unlockLevel
                const product = PRODUCTS[animal.productId]
                const prodMin = Math.floor(animal.productionTimeMs / 60000)

                return (
                  <div key={animal.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${unlocked ? 'bg-green-900/20 border-green-800/30' : 'bg-gray-900/30 border-gray-700/30'}`}>
                    <span className={`text-2xl ${unlocked ? '' : 'grayscale opacity-40'}`}>{animal.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-500'}`}>{animal.name}</span>
                        {!unlocked && <span className="text-[9px] bg-gray-700 text-gray-400 px-1 rounded">Lv{animal.unlockLevel}</span>}
                      </div>
                      <div className="flex gap-3 text-[10px] mt-0.5">
                        <span className="text-gray-400">Buy: 🪙{animal.buyPrice}</span>
                        <span className="text-yellow-400">Product: {product?.emoji} {product?.name} (🪙{product?.sellPrice})</span>
                      </div>
                      <div className="flex gap-3 text-[10px]">
                        <span className="text-blue-400">⏱️ Every {prodMin}min</span>
                        <span className="text-orange-400">Feed: {CROPS[animal.feedCropId]?.emoji} x{animal.feedAmount}</span>
                        <span className="text-purple-400">+{animal.xp} XP</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-1.5">
              {(Object.values(PRODUCTS) as ProductDef[]).map((product) => {
                const source = (Object.values(ANIMALS) as AnimalDef[]).find((a) => a.productId === product.id)
                return (
                  <div key={product.id} className="flex items-center gap-3 rounded-lg px-3 py-2 bg-green-900/20 border border-green-800/30">
                    <span className="text-2xl">{product.emoji}</span>
                    <div className="flex-1">
                      <span className="font-bold text-sm text-white">{product.name}</span>
                      <div className="flex gap-3 text-[10px] mt-0.5">
                        <span className="text-yellow-400">Sell: 🪙{product.sellPrice}</span>
                        {source && <span className="text-green-400">From: {source.emoji} {source.name}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'buildings' && (
            <div className="space-y-1.5">
              {(Object.values(BUILDINGS) as BuildingDef[]).map((building) => {
                const owned = useGameStore.getState().buildings.find((b) => b.buildingId === building.id)
                const cost = getBuildingCost(building.id, owned?.level || 0)

                return (
                  <div key={building.id} className="flex items-center gap-3 rounded-lg px-3 py-2 bg-green-900/20 border border-green-800/30">
                    <span className="text-2xl">{building.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{building.name}</span>
                        {owned && <span className="text-[9px] bg-green-700 text-green-200 px-1 rounded">Lv{owned.level}</span>}
                      </div>
                      <p className="text-[10px] text-green-400">{building.description}</p>
                      <div className="flex gap-3 text-[10px] mt-0.5">
                        <span className="text-yellow-400">{owned ? 'Upgrade' : 'Buy'}: 🪙{cost}</span>
                        <span className="text-gray-400">Max Lv{building.maxLevel}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
