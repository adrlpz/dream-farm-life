// Renderer.ts — Canvas2D rendering (Phase 2: +interaction prompt, hotbar)
import { Camera } from './Camera'
import { Player } from '../entities/Player'
import { TILE_DEFS } from '../data/tiles'
import { ITEMS } from '../data/items'
import { TOOL_DEFS } from '../data/tools'
import type { Chunk, TileType, BiomeType, NearbyResource } from './types'
import type { FarmPlot } from '../systems/farmTypes'
import type { NpcState } from '../entities/NPC'
import type { NpcDef } from '../data/npcs'
import { CROPS } from '../data/crops'

export class Renderer {
  private ctx: CanvasRenderingContext2D
  private camera: Camera
  private tileSize: number

  constructor(ctx: CanvasRenderingContext2D, camera: Camera, tileSize: number) {
    this.ctx = ctx
    this.camera = camera
    this.tileSize = tileSize
  }

  clear() {
    // Dynamic sky color based on time
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

          if (sx + ts < 0 || sy + ts < 0 || sx > this.ctx.canvas.width || sy > this.ctx.canvas.height) continue

          const tile = chunk.tiles[ty][tx]
          const def = TILE_DEFS[tile]
          ctx.fillStyle = def?.color ?? '#333'
          ctx.fillRect(sx, sy, ts + 1, ts + 1)

          // Emoji for special tiles (only when zoomed in enough)
          if (def?.emoji && ts > 20) {
            ctx.font = `${Math.max(12, ts * 0.6)}px serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(def.emoji, sx + ts / 2, sy + ts / 2)
          }
        }
      }
    }
  }

  renderEntities(chunks: Chunk[], _camera: Camera) {
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
          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.2)'
          ctx.beginPath()
          ctx.ellipse(sx + ts / 2, sy + ts * 0.85, ts * 0.3, ts * 0.1, 0, 0, Math.PI * 2)
          ctx.fill()

          if (def?.emoji) {
            ctx.font = `${Math.max(16, ts * 0.85)}px serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(def.emoji, sx + ts / 2, sy + ts * 0.45)
          }

          // Depleted indicator (dim)
          if (entity.meta?.depleted) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)'
            ctx.fillRect(sx, sy, ts, ts)
          }
        }
      }
    }
  }

  renderFarmPlots(plots: FarmPlot[], camera: Camera, canvasW: number, canvasH: number) {
    const ctx = this.ctx
    const ts = this.tileSize * this.camera.zoom
    const cx = canvasW / 2
    const cy = canvasH / 2

    for (const plot of plots) {
      const sx = (plot.x - this.camera.offsetX) * ts + cx
      const sy = (plot.y - this.camera.offsetY) * ts + cy
      if (sx + ts < 0 || sy + ts < 0 || sx > canvasW || sy > canvasH) continue

      // Tilled soil base
      ctx.fillStyle = plot.watered ? '#5a4a2e' : '#7a6a4e'
      ctx.fillRect(sx + 1, sy + 1, ts - 2, ts - 2)

      // Soil lines
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'
      ctx.lineWidth = 1
      for (let i = 1; i < 4; i++) {
        ctx.beginPath()
        ctx.moveTo(sx + 2, sy + (ts * i) / 4)
        ctx.lineTo(sx + ts - 2, sy + (ts * i) / 4)
        ctx.stroke()
      }

      // Water shimmer
      if (plot.watered) {
        ctx.fillStyle = 'rgba(59,141,189,0.2)'
        ctx.fillRect(sx + 1, sy + 1, ts - 2, ts - 2)
      }

      // Crop sprite
      if (plot.cropId) {
        const crop = CROPS[plot.cropId]
        if (crop) {
          const emoji = crop.stageEmojis[plot.stage] ?? crop.emoji
          ctx.font = `${Math.max(14, ts * 0.7)}px serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(emoji, sx + ts / 2, sy + ts * 0.4)

          // Harvest glow
          if (plot.harvestable) {
            ctx.strokeStyle = 'rgba(74,222,128,0.6)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(sx + ts / 2, sy + ts / 2, ts * 0.45, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
      }
    }
  }

  renderNpcs(npcs: NpcState[], camera: Camera, canvasW: number, canvasH: number) {
    const ctx = this.ctx
    const ts = this.tileSize * this.camera.zoom
    const cx = canvasW / 2
    const cy = canvasH / 2

    for (const npc of npcs) {
      const sx = (npc.x - this.camera.offsetX) * ts + cx
      const sy = (npc.y - this.camera.offsetY) * ts + cy
      if (sx + ts < 0 || sy + ts < 0 || sx > canvasW || sy > canvasH) continue

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.beginPath()
      ctx.ellipse(sx + ts / 2, sy + ts * 0.9, ts * 0.3, ts * 0.08, 0, 0, Math.PI * 2)
      ctx.fill()

      // NPC emoji
      const npcDefs: Record<string, string> = {
        elder: '👴', merchant: '👩‍🌾', blacksmith: '🔨',
        botanist: '🌸', fisherman: '🎣', archaeologist: '🏺', trader: '🎭',
      }
      ctx.font = `${Math.max(16, ts * 0.9)}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(npcDefs[npc.id] ?? '👤', sx + ts / 2, sy + ts * 0.45)

      // Name tag
      if (ts > 20) {
        ctx.font = `${Math.max(8, ts * 0.25)}px monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.fillText(npc.id, sx + ts / 2, sy + ts * 1.05)
      }
    }
  }

  renderNpcPrompt(npcDef: NpcDef, canvasW: number, canvasH: number) {
    const ctx = this.ctx
    const text = `[E] ${npcDef.emoji} Talk to ${npcDef.name}`
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    const tw = ctx.measureText(text).width + 24
    const px = canvasW / 2
    const py = canvasH / 2 + 80

    ctx.fillStyle = 'rgba(100,50,150,0.8)'
    ctx.beginPath()
    ctx.roundRect(px - tw / 2, py - 12, tw, 28, 6)
    ctx.fill()
    ctx.fillStyle = '#e9d5ff'
    ctx.fillText(text, px, py + 5)
  }

  renderPlayer(player: Player) {
    const ctx = this.ctx
    const ts = this.tileSize * this.camera.zoom
    const cx = this.ctx.canvas.width / 2
    const cy = this.ctx.canvas.height / 2
    const sx = (player.data.x - this.camera.offsetX) * ts + cx
    const sy = (player.data.y - this.camera.offsetY) * ts + cy

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(sx + ts / 2, sy + ts * 0.85, ts * 0.3, ts * 0.08, 0, 0, Math.PI * 2)
    ctx.fill()

    // Body
    ctx.fillStyle = '#4a90d9'
    ctx.beginPath()
    ctx.arc(sx + ts / 2, sy + ts / 2, ts * 0.35, 0, Math.PI * 2)
    ctx.fill()

    // Face
    ctx.fillStyle = '#f5d0a9'
    ctx.beginPath()
    ctx.arc(sx + ts / 2, sy + ts * 0.4, ts * 0.22, 0, Math.PI * 2)
    ctx.fill()

    // Eyes
    ctx.fillStyle = '#333'
    const eyeOffset = ts * 0.08
    let ex1 = 0, ey1 = 0, ex2 = 0, ey2 = 0
    switch (player.data.direction) {
      case 'down': ex1 = -eyeOffset; ey1 = 2; ex2 = eyeOffset; ey2 = 2; break
      case 'up': ey1 = -3; ey2 = -3; break
      case 'left': ex1 = -eyeOffset * 1.5; ex2 = -eyeOffset * 0.3; break
      case 'right': ex1 = eyeOffset * 0.3; ex2 = eyeOffset * 1.5; break
      default: ex1 = -eyeOffset; ex2 = eyeOffset
    }
    const eyeSize = ts * 0.04
    ctx.beginPath()
    ctx.arc(sx + ts / 2 + ex1, sy + ts * 0.38 + ey1, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(sx + ts / 2 + ex2, sy + ts * 0.38 + ey2, eyeSize, 0, Math.PI * 2)
    ctx.fill()

    // Equipped tool
    if (player.data.equippedTool) {
      const toolDef = TOOL_DEFS[player.data.equippedTool]
      if (toolDef) {
        ctx.font = `${Math.max(10, ts * 0.35)}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        let tx = 0, tty = 0
        switch (player.data.direction) {
          case 'right': tx = ts * 0.5; tty = ts * 0.1; break
          case 'left': tx = -ts * 0.3; tty = ts * 0.1; break
          case 'up': tx = ts * 0.4; tty = -ts * 0.2; break
          case 'down': tx = -ts * 0.3; tty = ts * 0.5; break
        }
        ctx.fillText(toolDef.emoji, sx + ts / 2 + tx, sy + ts / 2 + tty)
      }
    }

    // Running trail
    if (player.data.isRunning) {
      ctx.strokeStyle = 'rgba(240,192,64,0.3)'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(sx + ts / 2, sy + ts / 2, ts * 0.45, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  renderInteractionPrompt(nearby: NearbyResource, player: Player, canvasW: number, canvasH: number) {
    const ctx = this.ctx
    const hasTool = nearby.toolNeeded ? player.data.equippedTool && TOOL_DEFS[player.data.equippedTool]?.type === nearby.toolNeeded : true

    const text = hasTool
      ? `[E] ${nearby.emoji} Gather`
      : `❌ Need ${nearby.toolNeeded}`

    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    const tw = ctx.measureText(text).width + 24

    const px = canvasW / 2
    const py = canvasH / 2 + 60

    ctx.fillStyle = hasTool ? 'rgba(0,0,0,0.7)' : 'rgba(180,0,0,0.7)'
    ctx.beginPath()
    ctx.roundRect(px - tw / 2, py - 12, tw, 28, 6)
    ctx.fill()

    ctx.fillStyle = hasTool ? '#4ade80' : '#fca5a5'
    ctx.fillText(text, px, py + 5)
  }

  renderHotbar(player: Player, canvasW: number, canvasH: number) {
    const ctx = this.ctx
    const slotSize = 48
    const gap = 4
    const totalW = 5 * slotSize + 4 * gap
    const startX = (canvasW - totalW) / 2
    const startY = canvasH - slotSize - 16

    for (let i = 0; i < 5; i++) {
      const x = startX + i * (slotSize + gap)

      // Slot background
      ctx.fillStyle = i === player.data.hotbarIndex ? 'rgba(74,222,128,0.4)' : 'rgba(0,0,0,0.5)'
      ctx.beginPath()
      ctx.roundRect(x, startY, slotSize, slotSize, 6)
      ctx.fill()

      // Border
      ctx.strokeStyle = i === player.data.hotbarIndex ? '#4ade80' : 'rgba(255,255,255,0.2)'
      ctx.lineWidth = i === player.data.hotbarIndex ? 2 : 1
      ctx.beginPath()
      ctx.roundRect(x, startY, slotSize, slotSize, 6)
      ctx.stroke()

      // Item emoji
      const itemId = player.data.hotbar[i]
      if (itemId) {
        const item = ITEMS[itemId] ?? TOOL_DEFS[itemId]
        if (item) {
          ctx.font = '24px serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(item.emoji, x + slotSize / 2, startY + slotSize / 2)
        }
      }

      // Key number
      ctx.font = '10px monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.textAlign = 'left'
      ctx.fillText(String(i + 1), x + 4, startY + 12)
    }
  }

  renderMinimap(chunks: Chunk[], player: Player, canvasW: number, canvasH: number) {
    const ctx = this.ctx
    const mapSize = 100
    const margin = 8
    const mx = canvasW - mapSize - margin
    const my = margin

    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(mx, my, mapSize, mapSize)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(mx, my, mapSize, mapSize)

    const scale = mapSize / (8 * 32)
    const biomeColor: Record<BiomeType, string> = {
      farmland: '#4a7', forest: '#284', beach: '#da4',
      mountain: '#888', cave: '#443', snow: '#cdf',
      tropical: '#3b8', desert: '#c95',
    }

    for (const chunk of chunks) {
      if (!chunk.discovered) continue
      const cx = mx + mapSize / 2 + (chunk.cx * 32 + 16 - player.data.x) * scale
      const cy = my + mapSize / 2 + (chunk.cy * 32 + 16 - player.data.y) * scale
      if (cx < mx || cx > mx + mapSize || cy < my || cy > my + mapSize) continue
      ctx.fillStyle = biomeColor[chunk.biome] ?? '#555'
      ctx.fillRect(cx - 2, cy - 2, 4, 4)
    }

    // Player
    ctx.fillStyle = '#f44'
    ctx.beginPath()
    ctx.arc(mx + mapSize / 2, my + mapSize / 2, 3, 0, Math.PI * 2)
    ctx.fill()

    // Direction indicator
    const dirLen = 8
    const dirs: Record<string, { dx: number; dy: number }> = {
      up: { dx: 0, dy: -1 }, down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 }, right: { dx: 1, dy: 0 },
    }
    const d = dirs[player.data.direction]
    if (d) {
      ctx.strokeStyle = '#f44'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(mx + mapSize / 2, my + mapSize / 2)
      ctx.lineTo(mx + mapSize / 2 + d.dx * dirLen, my + mapSize / 2 + d.dy * dirLen)
      ctx.stroke()
    }
  }
}
