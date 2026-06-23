// ChunkManager.ts — Load/unload chunks around player, procedural generation
import { generateChunk } from '../world/WorldGenerator'
import type { Chunk, ChunkCoord } from './types'

export class ChunkManager {
  private chunks = new Map<string, Chunk>()
  private renderDistance = 3 // chunks in each direction
  private discovered = new Set<string>()

  private key(cx: number, cy: number): string {
    return `${cx},${cy}`
  }

  getChunk(cx: number, cy: number): Chunk | undefined {
    return this.chunks.get(this.key(cx, cy))
  }

  updateAround(playerCx: number, playerCy: number) {
    const needed = new Set<string>()

    for (let dy = -this.renderDistance; dy <= this.renderDistance; dy++) {
      for (let dx = -this.renderDistance; dx <= this.renderDistance; dx++) {
        const cx = playerCx + dx
        const cy = playerCy + dy
        const k = this.key(cx, cy)
        needed.add(k)

        if (!this.chunks.has(k)) {
          const chunk = generateChunk(cx, cy)
          this.chunks.set(k, chunk)
        }

        // Discover chunks within 2 radius
        if (Math.abs(dx) <= 2 && Math.abs(dy) <= 2) {
          const chunk = this.chunks.get(k)!
          if (!chunk.discovered) {
            chunk.discovered = true
            this.discovered.add(k)
          }
        }
      }
    }

    // Unload distant chunks (keep 5 radius)
    for (const [k, chunk] of this.chunks) {
      const dx = Math.abs(chunk.cx - playerCx)
      const dy = Math.abs(chunk.cy - playerCy)
      if (dx > this.renderDistance + 2 || dy > this.renderDistance + 2) {
        this.chunks.delete(k)
      }
    }
  }

  getVisibleChunks(camX: number, camY: number, canvasW: number, canvasH: number): Chunk[] {
    const result: Chunk[] = []
    for (const chunk of this.chunks.values()) {
      if (!chunk.discovered) continue
      const chunkWorldX = chunk.cx * 32
      const chunkWorldY = chunk.cy * 32
      // Rough visibility check
      if (
        chunkWorldX + 32 > camX - canvasW / 64 &&
        chunkWorldX < camX + canvasW / 64 &&
        chunkWorldY + 32 > camY - canvasH / 64 &&
        chunkWorldY < camY + canvasH / 64
      ) {
        result.push(chunk)
      }
    }
    return result
  }

  getDiscoveredCount(): number {
    return this.discovered.size
  }

  // Get tile at world coordinates
  getTileAt(worldX: number, worldY: number): { tile: string; chunk: Chunk } | null {
    const cx = Math.floor(worldX / 32)
    const cy = Math.floor(worldY / 32)
    const chunk = this.chunks.get(this.key(cx, cy))
    if (!chunk) return null
    const tx = ((worldX % 32) + 32) % 32
    const ty = ((worldY % 32) + 32) % 32
    return { tile: chunk.tiles[ty][tx], chunk }
  }

  serialize(): unknown {
    return {
      discovered: Array.from(this.discovered),
      chunks: Array.from(this.chunks.entries()).map(([k, c]) => ({
        k, cx: c.cx, cy: c.cy, biome: c.biome, tiles: c.tiles, entities: c.entities, discovered: c.discovered,
      })),
    }
  }

  deserialize(data: any) {
    this.discovered = new Set(data.discovered)
    this.chunks.clear()
    for (const c of data.chunks) {
      this.chunks.set(this.key(c.cx, c.cy), {
        cx: c.cx, cy: c.cy, biome: c.biome, tiles: c.tiles, entities: c.entities, discovered: c.discovered,
      })
    }
  }
}
