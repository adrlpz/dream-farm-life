// Engine.ts — Main game loop + orchestrator
import { Camera } from './Camera'
import { InputManager } from './InputManager'
import { Renderer } from './Renderer'
import { ChunkManager } from './ChunkManager'
import { CollisionSystem } from './CollisionSystem'
import { Player } from '../entities/Player'
import type { EngineConfig, EngineState, GameTime, BiomeType } from './types'

export class Engine {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  camera: Camera
  input: InputManager
  renderer: Renderer
  chunks: ChunkManager
  collision: CollisionSystem
  player: Player

  width: number
  height: number
  tileSize: number

  gameTime: GameTime
  private lastTime = 0
  private running = false
  private rafId = 0
  private onStateChange?: (state: EngineState) => void

  // Game time: 1 real second = 1 game minute
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
    this.player = new Player(16, 16) // spawn at center of home chunk
    this.renderer = new Renderer(this.ctx, this.camera, this.tileSize)

    this.gameTime = { day: 1, hour: 8, minute: 0, season: 'spring', year: 1 }

    // Camera follows player
    this.camera.setTarget(this.player.data.x, this.player.data.y)
    this.camera.snapToTarget()
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
    const dt = Math.min((now - this.lastTime) / 1000, 0.1) // cap delta
    this.lastTime = now

    this.update(dt)
    this.render()

    this.rafId = requestAnimationFrame(this.loop)
  }

  private update(dt: number) {
    // 1. Process input → player movement
    const input = this.input.getState()
    this.player.processInput(input, dt)

    // 2. Collision resolution
    this.collision.resolvePlayer(this.player)

    // 3. Update chunks around player
    const pcx = Math.floor(this.player.data.x / 32)
    const pcy = Math.floor(this.player.data.y / 32)
    this.chunks.updateAround(pcx, pcy)
    this.chunks.updateAround(pcx, pcy)

    // 4. Camera follow
    this.camera.setTarget(this.player.data.x, this.player.data.y)
    this.camera.update(dt)

    // 5. Game time
    this.updateGameTime(dt)

    // 6. Player animation
    this.player.updateAnimation(dt)

    // 7. Notify state change (throttled)
    this.notifyState()
  }

  private render() {
    this.renderer.clear()

    // Get visible chunks
    const visibleChunks = this.chunks.getVisibleChunks(
      this.camera.offsetX, this.camera.offsetY, this.width, this.height
    )

    // Render tilemap
    this.renderer.renderChunks(visibleChunks)

    // Render entities (resources, objects)
    this.renderer.renderEntities(visibleChunks, this.camera)

    // Render player
    this.renderer.renderPlayer(this.player)

    // Render HUD elements on canvas (minimap etc)
    this.renderer.renderMinimap(visibleChunks, this.player, this.width, this.height)
  }

  private updateGameTime(dt: number) {
    this.gameTime.minute += dt * Engine.TIME_SCALE
    while (this.gameTime.minute >= 60) {
      this.gameTime.minute -= 60
      this.gameTime.hour++
    }
    while (this.gameTime.hour >= 24) {
      this.gameTime.hour -= 0
      this.gameTime.day++
      this.player.data.stamina = this.player.data.maxStamina // restore stamina daily
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
    const chunk = this.chunks.getChunk(cx, cy)
    return chunk?.biome ?? 'farmland'
  }

  private notifyState() {
    if (!this.onStateChange) return
    const state: EngineState = {
      player: { ...this.player.data },
      gameTime: { ...this.gameTime },
      currentBiome: this.getCurrentBiome(),
      discoveredChunks: this.chunks.getDiscoveredCount(),
    }
    this.onStateChange(state)
  }

  // Save/Load
  save() {
    const data = {
      player: this.player.data,
      gameTime: this.gameTime,
      chunks: this.chunks.serialize(),
    }
    localStorage.setItem('dreamfarm_save', JSON.stringify(data))
  }

  load(): boolean {
    const raw = localStorage.getItem('dreamfarm_save')
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      this.player.data = data.player
      this.gameTime = data.gameTime
      this.chunks.deserialize(data.chunks)
      this.camera.snapToTarget()
      return true
    } catch {
      return false
    }
  }
}
