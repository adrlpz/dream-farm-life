import { ProductDef } from '../types'

export const PRODUCTS: Record<string, ProductDef> = {
  egg: {
    id: 'egg',
    name: 'Egg',
    emoji: '🥚',
    sellPrice: 15,
  },
  milk: {
    id: 'milk',
    name: 'Milk',
    emoji: '🥛',
    sellPrice: 30,
  },
  wool: {
    id: 'wool',
    name: 'Wool',
    emoji: '🧶',
    sellPrice: 45,
  },
  goat_milk: {
    id: 'goat_milk',
    name: 'Goat Milk',
    emoji: '🫗',
    sellPrice: 40,
  },
  truffle: {
    id: 'truffle',
    name: 'Truffle',
    emoji: '🍄',
    sellPrice: 80,
  },
}
