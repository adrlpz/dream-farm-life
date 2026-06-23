// Engine.ts — Main game loop + orchestrator (Phase 2)
import { Camera } from './Camera'
import { InputManager } from './InputManager'
import { Renderer } from './Renderer'
import { ChunkManager } from './ChunkManager'
import { CollisionSystem } from './CollisionSystem'
import { ParticleSystem } from './ParticleSystem'
import { Player } from '../entities/Player'
import { InteractionSystem } from '../systems/InteractionSystem'
import type { EngineConfig, EngineState, GameTime, BiomeType } from './types'

export class Engine {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  camera: Camera
  input: InputManager
  renderer: Renderer
  chunks: ChunkManager
  collision: CollisionSystem
  particles: ParticleSystem
  interaction: InteractionSystem
  player: Player

  width: number
  height: number
  tileSize: number

  gameTime: GameTime
  private lastTime = 0
  private running = false
  private rafId = 0
  private onStateChange?: (state: EngineState) => void
  private autoSaveTimer = 0

  private static readonly TIME_SCALE = 60

  constructor(config: EngineConfig) {
    this.canvas = config.canvas
    this.ctx = config.canvas.getContext('2d')!
    this.width = config.width
    this.height = config.height
    this.tileSize = config.tileSize
    this.onStateChange = config.onStateChange

    this.camera = new Camera()
    this.input = new InputManager(this.canvas)
    this.chunks = new ChunkManager()
    this.collision = new CollisionSystem(this.chunks)
    this.particles = new ParticleSystem()
    this.player = new Player(16, 16)
    this.interaction = new InteractionSystem(this.chunks)
    this.renderer = new Renderer(this.ctx, this.camera, this.tileSize)

    this.gameTime = { day: 1, hour: 8, minute: 0, season: 'spring', year: 1 }

    this.camera.setTarget(this.player.data.x, this.player.data.y)
    this.camera.snapToTarget()

    // Zoom via scroll
    this.input.bindZoom((delta) => {
      this.camera.setZoom(this.camera.zoom + delta)
    })
  }

  start() {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.rafId)
  }

  private loop = (now: number) => {
    if (!this.running) return
    const dt = Math.min((now - this.lastTime) / 1000, 0.1)
    this.lastTime = now
    this.update(dt)
    this.render()
    this.rafId = requestAnimationFrame(this.loop)
  }

  private update(dt: number) {
    const input = this.input.getState()

    // Player movement
    this.player.processInput(input, dt)
    this.collision.resolvePlayer(this.player)

    // Interaction (E key / space)
    if (this.player.data.interacting) {
      const result = this.interaction.attemptGather(this.player)
      if (result.success) {
        this.camera.addShake(1.5)
        // Emit particles at facing tile
        const facing = this.player.getFacingTile()
        this.particles.emit(facing.x + 0.5, facing.y + 0.5, 8, '#ffd700', 0.8)
      }
    }

    // Update chunks
    const pcx = Math.floor(this.player.data.x / 32)
    const pcy = Math.floor(this.player.data.y / 32)
    this.chunks.updateAround(pcx, pcy)

    // Camera
    this.camera.setTarget(this.player.data.x, this.player.data.y)
    this.camera.update(dt)

    // Game time
    this.updateGameTime(dt)

    // Animation
    this.player.updateAnimation(dt)

    // Particles
    this.particles.update(dt)

    // Auto-save
    this.autoSaveTimer += dt
    if (this.autoSaveTimer > 30) {
      this.autoSaveTimer = 0
      this.save()
    }

    this.notifyState()
  }

  private render() {
    this.renderer.clear()

    const visibleChunks = this.chunks.getVisibleChunks(
      this.camera.offsetX, this.camera.offsetY, this.width, this.height
    )

    this.renderer.renderChunks(visibleChunks)
    this.renderer.renderEntities(visibleChunks, this.camera)
    this.renderer.renderPlayer(this.player)

    // Render particles
    this.particles.render(
      this.ctx, this.camera.offsetX, this.camera.offsetY,
      this.camera.zoom, this.width, this.height, this.tileSize
    )

    // Render interaction prompt
    const nearby = this.interaction.getNearbyResource(this.player)
    if (nearby) {
      this.renderer.renderInteractionPrompt(nearby, this.player, this.width, this.height)
    }

    this.renderer.renderMinimap(visibleChunks, this.player, this.width, this.height)
    this.renderer.renderHotbar(this.player, this.width, this.height)
  }

  private updateGameTime(dt: number) {
    this.gameTime.minute += dt * Engine.TIME_SCALE
    while (this.gameTime.minute >= 60) {
      this.gameTime.minute -= 60
      this.gameTime.hour++
    }
    while (this.gameTime.hour >= 24) {
      this.gameTime.hour = 0
      this.gameTime.day++
      this.player.data.stamina = this.player.data.maxStamina
    }
    while (this.gameTime.day > 28) {
      this.gameTime.day = 1
      const seasons: GameTime['season'][] = ['spring', 'summer', 'fall', 'winter']
      const idx = seasons.indexOf(this.gameTime.season)
      this.gameTime.season = seasons[(idx + 1) % 4]
      if (this.gameTime.season === 'spring') this.gameTime.year++
    }
  }

  getCurrentBiome(): BiomeType {
    const cx = Math.floor(this.player.data.x / 32)
    const cy = Math.floor(this.player.data.y / 32)
    return this.chunks.getChunk(cx, cy)?.biome ?? 'farmland'
  }

  private notifyState() {
    if (!this.onStateChange) return
    const state: EngineState = {
      player: { ...this.player.data },
      gameTime: { ...this.gameTime },
      currentBiome: this.getCurrentBiome(),
      discoveredChunks: this.chunks.getDiscoveredCount(),
      nearbyResource: this.interaction.getNearbyResource(this.player),
      notifications: this.interaction.consumeNotifications(),
    }
    this.onStateChange(state)
  }

  save() {
    const data = {
      player: this.player.data,
      gameTime: this.gameTime,
      chunks: this.chunks.serialize(),
    }
    try {
      localStorage.setItem('dreamfarm_openworld', JSON.stringify(data))
    } catch {}
  }

  load(): boolean {
    const raw = localStorage.getItem('dreamfarm_openworld')
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      this.player.data = { ...this.player.data, ...data.player }
      this.gameTime = data.gameTime
      this.chunks.deserialize(data.chunks)
      this.camera.snapToTarget()
      return true
    } catch {
      return false
    }
  }
}
