// XP thresholds per level
export const LEVEL_XP: number[] = [
  0,     // Lv1
  50,    // Lv2
  120,   // Lv3
  220,   // Lv4
  360,   // Lv5
  550,   // Lv6
  800,   // Lv7
  1100,  // Lv8
  1500,  // Lv9
  2000,  // Lv10
  2600,  // Lv11
  3300,  // Lv12
  4200,  // Lv13
  5200,  // Lv14
  6500,  // Lv15
  8000,  // Lv16
  10000, // Lv17
  12500, // Lv18
  15500, // Lv19
  19000, // Lv20
]

export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  if (level > LEVEL_XP.length) return LEVEL_XP[LEVEL_XP.length - 1] + (level - LEVEL_XP.length) * 5000
  return LEVEL_XP[level - 1]
}

export function xpToNextLevel(currentLevel: number): number {
  return xpForLevel(currentLevel + 1) - xpForLevel(currentLevel)
}

// Daily login bonus
export const DAILY_BONUS_BASE = 20
export const DAILY_BONUS_STREAK_MULT = 0.5 // +50% per consecutive day
export const DAILY_BONUS_MAX_STREAK = 7
