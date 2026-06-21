import { CropDef } from '../types'

export const CROPS: Record<string, CropDef> = {
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    emoji: '🌾',
    stages: ['🫘', '🌱', '🌿', '🌾'],
    growTimeMs: 60_000,       // 1 min
    sellPrice: 5,
    seedCost: 2,
    xp: 3,
    unlockLevel: 1,
  },
  corn: {
    id: 'corn',
    name: 'Corn',
    emoji: '🌽',
    stages: ['🫘', '🌱', '🌿', '🌽'],
    growTimeMs: 120_000,      // 2 min
    sellPrice: 8,
    seedCost: 4,
    xp: 5,
    unlockLevel: 1,
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    emoji: '🥕',
    stages: ['🫘', '🌱', '🌿', '🥕'],
    growTimeMs: 180_000,      // 3 min
    sellPrice: 12,
    seedCost: 6,
    xp: 8,
    unlockLevel: 2,
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    emoji: '🍅',
    stages: ['🫘', '🌱', '🌿', '🍅'],
    growTimeMs: 300_000,      // 5 min
    sellPrice: 18,
    seedCost: 10,
    xp: 12,
    unlockLevel: 3,
  },
  potato: {
    id: 'potato',
    name: 'Potato',
    emoji: '🥔',
    stages: ['🫘', '🌱', '🌿', '🥔'],
    growTimeMs: 480_000,      // 8 min
    sellPrice: 25,
    seedCost: 14,
    xp: 16,
    unlockLevel: 5,
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    emoji: '🎃',
    stages: ['🫘', '🌱', '🌿', '🎃'],
    growTimeMs: 900_000,      // 15 min
    sellPrice: 40,
    seedCost: 22,
    xp: 25,
    unlockLevel: 7,
  },
  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    stages: ['🫘', '🌱', '🌿', '🍓'],
    growTimeMs: 1_200_000,    // 20 min
    sellPrice: 55,
    seedCost: 30,
    xp: 32,
    unlockLevel: 9,
  },
  grape: {
    id: 'grape',
    name: 'Grape',
    emoji: '🍇',
    stages: ['🫘', '🌱', '🌿', '🍇'],
    growTimeMs: 1_800_000,    // 30 min
    sellPrice: 80,
    seedCost: 45,
    xp: 45,
    unlockLevel: 12,
  },
}
