// CraftingSystem.ts — Crafting logic
import { RECIPES, canCraft, type RecipeDef } from '../data/recipes'
import type { Player } from '../entities/Player'

export interface CraftingQueue {
  recipeId: string
  startedAt: number
  finishAt: number
}

export class CraftingSystem {
  queue: CraftingQueue[] = []
  discoveredRecipes: Set<string> = new Set()
  private notifications: string[] = []

  constructor() {
    // Discover starter recipes
    for (const recipe of Object.values(RECIPES)) {
      if (recipe.unlockLevel <= 3) {
        this.discoveredRecipes.add(recipe.id)
      }
    }
  }

  // Discover a recipe (from NPC, quest, or leveling up)
  discoverRecipe(recipeId: string) {
    if (!this.discoveredRecipes.has(recipeId)) {
      this.discoveredRecipes.add(recipeId)
      const recipe = RECIPES[recipeId]
      if (recipe) {
        this.addNotification(`📖 New recipe: ${recipe.name}!`)
      }
    }
  }

  // Check recipes unlocked by leveling up
  checkLevelRecipes(level: number) {
    for (const recipe of Object.values(RECIPES)) {
      if (recipe.unlockLevel <= level) {
        this.discoveredRecipes.add(recipe.id)
      }
    }
  }

  // Get available recipes for a workstation
  getAvailableRecipes(workstation: string, playerLevel: number): RecipeDef[] {
    return Object.values(RECIPES).filter(r =>
      r.workstation === workstation &&
      r.unlockLevel <= playerLevel
    )
  }

  // Start crafting
  startCraft(recipeId: string, player: Player): boolean {
    const recipe = RECIPES[recipeId]
    if (!recipe) return false

    // Check ingredients
    if (!canCraft(recipe, player.data.inventory)) {
      this.addNotification('Not enough ingredients!')
      return false
    }

    // Consume ingredients
    for (const ing of recipe.ingredients) {
      player.removeItem(ing.itemId, ing.count)
    }

    // Add to queue
    this.queue.push({
      recipeId,
      startedAt: Date.now(),
      finishAt: Date.now() + recipe.craftTimeMs,
    })

    this.addNotification(`🔨 Crafting ${recipe.name}...`)
    return true
  }

  // Update crafting queue (call each frame/tick)
  update(player: Player): { recipeId: string; outputId: string; count: number }[] {
    const completed: { recipeId: string; outputId: string; count: number }[] = []
    const now = Date.now()

    for (let i = this.queue.length - 1; i >= 0; i--) {
      if (now >= this.queue[i].finishAt) {
        const item = this.queue[i]
        const recipe = RECIPES[item.recipeId]
        if (recipe) {
          // Add crafted items to inventory
          for (let j = 0; j < recipe.outputCount; j++) {
            player.addItem(recipe.outputId, 1)
          }
          completed.push({
            recipeId: item.recipeId,
            outputId: recipe.outputId,
            count: recipe.outputCount,
          })
          this.addNotification(`✅ Crafted ${recipe.name}!`)
        }
        this.queue.splice(i, 1)
      }
    }

    return completed
  }

  // Check if player can craft a recipe
  canCraftRecipe(recipeId: string, player: Player): boolean {
    const recipe = RECIPES[recipeId]
    if (!recipe) return false
    return canCraft(recipe, player.data.inventory)
  }

  // Get crafting progress for queue item
  getProgress(queueIndex: number): number {
    const item = this.queue[queueIndex]
    if (!item) return 0
    const total = item.finishAt - item.startedAt
    const elapsed = Date.now() - item.startedAt
    return Math.min(1, elapsed / total)
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
    return {
      queue: this.queue,
      discovered: Array.from(this.discoveredRecipes),
    }
  }

  deserialize(data: any) {
    if (data?.queue) this.queue = data.queue
    if (data?.discovered) this.discoveredRecipes = new Set(data.discovered)
  }
}
