// Engine.ts — Main game loop (Phase 4: +NPCs, quests, dialog)
import { Camera } from './Camera'
import { InputManager } from './InputManager'
import { Renderer } from './Renderer'
import { ChunkManager } from './ChunkManager'
import { CollisionSystem } from './CollisionSystem'
import { ParticleSystem } from './ParticleSystem'
import { Player } from '../entities/Player'
import { NpcManager } from '../entities/NPC'
import { InteractionSystem } from '../systems/InteractionSystem'
import { GrowthSystem } from '../systems/GrowthSystem'
import { QuestSystem } from '../systems/QuestSystem'
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
  growth: GrowthSystem
  quests: QuestSystem
  npcs: NpcManager
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
  private growthTimer = 0

  // Dialog state
  activeDialog: { npcId: string; lineIndex: number } | null = null

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
    this.growth = new GrowthSystem()
    this.quests = new QuestSystem()
    this.npcs = new NpcManager()
    this.npcs.initialize()
    this.renderer = new Renderer(this.ctx, this.camera, this.tileSize)

    this.gameTime = { day: 1, hour: 8, minute: 0, season: 'spring', year: 1 }

    this.camera.setTarget(this.player.data.x, this.player.data.y)
    this.camera.snapToTarget()

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

    // Don't process movement during dialog
    if (!this.activeDialog) {
      this.player.processInput(input, dt)
      this.collision.resolvePlayer(this.player)

      // Interaction (E key)
      if (this.player.data.interacting) {
        // Check for NPC first
        const facing = this.player.getFacingTile()
        const nearbyNpc = this.npcs.getNpcAt(facing.x, facing.y, 2)
        if (nearbyNpc) {
          this.openDialog(nearbyNpc.id)
        } else {
          // Try farming/gathering
          const result = this.interaction.attemptInteract(this.player)
          if (result.success) {
            this.camera.addShake(1.5)
            const facingPos = this.player.getFacingTile()
            const colors: Record<string, string> = {
              gather: '#ffd700', till: '#8b6914', water: '#3b8dbd',
              plant: '#4ade80', harvest: '#f0c040',
            }
            this.particles.emit(facingPos.x + 0.5, facingPos.y + 0.5, 8, colors[result.action] ?? '#ffd700', 0.8)

            // Update quest progress
            if (result.action === 'harvest') {
              for (const item of result.items) {
                this.quests.updateProgress('harvest', item.itemId, item.count)
                this.quests.updateProgress('harvest', 'any', item.count)
              }
            }
            if (result.action === 'gather') {
              for (const item of result.items) {
                this.quests.updateProgress('gather', item.itemId, item.count)
                this.quests.updateProgress('gather', 'any', item.count)
              }
            }
          }
        }
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

    // Growth
    this.growthTimer += dt
    if (this.growthTimer >= 0.5) {
      this.growthTimer = 0
      const cropResults = this.growth.updatePlots(this.interaction.farmPlots, 0.5, this.gameTime.season)
      for (const r of cropResults) {
        if (r.type === 'crop_ready') {
          this.interaction.addNotification(`${r.emoji} Ready to harvest!`)
          this.quests.updateProgress('harvest', r.cropId!, 0) // track discovery
        }
      }
    }

    // Check quest auto-completion
    for (const aq of this.quests.activeQuests) {
      if (this.quests.isQuestComplete(aq.questId)) {
        const def = this.quests.completeQuest(aq.questId, this.player)
        if (def) {
          this.camera.addShake(3)
          this.particles.emit(this.player.data.x, this.player.data.y, 20, '#ffd700', 1.5)
        }
      }
    }

    // Discover biome quests
    const currentBiome = this.getCurrentBiome()
    this.quests.updateProgress('discover_biome', currentBiome, 0)

    this.particles.update(dt)

    this.autoSaveTimer += dt
    if (this.autoSaveTimer > 30) {
      this.autoSaveTimer = 0
      this.save()
    }

    this.notifyState()
  }

  openDialog(npcId: string) {
    this.activeDialog = { npcId, lineIndex: 0 }
    this.player.data.interacting = false
    this.player.data.interactCooldown = 0.5
  }

  closeDialog() {
    this.activeDialog = null
  }

  // Get NPC state for UI
  getNpcDialogState() {
    if (!this.activeDialog) return null
    const npcDef = this.npcs.getDef(this.activeDialog.npcId)
    if (!npcDef) return null

    const questInfo = this.quests.getNpcQuests(this.activeDialog.npcId)
    return {
      npc: npcDef,
      dialog: npcDef.dialog,
      quests: questInfo,
    }
  }

  private render() {
    this.renderer.clear()

    const visibleChunks = this.chunks.getVisibleChunks(
      this.camera.offsetX, this.camera.offsetY, this.width, this.height
    )

    this.renderer.renderChunks(visibleChunks)
    this.renderer.renderFarmPlots(this.interaction.farmPlots, this.camera, this.width, this.height)
    this.renderer.renderNpcs(this.npcs.npcs, this.camera, this.width, this.height)
    this.renderer.renderEntities(visibleChunks, this.camera)
    this.renderer.renderPlayer(this.player)

    this.particles.render(
      this.ctx, this.camera.offsetX, this.camera.offsetY,
      this.camera.zoom, this.width, this.height, this.tileSize
    )

    if (!this.activeDialog) {
      const nearby = this.interaction.getNearbyResource(this.player)
      if (nearby) {
        this.renderer.renderInteractionPrompt(nearby, this.player, this.width, this.height)
      }

      // Check for nearby NPC
      const facing = this.player.getFacingTile()
      const nearNpc = this.npcs.getNpcAt(facing.x, facing.y, 2)
      if (nearNpc) {
        const def = this.npcs.getDef(nearNpc.id)
        if (def) {
          this.renderer.renderNpcPrompt(def, this.width, this.height)
        }
      }
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
      this.npcs.resetDaily()
      this.quests.refreshDailies()
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
      notifications: [
        ...this.interaction.consumeNotifications(),
        ...this.quests.consumeNotifications(),
      ],
      farmPlotCount: this.interaction.farmPlots.length,
      animalCount: this.interaction.farmAnimals.length,
      showPlantingUI: false,
      availableSeeds: this.interaction.getAvailableSeeds(this.player),
      activeQuests: this.quests.activeQuests,
      completedQuests: this.quests.completedQuests,
      activeDialog: this.activeDialog,
    }
    this.onStateChange(state)
  }

  save() {
    const data = {
      player: this.player.data,
      gameTime: this.gameTime,
      chunks: this.chunks.serialize(),
      farm: this.interaction.serializeFarm(),
      quests: { active: this.quests.activeQuests, completed: this.quests.completedQuests },
      npcs: this.npcs.serialize(),
    }
    try { localStorage.setItem('dreamfarm_openworld', JSON.stringify(data)) } catch {}
  }

  load(): boolean {
    const raw = localStorage.getItem('dreamfarm_openworld')
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      this.player.data = { ...this.player.data, ...data.player }
      this.gameTime = data.gameTime
      this.chunks.deserialize(data.chunks)
      if (data.farm) this.interaction.deserializeFarm(data.farm)
      if (data.quests) {
        this.quests.activeQuests = data.quests.active ?? []
        this.quests.completedQuests = data.quests.completed ?? []
      }
      if (data.npcs) this.npcs.deserialize(data.npcs)
      this.camera.snapToTarget()
      return true
    } catch { return false }
  }
}
