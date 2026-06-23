// Player.ts — Player entity with movement, stamina, animation
import type { PlayerData, Direction, InputState } from '../engine/types'

export class Player {
  data: PlayerData

  constructor(x: number, y: number) {
    this.data = {
      x,
      y,
      vx: 0,
      vy: 0,
      direction: 'down',
      speed: 4, // tiles per second
      stamina: 100,
      maxStamina: 100,
      isRunning: false,
      animFrame: 0,
      animTimer: 0,
    }
  }

  processInput(input: InputState, dt: number) {
    let dx = 0
    let dy = 0

    // Keyboard
    if (input.keys.has('w') || input.keys.has('arrowup')) dy -= 1
    if (input.keys.has('s') || input.keys.has('arrowdown')) dy += 1
    if (input.keys.has('a') || input.keys.has('arrowleft')) dx -= 1
    if (input.keys.has('d') || input.keys.has('arrowright')) dx += 1

    // Touch joystick (overrides if active)
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

    // Stamina drain
    if (this.data.isRunning) {
      this.data.stamina = Math.max(0, this.data.stamina - 15 * dt)
    }

    // Apply speed
    this.data.vx = dx * this.data.speed * speedMult * dt
    this.data.vy = dy * this.data.speed * speedMult * dt

    // Update direction
    if (len > 0.1) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.data.direction = dx > 0 ? 'right' : 'left'
      } else {
        this.data.direction = dy > 0 ? 'down' : 'up'
      }
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
}
