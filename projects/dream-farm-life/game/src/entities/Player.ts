// Player.ts — Player entity with movement, stamina, inventory, tools
import type { PlayerData, Direction, InputState, InventorySlot } from '../engine/types'

export class Player {
  data: PlayerData

  constructor(x: number, y: number) {
    this.data = {
      x,
      y,
      vx: 0,
      vy: 0,
      direction: 'down',
      speed: 4,
      stamina: 100,
      maxStamina: 100,
      isRunning: false,
      animFrame: 0,
      animTimer: 0,
      inventory: [
        { itemId: 'tool_axe_wood', count: 1 },
        { itemId: 'tool_pickaxe_wood', count: 1 },
        { itemId: 'tool_hoe_wood', count: 1 },
        { itemId: 'tool_fishing_rod', count: 1 },
        { itemId: 'tool_bug_net', count: 1 },
      ],
      equippedTool: 'tool_axe_wood',
      hotbar: ['tool_axe_wood', 'tool_pickaxe_wood', 'tool_hoe_wood', 'tool_fishing_rod', 'tool_bug_net'],
      hotbarIndex: 0,
      interacting: false,
      interactCooldown: 0,
    }
  }

  processInput(input: InputState, dt: number) {
    let dx = 0
    let dy = 0

    // Movement
    if (input.keys.has('w') || input.keys.has('arrowup')) dy -= 1
    if (input.keys.has('s') || input.keys.has('arrowdown')) dy += 1
    if (input.keys.has('a') || input.keys.has('arrowleft')) dx -= 1
    if (input.keys.has('d') || input.keys.has('arrowright')) dx += 1

    // Touch joystick
    if (input.touchJoystick.active) {
      dx = input.touchJoystick.dx
      dy = input.touchJoystick.dy
    }

    // Normalize diagonal
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len > 0) {
      dx /= len
      dy /= len
    }

    // Run
    const running = input.keys.has('shift') || input.keys.has(' ')
    const speedMult = running && this.data.stamina > 0 ? 1.8 : 1
    this.data.isRunning = running && len > 0 && this.data.stamina > 0

    if (this.data.isRunning) {
      this.data.stamina = Math.max(0, this.data.stamina - 15 * dt)
    }

    this.data.vx = dx * this.data.speed * speedMult * dt
    this.data.vy = dy * this.data.speed * speedMult * dt

    // Direction
    if (len > 0.1) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.data.direction = dx > 0 ? 'right' : 'left'
      } else {
        this.data.direction = dy > 0 ? 'down' : 'up'
      }
    }

    // Hotbar selection (1-5 keys)
    for (let i = 1; i <= 5; i++) {
      if (input.keys.has(String(i))) {
        this.data.hotbarIndex = i - 1
        this.data.equippedTool = this.data.hotbar[i - 1]
      }
    }

    // Mouse wheel / Q/E to cycle hotbar
    if (input.keys.has('q')) {
      this.data.hotbarIndex = (this.data.hotbarIndex + 4) % 5
      this.data.equippedTool = this.data.hotbar[this.data.hotbarIndex]
    }
    if (input.keys.has('e')) {
      this.data.hotbarIndex = (this.data.hotbarIndex + 1) % 5
      this.data.equippedTool = this.data.hotbar[this.data.hotbarIndex]
    }

    // Interaction cooldown
    if (this.data.interactCooldown > 0) {
      this.data.interactCooldown = Math.max(0, this.data.interactCooldown - dt)
    }

    // Interact (E or Space)
    this.data.interacting = (input.keys.has('e') || input.keys.has(' ')) && this.data.interactCooldown <= 0

    // Use item (left click / Enter)
    if (this.data.interacting) {
      this.data.interactCooldown = 0.4 // cooldown in seconds
    }
  }

  updateAnimation(dt: number) {
    const len = Math.sqrt(this.data.vx * this.data.vx + this.data.vy * this.data.vy)
    if (len > 0.001) {
      this.data.animTimer += dt
      if (this.data.animTimer > 0.15) {
        this.data.animTimer = 0
        this.data.animFrame = (this.data.animFrame + 1) % 4
      }
    } else {
      this.data.animFrame = 0
      this.data.animTimer = 0
    }
  }

  // Inventory management
  addItem(itemId: string, count: number): boolean {
    const existing = this.data.inventory.find(s => s.itemId === itemId)
    if (existing) {
      existing.count += count
      return true
    }
    if (this.data.inventory.length < 30) {
      this.data.inventory.push({ itemId, count })
      return true
    }
    return false // inventory full
  }

  removeItem(itemId: string, count: number): boolean {
    const slot = this.data.inventory.find(s => s.itemId === itemId)
    if (!slot || slot.count < count) return false
    slot.count -= count
    if (slot.count <= 0) {
      this.data.inventory = this.data.inventory.filter(s => s.itemId !== itemId)
    }
    return true
  }

  hasItem(itemId: string, count: number = 1): boolean {
    const slot = this.data.inventory.find(s => s.itemId === itemId)
    return slot ? slot.count >= count : false
  }

  getItemCount(itemId: string): number {
    return this.data.inventory.find(s => s.itemId === itemId)?.count ?? 0
  }

  // Get the facing tile position
  getFacingTile(): { x: number; y: number } {
    const offsets: Record<Direction, { dx: number; dy: number }> = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 },
      up_left: { dx: -1, dy: -1 },
      up_right: { dx: 1, dy: -1 },
      down_left: { dx: -1, dy: 1 },
      down_right: { dx: 1, dy: 1 },
    }
    const off = offsets[this.data.direction]
    return {
      x: Math.floor(this.data.x) + off.dx,
      y: Math.floor(this.data.y) + off.dy,
    }
  }
}
