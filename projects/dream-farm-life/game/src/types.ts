// ─── Crop ───
export type CropId = 'wheat' | 'corn' | 'tomato' | 'carrot' | 'potato' | 'pumpkin' | 'strawberry' | 'grape'

export interface CropDef {
  id: CropId
  name: string
  emoji: string
  stages: string[] // emoji per stage: [seed, sprout, mature, harvestable]
  growTimeMs: number
  sellPrice: number
  seedCost: number
  xp: number
  unlockLevel: number
}

export interface PlantedCrop {
  cropId: CropId
  plantedAt: number // timestamp ms
  stage: number // 0=seed, 1=sprout, 2=mature, 3=harvestable
  watered: boolean
}

// ─── Animal ───
export type AnimalId = 'chicken' | 'cow' | 'sheep' | 'goat' | 'pig'

export interface AnimalDef {
  id: AnimalId
  name: string
  emoji: string
  happyEmoji: string
  productId: ProductId
  productEmoji: string
  feedCropId: CropId
  feedAmount: number
  productionTimeMs: number
  buyPrice: number
  xp: number
  unlockLevel: number
}

export interface PlacedAnimal {
  animalId: AnimalId
  fedAt: number | null
  lastProductAt: number | null
  happiness: number // 0-100
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
