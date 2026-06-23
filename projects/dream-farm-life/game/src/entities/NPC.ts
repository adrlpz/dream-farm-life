// NPC entity — placed in world, has dialog, gives quests
import { NPC_DEFS, type NpcDef, type DialogLine } from '../data/npcs'

export interface NpcState {
  id: string
  x: number
  y: number
  friendship: number
  talkedToday: boolean
}

export class NpcManager {
  npcs: NpcState[] = []
  private defs = NPC_DEFS

  initialize() {
    // Spawn NPCs at their home positions
    this.npcs = Object.values(this.defs).map(def => ({
      id: def.id,
      x: def.homeX,
      y: def.homeY,
      friendship: 0,
      talkedToday: false,
    }))
  }

  getNpcAt(wx: number, wy: number, radius: number = 1.5): NpcState | null {
    for (const npc of this.npcs) {
      const dx = npc.x - wx
      const dy = npc.y - wy
      if (Math.sqrt(dx * dx + dy * dy) < radius) return npc
    }
    return null
  }

  getDef(npcId: string): NpcDef | undefined {
    return this.defs[npcId]
  }

  getDialog(npcId: string, questState: 'none' | 'active' | 'complete'): DialogLine[] {
    const def = this.defs[npcId]
    if (!def) return []

    // Return appropriate dialog based on quest state
    return def.dialog
  }

  giveGift(npcId: string, itemId: string): { friendship: number; liked: boolean } {
    const npc = this.npcs.find(n => n.id === npcId)
    const def = this.defs[npcId]
    if (!npc || !def) return { friendship: 0, liked: false }

    const liked = def.likes.includes(itemId)
    const hated = def.hates.includes(itemId)
    const change = liked ? 10 : hated ? -5 : 3

    npc.friendship = Math.max(0, Math.min(def.friendshipMax, npc.friendship + change))
    return { friendship: npc.friendship, liked }
  }

  resetDaily() {
    for (const npc of this.npcs) {
      npc.talkedToday = false
    }
  }

  serialize() {
    return this.npcs.map(n => ({ id: n.id, friendship: n.friendship }))
  }

  deserialize(data: any[]) {
    for (const saved of data) {
      const npc = this.npcs.find(n => n.id === saved.id)
      if (npc) npc.friendship = saved.friendship ?? 0
    }
  }
}
