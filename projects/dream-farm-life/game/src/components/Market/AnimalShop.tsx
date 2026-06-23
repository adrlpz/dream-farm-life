import { ANIMALS_COMPAT as ANIMALS } from '../../types'
import { useGameActions } from '../../hooks/useGameActions'
import { useGameStore } from '../../store/gameStore'
import { AnimalId, InventoryItem } from '../../types'

export default function AnimalShop() {
  const level = useGameStore((s) => s.player.level)
  const coins = useGameStore((s) => s.player.coins)
  const animals = useGameStore((s) => s.animals)
  const inventory = useGameStore((s) => s.inventory)
  const { buyAnimal, feedAnimal, collectProduct } = useGameActions()

  const animalDefs = Object.values(ANIMALS)

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-white text-center mb-3">🐄 Animals</h2>

      {/* My animals */}
      {animals.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-green-300 mb-2">My Animals ({animals.length})</h3>
          <div className="grid grid-cols-1 gap-2">
            {animals.map((animal, idx) => {
              const def = ANIMALS[animal.animalId]
              if (!def) return null

              const fed = !!animal.fedAt
              const canCollect = animal.lastProductAt
                ? Date.now() - animal.lastProductAt >= def.productionTimeMs
                : false
              const feedAvailable = (inventory[def.feedCropId as InventoryItem] || 0) >= def.feedAmount
              const progress = animal.lastProductAt
                ? Math.min(((Date.now() - animal.lastProductAt) / def.productionTimeMs) * 100, 100)
                : 0

              return (
                <div key={idx} className="card flex items-center gap-3">
                  <span className="text-3xl">
                    {animal.happiness >= 80 ? def.happyEmoji : def.emoji}
                  </span>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">
                      {def.name}
                      <span className="ml-2 text-xs text-pink-300">
                        {'❤️'.repeat(Math.ceil(animal.happiness / 20))}
                      </span>
                    </div>
                    <div className="text-xs text-green-400">
                      Feed: {def.feedAmount}x {def.emoji} • Makes: {def.productEmoji}
                    </div>
                    {fed && !canCollect && (
                      <div className="w-full h-1.5 bg-green-900 rounded-full mt-1">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {!fed ? (
                      <button
                        onClick={() => feedAnimal(idx)}
                        disabled={!feedAvailable}
                        className={`text-xs py-1 px-2 rounded ${
                          feedAvailable ? 'bg-yellow-600 text-white' : 'btn-disabled'
                        }`}
                      >
                        Feed
                      </button>
                    ) : canCollect ? (
                      <button
                        onClick={() => collectProduct(idx)}
                        className="text-xs py-1 px-2 rounded bg-green-600 text-white animate-pulse"
                      >
                        {def.productEmoji} Collect
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Growing...</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Buy animals */}
      <h3 className="text-sm font-bold text-green-300 mb-2">Buy Animals</h3>
      <div className="grid grid-cols-2 gap-2">
        {animalDefs.map((def) => {
          const unlocked = level >= def.unlockLevel
          const canAfford = coins >= def.buyPrice

          return (
            <div
              key={def.id}
              className={`card flex flex-col items-center gap-1 ${!unlocked ? 'opacity-50' : ''}`}
            >
              <span className="text-3xl">{def.emoji}</span>
              <div className="text-white font-bold text-sm">{def.name}</div>
              {unlocked ? (
                <>
                  <div className="text-xs text-green-400">
                    Feed: {def.feedAmount}x {CROP_EMOJI(def.feedCropId)}
                  </div>
                  <div className="text-xs text-yellow-300">{def.buyPrice} 🪙</div>
                  <button
                    onClick={() => buyAnimal(def.id as AnimalId)}
                    disabled={!canAfford}
                    className={`text-xs py-1 px-3 rounded mt-1 ${
                      canAfford ? 'btn-primary' : 'btn-disabled'
                    }`}
                  >
                    Buy
                  </button>
                </>
              ) : (
                <div className="text-xs text-gray-400">🔒 Level {def.unlockLevel}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CROP_EMOJI(cropId: string): string {
  const map: Record<string, string> = {
    wheat: '🌾',
    corn: '🌽',
    carrot: '🥕',
    tomato: '🍅',
    potato: '🥔',
    pumpkin: '🎃',
  }
  return map[cropId] || '🌱'
}
