// BuildingPlacer.ts — Building placement and land claiming
import { BUILDINGS, getBuildingTier, type BuildingDef } from '../data/buildings'
import type { PlacedBuildingState } from './farmTypes'
import type { Player } from '../entities/Player'

export class BuildingPlacer {
  buildings: PlacedBuildingState[] = []
  landClaim: { x: number; y: number; size: number } = { x: 7, y: 7, size: 9 }
  private notifications: string[] = []

  // Place a building
  placeBuilding(buildingId: string, x: number, y: number, player: Player): boolean {
    const def = BUILDINGS[buildingId]
    if (!def) return false

    // Check if in claim
    if (!this.isInClaim(x, y, def.width, def.height)) {
      this.addNotification('Must be within your land claim!')
      return false
    }

    // Check if overlapping
    if (this.isOverlapping(x, y, def.width, def.height)) {
      this.addNotification('Building overlaps another!')
      return false
    }

    // Check if player has the building item
    if (!player.hasItem(`building_${buildingId}`)) {
      this.addNotification(`Need to craft ${def.name} first!`)
      return false
    }

    // Check if overlapping NPC areas (near 0,0 of each chunk)
    // Home village is chunk 0,0 — don't build there
    const cx = Math.floor(x / 32)
    const cy = Math.floor(y / 32)
    if (cx === 0 && cy === 0 && x >= 10 && x <= 22 && y >= 10 && y <= 22) {
      this.addNotification('Cannot build in the village center!')
      return false
    }

    player.removeItem(`building_${buildingId}`, 1)

    this.buildings.push({
      id: `bld_${Date.now()}`,
      buildingId,
      x,
      y,
      tier: 1,
      width: def.width,
      height: def.height,
    })

    this.addNotification(`🏗️ Built ${def.name}!`)
    return true
  }

  // Upgrade a building
  upgradeBuilding(buildingStateId: string, player: Player): boolean {
    const building = this.buildings.find(b => b.id === buildingStateId)
    if (!building) return false

    const def = BUILDINGS[building.buildingId]
    if (!def) return false

    if (building.tier >= def.maxTier) {
      this.addNotification('Already max tier!')
      return false
    }

    const nextTier = getBuildingTier(building.buildingId, building.tier + 1)
    if (!nextTier) return false

    // Check upgrade cost
    for (const cost of nextTier.upgradeCost) {
      if (!player.hasItem(cost.itemId, cost.count)) {
        this.addNotification(`Need ${cost.count}x ${cost.itemId}!`)
        return false
      }
    }

    // Consume cost
    for (const cost of nextTier.upgradeCost) {
      player.removeItem(cost.itemId, cost.count)
    }

    building.tier++
    this.addNotification(`⬆️ Upgraded ${def.name} to tier ${building.tier}!`)
    return true
  }

  // Expand land claim
  expandClaim(player: Player): boolean {
    const cost = this.getClaimExpansionCost()
    if (!player.hasItem('gold_ore', cost.gold) || !player.hasItem('stone', cost.stone)) {
      this.addNotification(`Need ${cost.gold} gold ore + ${cost.stone} stone!`)
      return false
    }

    player.removeItem('gold_ore', cost.gold)
    player.removeItem('stone', cost.stone)

    this.landClaim.size += 2
    this.landClaim.x--
    this.landClaim.y--

    this.addNotification(`🗺️ Land expanded to ${this.landClaim.size}x${this.landClaim.size}!`)
    return true
  }

  getClaimExpansionCost(): { gold: number; stone: number } {
    const size = this.landClaim.size
    return {
      gold: Math.floor(size / 4) + 1,
      stone: Math.floor(size / 2) + 5,
    }
  }

  isInClaim(x: number, y: number, w: number, h: number): boolean {
    const c = this.landClaim
    return x >= c.x && y >= c.y && x + w <= c.x + c.size && y + h <= c.y + c.size
  }

  isOverlapping(x: number, y: number, w: number, h: number): boolean {
    for (const b of this.buildings) {
      if (x < b.x + b.width && x + w > b.x && y < b.y + b.height && y + h > b.y) {
        return true
      }
    }
    return false
  }

  getBuildingAt(x: number, y: number): PlacedBuildingState | null {
    for (const b of this.buildings) {
      if (x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height) {
        return b
      }
    }
    return null
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

  serialize() {
    return { buildings: this.buildings, claim: this.landClaim }
  }

  deserialize(data: any) {
    if (data?.buildings) this.buildings = data.buildings
    if (data?.claim) this.landClaim = data.claim
  }
}
