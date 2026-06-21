import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { GameState, Plot, PlacedAnimal, PlacedBuilding, CropId, AnimalId, InventoryItem } from '../types'
import { CROPS } from '../data/crops'
import { ANIMALS } from '../data/animals'
import { PRODUCTS } from '../data/products'
import { BUILDINGS, getBuildingCost } from '../data/buildings'
import { xpForLevel, DAILY_BONUS_BASE } from '../data/levels'
import { calculateOfflineProgress } from '../utils/offlineProgress'

const INITIAL_GRID_SIZE = 4 // 4x4 = 16 plots
const MAX_GRID_SIZE = 8

function createInitialPlots(size: number): Plot[] {
  const plots: Plot[] = []
  for (let i = 0; i < size * size; i++) {
    // First 4 plots are unlocked for free
    plots.push({
      id: i,
      state: i < 4 ? 'empty' : 'locked',
      crop: null,
    })
  }
  return plots
}

function getInitialState(): GameState {
  return {
    player: { level: 1, xp: 0, xpToNext: 50, coins: 100, gems: 5 },
    plots: createInitialPlots(INITIAL_GRID_SIZE),
    animals: [],
    buildings: [],
    inventory: {},
    gridSize: INITIAL_GRID_SIZE,
    lastOnline: Date.now(),
    totalHarvests: 0,
    totalEarned: 0,
    day: 1,
    achievements: [],
  }
}

interface GameActions {
  // Crop actions
  plantCrop: (plotId: number, cropId: CropId) => boolean
  harvestCrop: (plotId: number) => boolean
  waterCrop: (plotId: number) => void

  // Animal actions
  buyAnimal: (animalId: AnimalId) => boolean
  feedAnimal: (animalIndex: number) => boolean
  collectProduct: (animalIndex: number) => boolean

  // Building actions
  buyBuilding: (buildingId: string) => boolean
  upgradeBuilding: (buildingIndex: number) => boolean

  // Economy
  unlockPlot: (plotId: number) => boolean
  expandGrid: () => boolean

  // Inventory
  addItem: (item: InventoryItem, amount: number) => void
  removeItem: (item: InventoryItem, amount: number) => boolean
  sellItem: (item: InventoryItem, amount: number) => boolean

  // Progression
  addXp: (amount: number) => void
  claimDailyBonus: () => boolean

  // System
  processOfflineProgress: () => { offlineMs: number; products: { animalId: string; count: number }[] }
  resetGame: () => void
  tick: () => void // update crop stages
}

