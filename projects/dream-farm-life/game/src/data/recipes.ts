// recipes.ts — Crafting recipes (50+ across workstations)
export interface RecipeDef {
  id: string
  name: string
  emoji: string
  workstation: 'workbench' | 'kitchen' | 'forge' | 'loom' | 'alchemy'
  ingredients: { itemId: string; count: number }[]
  outputId: string
  outputCount: number
  unlockLevel: number
  craftTimeMs: number
  category: 'tool' | 'food' | 'building' | 'farming' | 'alchemy' | 'decoration'
  description: string
}

export const RECIPES: Record<string, RecipeDef> = {
  // ═══════════════════════════════════
  // WORKBENCH (start)
  // ═══════════════════════════════════
  craft_axe_iron: {
    id: 'craft_axe_iron', name: 'Iron Axe', emoji: '🪓', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 3 }, { itemId: 'iron_ore', count: 5 }],
    outputId: 'tool_axe_iron', outputCount: 1, unlockLevel: 3, craftTimeMs: 2000,
    category: 'tool', description: 'Stronger axe, faster wood chopping',
  },
  craft_pickaxe_iron: {
    id: 'craft_pickaxe_iron', name: 'Iron Pickaxe', emoji: '⛏️', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 3 }, { itemId: 'iron_ore', count: 5 }],
    outputId: 'tool_pickaxe_iron', outputCount: 1, unlockLevel: 3, craftTimeMs: 2000,
    category: 'tool', description: 'Mines rocks and ore faster',
  },
  craft_hoe_iron: {
    id: 'craft_hoe_iron', name: 'Iron Hoe', emoji: '🔨', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 2 }, { itemId: 'iron_ore', count: 3 }],
    outputId: 'tool_hoe_iron', outputCount: 1, unlockLevel: 3, craftTimeMs: 1500,
    category: 'tool', description: 'Tills soil faster',
  },
  craft_fishing_rod_iron: {
    id: 'craft_fishing_rod_iron', name: 'Fiberglass Rod', emoji: '🎣', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 3 }, { itemId: 'iron_ore', count: 5 }, { itemId: 'sap', count: 2 }],
    outputId: 'tool_fishing_rod_iron', outputCount: 1, unlockLevel: 5, craftTimeMs: 2500,
    category: 'tool', description: 'Better fish catch rates',
  },
  craft_fence: {
    id: 'craft_fence', name: 'Fence', emoji: '🪵', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 4 }],
    outputId: 'fence', outputCount: 4, unlockLevel: 2, craftTimeMs: 1000,
    category: 'building', description: 'Wooden fence for your farm',
  },
  craft_chest: {
    id: 'craft_chest', name: 'Storage Chest', emoji: '📦', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 8 }, { itemId: 'iron_ore', count: 2 }],
    outputId: 'chest', outputCount: 1, unlockLevel: 4, craftTimeMs: 2000,
    category: 'building', description: 'Extra storage space',
  },
  craft_scarecrow: {
    id: 'craft_scarecrow', name: 'Scarecrow', emoji: '� scarecrow', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 5 }, { itemId: 'wheat', count: 3 }],
    outputId: 'scarecrow', outputCount: 1, unlockLevel: 3, craftTimeMs: 1500,
    category: 'farming', description: 'Protects crops from crows',
  },
  craft_sprinkler: {
    id: 'craft_sprinkler', name: 'Sprinkler', emoji: '💦', workstation: 'workbench',
    ingredients: [{ itemId: 'iron_ore', count: 4 }, { itemId: 'stone', count: 2 }],
    outputId: 'sprinkler', outputCount: 1, unlockLevel: 6, craftTimeMs: 3000,
    category: 'farming', description: 'Auto-waters nearby crops',
  },
  craft_sign: {
    id: 'craft_sign', name: 'Sign', emoji: '🪧', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 3 }],
    outputId: 'sign', outputCount: 1, unlockLevel: 1, craftTimeMs: 500,
    category: 'decoration', description: 'A wooden sign',
  },
  craft_torch: {
    id: 'craft_torch', name: 'Torch', emoji: '🔦', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 2 }, { itemId: 'sap', count: 1 }],
    outputId: 'torch', outputCount: 2, unlockLevel: 2, craftTimeMs: 500,
    category: 'decoration', description: 'Lights up the night',
  },
  craft_bug_net: {
    id: 'craft_bug_net', name: 'Bug Net', emoji: '🦋', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 3 }, { itemId: 'sap', count: 2 }],
    outputId: 'tool_bug_net', outputCount: 1, unlockLevel: 2, craftTimeMs: 1000,
    category: 'tool', description: 'Catch insects',
  },

  // ═══════════════════════════════════
  // KITCHEN (Lv 5)
  // ═══════════════════════════════════
  craft_bread: {
    id: 'craft_bread', name: 'Bread', emoji: '🍞', workstation: 'kitchen',
    ingredients: [{ itemId: 'wheat', count: 3 }],
    outputId: 'bread', outputCount: 1, unlockLevel: 5, craftTimeMs: 2000,
    category: 'food', description: 'Restores 20 stamina',
  },
  craft_soup: {
    id: 'craft_soup', name: 'Vegetable Soup', emoji: '🍲', workstation: 'kitchen',
    ingredients: [{ itemId: 'carrot', count: 2 }, { itemId: 'potato', count: 1 }, { itemId: 'herb', count: 1 }],
    outputId: 'soup', outputCount: 1, unlockLevel: 6, craftTimeMs: 3000,
    category: 'food', description: 'Restores 40 stamina',
  },
  craft_pie: {
    id: 'craft_pie', name: 'Berry Pie', emoji: '🥧', workstation: 'kitchen',
    ingredients: [{ itemId: 'berry', count: 4 }, { itemId: 'wheat', count: 2 }],
    outputId: 'pie', outputCount: 1, unlockLevel: 8, craftTimeMs: 4000,
    category: 'food', description: 'Restores 60 stamina',
  },
  craft_jam: {
    id: 'craft_jam', name: 'Strawberry Jam', emoji: '🍓', workstation: 'kitchen',
    ingredients: [{ itemId: 'strawberry', count: 5 }, { itemId: 'sugarcane', count: 1 }],
    outputId: 'jam', outputCount: 1, unlockLevel: 7, craftTimeMs: 3000,
    category: 'food', description: 'Sweet jam, sells for good price',
  },
  craft_sushi: {
    id: 'craft_sushi', name: 'Sushi Roll', emoji: '🍣', workstation: 'kitchen',
    ingredients: [{ itemId: 'fish_salmon', count: 1 }, { itemId: 'rice', count: 2 }],
    outputId: 'sushi', outputCount: 2, unlockLevel: 10, craftTimeMs: 3000,
    category: 'food', description: 'Premium food, restores 50 stamina',
  },
  craft_honey_bread: {
    id: 'craft_honey_bread', name: 'Honey Bread', emoji: '🍯', workstation: 'kitchen',
    ingredients: [{ itemId: 'bread', count: 1 }, { itemId: 'honey', count: 1 }],
    outputId: 'honey_bread', outputCount: 1, unlockLevel: 12, craftTimeMs: 2000,
    category: 'food', description: 'Restores 35 stamina, very tasty',
  },

  // ═══════════════════════════════════
  // FORGE (Lv 10)
  // ═══════════════════════════════════
  craft_axe_gold: {
    id: 'craft_axe_gold', name: 'Gold Axe', emoji: '🪓', workstation: 'forge',
    ingredients: [{ itemId: 'iron_ore', count: 5 }, { itemId: 'gold_ore', count: 3 }],
    outputId: 'tool_axe_gold', outputCount: 1, unlockLevel: 10, craftTimeMs: 4000,
    category: 'tool', description: 'Fast axe with high yield',
  },
  craft_pickaxe_gold: {
    id: 'craft_pickaxe_gold', name: 'Gold Pickaxe', emoji: '⛏️', workstation: 'forge',
    ingredients: [{ itemId: 'iron_ore', count: 5 }, { itemId: 'gold_ore', count: 3 }],
    outputId: 'tool_pickaxe_gold', outputCount: 1, unlockLevel: 10, craftTimeMs: 4000,
    category: 'tool', description: 'Fast mining, more ore',
  },
  craft_axe_diamond: {
    id: 'craft_axe_diamond', name: 'Diamond Axe', emoji: '🪓', workstation: 'forge',
    ingredients: [{ itemId: 'gold_ore', count: 5 }, { itemId: 'gem', count: 2 }],
    outputId: 'tool_axe_diamond', outputCount: 1, unlockLevel: 18, craftTimeMs: 6000,
    category: 'tool', description: 'Ultimate axe, 3x yield',
  },
  craft_pickaxe_diamond: {
    id: 'craft_pickaxe_diamond', name: 'Diamond Pickaxe', emoji: '⛏️', workstation: 'forge',
    ingredients: [{ itemId: 'gold_ore', count: 5 }, { itemId: 'gem', count: 2 }],
    outputId: 'tool_pickaxe_diamond', outputCount: 1, unlockLevel: 18, craftTimeMs: 6000,
    category: 'tool', description: 'Ultimate pickaxe, 3x yield',
  },
  craft_lantern: {
    id: 'craft_lantern', name: 'Lantern', emoji: '🏮', workstation: 'forge',
    ingredients: [{ itemId: 'iron_ore', count: 3 }, { itemId: 'sap', count: 2 }],
    outputId: 'lantern', outputCount: 1, unlockLevel: 10, craftTimeMs: 2000,
    category: 'decoration', description: 'Bright lantern for your farm',
  },
  craft_watering_can_iron: {
    id: 'craft_watering_can_iron', name: 'Iron Watering Can', emoji: '🪣', workstation: 'forge',
    ingredients: [{ itemId: 'iron_ore', count: 5 }, { itemId: 'clay', count: 2 }],
    outputId: 'tool_watering_can', outputCount: 1, unlockLevel: 8, craftTimeMs: 2000,
    category: 'tool', description: 'Water crops faster',
  },
  craft_fishing_rod_gold: {
    id: 'craft_fishing_rod_gold', name: 'Master Rod', emoji: '🎣', workstation: 'forge',
    ingredients: [{ itemId: 'iron_ore', count: 5 }, { itemId: 'gold_ore', count: 3 }],
    outputId: 'tool_fishing_rod_gold', outputCount: 1, unlockLevel: 12, craftTimeMs: 4000,
    category: 'tool', description: 'Best fishing rod, 2x yield',
  },

  // ═══════════════════════════════════
  // ALCHEMY LAB (Lv 15)
  // ═══════════════════════════════════
  craft_growth_potion: {
    id: 'craft_growth_potion', name: 'Growth Potion', emoji: '🧪', workstation: 'alchemy',
    ingredients: [{ itemId: 'herb', count: 3 }, { itemId: 'mushroom', count: 2 }, { itemId: 'sap', count: 1 }],
    outputId: 'growth_potion', outputCount: 1, unlockLevel: 15, craftTimeMs: 5000,
    category: 'alchemy', description: 'Instantly advances crop growth 1 stage',
  },
  craft_stamina_potion: {
    id: 'craft_stamina_potion', name: 'Stamina Potion', emoji: '⚡', workstation: 'alchemy',
    ingredients: [{ itemId: 'herb', count: 2 }, { itemId: 'berry', count: 3 }],
    outputId: 'stamina_potion', outputCount: 1, unlockLevel: 13, craftTimeMs: 3000,
    category: 'alchemy', description: 'Restores 80 stamina instantly',
  },
  craft_luck_potion: {
    id: 'craft_luck_potion', name: 'Luck Potion', emoji: '🍀', workstation: 'alchemy',
    ingredients: [{ itemId: 'herb', count: 2 }, { itemId: 'crystal', count: 1 }],
    outputId: 'luck_potion', outputCount: 1, unlockLevel: 16, craftTimeMs: 5000,
    category: 'alchemy', description: 'Doubles rare drop chance for 5 min',
  },
  craft_super_fertilizer: {
    id: 'craft_super_fertilizer', name: 'Super Fertilizer', emoji: '💩', workstation: 'alchemy',
    ingredients: [{ itemId: 'mushroom', count: 3 }, { itemId: 'clay', count: 2 }],
    outputId: 'super_fertilizer', outputCount: 2, unlockLevel: 14, craftTimeMs: 3000,
    category: 'farming', description: 'Doubles crop yield on next harvest',
  },
  craft_bomb: {
    id: 'craft_bomb', name: 'Mining Bomb', emoji: '💣', workstation: 'alchemy',
    ingredients: [{ itemId: 'iron_ore', count: 3 }, { itemId: 'crystal', count: 1 }],
    outputId: 'bomb', outputCount: 1, unlockLevel: 17, craftTimeMs: 4000,
    category: 'alchemy', description: 'Clears all rocks in a 3x3 area',
  },

  // ═══════════════════════════════════
  // LOOM (Lv 12)
  // ═══════════════════════════════════
  craft_wool_shirt: {
    id: 'craft_wool_shirt', name: 'Wool Shirt', emoji: '👕', workstation: 'loom',
    ingredients: [{ itemId: 'wool', count: 3 }],
    outputId: 'wool_shirt', outputCount: 1, unlockLevel: 12, craftTimeMs: 3000,
    category: 'decoration', description: 'Cozy clothing, stamina regen +10%',
  },
  craft_silk_scarf: {
    id: 'craft_silk_scarf', name: 'Silk Scarf', emoji: '🧣', workstation: 'loom',
    ingredients: [{ itemId: 'wool', count: 2 }, { itemId: 'honey', count: 1 }],
    outputId: 'silk_scarf', outputCount: 1, unlockLevel: 14, craftTimeMs: 3000,
    category: 'decoration', description: 'Fashionable scarf, NPC friendship +5%',
  },
  craft_bag: {
    id: 'craft_bag', name: 'Leather Bag', emoji: '👜', workstation: 'loom',
    ingredients: [{ itemId: 'wool', count: 4 }, { itemId: 'iron_ore', count: 2 }],
    outputId: 'bag', outputCount: 1, unlockLevel: 15, craftTimeMs: 4000,
    category: 'tool', description: 'Expands inventory by 10 slots',
  },

  // ═══════════════════════════════════
  // BUILDINGS (crafted at workbench, placed)
  // ═══════════════════════════════════
  craft_barn: {
    id: 'craft_barn', name: 'Barn', emoji: '🏚️', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 20 }, { itemId: 'stone', count: 10 }, { itemId: 'iron_ore', count: 5 }],
    outputId: 'building_barn', outputCount: 1, unlockLevel: 5, craftTimeMs: 10000,
    category: 'building', description: 'Extra storage for crops and resources',
  },
  craft_animal_pen: {
    id: 'craft_animal_pen', name: 'Animal Pen', emoji: '🏠', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 15 }, { itemId: 'fence', count: 8 }],
    outputId: 'building_animal_pen', outputCount: 1, unlockLevel: 4, craftTimeMs: 8000,
    category: 'building', description: 'House farm animals',
  },
  craft_greenhouse: {
    id: 'craft_greenhouse', name: 'Greenhouse', emoji: '🌿', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 15 }, { itemId: 'iron_ore', count: 10 }, { itemId: 'sand', count: 10 }],
    outputId: 'building_greenhouse', outputCount: 1, unlockLevel: 12, craftTimeMs: 15000,
    category: 'building', description: 'Grow any crop regardless of biome',
  },
  craft_well: {
    id: 'craft_well', name: 'Well', emoji: '🪣', workstation: 'workbench',
    ingredients: [{ itemId: 'stone', count: 15 }, { itemId: 'clay', count: 5 }],
    outputId: 'building_well', outputCount: 1, unlockLevel: 7, craftTimeMs: 8000,
    category: 'building', description: 'Auto-waters nearby crops',
  },
  craft_windmill: {
    id: 'craft_windmill', name: 'Windmill', emoji: '🏗️', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 25 }, { itemId: 'iron_ore', count: 10 }, { itemId: 'stone', count: 10 }],
    outputId: 'building_windmill', outputCount: 1, unlockLevel: 10, craftTimeMs: 12000,
    category: 'building', description: 'Auto-process wheat into flour',
  },
  craft_market_stall: {
    id: 'craft_market_stall', name: 'Market Stall', emoji: '🏪', workstation: 'workbench',
    ingredients: [{ itemId: 'wood', count: 12 }, { itemId: 'iron_ore', count: 5 }],
    outputId: 'building_market_stall', outputCount: 1, unlockLevel: 8, craftTimeMs: 8000,
    category: 'building', description: 'Sell items to NPCs automatically',
  },
}

export function getRecipesForWorkstation(workstation: string, level: number): RecipeDef[] {
  return Object.values(RECIPES).filter(r => r.workstation === workstation && r.unlockLevel <= level)
}

export function canCraft(recipe: RecipeDef, inventory: { itemId: string; count: number }[]): boolean {
  return recipe.ingredients.every(ing => {
    const slot = inventory.find(s => s.itemId === ing.itemId)
    return slot && slot.count >= ing.count
  })
}
