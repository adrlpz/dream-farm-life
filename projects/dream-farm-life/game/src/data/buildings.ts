import { BuildingDef } from '../types'

export const BUILDINGS: Record<string, BuildingDef> = {
  barn: {
    id: 'barn',
    name: 'Barn',
    emoji: '🏚️',
    description: 'Stores more items (+20 per level)',
    maxLevel: 5,
    baseCost: 100,
    costMultiplier: 2,
    effect: 'storage',
  },
  silo: {
    id: 'silo',
    name: 'Silo',
    emoji: '🏗️',
    description: 'Stores more crops (+30 per level)',
    maxLevel: 5,
    baseCost: 80,
    costMultiplier: 1.8,
    effect: 'crop_storage',
  },
  coop: {
    id: 'coop',
    name: 'Chicken Coop',
    emoji: '🏠',
    description: 'Houses more chickens (+2 per level)',
    maxLevel: 3,
    baseCost: 120,
    costMultiplier: 2.2,
    effect: 'chicken_slots',
  },
  cowshed: {
    id: 'cowshed',
    name: 'Cowshed',
    emoji: '🏡',
    description: 'Houses more cows (+1 per level)',
    maxLevel: 3,
    baseCost: 200,
    costMultiplier: 2.5,
    effect: 'cow_slots',
  },
  well: {
    id: 'well',
    name: 'Well',
    emoji: '🪣',
    description: 'Auto-water nearby crops',
    maxLevel: 3,
    baseCost: 150,
    costMultiplier: 2,
    effect: 'auto_water',
  },
  windmill: {
    id: 'windmill',
    name: 'Windmill',
    emoji: '🌬️',
    description: 'Process crops into flour (+value)',
    maxLevel: 3,
    baseCost: 250,
    costMultiplier: 2.5,
    effect: 'process_crops',
  },
}

export function getBuildingCost(buildingId: string, currentLevel: number): number {
  const def = BUILDINGS[buildingId]
  if (!def) return 0
  return Math.floor(def.baseCost * Math.pow(def.costMultiplier, currentLevel))
}
