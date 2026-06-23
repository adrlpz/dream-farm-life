// tools.ts — Tool definitions with tiers and gathering behavior
import type { TileType } from '../engine/types'

export type ToolType = 'hoe' | 'axe' | 'pickaxe' | 'watering_can' | 'fishing_rod' | 'bug_net'
export type ToolTier = 'wood' | 'iron' | 'gold' | 'diamond'

export interface ToolDef {
  id: string
  type: ToolType
  tier: ToolTier
  name: string
  emoji: string
  speed: number        // gather speed multiplier
  durability: number   // uses before break
  yieldMult: number    // resource yield multiplier
  canGather: string[]  // tile types this tool can gather
  craftCost: { itemId: string; count: number }[]
}

export const TOOL_DEFS: Record<string, ToolDef> = {
  // ─── Axes (chop trees) ───
  axe_wood:    { id: 'axe_wood',    type: 'axe', tier: 'wood',    name: 'Wood Axe',    emoji: '🪓', speed: 1.0, durability: 50,  yieldMult: 1, canGather: ['tree'],               craftCost: [{ itemId: 'wood', count: 5 }] },
  axe_iron:    { id: 'axe_iron',    type: 'axe', tier: 'iron',    name: 'Iron Axe',    emoji: '🪓', speed: 1.5, durability: 120, yieldMult: 1.5, canGather: ['tree'],            craftCost: [{ itemId: 'wood', count: 3 }, { itemId: 'iron_ore', count: 5 }] },
  axe_gold:    { id: 'axe_gold',    type: 'axe', tier: 'gold',    name: 'Gold Axe',    emoji: '🪓', speed: 2.0, durability: 200, yieldMult: 2, canGather: ['tree'],             craftCost: [{ itemId: 'iron_ore', count: 5 }, { itemId: 'gold_ore', count: 3 }] },
  axe_diamond: { id: 'axe_diamond', type: 'axe', tier: 'diamond', name: 'Diamond Axe', emoji: '🪓', speed: 3.0, durability: 500, yieldMult: 3, canGather: ['tree'],             craftCost: [{ itemId: 'gold_ore', count: 5 }, { itemId: 'gem', count: 2 }] },

  // ─── Pickaxes (mine rocks/ore) ───
  pickaxe_wood:    { id: 'pickaxe_wood',    type: 'pickaxe', tier: 'wood',    name: 'Wood Pickaxe',    emoji: '⛏️', speed: 1.0, durability: 50,  yieldMult: 1, canGather: ['rock', 'ore_iron', 'ore_gold'], craftCost: [{ itemId: 'wood', count: 5 }] },
  pickaxe_iron:    { id: 'pickaxe_iron',    type: 'pickaxe', tier: 'iron',    name: 'Iron Pickaxe',    emoji: '⛏️', speed: 1.5, durability: 120, yieldMult: 1.5, canGather: ['rock', 'ore_iron', 'ore_gold'], craftCost: [{ itemId: 'wood', count: 3 }, { itemId: 'iron_ore', count: 5 }] },
  pickaxe_gold:    { id: 'pickaxe_gold',    type: 'pickaxe', tier: 'gold',    name: 'Gold Pickaxe',    emoji: '⛏️', speed: 2.0, durability: 200, yieldMult: 2, canGather: ['rock', 'ore_iron', 'ore_gold'], craftCost: [{ itemId: 'iron_ore', count: 5 }, { itemId: 'gold_ore', count: 3 }] },
  pickaxe_diamond: { id: 'pickaxe_diamond', type: 'pickaxe', tier: 'diamond', name: 'Diamond Pickaxe', emoji: '⛏️', speed: 3.0, durability: 500, yieldMult: 3, canGather: ['rock', 'ore_iron', 'ore_gold'], craftCost: [{ itemId: 'gold_ore', count: 5 }, { itemId: 'gem', count: 2 }] },

  // ─── Hoes (till soil) ───
  hoe_wood:    { id: 'hoe_wood',    type: 'hoe', tier: 'wood',    name: 'Wood Hoe',    emoji: '🔨', speed: 1.0, durability: 50,  yieldMult: 1, canGather: ['grass', 'dirt'],  craftCost: [{ itemId: 'wood', count: 3 }] },
  hoe_iron:    { id: 'hoe_iron',    type: 'hoe', tier: 'iron',    name: 'Iron Hoe',    emoji: '🔨', speed: 1.5, durability: 120, yieldMult: 1, canGather: ['grass', 'dirt'],  craftCost: [{ itemId: 'wood', count: 2 }, { itemId: 'iron_ore', count: 3 }] },

  // ─── Watering Can ───
  watering_can: { id: 'watering_can', type: 'watering_can', tier: 'wood', name: 'Watering Can', emoji: '🪣', speed: 1.0, durability: 200, yieldMult: 1, canGather: [], craftCost: [{ itemId: 'iron_ore', count: 3 }] },

  // ─── Fishing Rod ───
  fishing_rod_wood:    { id: 'fishing_rod_wood',    type: 'fishing_rod', tier: 'wood',    name: 'Bamboo Rod',     emoji: '🎣', speed: 1.0, durability: 100, yieldMult: 1, canGather: ['water'], craftCost: [{ itemId: 'wood', count: 5 }] },
  fishing_rod_iron:    { id: 'fishing_rod_iron',    type: 'fishing_rod', tier: 'iron',    name: 'Fiberglass Rod', emoji: '🎣', speed: 1.3, durability: 200, yieldMult: 1.5, canGather: ['water'], craftCost: [{ itemId: 'wood', count: 3 }, { itemId: 'iron_ore', count: 5 }] },
  fishing_rod_gold:    { id: 'fishing_rod_gold',    type: 'fishing_rod', tier: 'gold',    name: 'Master Rod',     emoji: '🎣', speed: 1.6, durability: 400, yieldMult: 2, canGather: ['water'], craftCost: [{ itemId: 'iron_ore', count: 5 }, { itemId: 'gold_ore', count: 3 }] },

  // ─── Bug Net ───
  bug_net: { id: 'bug_net', type: 'bug_net', tier: 'wood', name: 'Bug Net', emoji: '🦋', speed: 1.0, durability: 100, yieldMult: 1, canGather: [], craftCost: [{ itemId: 'wood', count: 3 }, { itemId: 'sap', count: 2 }] },
}

