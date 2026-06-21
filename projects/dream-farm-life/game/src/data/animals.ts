import { AnimalDef } from '../types'

export const ANIMALS: Record<string, AnimalDef> = {
  chicken: {
    id: 'chicken',
    name: 'Chicken',
    emoji: '🐔',
    happyEmoji: '🐣',
    productId: 'egg',
    productEmoji: '🥚',
    feedCropId: 'wheat',
    feedAmount: 3,
    productionTimeMs: 120_000,   // 2 min
    buyPrice: 50,
    xp: 20,
    unlockLevel: 3,
  },
  cow: {
    id: 'cow',
    name: 'Cow',
    emoji: '🐄',
    happyEmoji: '🐮',
    productId: 'milk',
    productEmoji: '🥛',
    feedCropId: 'corn',
    feedAmount: 5,
    productionTimeMs: 300_000,   // 5 min
    buyPrice: 150,
    xp: 40,
    unlockLevel: 5,
  },
  sheep: {
    id: 'sheep',
    name: 'Sheep',
    emoji: '🐑',
    happyEmoji: '🐏',
    productId: 'wool',
    productEmoji: '🧶',
    feedCropId: 'wheat',
    feedAmount: 4,
    productionTimeMs: 600_000,   // 10 min
    buyPrice: 200,
    xp: 50,
    unlockLevel: 7,
  },
  goat: {
    id: 'goat',
    name: 'Goat',
    emoji: '🐐',
    happyEmoji: '🐐',
    productId: 'goat_milk',
    productEmoji: '🫗',
    feedCropId: 'carrot',
    feedAmount: 4,
    productionTimeMs: 420_000,   // 7 min
    buyPrice: 180,
    xp: 45,
    unlockLevel: 8,
  },
  pig: {
    id: 'pig',
    name: 'Pig',
    emoji: '🐷',
    happyEmoji: '🐽',
    productId: 'truffle',
    productEmoji: '🍄',
    feedCropId: 'potato',
    feedAmount: 6,
    productionTimeMs: 900_000,   // 15 min
    buyPrice: 300,
    xp: 65,
    unlockLevel: 10,
  },
}
