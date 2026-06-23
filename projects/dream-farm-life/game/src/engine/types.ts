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
  resourceDensity: number
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

// Inventory
export interface InventorySlot {
  itemId: string
  count: number
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
  inventory: InventorySlot[]
  equippedTool: string | null
  hotbar: (string | null)[]
  hotbarIndex: number
  interacting: boolean
  interactCooldown: number
  farmingLevel: number
  farmingXp: number
  farmingXpToNext: number
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
  hour: number
  minute: number
  season: 'spring' | 'summer' | 'fall' | 'winter'
  year: number
}

// Resource node (chunk-based)
export interface ResourceNodeState {
  id: string
  tileType: TileType
  x: number
  y: number
  hp: number
  maxHp: number
  depletedAt: number | null
}

// Nearby resource info for HUD
export interface NearbyResource {
  tileType: TileType
  toolNeeded: string | null
  emoji: string
  distance: number
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
  nearbyResource: NearbyResource | null
  notifications: string[]
  farmPlotCount: number
  animalCount: number
  showPlantingUI: boolean
  availableSeeds: string[]
  activeQuests: { questId: string; progress: number[]; startedAt: number }[]
  completedQuests: string[]
  activeDialog: { npcId: string; lineIndex: number } | null
  buildingCount: number
  claimSize: number
  craftingQueueCount: number
  weather: { type: string; emoji: string; name: string }
}
