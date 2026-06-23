// buildings.ts — Building definitions for placement system
export interface BuildingDef {
  id: string
  name: string
  emoji: string
  width: number   // tiles
  height: number  // tiles
  maxTier: number
  tiers: BuildingTier[]
  description: string
  unlockLevel: number
}

export interface BuildingTier {
  tier: number
  emoji: string
  upgradeCost: { itemId: string; count: number }[]
  effect: string
}

export const BUILDINGS: Record<string, BuildingDef> = {
  barn: {
    id: 'barn', name: 'Barn', emoji: '🏚️', width: 3, height: 3, maxTier: 3,
    unlockLevel: 5,
    description: 'Storage for crops and resources',
    tiers: [
      { tier: 1, emoji: '🏚️', upgradeCost: [], effect: '+20 storage slots' },
      { tier: 2, emoji: '🏠', upgradeCost: [{ itemId: 'wood', count: 15 }, { itemId: 'iron_ore', count: 5 }], effect: '+40 storage slots' },
      { tier: 3, emoji: '🏰', upgradeCost: [{ itemId: 'iron_ore', count: 10 }, { itemId: 'stone', count: 10 }], effect: '+60 storage slots' },
    ],
  },
  animal_pen: {
    id: 'animal_pen', name: 'Animal Pen', emoji: '🏠', width: 3, height: 3, maxTier: 3,
    unlockLevel: 4,
    description: 'House farm animals',
    tiers: [
      { tier: 1, emoji: '🏠', upgradeCost: [], effect: 'Houses 2 animals' },
      { tier: 2, emoji: '🏡', upgradeCost: [{ itemId: 'wood', count: 10 }], effect: 'Houses 4 animals' },
      { tier: 3, emoji: '🏘️', upgradeCost: [{ itemId: 'wood', count: 20 }, { itemId: 'iron_ore', count: 5 }], effect: 'Houses 6 animals' },
    ],
  },
  greenhouse: {
    id: 'greenhouse', name: 'Greenhouse', emoji: '🌿', width: 4, height: 4, maxTier: 2,
    unlockLevel: 12,
    description: 'Grow any crop regardless of biome or season',
    tiers: [
      { tier: 1, emoji: '🌿', upgradeCost: [], effect: '8 indoor plots' },
      { tier: 2, emoji: '🌳', upgradeCost: [{ itemId: 'iron_ore', count: 10 }, { itemId: 'sand', count: 10 }], effect: '16 indoor plots' },
    ],
  },
  well: {
    id: 'well', name: 'Well', emoji: '🪣', width: 1, height: 1, maxTier: 2,
    unlockLevel: 7,
    description: 'Auto-waters nearby crops',
    tiers: [
      { tier: 1, emoji: '🪣', upgradeCost: [], effect: 'Waters 3x3 area' },
      { tier: 2, emoji: '⛲', upgradeCost: [{ itemId: 'stone', count: 10 }, { itemId: 'iron_ore', count: 5 }], effect: 'Waters 5x5 area' },
    ],
  },
  windmill: {
    id: 'windmill', name: 'Windmill', emoji: '🏗️', width: 2, height: 2, maxTier: 2,
    unlockLevel: 10,
    description: 'Auto-process crops (wheat→flour)',
    tiers: [
      { tier: 1, emoji: '🏗️', upgradeCost: [], effect: 'Process 1 crop/min' },
      { tier: 2, emoji: '🏭', upgradeCost: [{ itemId: 'iron_ore', count: 10 }], effect: 'Process 3 crops/min' },
    ],
  },
  market_stall: {
    id: 'market_stall', name: 'Market Stall', emoji: '🏪', width: 2, height: 1, maxTier: 3,
    unlockLevel: 8,
    description: 'Sell items to NPCs for coins',
    tiers: [
      { tier: 1, emoji: '🏪', upgradeCost: [], effect: 'Sell at 80% price' },
      { tier: 2, emoji: '🏬', upgradeCost: [{ itemId: 'wood', count: 10 }, { itemId: 'iron_ore', count: 5 }], effect: 'Sell at 100% price' },
      { tier: 3, emoji: '🏛️', upgradeCost: [{ itemId: 'gold_ore', count: 5 }], effect: 'Sell at 120% price' },
    ],
  },
  farmhouse: {
    id: 'farmhouse', name: 'Farm House', emoji: '🏡', width: 3, height: 3, maxTier: 3,
    unlockLevel: 1,
    description: 'Your home — spawn point and save',
    tiers: [
      { tier: 1, emoji: '⛺', upgradeCost: [], effect: 'Basic shelter' },
      { tier: 2, emoji: '🏡', upgradeCost: [{ itemId: 'wood', count: 20 }, { itemId: 'stone', count: 10 }], effect: 'Sleep to restore stamina' },
      { tier: 3, emoji: '🏠', upgradeCost: [{ itemId: 'iron_ore', count: 10 }, { itemId: 'gold_ore', count: 3 }], effect: 'Full rest + bonus stamina' },
    ],
  },
}

export function getBuilding(id: string): BuildingDef | undefined {
  return BUILDINGS[id]
}

// Compat for classic farm
export function getBuildingCost(id: string, level: number): number {
  const def = BUILDINGS[id]
  if (!def) return 0
  const tier = def.tiers[level] ?? def.tiers[0]
  return tier.upgradeCost.reduce((sum, c) => sum + c.count * 10, 0)
}

export function getBuildingTier(buildingId: string, tier: number) {
  const def = BUILDINGS[buildingId]
  return def?.tiers.find(t => t.tier === tier)
}