export type GameStore = GameState & GameActions

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      ...getInitialState(),

      // ─── CROP ACTIONS ───
      plantCrop: (plotId, cropId) => {
        const state = get()
        const cropDef = CROPS[cropId]
        if (!cropDef) return false

        const plot = state.plots[plotId]
        if (!plot || plot.state !== 'empty') return false

        if (state.player.level < cropDef.unlockLevel) return false
        if (state.player.coins < cropDef.seedCost) return false

        set((s) => {
          s.player.coins -= cropDef.seedCost
          s.plots[plotId].state = 'planted'
          s.plots[plotId].crop = {
            cropId,
            plantedAt: Date.now(),
            stage: 0,
            watered: false,
          }
        })
        return true
      },

      harvestCrop: (plotId) => {
        const state = get()
        const plot = state.plots[plotId]
        if (!plot || plot.state !== 'harvestable' || !plot.crop) return false

        const cropDef = CROPS[plot.crop.cropId]
        if (!cropDef) return false

        set((s) => {
          s.plots[plotId].state = 'empty'
          s.plots[plotId].crop = null

          // Add to inventory
          const inv = s.inventory as Record<string, number>
          inv[plot.crop!.cropId] = (inv[plot.crop!.cropId] || 0) + 1

          s.totalHarvests += 1

          // XP
          s.player.xp += cropDef.xp
          while (s.player.xp >= s.player.xpToNext && s.player.level < 20) {
            s.player.level += 1
            s.player.xp -= s.player.xpToNext
            s.player.xpToNext = xpForLevel(s.player.level + 1) - xpForLevel(s.player.level)
          }
        })
        return true
      },

      waterCrop: (plotId) => {
        set((s) => {
          const plot = s.plots[plotId]
          if (plot?.crop && !plot.crop.watered) {
            plot.crop.watered = true
          }
        })
      },

      // ─── ANIMAL ACTIONS ───
      buyAnimal: (animalId) => {
        const state = get()
        const animalDef = ANIMALS[animalId]
        if (!animalDef) return false
        if (state.player.level < animalDef.unlockLevel) return false
        if (state.player.coins < animalDef.buyPrice) return false

        set((s) => {
          s.player.coins -= animalDef.buyPrice
          s.animals.push({
            animalId,
            fedAt: null,
            lastProductAt: null,
            happiness: 50,
          })
        })
        return true
      },

      feedAnimal: (animalIndex) => {
        const state = get()
        const animal = state.animals[animalIndex]
        if (!animal) return false

        const animalDef = ANIMALS[animal.animalId]
        if (!animalDef) return false

        const feedCount = state.inventory[animalDef.feedCropId] || 0
        if (feedCount < animalDef.feedAmount) return false

        set((s) => {
          const inv = s.inventory as Record<string, number>
          inv[animalDef.feedCropId]! -= animalDef.feedAmount

          s.animals[animalIndex].fedAt = Date.now()
          s.animals[animalIndex].lastProductAt = Date.now()
          s.animals[animalIndex].happiness = Math.min(100, s.animals[animalIndex].happiness + 20)
        })
        return true
      },

      collectProduct: (animalIndex) => {
        const state = get()
        const animal = state.animals[animalIndex]
        if (!animal || !animal.fedAt || !animal.lastProductAt) return false

        const animalDef = ANIMALS[animal.animalId]
        if (!animalDef) return false

        const elapsed = Date.now() - animal.lastProductAt
        if (elapsed < animalDef.productionTimeMs) return false

        set((s) => {
          const inv = s.inventory as Record<string, number>
          const bonusMult = s.animals[animalIndex].happiness >= 80 ? 2 : 1
          inv[animalDef.productId] = (inv[animalDef.productId] || 0) + bonusMult

          s.animals[animalIndex].lastProductAt = Date.now()
          s.animals[animalIndex].happiness = Math.max(0, s.animals[animalIndex].happiness - 5)

          s.player.xp += Math.floor(animalDef.xp / 4)
          while (s.player.xp >= s.player.xpToNext && s.player.level < 20) {
            s.player.level += 1
            s.player.xp -= s.player.xpToNext
            s.player.xpToNext = xpForLevel(s.player.level + 1) - xpForLevel(s.player.level)
          }
        })
        return true
      },

      // ─── BUILDING ACTIONS ───
      buyBuilding: (buildingId) => {
        const state = get()
        const bDef = BUILDINGS[buildingId]
        if (!bDef) return false

        const existing = state.buildings.find((b) => b.buildingId === buildingId)
        if (existing) return false // already owned, should upgrade

        const cost = getBuildingCost(buildingId, 0)
        if (state.player.coins < cost) return false

        set((s) => {
          s.player.coins -= cost
          s.buildings.push({ buildingId, level: 1 })
        })
        return true
      },

      upgradeBuilding: (buildingIndex) => {
        const state = get()
        const building = state.buildings[buildingIndex]
        if (!building) return false

        const bDef = BUILDINGS[building.buildingId]
        if (!bDef) return false
        if (building.level >= bDef.maxLevel) return false

        const cost = getBuildingCost(building.buildingId, building.level)
        if (state.player.coins < cost) return false

        set((s) => {
          s.player.coins -= cost
          s.buildings[buildingIndex].level += 1
        })
        return true
      },

      // ─── ECONOMY ───
      unlockPlot: (plotId) => {
        const state = get()
        const plot = state.plots[plotId]
        if (!plot || plot.state !== 'locked') return false

        const unlockCost = 50 + plotId * 10
        if (state.player.coins < unlockCost) return false

        set((s) => {
          s.player.coins -= unlockCost
          s.plots[plotId].state = 'empty'
        })
        return true
      },

      expandGrid: () => {
        const state = get()
        if (state.gridSize >= MAX_GRID_SIZE) return false

        const expandCost = state.gridSize * 500
        if (state.player.coins < expandCost) return false

        const newSize = state.gridSize + 1
        const newPlots: Plot[] = []
        for (let i = 0; i < newSize * newSize; i++) {
          const existing = state.plots[i]
          if (existing) {
            newPlots.push(existing)
          } else {
            newPlots.push({ id: i, state: 'locked', crop: null })
          }
        }

        set((s) => {
          s.player.coins -= expandCost
          s.gridSize = newSize
          s.plots = newPlots
        })
        return true
      },

      // ─── INVENTORY ───
      addItem: (item, amount) => {
        set((s) => {
          const inv = s.inventory as Record<string, number>
          inv[item] = (inv[item] || 0) + amount
        })
      },

      removeItem: (item, amount) => {
        const state = get()
        const current = state.inventory[item] || 0
        if (current < amount) return false

        set((s) => {
          const inv = s.inventory as Record<string, number>
          inv[item]! -= amount
          if (inv[item] === 0) delete inv[item]
        })
        return true
      },

      sellItem: (item, amount) => {
        const state = get()
        const current = state.inventory[item] || 0
        if (current < amount) return false

        // Find sell price
        let price = 0
        if (CROPS[item]) {
          price = CROPS[item].sellPrice
        } else if (PRODUCTS[item]) {
          price = PRODUCTS[item].sellPrice
        }
        if (price === 0) return false

        set((s) => {
          const inv = s.inventory as Record<string, number>
          inv[item]! -= amount
          if (inv[item] === 0) delete inv[item]

          s.player.coins += price * amount
          s.totalEarned += price * amount
        })
        return true
      },

      // ─── PROGRESSION ───
      addXp: (amount) => {
        set((s) => {
          s.player.xp += amount
          while (s.player.xp >= s.player.xpToNext && s.player.level < 20) {
            s.player.level += 1
            s.player.xp -= s.player.xpToNext
            s.player.xpToNext = xpForLevel(s.player.level + 1) - xpForLevel(s.player.level)
          }
        })
      },

      claimDailyBonus: () => {
        const state = get()
        // Simple daily check: use day counter
        const bonus = DAILY_BONUS_BASE * state.day
        set((s) => {
          s.player.coins += bonus
          s.day += 1
        })
        return true
      },

      // ─── SYSTEM ───
      processOfflineProgress: () => {
        const state = get()
        const result = calculateOfflineProgress(state)

        if (result.offlineMs > 0) {
          set((s) => {
            Object.assign(s, result.updatedState)
          })
        }

        return {
          offlineMs: result.offlineMs,
          products: result.offlineProducts,
        }
      },

      resetGame: () => {
        set(getInitialState())
      },

      tick: () => {
        // Update crop stages based on elapsed time
        const now = Date.now()
        set((s) => {
          for (const plot of s.plots) {
            if (!plot.crop || plot.state === 'harvestable') continue
            const cropDef = CROPS[plot.crop.cropId]
            if (!cropDef) continue

            const timePerStage = cropDef.growTimeMs / 3
            const elapsed = now - plot.crop.plantedAt
            const newStage = Math.min(Math.floor(elapsed / timePerStage), 3)

            if (newStage !== plot.crop.stage) {
              plot.crop.stage = newStage
              if (newStage >= 3) {
                plot.state = 'harvestable'
              }
            }
          }

          // Update animal product readiness
          for (const animal of s.animals) {
            if (!animal.fedAt || !animal.lastProductAt) continue
            const animalDef = ANIMALS[animal.animalId]
            if (!animalDef) continue

            // Decrease happiness over time
            const timeSinceFeed = now - animal.fedAt
            if (timeSinceFeed > animalDef.productionTimeMs * 3) {
              animal.happiness = Math.max(0, animal.happiness - 1)
            }
          }

          s.lastOnline = now
        })
      },
    })),
    {
      name: 'dream-farm-life-save',
      partialize: (state) => ({
        player: state.player,
        plots: state.plots,
        animals: state.animals,
        buildings: state.buildings,
        inventory: state.inventory,
        gridSize: state.gridSize,
        lastOnline: state.lastOnline,
        totalHarvests: state.totalHarvests,
        totalEarned: state.totalEarned,
        day: state.day,
        achievements: state.achievements,
      }),
    }
  )
)
