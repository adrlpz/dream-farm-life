// tiles.ts — Tile definitions
import type { TileType } from '../engine/types'

interface TileDefEntry {
  type: TileType
  walkable: boolean
  color: string
  emoji?: string
  gatherable?: boolean
  gatherItem?: string
}

export const TILE_DEFS: Record<TileType, TileDefEntry> = {
  grass:       { type: 'grass',       walkable: true,  color: '#5a8f3c' },
  tall_grass:  { type: 'tall_grass',  walkable: true,  color: '#4a7a2e', emoji: '🌿', gatherable: true, gatherItem: 'herb' },
  dirt:        { type: 'dirt',        walkable: true,  color: '#8b7355' },
  soil:        { type: 'soil',        walkable: true,  color: '#6b5b3a' },
  water:       { type: 'water',       walkable: false, color: '#3b8dbd' },
  deep_water:  { type: 'deep_water',  walkable: false, color: '#1a5f8a' },
  sand:        { type: 'sand',        walkable: true,  color: '#e8d68a' },
  rock:        { type: 'rock',        walkable: false, color: '#7a7a7a', emoji: '🪨', gatherable: true, gatherItem: 'stone' },
  stone:       { type: 'stone',       walkable: true,  color: '#9a9a9a' },
  ore_iron:    { type: 'ore_iron',    walkable: false, color: '#8b6914', emoji: '⛏️', gatherable: true, gatherItem: 'iron_ore' },
  ore_gold:    { type: 'ore_gold',    walkable: false, color: '#daa520', emoji: '✨', gatherable: true, gatherItem: 'gold_ore' },
  snow:        { type: 'snow',        walkable: true,  color: '#e8eef0' },
  ice:         { type: 'ice',         walkable: true,  color: '#b0d4e8' },
  tree:        { type: 'tree',        walkable: false, color: '#2d5a1e', emoji: '🌲', gatherable: true, gatherItem: 'wood' },
  bush:        { type: 'bush',        walkable: true,  color: '#3d6b2e', emoji: '🫐', gatherable: true, gatherItem: 'berry' },
  flower:      { type: 'flower',      walkable: true,  color: '#5a8f3c', emoji: '🌸' },
  path:        { type: 'path',        walkable: true,  color: '#c4a35a' },
  wall:        { type: 'wall',        walkable: false, color: '#5a4a3a' },
  door:        { type: 'door',        walkable: true,  color: '#8b6914' },
  fence:       { type: 'fence',       walkable: false, color: '#a08050' },
}

// Tile colors for minimap
export const TILE_MINIMAP_COLORS: Record<TileType, string> = Object.fromEntries(
  Object.entries(TILE_DEFS).map(([k, v]) => [k, v.color])
) as Record<TileType, string>
