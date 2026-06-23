// nfts.ts — NFT minting for land parcels and items
import {
  PublicKey, Transaction, SystemProgram,
} from '@solana/web3.js'
import type { SolanaWallet } from './wallet'
import { NFT_PROGRAM_ID } from './wallet'

export interface NftMetadata {
  name: string
  description: string
  image: string
  attributes: { trait_type: string; value: string }[]
  properties: Record<string, unknown>
}

export interface LandNft {
  mint: string
  owner: string
  x: number
  y: number
  width: number
  height: number
  biome: string
  tier: number
}

// Pre-defined land parcel templates
const LAND_TEMPLATES: Record<string, { name: string; emoji: string; basePrice: number }> = {
  farmland_small: { name: 'Small Farm Plot', emoji: '🌾', basePrice: 100 },
  farmland_medium: { name: 'Medium Farm Plot', emoji: '🌾', basePrice: 500 },
  farmland_large: { name: 'Large Farm Plot', emoji: '🌾', basePrice: 2000 },
  forest_cabin: { name: 'Forest Cabin', emoji: '🌲', basePrice: 1000 },
  beach_house: { name: 'Beach House', emoji: '🏖️', basePrice: 3000 },
  mountain_lodge: { name: 'Mountain Lodge', emoji: '⛰️', basePrice: 5000 },
  tropical_villa: { name: 'Tropical Villa', emoji: '🌺', basePrice: 10000 },
}

export class NftManager {
  private wallet: SolanaWallet
  private notifications: string[] = []

  // Owned land NFTs (loaded from chain or local)
  ownedLand: LandNft[] = []

  constructor(wallet: SolanaWallet) {
    this.wallet = wallet
  }

  // Mint a land NFT
  async mintLand(x: number, y: number, width: number, height: number, biome: string): Promise<LandNft | null> {
    if (!this.wallet.state.connected) {
      this.notifications.push('❌ Connect wallet to mint land NFT')
      return null
    }

    // In production: call Metaplex/Bubblegum for compressed NFT
    // For now: create local representation
    const nft: LandNft = {
      mint: `land_${x}_${y}_${Date.now()}`,
      owner: this.wallet.state.publicKey!,
      x, y, width, height,
      biome,
      tier: 1,
    }

    this.ownedLand.push(nft)
    this.notifications.push(`🗺️ Land NFT minted at (${x}, ${y})!`)
    return nft
  }

  // Generate NFT metadata for an in-game item
  generateItemMetadata(itemId: string, name: string, emoji: string, rarity: string): NftMetadata {
    return {
      name: `${emoji} ${name}`,
      description: `Dream Farm Life in-game item: ${name}`,
      image: `https://dreamfarm.adrlpz.site/nft/${itemId}.png`,
      attributes: [
        { trait_type: 'Item ID', value: itemId },
        { trait_type: 'Rarity', value: rarity },
        { trait_type: 'Game', value: 'Dream Farm Life' },
      ],
      properties: { category: 'game_item', game: 'dream-farm-life' },
    }
  }

  // Generate metadata for land
  generateLandMetadata(land: LandNft): NftMetadata {
    const template = LAND_TEMPLATES[`${land.biome}_${land.width > 5 ? 'large' : land.width > 3 ? 'medium' : 'small'}`]
    return {
      name: template?.name ?? `Land at (${land.x}, ${land.y})`,
      description: `A plot of land in Dream Farm Life. Biome: ${land.biome}. Size: ${land.width}x${land.height}.`,
      image: `https://dreamfarm.adrlpz.site/nft/land_${land.biome}.png`,
      attributes: [
        { trait_type: 'Biome', value: land.biome },
        { trait_type: 'Size', value: `${land.width}x${land.height}` },
        { trait_type: 'Tier', value: String(land.tier) },
        { trait_type: 'Coordinates', value: `(${land.x}, ${land.y})` },
      ],
      properties: { category: 'land', game: 'dream-farm-life' },
    }
  }

  // List land templates for purchase
  getLandTemplates() {
    return Object.entries(LAND_TEMPLATES).map(([id, t]) => ({
      id, ...t,
    }))
  }

  // Check if player owns land at position
  ownsLandAt(x: number, y: number): boolean {
    return this.ownedLand.some(l =>
      x >= l.x && x < l.x + l.width &&
      y >= l.y && y < l.y + l.height
    )
  }

  consumeNotifications(): string[] {
    const n = [...this.notifications]
    this.notifications = []
    return n
  }

  serialize() { return { ownedLand: this.ownedLand } }
  deserialize(data: { ownedLand: LandNft[] }) { this.ownedLand = data.ownedLand ?? [] }
}
