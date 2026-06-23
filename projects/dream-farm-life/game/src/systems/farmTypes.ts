// farmTypes.ts — Farm-specific types for Phase 3

export interface FarmPlot {
  id: string
  x: number           // world tile x
  y: number           // world tile y
  state: 'grass' | 'tilled' | 'planted' | 'watered'
  cropId: string | null
  growthProgress: number  // 0-1
  stage: number          // visual stage (0-3)
  harvestable: boolean
  watered: boolean
  plantedAt: number      // timestamp
}

export interface FarmAnimal {
  id: string
  animalId: string      // e.g. 'chicken', 'cow'
  x: number
  y: number
  fed: boolean
  happiness: number     // 0-100
  productionProgress: number // 0-1
}

export interface FarmBuilding {
  id: string
  type: 'farmhouse' | 'barn' | 'silo' | 'animal_pen' | 'greenhouse' | 'windmill' | 'well' | 'market_stall' | 'dock'
  tier: number
  x: number
  y: number
  width: number
  height: number
}

export interface PlacedBuildingState {
  id: string
  buildingId: string
  x: number
  y: number
  tier: number
  width: number
  height: number
}

export interface GrowthTickResult {
  plotId: string
  type: 'crop_ready' | 'animal_product' | 'tree_ready'
  cropId?: string
  animalId?: string
  productId?: string
  emoji?: string
  bonus?: number
}
