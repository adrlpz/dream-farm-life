// items.ts — All item definitions
export interface ItemDef {
  id: string
  name: string
  emoji: string
  category: 'seed' | 'crop' | 'resource' | 'tool' | 'fish' | 'food' | 'bug' | 'special'
  stackable: boolean
  maxStack: number
  sellPrice: number
  description: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
}

export const ITEMS: Record<string, ItemDef> = {
  // ─── Resources ───
  wood:        { id: 'wood',        name: 'Wood',         emoji: '🪵', category: 'resource', stackable: true, maxStack: 99, sellPrice: 5,   description: 'Basic building material', rarity: 'common' },
  stone:       { id: 'stone',       name: 'Stone',        emoji: '🪨', category: 'resource', stackable: true, maxStack: 99, sellPrice: 5,   description: 'Hard mineral', rarity: 'common' },
  iron_ore:    { id: 'iron_ore',    name: 'Iron Ore',     emoji: '⛏️', category: 'resource', stackable: true, maxStack: 99, sellPrice: 15,  description: 'Raw iron from rocks', rarity: 'uncommon' },
  gold_ore:    { id: 'gold_ore',    name: 'Gold Ore',     emoji: '✨', category: 'resource', stackable: true, maxStack: 99, sellPrice: 50,  description: 'Precious gold ore', rarity: 'rare' },
  sap:         { id: 'sap',         name: 'Sap',          emoji: '💧', category: 'resource', stackable: true, maxStack: 99, sellPrice: 3,   description: 'Sticky tree sap', rarity: 'common' },
  herb:        { id: 'herb',        name: 'Herb',         emoji: '🌿', category: 'resource', stackable: true, maxStack: 99, sellPrice: 8,   description: 'Wild medicinal herb', rarity: 'common' },
  berry:       { id: 'berry',       name: 'Berry',        emoji: '🫐', category: 'resource', stackable: true, maxStack: 99, sellPrice: 6,   description: 'Sweet wild berries', rarity: 'common' },
  mushroom:    { id: 'mushroom',    name: 'Mushroom',     emoji: '🍄', category: 'resource', stackable: true, maxStack: 99, sellPrice: 10,  description: 'Forest mushroom', rarity: 'uncommon' },
  gem:         { id: 'gem',         name: 'Gem',          emoji: '💎', category: 'resource', stackable: true, maxStack: 99, sellPrice: 100, description: 'Sparkling gemstone', rarity: 'rare' },
  crystal:     { id: 'crystal',     name: 'Crystal',      emoji: '🔮', category: 'resource', stackable: true, maxStack: 99, sellPrice: 150, description: 'Mystical cave crystal', rarity: 'rare' },
  clay:        { id: 'clay',        name: 'Clay',         emoji: '🟤', category: 'resource', stackable: true, maxStack: 99, sellPrice: 4,   description: 'Wet clay for crafting', rarity: 'common' },
  sand:        { id: 'sand',        name: 'Sand',         emoji: '⏳', category: 'resource', stackable: true, maxStack: 99, sellPrice: 3,   description: 'Fine beach sand', rarity: 'common' },
  shell:       { id: 'shell',       name: 'Shell',        emoji: '🐚', category: 'resource', stackable: true, maxStack: 99, sellPrice: 8,   description: 'Ocean shell', rarity: 'common' },
  seaweed:     { id: 'seaweed',     name: 'Seaweed',      emoji: '🌊', category: 'resource', stackable: true, maxStack: 99, sellPrice: 6,   description: 'Fresh seaweed', rarity: 'common' },
  ice_crystal: { id: 'ice_crystal', name: 'Ice Crystal',  emoji: '❄️', category: 'resource', stackable: true, maxStack: 99, sellPrice: 80,  description: 'Frozen crystal from snow peaks', rarity: 'rare' },
  ancient_coin:{ id: 'ancient_coin',name: 'Ancient Coin', emoji: '🪙', category: 'resource', stackable: true, maxStack: 99, sellPrice: 200, description: 'Lost civilization currency', rarity: 'legendary' },

  // ─── Fish ───
  fish_common:    { id: 'fish_common',    name: 'Trout',         emoji: '🐟', category: 'fish', stackable: true, maxStack: 99, sellPrice: 10,  description: 'Common freshwater fish', rarity: 'common' },
  fish_bass:      { id: 'fish_bass',      name: 'Bass',          emoji: '🐠', category: 'fish', stackable: true, maxStack: 99, sellPrice: 20,  description: 'Largemouth bass', rarity: 'uncommon' },
  fish_salmon:    { id: 'fish_salmon',    name: 'Salmon',        emoji: '🍣', category: 'fish', stackable: true, maxStack: 99, sellPrice: 35,  description: 'Fresh salmon', rarity: 'uncommon' },
  fish_puffer:    { id: 'fish_puffer',    name: 'Pufferfish',    emoji: '🐡', category: 'fish', stackable: true, maxStack: 99, sellPrice: 75,  description: 'Rare tropical pufferfish', rarity: 'rare' },
  fish_golden:    { id: 'fish_golden',    name: 'Golden Koi',    emoji: '🐉', category: 'fish', stackable: true, maxStack: 99, sellPrice: 250, description: 'Legendary golden koi', rarity: 'legendary' },
  fish_ice:       { id: 'fish_ice',       name: 'Ice Fish',      emoji: '🧊', category: 'fish', stackable: true, maxStack: 99, sellPrice: 100, description: 'Frozen deep water fish', rarity: 'rare' },

  // ─── Bugs ───
  bug_butterfly:  { id: 'bug_butterfly',  name: 'Butterfly',     emoji: '🦋', category: 'bug', stackable: true, maxStack: 99, sellPrice: 15,  description: 'Colorful butterfly', rarity: 'common' },
  bug_beetle:     { id: 'bug_beetle',     name: 'Beetle',        emoji: '🪲', category: 'bug', stackable: true, maxStack: 99, sellPrice: 20,  description: 'Hard-shelled beetle', rarity: 'uncommon' },
  bug_firefly:    { id: 'bug_firefly',    name: 'Firefly',       emoji: '🪲', category: 'bug', stackable: true, maxStack: 99, sellPrice: 40,  description: 'Glowing night insect', rarity: 'rare' },

  // ─── Crops (from farming) ───
  wheat:    { id: 'wheat',    name: 'Wheat',     emoji: '🌾', category: 'crop', stackable: true, maxStack: 99, sellPrice: 8,   description: 'Golden wheat', rarity: 'common' },
  corn:     { id: 'corn',     name: 'Corn',      emoji: '🌽', category: 'crop', stackable: true, maxStack: 99, sellPrice: 12,  description: 'Sweet corn', rarity: 'common' },
  tomato:   { id: 'tomato',   name: 'Tomato',    emoji: '🍅', category: 'crop', stackable: true, maxStack: 99, sellPrice: 15,  description: 'Juicy tomato', rarity: 'common' },
  carrot:   { id: 'carrot',   name: 'Carrot',    emoji: '🥕', category: 'crop', stackable: true, maxStack: 99, sellPrice: 10,  description: 'Crunchy carrot', rarity: 'common' },
  potato:   { id: 'potato',   name: 'Potato',    emoji: '🥔', category: 'crop', stackable: true, maxStack: 99, sellPrice: 14,  description: 'Starchy potato', rarity: 'common' },
  pumpkin:  { id: 'pumpkin',  name: 'Pumpkin',   emoji: '🎃', category: 'crop', stackable: true, maxStack: 99, sellPrice: 30,  description: 'Big orange pumpkin', rarity: 'uncommon' },

  // ─── Seeds ───
  seed_wheat:   { id: 'seed_wheat',   name: 'Wheat Seeds',   emoji: '🌱', category: 'seed', stackable: true, maxStack: 99, sellPrice: 3,  description: 'Plant to grow wheat', rarity: 'common' },
  seed_corn:    { id: 'seed_corn',    name: 'Corn Seeds',    emoji: '🌱', category: 'seed', stackable: true, maxStack: 99, sellPrice: 5,  description: 'Plant to grow corn', rarity: 'common' },
  seed_tomato:  { id: 'seed_tomato',  name: 'Tomato Seeds',  emoji: '🌱', category: 'seed', stackable: true, maxStack: 99, sellPrice: 7,  description: 'Plant to grow tomatoes', rarity: 'common' },

  // ─── Food ───
  bread:     { id: 'bread',     name: 'Bread',     emoji: '🍞', category: 'food', stackable: true, maxStack: 99, sellPrice: 15,  description: 'Restores 20 stamina', rarity: 'common' },
  soup:      { id: 'soup',      name: 'Soup',      emoji: '🍲', category: 'food', stackable: true, maxStack: 99, sellPrice: 25,  description: 'Restores 40 stamina', rarity: 'uncommon' },
  pie:       { id: 'pie',       name: 'Pie',       emoji: '🥧', category: 'food', stackable: true, maxStack: 99, sellPrice: 40,  description: 'Restores 60 stamina', rarity: 'uncommon' },

  // ─── Tools (not stackable) ───
  tool_hoe_wood:     { id: 'tool_hoe_wood',     name: 'Wood Hoe',     emoji: '🪓', category: 'tool', stackable: false, maxStack: 1, sellPrice: 10,  description: 'Tills soil for planting', rarity: 'common' },
  tool_axe_wood:     { id: 'tool_axe_wood',     name: 'Wood Axe',     emoji: '🪓', category: 'tool', stackable: false, maxStack: 1, sellPrice: 10,  description: 'Chops trees', rarity: 'common' },
  tool_pickaxe_wood: { id: 'tool_pickaxe_wood', name: 'Wood Pickaxe', emoji: '⛏️', category: 'tool', stackable: false, maxStack: 1, sellPrice: 10,  description: 'Mines rocks and ore', rarity: 'common' },
  tool_watering_can: { id: 'tool_watering_can', name: 'Watering Can', emoji: '🪣', category: 'tool', stackable: false, maxStack: 1, sellPrice: 10,  description: 'Waters crops', rarity: 'common' },
  tool_fishing_rod:  { id: 'tool_fishing_rod',  name: 'Fishing Rod',  emoji: '🎣', category: 'tool', stackable: false, maxStack: 1, sellPrice: 15,  description: 'Catch fish', rarity: 'common' },
  tool_bug_net:      { id: 'tool_bug_net',      name: 'Bug Net',      emoji: '🦋', category: 'tool', stackable: false, maxStack: 1, sellPrice: 10,  description: 'Catch insects', rarity: 'common' },
}

export function getItem(id: string): ItemDef | undefined {
  return ITEMS[id]
}

export function getItemEmoji(id: string): string {
  return ITEMS[id]?.emoji ?? '❓'
}

export function getItemName(id: string): string {
  return ITEMS[id]?.name ?? id
}
