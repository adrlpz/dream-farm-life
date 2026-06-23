// InputManager.ts — Keyboard + touch + mouse input
import type { InputState } from './types'

export class InputManager {
  private keys = new Set<string>()
  private joystick = { dx: 0, dy: 0, active: false }
  private tap = { x: 0, y: 0, active: false }
  private mouse = { x: 0, y: 0, down: false }
  private canvas: HTMLCanvasElement

  // Touch joystick state
  private touchStart: { x: number; y: number } | null = null
  private joystickRadius = 60

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.bindKeyboard()
    this.bindTouch()
    this.bindMouse()
  }

  private bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase())
      // Prevent scroll on arrow keys/space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    })
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase())
    })
  }

  private bindTouch() {
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = this.canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // Left half = joystick, right half = tap
      if (x < this.canvas.width / 2) {
        this.touchStart = { x, y }
        this.joystick.active = true
      } else {
        this.tap = { x, y, active: true }
      }
    }, { passive: false })

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      if (this.touchStart && e.touches[0]) {
        const touch = e.touches[0]
        const rect = this.canvas.getBoundingClientRect()
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        let dx = x - this.touchStart.x
        let dy = y - this.touchStart.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > this.joystickRadius) {
          dx = (dx / dist) * this.joystickRadius
          dy = (dy / dist) * this.joystickRadius
        }
        this.joystick.dx = dx / this.joystickRadius
        this.joystick.dy = dy / this.joystickRadius
      }
    }, { passive: false })

    const touchEnd = () => {
      this.touchStart = null
      this.joystick = { dx: 0, dy: 0, active: false }
      this.tap = { x: 0, y: 0, active: false }
    }
    this.canvas.addEventListener('touchend', touchEnd)
    this.canvas.addEventListener('touchcancel', touchEnd)
  }

  private bindMouse() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      this.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top, down: true }
      this.tap = { x: this.mouse.x, y: this.mouse.y, active: true }
    })
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      this.mouse.x = e.clientX - rect.left
      this.mouse.y = e.clientY - rect.top
    })
    this.canvas.addEventListener('mouseup', () => {
      this.mouse.down = false
      this.tap.active = false
    })
  }

  getState(): InputState {
    return {
      keys: this.keys,
      touchJoystick: { ...this.joystick },
      tap: { ...this.tap },
      mouse: { ...this.mouse },
    }
  }

  consumeTap() {
    this.tap.active = false
  }

  // Zoom via scroll
  bindZoom(callback: (delta: number) => void) {
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault()
      callback(-e.deltaY * 0.001)
    }, { passive: false })
  }

  destroy() {
    // Cleanup listeners if needed
  }
}
