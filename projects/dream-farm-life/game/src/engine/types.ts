// ─── Open World Types ───

// Tile
export type TileType =
  | 'grass' | 'tall_grass' | 'dirt' | 'soil' | 'water' | 'deep_water'
  | 'sand' | 'rock' | 'stone' | 'ore_iron' | 'ore_gold'
  | 'snow' | 'ice' | 'tree' | 'bush' | 'flower'
  | 'path' | 'wall' | 'door' | 'fence'

export interface TileDef {
  type: TileType
  walkable: boolean
  color: string
  emoji?: string
  gatherable?: boolean
  gatherItem?: string
  growTimeMs?: number
}

// Biome
export type BiomeType = 'farmland' | 'forest' | 'beach' | 'mountain' | 'cave' | 'snow' | 'tropical' | 'desert'

export interface BiomeDef {
  type: BiomeType
  name: string
  emoji: string
  primaryTiles: TileType[]
  secondaryTiles: TileType[]
  resourceDensity: number // 0-1
  color: string
}

// Chunk
export const CHUNK_SIZE = 32

export interface ChunkCoord {
  cx: number
  cy: number
}

export interface Chunk {
  cx: number
  cy: number
  tiles: TileType[][]
  biome: BiomeType
  entities: EntityData[]
  discovered: boolean
}

// Entity
export interface EntityData {
  id: string
  type: 'resource_node' | 'npc' | 'animal' | 'world_object'
  x: number
  y: number
  tileType?: TileType
  meta?: Record<string, unknown>
}

// Player
export interface PlayerData {
  x: number
  y: number
  vx: number
  vy: number
  direction: Direction
  speed: number
  stamina: number
  maxStamina: number
  isRunning: boolean
  animFrame: number
  animTimer: number
}

export type Direction = 'up' | 'down' | 'left' | 'right' | 'up_left' | 'up_right' | 'down_left' | 'down_right'

// Camera
export interface CameraData {
  x: number
  y: number
  zoom: number
  targetX: number
  targetY: number
  shake: number
}

// Input
export interface InputState {
  keys: Set<string>
  touchJoystick: { dx: number; dy: number; active: boolean }
  tap: { x: number; y: number; active: boolean }
  mouse: { x: number; y: number; down: boolean }
}

// Game Time
export interface GameTime {
  day: number
  hour: number   // 0-23
  minute: number // 0-59
  season: 'spring' | 'summer' | 'fall' | 'winter'
  year: number
}

// Inventory item
export interface ItemDef {
  id: string
  name: string
  emoji: string
  category: 'seed' | 'crop' | 'resource' | 'tool' | 'fish' | 'food' | 'quest' | 'special'
  stackable: boolean
  maxStack: number
  sellPrice: number
  description: string
}

// Resource node
export interface ResourceNodeData {
  id: string
  tileType: TileType
  x: number
  y: number
  hp: number
  maxHp: number
  respawnTimeMs: number
  depletedAt: number | null
  drops: { itemId: string; min: number; max: number; chance: number }[]
}

// Engine config
export interface EngineConfig {
  canvas: HTMLCanvasElement
  width: number
  height: number
  tileSize: number
  onStateChange?: (state: EngineState) => void
}

export interface EngineState {
  player: PlayerData
  gameTime: GameTime
  currentBiome: BiomeType
  discoveredChunks: number
}
