// Renderer.ts — Canvas2D rendering (tiles, entities, player, minimap)
import { Camera } from './Camera'
import { Player } from '../entities/Player'
import { TILE_DEFS } from '../data/tiles'
import type { Chunk, TileType, BiomeType } from './types'

export class Renderer {
  private ctx: CanvasRenderingContext2D
  private camera: Camera
  private tileSize: number
  private tileCache = new Map<string, string>() // tileKey → color

  constructor(ctx: CanvasRenderingContext2D, camera: Camera, tileSize: number) {
    this.ctx = ctx
    this.camera = camera
    this.tileSize = tileSize
  }

  clear() {
    this.ctx.fillStyle = '#1a1a2e'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  renderChunks(chunks: Chunk[]) {
    const ctx = this.ctx
    const ts = this.tileSize * this.camera.zoom
    const cx = this.ctx.canvas.width / 2
    const cy = this.ctx.canvas.height / 2

    for (const chunk of chunks) {
      if (!chunk.discovered) continue
      for (let ty = 0; ty < chunk.tiles.length; ty++) {
        for (let tx = 0; tx < chunk.tiles[ty].length; tx++) {
          const worldX = chunk.cx * 32 + tx
          const worldY = chunk.cy * 32 + ty
          const sx = (worldX - this.camera.offsetX) * ts + cx
          const sy = (worldY - this.camera.offsetY) * ts + cy

          // Cull off-screen
          if (sx + ts < 0 || sy + ts < 0 || sx > this.ctx.canvas.width || sy > this.ctx.canvas.height) continue

          const tile = chunk.tiles[ty][tx]
          const def = TILE_DEFS[tile]
          ctx.fillStyle = def?.color ?? '#333'
          ctx.fillRect(sx, sy, ts + 1, ts + 1)

          // Emoji overlay for special tiles
          if (def?.emoji && ts > 16) {
            ctx.font = `${Math.max(10, ts * 0.6)}px serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(def.emoji, sx + ts / 2, sy + ts / 2)
          }
        }
      }
    }
  }

  renderEntities(chunks: Chunk[], _camera: Camera) {
    // Resource nodes rendered as colored circles with emoji
    const ctx = this.ctx
    const ts = this.tileSize * this.camera.zoom
    const cx = this.ctx.canvas.width / 2
    const cy = this.ctx.canvas.height / 2

    for (const chunk of chunks) {
      if (!chunk.discovered) continue
      for (const entity of chunk.entities) {
        const sx = (entity.x - this.camera.offsetX) * ts + cx
        const sy = (entity.y - this.camera.offsetY) * ts + cy
        if (sx + ts < 0 || sy + ts < 0 || sx > this.ctx.canvas.width || sy > this.ctx.canvas.height) continue

        if (entity.type === 'resource_node' && entity.tileType) {
          const def = TILE_DEFS[entity.tileType]
          if (def?.emoji) {
            ctx.font = `${Math.max(14, ts * 0.8)}px serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(def.emoji, sx + ts / 2, sy + ts / 2)
          }
        }
      }
    }
  }

  renderPlayer(player: Player) {
    const ctx = this.ctx
    const ts = this.tileSize * this.camera.zoom
    const cx = this.ctx.canvas.width / 2
    const cy = this.ctx.canvas.height / 2

    const sx = (player.data.x - this.camera.offsetX) * ts + cx
    const sy = (player.data.y - this.camera.offsetY) * ts + cy

    // Body
    ctx.fillStyle = '#4a90d9'
    ctx.beginPath()
    ctx.arc(sx + ts / 2, sy + ts / 2, ts * 0.35, 0, Math.PI * 2)
    ctx.fill()

    // Eyes based on direction
    ctx.fillStyle = '#fff'
    const eyeOffset = ts * 0.12
    let ex1 = 0, ey1 = 0, ex2 = 0, ey2 = 0
    switch (player.data.direction) {
      case 'down': ex1 = -eyeOffset; ey1 = 2; ex2 = eyeOffset; ey2 = 2; break
      case 'up': ex1 = -eyeOffset; ey1 = -2; ex2 = eyeOffset; ey2 = -2; break
      case 'left': ex1 = -eyeOffset * 1.5; ey1 = 0; ex2 = -eyeOffset * 0.3; ey2 = 0; break
      case 'right': ex1 = eyeOffset * 0.3; ey1 = 0; ex2 = eyeOffset * 1.5; ey2 = 0; break
      default: ex1 = -eyeOffset; ey1 = 0; ex2 = eyeOffset; ey2 = 0
    }
    const eyeSize = ts * 0.06
    ctx.beginPath()
    ctx.arc(sx + ts / 2 + ex1, sy + ts / 2 + ey1, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(sx + ts / 2 + ex2, sy + ts / 2 + ey2, eyeSize, 0, Math.PI * 2)
    ctx.fill()

    // Direction indicator
    ctx.fillStyle = '#f0c040'
    ctx.beginPath()
    const indDist = ts * 0.45
    let ix = 0, iy = 0
    switch (player.data.direction) {
      case 'up': iy = -indDist; break
      case 'down': iy = indDist; break
      case 'left': ix = -indDist; break
      case 'right': ix = indDist; break
      default: iy = -indDist
    }
    ctx.arc(sx + ts / 2 + ix, sy + ts / 2 + iy, ts * 0.05, 0, Math.PI * 2)
    ctx.fill()

    // Running indicator
    if (player.data.isRunning) {
      ctx.strokeStyle = '#f0c040'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(sx + ts / 2, sy + ts / 2, ts * 0.45, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  renderMinimap(chunks: Chunk[], player: Player, canvasW: number, canvasH: number) {
    const ctx = this.ctx
    const mapSize = 120
    const margin = 10
    const mx = canvasW - mapSize - margin
    const my = margin

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(mx, my, mapSize, mapSize)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.strokeRect(mx, my, mapSize, mapSize)

    // Chunk dots
    const scale = mapSize / (8 * 32) // show ~8 chunk radius
    const pcx = player.data.x
    const pcy = player.data.y

    for (const chunk of chunks) {
      if (!chunk.discovered) continue
      const biomeColor: Record<BiomeType, string> = {
        farmland: '#4a7', forest: '#284', beach: '#da4',
        mountain: '#888', cave: '#443', snow: '#cdf',
        tropical: '#3b8', desert: '#c95',
      }
      const cx = mx + mapSize / 2 + (chunk.cx * 32 + 16 - pcx) * scale
      const cy = my + mapSize / 2 + (chunk.cy * 32 + 16 - pcy) * scale
      if (cx < mx || cx > mx + mapSize || cy < my || cy > my + mapSize) continue
      ctx.fillStyle = biomeColor[chunk.biome] ?? '#555'
      ctx.fillRect(cx - 2, cy - 2, 4, 4)
    }

    // Player dot
    ctx.fillStyle = '#f44'
    ctx.beginPath()
    ctx.arc(mx + mapSize / 2, my + mapSize / 2, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}
