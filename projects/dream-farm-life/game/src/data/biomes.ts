// biomes.ts — Biome definitions and layouts
import type { BiomeType, BiomeDef, TileType, EntityData } from '../engine/types'

export const BIOME_DEFS: Record<BiomeType, BiomeDef> = {
  farmland: {
    type: 'farmland', name: 'Farmland', emoji: '🌾',
    primaryTiles: ['grass', 'grass', 'grass', 'dirt', 'soil'],
    secondaryTiles: ['flower', 'tall_grass', 'path'],
    resourceDensity: 0.05,
    color: '#5a8f3c',
  },
  forest: {
    type: 'forest', name: 'Forest', emoji: '🌲',
    primaryTiles: ['grass', 'grass', 'tall_grass'],
    secondaryTiles: ['tree', 'tree', 'bush', 'flower'],
    resourceDensity: 0.3,
    color: '#2d5a1e',
  },
  beach: {
    type: 'beach', name: 'Beach', emoji: '🏖️',
    primaryTiles: ['sand', 'sand', 'sand'],
    secondaryTiles: ['water', 'rock', 'flower'],
    resourceDensity: 0.1,
    color: '#e8d68a',
  },
  mountain: {
    type: 'mountain', name: 'Mountain', emoji: '⛰️',
    primaryTiles: ['rock', 'stone', 'stone'],
    secondaryTiles: ['ore_iron', 'ore_gold', 'tree'],
    resourceDensity: 0.25,
    color: '#7a7a7a',
  },
  cave: {
    type: 'cave', name: 'Dark Cave', emoji: '🌑',
    primaryTiles: ['stone', 'rock', 'stone'],
    secondaryTiles: ['ore_iron', 'ore_gold'],
    resourceDensity: 0.35,
    color: '#3a3a2a',
  },
  snow: {
    type: 'snow', name: 'Snow Mountain', emoji: '❄️',
    primaryTiles: ['snow', 'snow', 'ice'],
    secondaryTiles: ['rock', 'tree'],
    resourceDensity: 0.15,
    color: '#e8eef0',
  },
  tropical: {
    type: 'tropical', name: 'Tropical Island', emoji: '🌺',
    primaryTiles: ['sand', 'grass', 'grass'],
    secondaryTiles: ['tree', 'flower', 'bush'],
    resourceDensity: 0.2,
    color: '#3b8',
  },
  desert: {
    type: 'desert', name: 'Desert', emoji: '🏜️',
    primaryTiles: ['sand', 'sand', 'sand'],
    secondaryTiles: ['rock', 'bush'],
    resourceDensity: 0.05,
    color: '#c9a84c',
  },
}

// Biome layout map — which biome at which chunk offset from center
// Center (0,0) = farmland (home)
export const BIOME_MAP: { dx: number; dy: number; biome: BiomeType }[] = [
  { dx: 0,  dy: 0,  biome: 'farmland' },   // Home
  { dx: 1,  dy: 0,  biome: 'farmland' },   // East farmland
  { dx: -1, dy: 0,  biome: 'farmland' },   // West farmland
  { dx: 0,  dy: -1, biome: 'forest' },     // North forest
  { dx: 1,  dy: -1, biome: 'forest' },     // NE forest
  { dx: -1, dy: -1, biome: 'forest' },     // NW forest
  { dx: 0,  dy: 1,  biome: 'beach' },      // South beach
  { dx: 1,  dy: 1,  biome: 'beach' },      // SE beach
  { dx: -1, dy: 1,  biome: 'beach' },      // SW beach
  { dx: 2,  dy: 0,  biome: 'mountain' },   // Far east mountain
  { dx: -2, dy: 0,  biome: 'mountain' },   // Far west mountain
  { dx: 0,  dy: -2, biome: 'cave' },       // Far north cave
  { dx: 2,  dy: -1, biome: 'mountain' },   // NE mountain
  { dx: -2, dy: -1, biome: 'mountain' },   // NW mountain
  { dx: 0,  dy: 2,  biome: 'tropical' },   // Far south tropical
  { dx: 1,  dy: 2,  biome: 'tropical' },   // SE tropical
  { dx: -1, dy: 2,  biome: 'tropical' },   // SW tropical
  { dx: 2,  dy: 1,  biome: 'desert' },     // E desert
  { dx: -2, dy: 1,  biome: 'desert' },     // W desert
  { dx: 2,  dy: -2, biome: 'snow' },       // NE snow
  { dx: -2, dy: -2, biome: 'snow' },       // NW snow
]

export function getBiomeForChunk(cx: number, cy: number): BiomeType {
  // Check exact biome map match
  for (const entry of BIOME_MAP) {
    if (entry.dx === cx && entry.dy === cy) return entry.biome
  }
  // Default: farmland near center, forest for far chunks
  const dist = Math.max(Math.abs(cx), Math.abs(cy))
  if (dist <= 1) return 'farmland'
  if (dist <= 2) return 'forest'
  return 'mountain'
}
