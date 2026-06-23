// InteractionSystem.ts — Player ↔ world interaction (gathering, fishing)
import { Player } from '../entities/Player'
import { ChunkManager } from '../engine/ChunkManager'
import { TILE_DEFS } from '../data/tiles'
import { RESOURCE_DROPS, TILE_TOOL_MAP, TOOL_DEFS } from '../data/tools'
import type { TileType, NearbyResource } from '../engine/types'

export class InteractionSystem {
  private chunks: ChunkManager
  private notifications: string[] = []
  private gatheredTiles = new Map<string, number>() // tileKey → timestamp of gather

  constructor(chunks: ChunkManager) {
    this.chunks = chunks
  }

  // Check what's nearby for HUD prompt
  getNearbyResource(player: Player): NearbyResource | null {
    const facing = player.getFacingTile()
    const result = this.chunks.getTileAt(facing.x, facing.y)
    if (!result) return null

    const tile = result.tile as TileType
    const def = TILE_DEFS[tile]
    if (!def?.gatherable && !['water'].includes(tile)) return null

    const toolNeeded = TILE_TOOL_MAP[tile] ?? null
    return {
      tileType: tile,
      toolNeeded,
      emoji: def?.emoji ?? '❓',
      distance: 1,
    }
  }

  // Attempt to gather the facing tile
  attemptGather(player: Player): { success: boolean; items: { itemId: string; count: number }[] } {
    if (player.data.interactCooldown > 0) return { success: false, items: [] }

    const facing = player.getFacingTile()
    const result = this.chunks.getTileAt(facing.x, facing.y)
    if (!result) return { success: false, items: [] }

    const tile = result.tile as TileType
    const tileKey = `${facing.x},${facing.y}`

    // Check cooldown for this specific tile
    const lastGather = this.gatheredTiles.get(tileKey)
    if (lastGather && Date.now() - lastGather < 3000) {
      return { success: false, items: [] }
    }

    // Check tool requirement
    const requiredTool = TILE_TOOL_MAP[tile]
    if (requiredTool) {
      const toolDef = this.getEquippedToolDef(player)
      if (!toolDef || toolDef.type !== requiredTool) {
        this.addNotification(`Need ${requiredTool}!`)
        return { success: false, items: [] }
      }
    }

    // Check stamina
    if (player.data.stamina < 2) {
      this.addNotification('Too tired!')
      return { success: false, items: [] }
    }

    // Consume stamina
    player.data.stamina = Math.max(0, player.data.stamina - 2)

    // Calculate drops
    const drops = RESOURCE_DROPS[tile]
    if (!drops) return { success: false, items: [] }

    const gathered: { itemId: string; count: number }[] = []
    const toolDef = this.getEquippedToolDef(player)
    const yieldMult = toolDef?.yieldMult ?? 1

    for (const drop of drops) {
      if (Math.random() < drop.chance) {
        let count = Math.floor(drop.min + Math.random() * (drop.max - drop.min + 1))
        count = Math.max(1, Math.round(count * yieldMult))
        if (count > 0) {
          player.addItem(drop.itemId, count)
          gathered.push({ itemId: drop.itemId, count })
        }
      }
    }

    // Mark tile as gathered
    this.gatheredTiles.set(tileKey, Date.now())

    // Durability
    if (toolDef) {
      const slot = player.data.inventory.find(s => s.itemId === player.data.equippedTool)
      // Simple durability: 10% chance to "break" (for now just remove)
      // TODO: proper durability tracking
    }

    if (gathered.length > 0) {
      const msg = gathered.map(g => `+${g.count} ${g.itemId}`).join(', ')
      this.addNotification(msg)
    }

    return { success: gathered.length > 0, items: gathered }
  }

  // Eat food to restore stamina
  eatFood(player: Player, itemId: string): boolean {
    const foodStamina: Record<string, number> = {
      berry: 10,
      bread: 20,
      soup: 40,
      pie: 60,
      fish_common: 15,
      fish_bass: 20,
      fish_salmon: 25,
    }
    const restore = foodStamina[itemId]
    if (!restore) return false
    if (!player.hasItem(itemId)) return false

    player.removeItem(itemId, 1)
    player.data.stamina = Math.min(player.data.maxStamina, player.data.stamina + restore)
    this.addNotification(`Ate ${itemId}! +${restore} stamina`)
    return true
  }

  private getEquippedToolDef(player: Player) {
    const toolId = player.data.equippedTool
    if (!toolId) return null
    return TOOL_DEFS[toolId] ?? null
  }

  addNotification(msg: string) {
    this.notifications.push(msg)
    if (this.notifications.length > 5) this.notifications.shift()
  }

  consumeNotifications(): string[] {
    const n = [...this.notifications]
    this.notifications = []
    return n
  }
}
