// Camera.ts — Smooth follow camera with zoom & shake
import type { CameraData } from './types'

export class Camera {
  data: CameraData
  private lerpSpeed = 5

  constructor() {
    this.data = { x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, shake: 0 }
  }

  setTarget(x: number, y: number) {
    this.data.targetX = x
    this.data.targetY = y
  }

  snapToTarget() {
    this.data.x = this.data.targetX
    this.data.y = this.data.targetY
  }

  update(dt: number) {
    this.data.x += (this.data.targetX - this.data.x) * this.lerpSpeed * dt
    this.data.y += (this.data.targetY - this.data.y) * this.lerpSpeed * dt

    if (this.data.shake > 0) {
      this.data.shake = Math.max(0, this.data.shake - dt * 10)
    }
  }

  setZoom(z: number) {
    this.data.zoom = Math.max(0.5, Math.min(3, z))
  }

  addShake(amount: number) {
    this.data.shake = Math.min(this.data.shake + amount, 5)
  }

  get offsetX(): number {
    const shakeX = this.data.shake > 0 ? (Math.random() - 0.5) * this.data.shake * 2 : 0
    return this.data.x + shakeX
  }

  get offsetY(): number {
    const shakeY = this.data.shake > 0 ? (Math.random() - 0.5) * this.data.shake * 2 : 0
    return this.data.y + shakeY
  }

  get zoom(): number {
    return this.data.zoom
  }

  // Convert world coords to screen coords
  worldToScreen(wx: number, wy: number, canvasW: number, canvasH: number, tileSize: number): { sx: number; sy: number } {
    const sx = (wx - this.offsetX) * tileSize * this.zoom + canvasW / 2
    const sy = (wy - this.offsetY) * tileSize * this.zoom + canvasH / 2
    return { sx, sy }
  }

  // Convert screen coords to world coords
  screenToWorld(sx: number, sy: number, canvasW: number, canvasH: number, tileSize: number): { wx: number; wy: number } {
    const wx = (sx - canvasW / 2) / (tileSize * this.zoom) + this.offsetX
    const wy = (sy - canvasH / 2) / (tileSize * this.zoom) + this.offsetY
    return { wx, wy }
  }
}
