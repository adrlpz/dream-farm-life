// skills.ts — 6 skills with perks every 10 levels (max 50)

export type SkillId = 'farming' | 'mining' | 'foraging' | 'fishing' | 'crafting' | 'animal_care'

export interface SkillPerk {
  level: number
  name: string
  description: string
  effect: string // machine-readable effect key
  value: number  // effect magnitude
}

export interface SkillDef {
  id: SkillId
  name: string
  emoji: string
  description: string
  maxLevel: number
  xpPerLevel: number // base; total = xpPerLevel * level
  perks: SkillPerk[]
}

export const SKILLS: Record<SkillId, SkillDef> = {
  farming: {
    id: 'farming', name: 'Farming', emoji: '🌱',
    description: 'Grow crops, tend animals, master the land.',
    maxLevel: 50, xpPerLevel: 100,
    perks: [
      { level: 5, name: 'Green Thumb I', description: 'Crops grow 10% faster', effect: 'crop_growth_speed', value: 0.1 },
      { level: 10, name: 'Bountiful Harvest', description: '20% chance for double harvest', effect: 'double_harvest_chance', value: 0.2 },
      { level: 15, name: 'Crop Whisperer', description: 'Unlock rare seed recipes', effect: 'unlock_rare_seeds', value: 1 },
      { level: 20, name: 'Fertilizer Expert', description: 'Fertilizer lasts 50% longer', effect: 'fertilizer_duration', value: 0.5 },
      { level: 25, name: 'Green Thumb II', description: 'Crops grow 25% faster', effect: 'crop_growth_speed', value: 0.25 },
      { level: 30, name: 'Master Farmer', description: 'All crops unlocked, +30% yield', effect: 'crop_yield_bonus', value: 0.3 },
      { level: 40, name: 'Golden Harvest', description: '5% chance for golden quality', effect: 'golden_quality_chance', value: 0.05 },
      { level: 50, name: 'Farming Legend', description: 'Double XP from all farming actions', effect: 'double_farming_xp', value: 1 },
    ],
  },
  mining: {
    id: 'mining', name: 'Mining', emoji: '⛏️',
    description: 'Break rocks, find gems, explore caves.',
    maxLevel: 50, xpPerLevel: 100,
    perks: [
      { level: 5, name: 'Sturdy Pick', description: 'Mining uses 20% less stamina', effect: 'mining_stamina_cost', value: -0.2 },
      { level: 10, name: 'Ore Sense', description: 'Rare ore chance +15%', effect: 'rare_ore_chance', value: 0.15 },
      { level: 15, name: 'Deep Miner', description: 'Unlock cave biome resources', effect: 'unlock_cave_resources', value: 1 },
      { level: 20, name: 'Lucky Strike', description: '10% chance for gem drops', effect: 'gem_drop_chance', value: 0.1 },
      { level: 25, name: 'Quarry Master', description: 'Mine 2x resources from rocks', effect: 'double_mining_yield', value: 1 },
      { level: 30, name: 'Explosives Expert', description: 'Unlock bomb recipe, area mining', effect: 'unlock_bombs', value: 1 },
      { level: 40, name: 'Crystal Finder', description: '20% gem drop chance', effect: 'gem_drop_chance', value: 0.2 },
      { level: 50, name: 'Mining Legend', description: 'Mining XP doubled, stamina cost halved', effect: 'mining_legend', value: 1 },
    ],
  },
  foraging: {
    id: 'foraging', name: 'Foraging', emoji: '🍄',
    description: 'Gather berries, mushrooms, wood, and herbs.',
    maxLevel: 50, xpPerLevel: 100,
    perks: [
      { level: 5, name: 'Keen Eye', description: 'Rare plant chance +15%', effect: 'rare_plant_chance', value: 0.15 },
      { level: 10, name: 'Nature\'s Bounty', description: '+1 extra gather per node', effect: 'bonus_gather', value: 1 },
      { level: 15, name: 'Herbalist', description: 'Unlock herb recipes in Alchemy', effect: 'unlock_herbs', value: 1 },
      { level: 20, name: 'Tree Expert', description: 'Wood yield doubled', effect: 'double_wood_yield', value: 1 },
      { level: 25, name: 'Mushroom Hunter', description: 'Unlock mushroom types', effect: 'unlock_mushrooms', value: 1 },
      { level: 30, name: 'Wild Chef', description: 'Wild berries restore 2x stamina', effect: 'berry_stamina_bonus', value: 2 },
      { level: 40, name: 'Master Forager', description: '+2 bonus gather per node', effect: 'bonus_gather', value: 2 },
      { level: 50, name: 'Foraging Legend', description: 'All foraging XP doubled', effect: 'double_foraging_xp', value: 1 },
    ],
  },
  fishing: {
    id: 'fishing', name: 'Fishing', emoji: '🎣',
    description: 'Catch fish from rivers, lakes, and ocean.',
    maxLevel: 50, xpPerLevel: 100,
    perks: [
      { level: 5, name: 'Steady Hand', description: 'Fishing minigame 20% easier', effect: 'fishing_ease', value: 0.2 },
      { level: 10, name: 'Bigger Net', description: 'Unlock large fish types', effect: 'unlock_large_fish', value: 1 },
      { level: 15, name: 'Treasure Hunter', description: '5% chance to find treasure', effect: 'treasure_chance', value: 0.05 },
      { level: 20, name: 'Night Fisher', description: 'Catch rare fish at night', effect: 'night_fish_bonus', value: 1 },
      { level: 25, name: 'Master Angler', description: 'Fish worth 50% more', effect: 'fish_value_bonus', value: 0.5 },
      { level: 30, name: 'Deep Sea', description: 'Unlock ocean fishing', effect: 'unlock_ocean', value: 1 },
      { level: 40, name: 'Legendary Catch', description: '1% chance for legendary fish', effect: 'legendary_fish_chance', value: 0.01 },
      { level: 50, name: 'Fishing Legend', description: 'Fishing XP doubled, auto-catch', effect: 'fishing_legend', value: 1 },
    ],
  },
  crafting: {
    id: 'crafting', name: 'Crafting', emoji: '🔨',
    description: 'Build tools, machines, and furniture.',
    maxLevel: 50, xpPerLevel: 100,
    perks: [
      { level: 5, name: 'Efficient Crafter', description: 'Crafting uses 15% fewer materials', effect: 'material_efficiency', value: 0.15 },
      { level: 10, name: 'Quick Hands', description: 'Crafting speed +30%', effect: 'craft_speed', value: 0.3 },
      { level: 15, name: 'Master Builder', description: 'Unlock advanced building recipes', effect: 'unlock_advanced_builds', value: 1 },
      { level: 20, name: 'Quality Control', description: 'Crafted items have +1 tier quality', effect: 'craft_quality_bonus', value: 1 },
      { level: 25, name: 'Mass Production', description: 'Craft 2 items at once', effect: 'double_craft', value: 1 },
      { level: 30, name: 'Innovation', description: 'Unlock unique furniture', effect: 'unlock_furniture', value: 1 },
      { level: 40, name: 'Artisan', description: 'Crafted items +2 tier quality', effect: 'craft_quality_bonus', value: 2 },
      { level: 50, name: 'Crafting Legend', description: 'All crafting XP doubled, zero waste', effect: 'crafting_legend', value: 1 },
    ],
  },
  animal_care: {
    id: 'animal_care', name: 'Animal Care', emoji: '🐮',
    description: 'Raise livestock, breed animals, produce goods.',
    maxLevel: 50, xpPerLevel: 100,
    perks: [
      { level: 5, name: 'Animal Friend', description: 'Animals gain happiness 20% faster', effect: 'happiness_rate', value: 0.2 },
      { level: 10, name: 'Better Feed', description: 'Feed restores 30% more', effect: 'feed_efficiency', value: 0.3 },
      { level: 15, name: 'Breeder', description: 'Unlock breeding system', effect: 'unlock_breeding', value: 1 },
      { level: 20, name: 'Premium Products', description: 'Animal products worth 40% more', effect: 'product_value_bonus', value: 0.4 },
      { level: 25, name: 'Whisperer', description: 'Max happiness bonus doubled', effect: 'max_happiness_bonus', value: 2 },
      { level: 30, name: 'Ranch Expansion', description: 'Can have 2x animals per pen', effect: 'animal_capacity', value: 2 },
      { level: 40, name: 'Rare Breeds', description: 'Unlock rare animal variants', effect: 'unlock_rare_breeds', value: 1 },
      { level: 50, name: 'Animal Legend', description: 'Animal XP doubled, auto-feed', effect: 'animal_legend', value: 1 },
    ],
  },
}

export function getXpForLevel(skill: SkillDef, level: number): number {
  return skill.xpPerLevel * level
}

export function getActivePerks(skill: SkillId, level: number): SkillPerk[] {
  return SKILLS[skill].perks.filter(p => p.level <= level)
}

export function getPerkValue(skill: SkillId, level: number, effect: string): number {
  const perks = getActivePerks(skill, level)
  return perks.filter(p => p.effect === effect).reduce((sum, p) => sum + p.value, 0)
}

export function getNextPerk(skill: SkillId, level: number): SkillPerk | undefined {
  return SKILLS[skill].perks.find(p => p.level > level)
}
