// ─── Crop ───
export type CropId = 'wheat' | 'corn' | 'tomato' | 'carrot' | 'potato' | 'pumpkin' | 'strawberry' | 'grape'

// Re-export from new data with backward-compat
import { CROPS as _CROPS } from './data/crops'
import type { CropDef as NewCropDef } from './data/crops'

// Classic farm CropDef shape
export interface CropDef {
  id: string
  name: string
  emoji: string
  stages: string[]
  growTimeMs: number
  sellPrice: number
  seedCost: number
  xp: number
  unlockLevel: number
}

// Convert new CROPS to old shape for classic farm compatibility
export const CROPS_COMPAT: Record<string, CropDef> = Object.fromEntries(
  Object.entries(_CROPS).map(([id, c]) => [id, {
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    stages: c.stageEmojis,
    growTimeMs: c.growthTimeMs,
    sellPrice: c.sellPrice,
    seedCost: Math.floor(c.sellPrice * 0.4),
    xp: c.xp,
    unlockLevel: c.unlockLevel,
  }])
)

export interface PlantedCrop {
  cropId: CropId
  plantedAt: number
  stage: number
  watered: boolean
}

// ─── Animal ───
export type AnimalId = 'chicken' | 'cow' | 'sheep' | 'goat' | 'pig'

import { ANIMALS as _ANIMALS } from './data/animals'
import type { AnimalDef as NewAnimalDef } from './data/animals'

export interface AnimalDef {
  id: string
  name: string
  emoji: string
  happyEmoji: string
  productId: string
  productEmoji: string
  feedCropId: string
  feedAmount: number
  productionTimeMs: number
  buyPrice: number
  xp: number
  unlockLevel: number
}

export const ANIMALS_COMPAT: Record<string, AnimalDef> = Object.fromEntries(
  Object.entries(_ANIMALS).map(([id, a]) => [id, {
    id: a.id,
    name: a.name,
    emoji: a.emoji,
    happyEmoji: a.emoji,
    productId: a.productId,
    productEmoji: a.productEmoji,
    feedCropId: a.feedItemId,
    feedAmount: 1,
    productionTimeMs: a.productionTimeMs,
    buyPrice: a.buyPrice,
    xp: 10,
    unlockLevel: a.unlockLevel,
  }])
)

export interface PlacedAnimal {
  animalId: AnimalId
  fedAt: number | null
  lastProductAt: number | null
  happiness: number
}

// ─── Products ───
export type ProductId = 'egg' | 'milk' | 'wool' | 'goat_milk' | 'truffle'

export interface ProductDef {
  id: ProductId
  name: string
  emoji: string
  sellPrice: number
}

// ─── Buildings ───
export type BuildingId = 'barn' | 'silo' | 'coop' | 'cowshed' | 'market' | 'well' | 'windmill'

export interface BuildingDef {
  id: BuildingId
  name: string
  emoji: string
  description: string
  maxLevel: number
  baseCost: number
  costMultiplier: number
  effect: string
}

export interface PlacedBuilding {
  buildingId: BuildingId
  level: number
}

// ─── Plot ───
export type PlotState = 'locked' | 'empty' | 'planted' | 'harvestable'

export interface Plot {
  id: number
  state: PlotState
  crop: PlantedCrop | null
}

// ─── Player ───
export interface Player {
  level: number
  xp: number
  xpToNext: number
  coins: number
  gems: number
}

// ─── Inventory ───
export type InventoryItem = CropId | ProductId

export type Inventory = Partial<Record<InventoryItem, number>>

// ─── Game State ───
export interface GameState {
  player: Player
  plots: Plot[]
  animals: PlacedAnimal[]
  buildings: PlacedBuilding[]
  inventory: Inventory
  gridSize: number
  lastOnline: number
  totalHarvests: number
  totalEarned: number
  day: number
  achievements: string[]
}

// ─── Shop Tab ───
export type ShopTab = 'seeds' | 'animals' | 'buildings' | 'sell'
