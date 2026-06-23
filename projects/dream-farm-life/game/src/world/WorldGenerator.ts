// WorldGenerator.ts — Procedural chunk generation
import { CHUNK_SIZE } from '../engine/types'
import { BIOME_DEFS, getBiomeForChunk } from '../data/biomes'
import type { Chunk, TileType, EntityData, BiomeType } from '../engine/types'

// Simple seeded random
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// Simple 2D noise (value noise)
function valueNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
  return n - Math.floor(n)
}

// Smooth noise with interpolation
function smoothNoise(x: number, y: number, seed: number, scale: number): number {
  const sx = x / scale
  const sy = y / scale
  const ix = Math.floor(sx)
  const iy = Math.floor(sy)
  const fx = sx - ix
  const fy = sy - iy

  const n00 = valueNoise(ix, iy, seed)
  const n10 = valueNoise(ix + 1, iy, seed)
  const n01 = valueNoise(ix, iy + 1, seed)
  const n11 = valueNoise(ix + 1, iy + 1, seed)

  const nx0 = n00 + (n10 - n00) * fx
  const nx1 = n01 + (n11 - n01) * fx
  return nx0 + (nx1 - nx0) * fy
}

export function generateChunk(cx: number, cy: number): Chunk {
  const biome = getBiomeForChunk(cx, cy)
  const def = BIOME_DEFS[biome]
  const seed = cx * 1000 + cy * 7 + 42
  const rand = seededRandom(seed)

  const tiles: TileType[][] = []
  const entities: EntityData[] = []

  for (let ty = 0; ty < CHUNK_SIZE; ty++) {
    tiles[ty] = []
    for (let tx = 0; tx < CHUNK_SIZE; tx++) {
      const wx = cx * CHUNK_SIZE + tx
      const wy = cy * CHUNK_SIZE + ty

      // Multi-octave noise for terrain
      const n1 = smoothNoise(wx, wy, seed, 8)
      const n2 = smoothNoise(wx, wy, seed + 100, 4)
      const n3 = smoothNoise(wx, wy, seed + 200, 16)
      const noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2

      let tile: TileType

      // Biome-specific terrain generation
      switch (biome) {
        case 'farmland': {
          if (noise < 0.2) {
            tile = 'water'
          } else if (noise < 0.3) {
            tile = 'dirt'
          } else if (noise < 0.7) {
            tile = 'grass'
          } else if (noise < 0.85) {
            tile = 'tall_grass'
          } else {
            tile = 'flower'
          }
          // Paths near center
          if (cy === 0 && (wy === 0 || wy === -1) && Math.abs(wx) < 20) tile = 'path'
          if (cx === 0 && (wx === 0 || wx === -1) && Math.abs(wy) < 20) tile = 'path'
          break
        }
        case 'forest': {
          if (noise < 0.15) {
            tile = 'water'
          } else if (noise < 0.4) {
            tile = 'grass'
          } else if (noise < 0.55) {
            tile = 'tall_grass'
          } else if (noise < 0.75) {
            tile = 'tree'
          } else if (noise < 0.85) {
            tile = 'bush'
          } else {
            tile = 'flower'
          }
          break
        }
        case 'beach': {
          if (noise < 0.25) {
            tile = 'deep_water'
          } else if (noise < 0.4) {
            tile = 'water'
          } else if (noise < 0.6) {
            tile = 'sand'
          } else if (noise < 0.75) {
            tile = 'grass'
          } else {
            tile = 'rock'
          }
          break
        }
        case 'mountain': {
          if (noise < 0.2) {
            tile = 'rock'
          } else if (noise < 0.45) {
            tile = 'stone'
          } else if (noise < 0.6) {
            tile = 'grass'
          } else if (noise < 0.7) {
            tile = rand() < 0.3 ? 'ore_iron' : 'rock'
          } else if (noise < 0.8) {
            tile = 'tree'
          } else {
            tile = rand() < 0.1 ? 'ore_gold' : 'rock'
          }
          break
        }
        case 'cave': {
          if (noise < 0.3) {
            tile = 'rock'
          } else if (noise < 0.6) {
            tile = 'stone'
          } else if (noise < 0.75) {
            tile = rand() < 0.4 ? 'ore_iron' : 'stone'
          } else {
            tile = rand() < 0.15 ? 'ore_gold' : 'rock'
          }
          break
        }
        case 'snow': {
          if (noise < 0.15) {
            tile = 'ice'
          } else if (noise < 0.5) {
            tile = 'snow'
          } else if (noise < 0.7) {
            tile = 'rock'
          } else {
            tile = 'tree'
          }
          break
        }
        case 'tropical': {
          if (noise < 0.2) {
            tile = 'water'
          } else if (noise < 0.35) {
            tile = 'sand'
          } else if (noise < 0.6) {
            tile = 'grass'
          } else if (noise < 0.8) {
            tile = 'tree'
          } else {
            tile = 'flower'
          }
          break
        }
        case 'desert': {
          if (noise < 0.1) {
            tile = 'rock'
          } else if (noise < 0.6) {
            tile = 'sand'
          } else if (noise < 0.75) {
            tile = 'sand'
          } else {
            tile = 'rock'
          }
          break
        }
        default:
          tile = 'grass'
      }

      tiles[ty][tx] = tile
    }
  }

  // Generate resource entities on walkable tiles
  if (def.resourceDensity > 0) {
    for (let ty = 0; ty < CHUNK_SIZE; ty++) {
      for (let tx = 0; tx < CHUNK_SIZE; tx++) {
        if (rand() < def.resourceDensity) {
          const tile = tiles[ty][tx]
          const wx = cx * CHUNK_SIZE + tx + 0.5
          const wy = cy * CHUNK_SIZE + ty + 0.5
          if (tile === 'grass' || tile === 'dirt') {
            const entityType = rand() < 0.5 ? 'tree' : rand() < 0.5 ? 'rock' : 'bush'
            entities.push({
              id: `res_${cx}_${cy}_${tx}_${ty}`,
              type: 'resource_node',
              x: wx,
              y: wy,
              tileType: entityType as TileType,
            })
          }
        }
      }
    }
  }

  // Home chunk special: clear center area for farm
  if (cx === 0 && cy === 0) {
    for (let ty = 10; ty < 22; ty++) {
      for (let tx = 10; tx < 22; tx++) {
        tiles[ty][tx] = 'grass'
        // Remove resource entities in home area
        const idx = entities.findIndex(e =>
          Math.abs(e.x - tx - 0.5) < 0.1 && Math.abs(e.y - ty - 0.5) < 0.1
        )
        if (idx >= 0) entities.splice(idx, 1)
      }
    }
    // Place paths in home
    for (let i = 10; i < 22; i++) {
      tiles[16][i] = 'path'
      tiles[i][16] = 'path'
    }
  }

  return {
    cx,
    cy,
    tiles,
    biome,
    entities,
    discovered: false,
  }
}
