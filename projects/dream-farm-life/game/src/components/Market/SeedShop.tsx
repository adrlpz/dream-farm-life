import { CROPS_COMPAT as CROPS } from '../../types'
import { useGameStore } from '../../store/gameStore'
import { CropId } from '../../types'

export default function SeedShop() {
  const level = useGameStore((s) => s.player.level)
  const coins = useGameStore((s) => s.player.coins)
  const inventory = useGameStore((s) => s.inventory)

  const crops = Object.values(CROPS)

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-white text-center mb-3">🌱 Seed Shop</h2>

      <div className="grid grid-cols-2 gap-2">
        {crops.map((crop) => {
          const unlocked = level >= crop.unlockLevel
          const owned = inventory[crop.id as CropId] || 0

          return (
            <div
              key={crop.id}
              className={`card flex flex-col gap-1 ${
                !unlocked ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{crop.emoji}</span>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">{crop.name}</div>
                  <div className="text-green-400 text-xs">
                    {unlocked ? (
                      <>
                        ⏱ {(crop.growTimeMs / 60_000).toFixed(0)}min • 💰 {crop.sellPrice}🪙
                      </>
                    ) : (
                      <>🔒 Level {crop.unlockLevel}</>
                    )}
                  </div>
                </div>
              </div>

              {unlocked && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-300">Seed: {crop.seedCost} 🪙</span>
                  <span className="text-green-300">XP: +{crop.xp}</span>
                </div>
              )}

              {owned > 0 && (
                <div className="text-xs text-blue-300">In bag: {owned}</div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-center text-green-500 text-xs mt-4">
        Tap empty plot on farm to plant seeds
      </p>
    </div>
  )
}
