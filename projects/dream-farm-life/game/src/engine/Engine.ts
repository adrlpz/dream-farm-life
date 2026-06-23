// Engine.ts — Main game loop (Phase 6: +weather, day/night, seasons)
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
import { CraftingSystem } from '../systems/CraftingSystem'
import { BuildingPlacer } from '../systems/BuildingPlacer'
import { WeatherSystem } from '../systems/WeatherSystem'
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
  crafting: CraftingSystem
  buildings: BuildingPlacer
  weather: WeatherSystem
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
  private weatherParticleTimer = 0

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
    this.crafting = new CraftingSystem()
    this.buildings = new BuildingPlacer()
    this.weather = new WeatherSystem()
    this.npcs = new NpcManager()
    this.npcs.initialize()
    this.renderer = new Renderer(this.ctx, this.camera, this.tileSize)

    this.gameTime = { day: 1, hour: 8, minute: 0, season: 'spring', year: 1 }
    this.camera.setTarget(this.player.data.x, this.player.data.y)
    this.camera.snapToTarget()
    this.input.bindZoom((delta) => { this.camera.setZoom(this.camera.zoom + delta) })
  }

  start() {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.loop)
  }

  stop() { this.running = false; cancelAnimationFrame(this.rafId) }

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

    if (!this.activeDialog) {
      this.player.processInput(input, dt)
      this.collision.resolvePlayer(this.player)

      if (this.player.data.interacting) {
        const facing = this.player.getFacingTile()
        const nearbyNpc = this.npcs.getNpcAt(facing.x, facing.y, 2)
        if (nearbyNpc) {
          this.openDialog(nearbyNpc.id)
        } else {
          const result = this.interaction.attemptInteract(this.player)
          if (result.success) {
            this.camera.addShake(1.5)
            const fp = this.player.getFacingTile()
            this.particles.emit(fp.x + 0.5, fp.y + 0.5, 8,
              { gather: '#ffd700', till: '#8b6914', water: '#3b8dbd', plant: '#4ade80', harvest: '#f0c040' }[result.action] ?? '#ffd700', 0.8)
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

    const pcx = Math.floor(this.player.data.x / 32)
    const pcy = Math.floor(this.player.data.y / 32)
    this.chunks.updateAround(pcx, pcy)
    this.camera.setTarget(this.player.data.x, this.player.data.y)
    this.camera.update(dt)
    this.updateGameTime(dt)
    this.player.updateAnimation(dt)

    // Weather
    this.weather.update(dt, this.gameTime.season)

    // Weather effects on crops
    if (this.weather.watersCrops) {
      for (const plot of this.interaction.farmPlots) {
        if (plot.cropId && !plot.watered) plot.watered = true
      }
    }

    // Growth (affected by weather)
    this.growthTimer += dt
    if (this.growthTimer >= 0.5) {
      this.growthTimer = 0
      const cropResults = this.growth.updatePlots(this.interaction.farmPlots, 0.5, this.gameTime.season)
      for (const r of cropResults) {
        if (r.type === 'crop_ready') this.interaction.addNotification(`${r.emoji} Ready to harvest!`)
      }

      // Storm damage
      if (this.weather.cropDamageChance > 0) {
        for (const plot of this.interaction.farmPlots) {
          if (plot.cropId && Math.random() < this.weather.cropDamageChance) {
            // Destroy crop
            plot.cropId = null
            plot.state = 'tilled'
            plot.growthProgress = 0
            plot.stage = 0
            plot.harvestable = false
            this.interaction.addNotification('⛈️ Storm destroyed a crop!')
          }
        }
      }
    }

    // Weather particles
    this.weatherParticleTimer += dt
    if (this.weatherParticleTimer >= 0.1) {
      this.weatherParticleTimer = 0
      const pc = this.weather.getParticlesConfig()
      if (pc) {
        // Emit weather particles around player
        for (let i = 0; i < Math.min(pc.count, 5); i++) {
          const rx = this.player.data.x + (Math.random() - 0.5) * 20
          const ry = this.player.data.y + (Math.random() - 0.5) * 20
          const vx = pc.type === 'stormy' ? (Math.random() - 0.3) * 2 : (Math.random() - 0.5) * 0.3
          this.particles.emit(rx, ry, 1, pc.color, 0.1)
        }
      }
    }

    // Crafting queue
    const crafted = this.crafting.update(this.player)
    for (const c of crafted) {
      this.particles.emit(this.player.data.x, this.player.data.y, 10, '#4ade80', 1)
    }

    // Quest auto-complete
    for (const aq of [...this.quests.activeQuests]) {
      if (this.quests.isQuestComplete(aq.questId)) {
        const def = this.quests.completeQuest(aq.questId, this.player)
        if (def) {
          this.camera.addShake(3)
          this.particles.emit(this.player.data.x, this.player.data.y, 20, '#ffd700', 1.5)
          this.crafting.checkLevelRecipes(this.player.data.farmingLevel)
        }
      }
    }

    this.particles.update(dt)
    this.autoSaveTimer += dt
    if (this.autoSaveTimer > 30) { this.autoSaveTimer = 0; this.save() }
    this.notifyState()
  }

  openDialog(npcId: string) {
    this.activeDialog = { npcId, lineIndex: 0 }
    this.player.data.interacting = false
    this.player.data.interactCooldown = 0.5
  }

  closeDialog() { this.activeDialog = null }

  getNpcDialogState() {
    if (!this.activeDialog) return null
    const npcDef = this.npcs.getDef(this.activeDialog.npcId)
    if (!npcDef) return null
    return { npc: npcDef, dialog: npcDef.dialog, quests: this.quests.getNpcQuests(this.activeDialog.npcId) }
  }

  private render() {
    this.renderer.clear()

    const visibleChunks = this.chunks.getVisibleChunks(this.camera.offsetX, this.camera.offsetY, this.width, this.height)

    this.renderer.renderChunks(visibleChunks)
    this.renderer.renderFarmPlots(this.interaction.farmPlots, this.camera, this.width, this.height)
    this.renderer.renderBuildings(this.buildings.buildings, this.camera, this.width, this.height)
    this.renderer.renderLandClaim(this.buildings.landClaim, this.camera, this.width, this.height)
    this.renderer.renderNpcs(this.npcs.npcs, this.camera, this.width, this.height)
    this.renderer.renderEntities(visibleChunks, this.camera)
    this.renderer.renderPlayer(this.player)

    this.particles.render(this.ctx, this.camera.offsetX, this.camera.offsetY, this.camera.zoom, this.width, this.height, this.tileSize)

    // Day/night + weather overlay
    const lighting = this.weather.getLightingOverlay(this.gameTime.hour)
    if (lighting.alpha > 0) {
      this.ctx.fillStyle = lighting.color
      this.ctx.globalAlpha = lighting.alpha
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.ctx.globalAlpha = 1
    }

    // Fog overlay
    if (this.weather.state.current === 'foggy') {
      this.ctx.fillStyle = '#c0c0c0'
      this.ctx.globalAlpha = 0.15 * this.weather.state.intensity
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.ctx.globalAlpha = 1
    }

    if (!this.activeDialog) {
      const nearby = this.interaction.getNearbyResource(this.player)
      if (nearby) this.renderer.renderInteractionPrompt(nearby, this.player, this.width, this.height)
      const facing = this.player.getFacingTile()
      const nearNpc = this.npcs.getNpcAt(facing.x, facing.y, 2)
      if (nearNpc) { const def = this.npcs.getDef(nearNpc.id); if (def) this.renderer.renderNpcPrompt(def, this.width, this.height) }
      const nearBuilding = this.buildings.getBuildingAt(facing.x, facing.y)
      if (nearBuilding) this.renderer.renderBuildingPrompt(nearBuilding, this.width, this.height)
    }

    this.renderer.renderMinimap(visibleChunks, this.player, this.width, this.height)
    this.renderer.renderHotbar(this.player, this.width, this.height)
  }

  private updateGameTime(dt: number) {
    this.gameTime.minute += dt * Engine.TIME_SCALE
    while (this.gameTime.minute >= 60) { this.gameTime.minute -= 60; this.gameTime.hour++ }
    while (this.gameTime.hour >= 24) {
      this.gameTime.hour = 0; this.gameTime.day++
      this.player.data.stamina = this.player.data.maxStamina
      this.npcs.resetDaily(); this.quests.refreshDailies()
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
    this.onStateChange({
      player: { ...this.player.data },
      gameTime: { ...this.gameTime },
      currentBiome: this.getCurrentBiome(),
      discoveredChunks: this.chunks.getDiscoveredCount(),
      nearbyResource: this.interaction.getNearbyResource(this.player),
      notifications: [
        ...this.interaction.consumeNotifications(),
        ...this.quests.consumeNotifications(),
        ...this.crafting.consumeNotifications(),
        ...this.buildings.consumeNotifications(),
      ],
      farmPlotCount: this.interaction.farmPlots.length,
      animalCount: this.interaction.farmAnimals.length,
      showPlantingUI: false,
      availableSeeds: this.interaction.getAvailableSeeds(this.player),
      activeQuests: this.quests.activeQuests,
      completedQuests: this.quests.completedQuests,
      activeDialog: this.activeDialog,
      buildingCount: this.buildings.buildings.length,
      claimSize: this.buildings.landClaim.size,
      craftingQueueCount: this.crafting.queue.length,
      weather: { type: this.weather.state.current, emoji: this.weather.emoji, name: this.weather.name },
    })
  }

  save() {
    const data = {
      player: this.player.data, gameTime: this.gameTime,
      chunks: this.chunks.serialize(), farm: this.interaction.serializeFarm(),
      quests: { active: this.quests.activeQuests, completed: this.quests.completedQuests },
      npcs: this.npcs.serialize(), crafting: this.crafting.serialize(),
      buildings: this.buildings.serialize(), weather: this.weather.serialize(),
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
      if (data.quests) { this.quests.activeQuests = data.quests.active ?? []; this.quests.completedQuests = data.quests.completed ?? [] }
      if (data.npcs) this.npcs.deserialize(data.npcs)
      if (data.crafting) this.crafting.deserialize(data.crafting)
      if (data.buildings) this.buildings.deserialize(data.buildings)
      if (data.weather) this.weather.deserialize(data.weather)
      this.camera.snapToTarget()
      return true
    } catch { return false }
  }
}