// What tool type is needed for a tile
export const TILE_TOOL_MAP: Partial<Record<TileType, ToolType>> = {
  tree: 'axe',
  rock: 'pickaxe',
  ore_iron: 'pickaxe',
  ore_gold: 'pickaxe',
  grass: 'hoe',
  dirt: 'hoe',
  water: 'fishing_rod',
  tall_grass: 'hoe',
  bush: 'axe',
}

// Drops per resource tile type
export const RESOURCE_DROPS: Partial<Record<TileType, { itemId: string; min: number; max: number; chance: number }[]>> = {
  tree: [
    { itemId: 'wood', min: 1, max: 3, chance: 1.0 },
    { itemId: 'sap', min: 0, max: 2, chance: 0.5 },
  ],
  rock: [
    { itemId: 'stone', min: 1, max: 3, chance: 1.0 },
    { itemId: 'iron_ore', min: 0, max: 1, chance: 0.3 },
    { itemId: 'gem', min: 0, max: 1, chance: 0.05 },
  ],
  ore_iron: [
    { itemId: 'iron_ore', min: 1, max: 3, chance: 1.0 },
    { itemId: 'stone', min: 0, max: 1, chance: 0.5 },
  ],
  ore_gold: [
    { itemId: 'gold_ore', min: 1, max: 2, chance: 1.0 },
    { itemId: 'gem', min: 0, max: 1, chance: 0.15 },
  ],
  bush: [
    { itemId: 'berry', min: 1, max: 3, chance: 1.0 },
    { itemId: 'herb', min: 0, max: 1, chance: 0.4 },
    { itemId: 'mushroom', min: 0, max: 1, chance: 0.2 },
  ],
  tall_grass: [
    { itemId: 'herb', min: 1, max: 1, chance: 0.6 },
    { itemId: 'seed_wheat', min: 0, max: 1, chance: 0.15 },
  ],
  water: [
    { itemId: 'fish_common', min: 1, max: 1, chance: 0.6 },
    { itemId: 'fish_bass', min: 1, max: 1, chance: 0.25 },
    { itemId: 'fish_salmon', min: 1, max: 1, chance: 0.12 },
    { itemId: 'fish_golden', min: 1, max: 1, chance: 0.03 },
  ],
}

export function getToolForTile(tileType: TileType): ToolType | null {
  return TILE_TOOL_MAP[tileType] ?? null
}
