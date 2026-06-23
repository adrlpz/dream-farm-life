// npcs.ts — NPC definitions with dialog trees
export interface DialogLine {
  speaker: 'npc' | 'player'
  text: string
  choices?: DialogChoice[]
}

export interface DialogChoice {
  text: string
  nextLine: number // index into dialog array, -1 = end
  questId?: string
  requiresItem?: string
  giveItem?: string
  giveCount?: number
}

export interface NpcDef {
  id: string
  name: string
  emoji: string
  role: string
  biome: string
  homeX: number // tile coords relative to chunk center
  homeY: number
  portrait: string // emoji for portrait
  greeting: string
  dialog: DialogLine[]
  quests: string[] // quest IDs this NPC gives
  likes: string[]  // item IDs they like as gifts
  hates: string[]
  friendshipMax: number
}

export const NPC_DEFS: Record<string, NpcDef> = {
  elder: {
    id: 'elder', name: 'Elder Oakwood', emoji: '👴', role: 'Village Elder',
    biome: 'farmland', homeX: 16, homeY: 14, portrait: '👴',
    greeting: 'Welcome to the village, young farmer!',
    dialog: [
      { speaker: 'npc', text: 'Welcome, newcomer! I am Elder Oakwood, keeper of this village.' },
      { speaker: 'npc', text: 'This land was once fertile and full of life. But the wilds have grown restless.' },
      { speaker: 'player', text: 'What happened?', choices: [
        { text: 'Tell me more', nextLine: 3 },
        { text: 'I\'m here to farm', nextLine: 5 },
      ]},
      { speaker: 'npc', text: 'Ancient forces stir in the deep places. The forest grows thicker each day, and strange creatures appear in the mountains.' },
      { speaker: 'npc', text: 'We need someone brave enough to explore these lands and restore balance. Will you help?', choices: [
        { text: 'I\'ll help!', nextLine: 6, questId: 'main_ch1' },
        { text: 'Not right now', nextLine: -1 },
      ]},
      { speaker: 'npc', text: 'Farming is the heart of our village! Till the soil, plant seeds, and watch them grow. Start with wheat — it\'s easy and fast.' },
      { speaker: 'npc', text: 'Excellent! Start by tilling some grass near your farm. Use your hoe and press [E] to interact. Once you harvest your first wheat, come talk to me again.' },
    ],
    quests: ['main_ch1', 'main_ch2', 'main_ch3', 'main_ch4'],
    likes: ['wheat', 'pumpkin', 'golden_apple'],
    hates: ['stone', 'iron_ore'],
    friendshipMax: 100,
  },

  merchant: {
    id: 'merchant', name: 'Penny the Merchant', emoji: '👩‍🌾', role: 'Seed Merchant',
    biome: 'farmland', homeX: 18, homeY: 16, portrait: '👩‍🌾',
    greeting: 'Looking for seeds? You\'ve come to the right place!',
    dialog: [
      { speaker: 'npc', text: 'Welcome to my shop! I have seeds for every season.' },
      { speaker: 'player', text: 'What do you have?', choices: [
        { text: 'Show me seeds', nextLine: 2 },
        { text: 'Any tips?', nextLine: 3 },
      ]},
      { speaker: 'npc', text: 'Check the seed prices — they change with the seasons! Spring is best for most crops.' },
      { speaker: 'npc', text: 'Pro tip: plant in the right season for bonus yield. And don\'t forget to water your crops!' },
      { speaker: 'npc', text: 'Also, if you bring me rare fish from the beach, I\'ll pay top dollar! 💰' },
    ],
    quests: ['side_merchant_fish'],
    likes: ['fish_bass', 'fish_salmon', 'fish_golden'],
    hates: ['stone', 'clay'],
    friendshipMax: 100,
  },

  blacksmith: {
    id: 'blacksmith', name: 'Forge Master Bruno', emoji: '🔨', role: 'Blacksmith',
    biome: 'mountain', homeX: 20, homeY: 14, portrait: '🔨',
    greeting: 'Need something forged? Bring me ore!',
    dialog: [
      { speaker: 'npc', text: '*clang clang* Oh, a visitor! I\'m Bruno, the blacksmith.' },
      { speaker: 'npc', text: 'I can upgrade your tools if you bring me the right materials. Iron for iron tools, gold for gold!' },
      { speaker: 'player', text: 'What can you make?', choices: [
        { text: 'Upgrade my tools', nextLine: 3 },
        { text: 'Tell me about the mountains', nextLine: 4 },
      ]},
      { speaker: 'npc', text: 'Bring me 5 iron ore + 3 wood for an iron tool upgrade. Gold ore for gold tier! Higher tiers = faster gathering + more yield.' },
      { speaker: 'npc', text: 'The mountains hold rich ore veins, but beware — the deeper caves have strange crystals that glow in the dark. Fascinating!' },
    ],
    quests: ['side_blacksmith_ore'],
    likes: ['iron_ore', 'gold_ore', 'gem'],
    hates: ['berry', 'flower'],
    friendshipMax: 100,
  },

  botanist: {
    id: 'botanist', name: 'Flora the Botanist', emoji: '🌸', role: 'Botanist',
    biome: 'forest', homeX: 14, homeY: 10, portrait: '🌸',
    greeting: 'Oh! A fellow nature lover! The forest is full of wonders.',
    dialog: [
      { speaker: 'npc', text: 'I study the plants and fungi of the forest. There\'s so much to discover!' },
      { speaker: 'npc', text: 'Some mushrooms only grow in caves, and certain herbs have medicinal properties. Fascinating!' },
      { speaker: 'player', text: 'Can you teach me?', choices: [
        { text: 'Yes, teach me!', nextLine: 3, questId: 'side_botanist_herbs' },
        { text: 'Just browsing', nextLine: -1 },
      ]},
      { speaker: 'npc', text: 'Bring me 5 herbs and 3 mushrooms from the forest. I\'ll teach you how to grow them yourself!' },
    ],
    quests: ['side_botanist_herbs', 'side_botanist_mushroom'],
    likes: ['herb', 'mushroom', 'blueberry'],
    hates: ['iron_ore', 'stone'],
    friendshipMax: 100,
  },

  fisherman: {
    id: 'fisherman', name: 'Old Captain Finn', emoji: '🎣', role: 'Fisherman',
    biome: 'beach', homeX: 16, homeY: 22, portrait: '🎣',
    greeting: 'The fish are biting today! Want to try your luck?',
    dialog: [
      { speaker: 'npc', text: 'Ahoy! I\'m Captain Finn. Been fishing these waters for 40 years.' },
      { speaker: 'npc', text: 'The beach has common fish, but if you use a better rod, you might catch something rare!' },
      { speaker: 'player', text: 'Any legendary fish?', choices: [
        { text: 'Tell me about them', nextLine: 3 },
        { text: 'I\'ll start fishing', nextLine: -1 },
      ]},
      { speaker: 'npc', text: 'Legend says a Golden Koi lives in the deep waters. Only the most skilled anglers can catch it. Bring it to me and I\'ll reward you handsomely!' },
    ],
    quests: ['side_fisherman_koi'],
    likes: ['fish_common', 'fish_bass', 'shell'],
    hates: ['stone', 'iron_ore'],
    friendshipMax: 100,
  },

  archaeologist: {
    id: 'archaeologist', name: 'Dr. Stone', emoji: '🏺', role: 'Archaeologist',
    biome: 'mountain', homeX: 22, homeY: 12, portrait: '🏺',
    greeting: 'Fascinating! Ancient ruins in these mountains...',
    dialog: [
      { speaker: 'npc', text: 'I\'m Dr. Stone, archaeologist. I\'ve been studying the ancient ruins hidden in these mountains.' },
      { speaker: 'npc', text: 'The civilization that built them vanished long ago. But their artifacts remain...' },
      { speaker: 'player', text: 'What kind of artifacts?', choices: [
        { text: 'I want to help excavate', nextLine: 3, questId: 'side_archaeologist_artifacts' },
        { text: 'Sounds dangerous', nextLine: -1 },
      ]},
      { speaker: 'npc', text: 'Bring me any ancient coins or strange items you find in caves. Each artifact tells a story!' },
    ],
    quests: ['side_archaeologist_artifacts'],
    likes: ['ancient_coin', 'gem', 'crystal'],
    hates: ['berry', 'wheat'],
    friendshipMax: 100,
  },

  trader: {
    id: 'trader', name: 'Mysterious Trader', emoji: '🎭', role: 'Wandering Trader',
    biome: 'farmland', homeX: 12, homeY: 16, portrait: '🎭',
    greeting: 'Psst... interested in rare goods?',
    dialog: [
      { speaker: 'npc', text: 'I travel between biomes, trading rare items. You won\'t find my goods anywhere else.' },
      { speaker: 'npc', text: 'I accept gems and rare resources. No coins — only quality goods.' },
      { speaker: 'player', text: 'Show me what you have', choices: [
        { text: 'Let me see', nextLine: 3 },
        { text: 'Maybe later', nextLine: -1 },
      ]},
      { speaker: 'npc', text: 'I have exotic seeds, rare tools, and... special items. Come back when you have something worth trading.' },
    ],
    quests: ['side_trader_exotic'],
    likes: ['gem', 'crystal', 'golden_apple', 'ancient_coin'],
    hates: ['wheat', 'corn'],
    friendshipMax: 100,
  },
}

export function getNpcByBiome(biome: string): NpcDef[] {
  return Object.values(NPC_DEFS).filter(n => n.biome === biome)
}

export function getNpcById(id: string): NpcDef | undefined {
  return NPC_DEFS[id]
}
