// CollisionSystem.ts — Tile-based collision for player
import { ChunkManager } from './ChunkManager'
import { Player } from '../entities/Player'
import { TILE_DEFS } from '../data/tiles'

export class CollisionSystem {
  private chunks: ChunkManager

  constructor(chunks: ChunkManager) {
    this.chunks = chunks
  }

  resolvePlayer(player: Player) {
    const data = player.data
    const radius = 0.3 // collision radius in tiles

    // Check 4 corners of player hitbox
    const left = data.x - radius
    const right = data.x + radius
    const top = data.y - radius
    const bottom = data.y + radius

    // Horizontal collision
    if (data.vx !== 0) {
      const newX = data.x + data.vx
      const checkX = data.vx > 0 ? newX + radius : newX - radius
      if (
        !this.isWalkable(Math.floor(checkX), Math.floor(top)) ||
        !this.isWalkable(Math.floor(checkX), Math.floor(bottom))
      ) {
        data.vx = 0
      }
    }

    // Vertical collision
    if (data.vy !== 0) {
      const newY = data.y + data.vy
      const checkY = data.vy > 0 ? newY + radius : newY - radius
      if (
        !this.isWalkable(Math.floor(left), Math.floor(checkY)) ||
        !this.isWalkable(Math.floor(right), Math.floor(checkY))
      ) {
        data.vy = 0
      }
    }

    // Apply velocity
    data.x += data.vx
    data.y += data.vy
  }

  private isWalkable(wx: number, wy: number): boolean {
    const result = this.chunks.getTileAt(wx, wy)
    if (!result) return true // unknown = walkable (loading)
    const def = TILE_DEFS[result.tile as keyof typeof TILE_DEFS]
    return def?.walkable ?? true
  }
}
