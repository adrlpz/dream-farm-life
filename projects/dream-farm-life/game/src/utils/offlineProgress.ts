import { GameState, Plot, PlacedAnimal } from '../types'
import { CROPS } from '../data/crops'
import { ANIMALS } from '../data/animals'

const STAGE_COUNT = 4 // seed, sprout, mature, harvestable

export function calculateOfflineProgress(state: GameState): {
  updatedState: Partial<GameState>
  offlineHarvests: number
  offlineProducts: { animalId: string; count: number }[]
  offlineMs: number
} {
  const now = Date.now()
  const offlineMs = now - state.lastOnline

  // Minimum 10 seconds offline to process
  if (offlineMs < 10_000) {
    return { updatedState: {}, offlineHarvests: 0, offlineProducts: [], offlineMs: 0 }
  }

  let offlineHarvests = 0
  const offlineProducts: { animalId: string; count: number }[] = []

  // Process crop growth
  const updatedPlots = state.plots.map((plot) => {
    if (!plot.crop) return plot

    const cropDef = CROPS[plot.crop.cropId]
    if (!cropDef) return plot

    const timePerStage = cropDef.growTimeMs / (STAGE_COUNT - 1)
    const elapsed = now - plot.crop.plantedAt
    const totalStages = Math.floor(elapsed / timePerStage)
    const finalStage = Math.min(totalStages, STAGE_COUNT - 1)

    if (finalStage !== plot.crop.stage) {
      return {
        ...plot,
        state: finalStage >= STAGE_COUNT - 1 ? 'harvestable' as const : 'planted' as const,
        crop: {
          ...plot.crop,
          stage: finalStage,
        },
      }
    }
    return plot
  })

  // Process animal production
  const updatedAnimals = state.animals.map((animal, idx) => {
    const animalDef = ANIMALS[animal.animalId]
    if (!animalDef) return animal

    if (animal.fedAt && animal.lastProductAt) {
      const timeSinceProduct = now - animal.lastProductAt
      const productionCount = Math.floor(timeSinceProduct / animalDef.productionTimeMs)

      if (productionCount > 0) {
        offlineProducts.push({ animalId: animal.animalId, count: productionCount })
        return {
          ...animal,
          lastProductAt: animal.lastProductAt + productionCount * animalDef.productionTimeMs,
          happiness: Math.max(0, animal.happiness - productionCount * 5),
        }
      }
    }
    return animal
  })

  return {
    updatedState: {
      plots: updatedPlots as Plot[],
      animals: updatedAnimals as PlacedAnimal[],
      lastOnline: now,
    },
    offlineHarvests,
    offlineProducts,
    offlineMs,
  }
}
