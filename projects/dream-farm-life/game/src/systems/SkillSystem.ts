// SkillSystem.ts — Track XP + level up for 6 skills
import type { SkillId } from '../data/skills'
import { SKILLS, getXpForLevel, getPerkValue } from '../data/skills'

export interface SkillState {
  level: number
  xp: number
  totalXp: number
}

export class SkillSystem {
  skills: Record<SkillId, SkillState> = {
    farming: { level: 1, xp: 0, totalXp: 0 },
    mining: { level: 1, xp: 0, totalXp: 0 },
    foraging: { level: 1, xp: 0, totalXp: 0 },
    fishing: { level: 1, xp: 0, totalXp: 0 },
    crafting: { level: 1, xp: 0, totalXp: 0 },
    animal_care: { level: 1, xp: 0, totalXp: 0 },
  }

  private notifications: string[] = []
  private levelUpCallbacks: ((skill: SkillId, newLevel: number) => void)[] = []

  onLevelUp(cb: (skill: SkillId, newLevel: number) => void) {
    this.levelUpCallbacks.push(cb)
  }

  addXp(skill: SkillId, amount: number): { leveled: boolean; newLevel?: number } {
    const state = this.skills[skill]
    const def = SKILLS[skill]
    if (!state || !def) return { leveled: false }

    // Check for double XP perk
    const doubleXpKey = `double_${skill}_xp`
    const doubleXp = getPerkValue(skill, state.level, doubleXpKey)
    if (doubleXp > 0) amount = Math.floor(amount * (1 + doubleXp))

    state.xp += amount
    state.totalXp += amount

    const xpNeeded = getXpForLevel(def, state.level)
    if (state.xp >= xpNeeded && state.level < def.maxLevel) {
      state.xp -= xpNeeded
      state.level++
      this.notifications.push(`⬆️ ${def.emoji} ${def.name} leveled up to ${state.level}!`)
      this.levelUpCallbacks.forEach(cb => cb(skill, state.level))
      return { leveled: true, newLevel: state.level }
    }

    return { leveled: false }
  }

  getLevel(skill: SkillId): number {
    return this.skills[skill]?.level ?? 1
  }

  getXp(skill: SkillId): number {
    return this.skills[skill]?.xp ?? 0
  }

  getXpToNext(skill: SkillId): number {
    const state = this.skills[skill]
    const def = SKILLS[skill]
    if (!state || !def) return 100
    return getXpForLevel(def, state.level)
  }

  getXpPercent(skill: SkillId): number {
    return (this.getXp(skill) / this.getXpToNext(skill)) * 100
  }

  // Get all active perks across all skills
  getAllPerks(): { skill: SkillId; effect: string; value: number }[] {
    const perks: { skill: SkillId; effect: string; value: number }[] = []
    for (const [id, state] of Object.entries(this.skills) as [SkillId, SkillState][]) {
      const def = SKILLS[id]
      for (const perk of def.perks) {
        if (perk.level <= state.level) {
          perks.push({ skill: id, effect: perk.effect, value: perk.value })
        }
      }
    }
    return perks
  }

  // Get total effect value for a given effect key
  getEffect(effect: string): number {
    return this.getAllPerks()
      .filter(p => p.effect === effect)
      .reduce((sum, p) => sum + p.value, 0)
  }

  consumeNotifications(): string[] {
    const n = [...this.notifications]
    this.notifications = []
    return n
  }

  serialize() { return { ...this.skills } }
  deserialize(data: Record<SkillId, SkillState>) {
    for (const [id, state] of Object.entries(data) as [SkillId, SkillState][]) {
      if (this.skills[id]) this.skills[id] = state
    }
  }
}
