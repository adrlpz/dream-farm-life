// QuestSystem.ts — Quest tracking, progress, completion
import { QUESTS, getAvailableQuests, getDailyQuests, type QuestDef } from '../data/quests'
import type { Player } from '../entities/Player'

export interface ActiveQuest {
  questId: string
  progress: number[] // per-objective current count
  startedAt: number
}

export class QuestSystem {
  activeQuests: ActiveQuest[] = []
  completedQuests: string[] = []
  private notifications: string[] = []

  constructor() {
    this.load()
  }

  // Start a quest
  startQuest(questId: string): boolean {
    if (this.activeQuests.find(q => q.questId === questId)) return false
    const def = QUESTS[questId]
    if (!def) return false
    if (this.completedQuests.includes(questId) && !def.repeatable) return false
    if (def.prereq && !this.completedQuests.includes(def.prereq)) return false

    this.activeQuests.push({
      questId,
      progress: def.objectives.map(() => 0),
      startedAt: Date.now(),
    })
    this.addNotification(`📜 Quest started: ${def.name}`)
    this.save()
    return true
  }

  // Update progress for an objective type
  updateProgress(type: string, target: string, count: number = 1) {
    for (const active of this.activeQuests) {
      const def = QUESTS[active.questId]
      if (!def) continue

      for (let i = 0; i < def.objectives.length; i++) {
        const obj = def.objectives[i]
        if (obj.type !== type) continue
        if (obj.target !== target && obj.target !== 'any') continue

        active.progress[i] = Math.min(obj.count, active.progress[i] + count)
      }
    }
  }

  // Check if a quest is complete
  isQuestComplete(questId: string): boolean {
    const active = this.activeQuests.find(q => q.questId === questId)
    if (!active) return false
    const def = QUESTS[questId]
    if (!def) return false

    return def.objectives.every((obj, i) => active.progress[i] >= obj.count)
  }

  // Complete a quest and get rewards
  completeQuest(questId: string, player: Player): QuestDef | null {
    const idx = this.activeQuests.findIndex(q => q.questId === questId)
    if (idx === -1) return null

    const def = QUESTS[questId]
    if (!def) return null

    if (!this.isQuestComplete(questId)) return null

    // Grant rewards
    if (def.rewards.xp) player.addFarmingXp(def.rewards.xp)
    if (def.rewards.farmingXp) player.addFarmingXp(def.rewards.farmingXp)
    if (def.rewards.items) {
      for (const item of def.rewards.items) {
        player.addItem(item.itemId, item.count)
      }
    }

    // Remove active, add completed
    this.activeQuests.splice(idx, 1)
    if (!def.repeatable) {
      this.completedQuests.push(questId)
    }

    this.addNotification(`✅ Quest complete: ${def.name}!`)
    this.save()
    return def
  }

  // Abandon a quest
  abandonQuest(questId: string) {
    this.activeQuests = this.activeQuests.filter(q => q.questId !== questId)
    this.save()
  }

  // Get available quests from an NPC
  getNpcQuests(npcId: string): { available: QuestDef[]; active: ActiveQuest[]; completable: string[] } {
    const completed = this.completedQuests
    const activeIds = this.activeQuests.map(q => q.questId)

    const available = getAvailableQuests(completed, activeIds).filter(q => q.giver === npcId)
    const active = this.activeQuests.filter(a => QUESTS[a.questId]?.giver === npcId)
    const completable = active
      .filter(a => this.isQuestComplete(a.questId))
      .map(a => a.questId)

    return { available, active, completable }
  }

  // Get daily quest refresh
  refreshDailies() {
    // Remove completed dailies from active
    this.activeQuests = this.activeQuests.filter(a => {
      const def = QUESTS[a.questId]
      return def?.type !== 'daily'
    })
    // Dailies are always available again
  }

  // Get progress text for a quest
  getProgressText(questId: string): string[] {
    const active = this.activeQuests.find(q => q.questId === questId)
    const def = QUESTS[questId]
    if (!active || !def) return []

    return def.objectives.map((obj, i) => {
      const done = active.progress[i] >= obj.count
      const prefix = done ? '✅' : '⬜'
      const targetName = obj.target === 'any' ? 'items' : obj.target
      return `${prefix} ${obj.type} ${targetName}: ${active.progress[i]}/${obj.count}`
    })
  }

  // Get all completable quests
  getCompletableQuests(): string[] {
    return this.activeQuests
      .filter(a => this.isQuestComplete(a.questId))
      .map(a => a.questId)
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

  save() {
    try {
      localStorage.setItem('dreamfarm_quests', JSON.stringify({
        active: this.activeQuests,
        completed: this.completedQuests,
      }))
    } catch {}
  }

  load() {
    try {
      const raw = localStorage.getItem('dreamfarm_quests')
      if (!raw) return
      const data = JSON.parse(raw)
      this.activeQuests = data.active ?? []
      this.completedQuests = data.completed ?? []
    } catch {}
  }
}
