// quests.ts — Quest definitions
export interface QuestObjective {
  type: 'gather' | 'harvest' | 'talk' | 'deliver' | 'reach_level' | 'discover_biome' | 'catch_fish' | 'craft'
  target: string    // item ID, NPC ID, biome, level number
  count: number
  current?: number
}

export interface QuestReward {
  xp?: number
  coins?: number
  items?: { itemId: string; count: number }[]
  unlockBiome?: string
  unlockRecipe?: string
  farmingXp?: number
}

export interface QuestDef {
  id: string
  name: string
  description: string
  type: 'main' | 'daily' | 'side' | 'exploration'
  chapter?: number // main story chapter
  giver: string // NPC ID
  objectives: QuestObjective[]
  rewards: QuestReward
  prereq?: string // quest ID that must be completed first
  dialog: {
    start: string[]    // NPC lines when giving quest
    progress: string[] // NPC lines when quest in progress
    complete: string[] // NPC lines when turning in
  }
  autoComplete?: boolean // complete as soon as objectives met
  repeatable?: boolean
}

export const QUESTS: Record<string, QuestDef> = {
  // ══════════════════════════════════════════
  // MAIN STORY
  // ══════════════════════════════════════════
  main_ch1: {
    id: 'main_ch1',
    name: 'New Beginnings',
    description: 'Learn the basics of farming. Till soil, plant wheat, and harvest your first crop.',
    type: 'main',
    chapter: 1,
    giver: 'elder',
    objectives: [
      { type: 'harvest', target: 'wheat', count: 3 },
      { type: 'reach_level', target: 'farming', count: 2 },
    ],
    rewards: {
      xp: 50, coins: 100, farmingXp: 30,
      items: [
        { itemId: 'seed_corn', count: 5 },
        { itemId: 'seed_tomato', count: 3 },
      ],
    },
    dialog: {
      start: [
        'Welcome, newcomer! Let me teach you the ways of farming.',
        'Till some grass with your hoe, plant wheat seeds, water them, and harvest when ready!',
        'Harvest 3 wheat and reach farming level 2. Then come talk to me.',
      ],
      progress: [
        'Keep going! Till, plant, water, harvest. You\'re doing great!',
        'Remember: press [E] near tilled soil to plant seeds.',
      ],
      complete: [
        'Wonderful! You\'ve harvested your first crops!',
        'Here are some corn and tomato seeds. They\'re worth more but take longer to grow.',
        'The forest to the north holds many secrets. When you\'re ready, explore it!',
      ],
    },
  },

  main_ch2: {
    id: 'main_ch2',
    name: 'Into the Wild',
    description: 'Explore the forest biome and meet Flora the Botanist.',
    type: 'main',
    chapter: 2,
    giver: 'elder',
    prereq: 'main_ch1',
    objectives: [
      { type: 'discover_biome', target: 'forest', count: 1 },
      { type: 'talk', target: 'botanist', count: 1 },
      { type: 'gather', target: 'wood', count: 10 },
    ],
    rewards: {
      xp: 100, coins: 200, farmingXp: 50,
      items: [
        { itemId: 'seed_blueberry', count: 3 },
        { itemId: 'seed_herb', count: 3 },
      ],
    },
    dialog: {
      start: [
        'The forest to the north is thick with trees and wild herbs.',
        'Find Flora the Botanist — she lives on the forest edge. She can teach you about forest crops.',
        'Gather some wood while you\'re there. You\'ll need it for building!',
      ],
      progress: [
        'Head north into the forest. Look for the tall trees!',
        'Flora should be somewhere near the center of the forest.',
      ],
      complete: [
        'You found Flora! Excellent. The forest holds many valuable resources.',
        'Blueberries and herbs grow there — they sell for good prices.',
        'To the south lies the beach. Captain Finn can teach you to fish!',
      ],
    },
  },

  main_ch3: {
    id: 'main_ch3',
    name: 'Tides of Change',
    description: 'Visit the beach and learn fishing from Captain Finn.',
    type: 'main',
    chapter: 3,
    giver: 'elder',
    prereq: 'main_ch2',
    objectives: [
      { type: 'discover_biome', target: 'beach', count: 1 },
      { type: 'talk', target: 'fisherman', count: 1 },
      { type: 'catch_fish', target: 'fish_common', count: 3 },
    ],
    rewards: {
      xp: 150, coins: 300, farmingXp: 60,
      items: [
        { itemId: 'tool_fishing_rod', count: 1 },
        { itemId: 'seed_rice', count: 3 },
      ],
    },
    dialog: {
      start: [
        'The beach to the south has excellent fishing waters.',
        'Captain Finn knows every fish in the sea. He can teach you well.',
        'Catch 3 fish and report back!',
      ],
      progress: [
        'Head south to find the beach. Use your fishing rod near water!',
        'Press [E] near water with a fishing rod equipped to cast your line.',
      ],
      complete: [
        'Fish! The sea provides sustenance. You\'re becoming a true farmer-adventurer.',
        'The mountains to the east hold ore and a skilled blacksmith. Visit him next!',
      ],
    },
  },

  main_ch4: {
    id: 'main_ch4',
    name: 'Mountain\'s Call',
    description: 'Climb the mountains and meet Forge Master Bruno.',
    type: 'main',
    chapter: 4,
    giver: 'elder',
    prereq: 'main_ch3',
    objectives: [
      { type: 'discover_biome', target: 'mountain', count: 1 },
      { type: 'talk', target: 'blacksmith', count: 1 },
      { type: 'gather', target: 'iron_ore', count: 5 },
    ],
    rewards: {
      xp: 200, coins: 500, farmingXp: 80,
      items: [
        { itemId: 'tool_pickaxe_iron', count: 1 },
        { itemId: 'tool_axe_iron', count: 1 },
      ],
    },
    dialog: {
      start: [
        'The mountains are rich with ore. Bruno the blacksmith can upgrade your tools!',
        'Gather 5 iron ore — Bruno will know what to do with them.',
      ],
      progress: [
        'Head east to the mountains. Look for rocky terrain and ore veins!',
        'Use your pickaxe on rocks and ore deposits.',
      ],
      complete: [
        'Iron tools! You\'re becoming well-equipped for this land.',
        'There are more biomes to explore — the desert, snow peaks, and tropical islands.',
        'Keep building, keep farming, keep exploring. This world is yours!',
      ],
    },
  },

  // ══════════════════════════════════════════
  // SIDE QUESTS
  // ══════════════════════════════════════════
  side_merchant_fish: {
    id: 'side_merchant_fish',
    name: 'Fresh Catch',
    description: 'Bring Penny 3 fish for a reward.',
    type: 'side',
    giver: 'merchant',
    objectives: [
      { type: 'deliver', target: 'fish_common', count: 3 },
    ],
    rewards: {
      xp: 40, coins: 150,
      items: [{ itemId: 'seed_strawberry', count: 5 }],
    },
    dialog: {
      start: [
        'I\'m craving fresh fish! Bring me 3 trout and I\'ll make it worth your while.',
      ],
      progress: [
        'Still waiting for that fish! Try fishing at the beach.',
      ],
      complete: [
        'Fresh fish! Here, take these strawberry seeds as thanks. They sell for a pretty penny!',
      ],
    },
  },

  side_blacksmith_ore: {
    id: 'side_blacksmith_ore',
    name: 'Ore Rush',
    description: 'Deliver 10 iron ore to Bruno.',
    type: 'side',
    giver: 'blacksmith',
    objectives: [
      { type: 'deliver', target: 'iron_ore', count: 10 },
    ],
    rewards: {
      xp: 60, coins: 200,
      items: [{ itemId: 'tool_pickaxe_gold', count: 1 }],
    },
    dialog: {
      start: [
        'I need 10 iron ore for a special project. Bring them to me!',
      ],
      progress: [
        'Not enough ore yet! Mine rocks in the mountains with your pickaxe.',
      ],
      complete: [
        'Perfect! Here — take this gold pickaxe. It mines much faster and yields more ore!',
      ],
    },
  },

  side_botanist_herbs: {
    id: 'side_botanist_herbs',
    name: 'Herb Collection',
    description: 'Gather 5 herbs for Flora.',
    type: 'side',
    giver: 'botanist',
    objectives: [
      { type: 'gather', target: 'herb', count: 5 },
    ],
    rewards: {
      xp: 30, coins: 100, farmingXp: 20,
      items: [{ itemId: 'seed_mushroom', count: 3 }],
    },
    dialog: {
      start: [
        'I need 5 herbs for my research. Gather them from the forest — look for tall grass!',
      ],
      progress: [
        'Herbs grow in tall grass. Forage in the forest with your hoe or bare hands.',
      ],
      complete: [
        'Wonderful specimens! Here, take these mushroom spores. They grow well in dark, damp places.',
      ],
    },
  },

  side_botanist_mushroom: {
    id: 'side_botanist_mushroom',
    name: 'Fungal Research',
    description: 'Bring Flora 4 mushrooms.',
    type: 'side',
    giver: 'botanist',
    prereq: 'side_botanist_herbs',
    objectives: [
      { type: 'gather', target: 'mushroom', count: 4 },
    ],
    rewards: {
      xp: 50, coins: 150, farmingXp: 30,
      items: [{ itemId: 'seed_sunflower', count: 2 }],
    },
    dialog: {
      start: [
        'Now I need mushrooms! They grow in forest clearings and cave entrances.',
      ],
      progress: [
        'Mushrooms are found in the forest. Forage bushes and tall grass!',
      ],
      complete: [
        'Excellent fungi! Sunflower seeds — they\'re beautiful AND valuable.',
      ],
    },
  },

  side_fisherman_koi: {
    id: 'side_fisherman_koi',
    name: 'The Golden Koi',
    description: 'Catch the legendary Golden Koi for Captain Finn.',
    type: 'side',
    giver: 'fisherman',
    objectives: [
      { type: 'catch_fish', target: 'fish_golden', count: 1 },
    ],
    rewards: {
      xp: 100, coins: 500,
      items: [{ itemId: 'tool_fishing_rod', count: 1 }], // better rod
    },
    dialog: {
      start: [
        'The Golden Koi... many have tried, few have caught it. Use your best rod and fish in deep waters!',
      ],
      progress: [
        'Keep trying! The Golden Koi is rare — you might need to catch many fish before it appears.',
      ],
      complete: [
        'THE GOLDEN KOI! You\'re a master angler! Take my finest rod — you\'ve earned it!',
      ],
    },
  },

  side_archaeologist_artifacts: {
    id: 'side_archaeologist_artifacts',
    name: 'Lost Artifacts',
    description: 'Find ancient artifacts in caves for Dr. Stone.',
    type: 'side',
    giver: 'archaeologist',
    objectives: [
      { type: 'gather', target: 'ancient_coin', count: 3 },
    ],
    rewards: {
      xp: 80, coins: 400,
      items: [
        { itemId: 'gem', count: 3 },
        { itemId: 'crystal', count: 2 },
      ],
    },
    dialog: {
      start: [
        'Ancient coins are scattered throughout the caves. Find 3 and bring them to me!',
      ],
      progress: [
        'Check the deep caves and mountain ruins. Ancient coins glow faintly in the dark.',
      ],
      complete: [
        'Remarkable! These coins predate any known civilization. Take these gems as payment!',
      ],
    },
  },

  side_trader_exotic: {
    id: 'side_trader_exotic',
    name: 'Rare Goods',
    description: 'Bring the Mysterious Trader 2 gems.',
    type: 'side',
    giver: 'trader',
    objectives: [
      { type: 'deliver', target: 'gem', count: 2 },
    ],
    rewards: {
      xp: 60, coins: 0,
      items: [
        { itemId: 'seed_starfruit', count: 2 },
        { itemId: 'seed_dragonfruit', count: 1 },
      ],
    },
    dialog: {
      start: [
        'Bring me 2 gems, and I\'ll give you seeds you can\'t find anywhere else...',
      ],
      progress: [
        'Gems, friend. Not rocks. Gems! Mine ore in the mountains.',
      ],
      complete: [
        'Pleasure doing business. Here — exotic seeds. Grow them well. 🌟',
      ],
    },
  },

  // ══════════════════════════════════════════
  // DAILY QUESTS (templates)
  // ══════════════════════════════════════════
  daily_harvest: {
    id: 'daily_harvest',
    name: 'Daily Harvest',
    description: 'Harvest any 5 crops today.',
    type: 'daily',
    giver: 'elder',
    objectives: [
      { type: 'harvest', target: 'any', count: 5 },
    ],
    rewards: { xp: 20, coins: 50, farmingXp: 10 },
    dialog: {
      start: ['The fields need tending! Harvest 5 crops today.'],
      progress: ['Keep harvesting! 5 crops and you\'re done for the day.'],
      complete: ['Good work today! Here\'s your reward.'],
    },
    repeatable: true,
  },

  daily_gather: {
    id: 'daily_gather',
    name: 'Resource Run',
    description: 'Gather 10 resources (wood, stone, or ore).',
    type: 'daily',
    giver: 'elder',
    objectives: [
      { type: 'gather', target: 'any', count: 10 },
    ],
    rewards: { xp: 20, coins: 50 },
    dialog: {
      start: ['We need supplies! Gather 10 resources today.'],
      progress: ['Keep gathering! Trees, rocks, ore — anything counts.'],
      complete: ['Excellent supply run! Here you go.'],
    },
    repeatable: true,
  },

  daily_fish: {
    id: 'daily_fish',
    name: 'Fishing Trip',
    description: 'Catch 3 fish.',
    type: 'daily',
    giver: 'fisherman',
    objectives: [
      { type: 'catch_fish', target: 'any', count: 3 },
    ],
    rewards: { xp: 15, coins: 40 },
    dialog: {
      start: ['The fish are biting! Catch 3 today.'],
      progress: ['Cast your line near water. 3 fish and you\'re set!'],
      complete: ['Nice catch! Here\'s something for your trouble.'],
    },
    repeatable: true,
  },
}

export function getQuestById(id: string): QuestDef | undefined {
  return QUESTS[id]
}

export function getAvailableQuests(completedQuests: string[], activeQuests: string[]): QuestDef[] {
  return Object.values(QUESTS).filter(q => {
    if (completedQuests.includes(q.id) && !q.repeatable) return false
    if (activeQuests.includes(q.id)) return false
    if (q.prereq && !completedQuests.includes(q.prereq)) return false
    return true
  })
}

export function getDailyQuests(): QuestDef[] {
  return Object.values(QUESTS).filter(q => q.type === 'daily')
}
