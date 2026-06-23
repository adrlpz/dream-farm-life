// token.ts — $DREAM SPL token operations
import {
  Connection, PublicKey, Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID, getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token'
import type { SolanaWallet } from './wallet'
import { DREAM_TOKEN_MINT } from './wallet'

export interface TokenPrice {
  item: string
  dreamPrice: number
  solPrice: number
}

// In-game marketplace prices (in $DREAM)
export const MARKETPLACE_PRICES: TokenPrice[] = [
  // Seeds
  { item: 'seed_wheat', dreamPrice: 5, solPrice: 0.001 },
  { item: 'seed_carrot', dreamPrice: 10, solPrice: 0.002 },
  { item: 'seed_tomato', dreamPrice: 20, solPrice: 0.004 },
  { item: 'seed_strawberry', dreamPrice: 50, solPrice: 0.01 },
  { item: 'seed_orchid', dreamPrice: 200, solPrice: 0.04 },
  // Tools
  { item: 'tool_axe_stone', dreamPrice: 50, solPrice: 0.01 },
  { item: 'tool_pickaxe_stone', dreamPrice: 50, solPrice: 0.01 },
  { item: 'tool_axe_iron', dreamPrice: 200, solPrice: 0.04 },
  { item: 'tool_pickaxe_iron', dreamPrice: 200, solPrice: 0.04 },
  { item: 'tool_axe_gold', dreamPrice: 1000, solPrice: 0.2 },
  // Rare items
  { item: 'ancient_coin', dreamPrice: 500, solPrice: 0.1 },
  { item: 'crystal_shard', dreamPrice: 300, solPrice: 0.06 },
  { item: 'star_fragment', dreamPrice: 1000, solPrice: 0.2 },
  // Building materials
  { item: 'mat_wood', dreamPrice: 2, solPrice: 0.0004 },
  { item: 'mat_stone', dreamPrice: 3, solPrice: 0.0006 },
  { item: 'mat_iron', dreamPrice: 15, solPrice: 0.003 },
  { item: 'mat_gold', dreamPrice: 100, solPrice: 0.02 },
]

export class DreamToken {
  private wallet: SolanaWallet
  private connection: Connection

  constructor(wallet: SolanaWallet, connection: Connection) {
    this.wallet = wallet
    this.connection = connection
  }

  // Get $DREAM balance
  async getBalance(): Promise<number> {
    return this.wallet.state.dreamBalance
  }

  // Transfer $DREAM to another wallet
  async transfer(toAddress: string, amount: number): Promise<string | null> {
    const fromPubKey = this.wallet.getPublicKey()
    if (!fromPubKey) return null

    const toPubKey = new PublicKey(toAddress)
    const fromTokenAccount = await getAssociatedTokenAddress(DREAM_TOKEN_MINT, fromPubKey)
    const toTokenAccount = await getAssociatedTokenAddress(DREAM_TOKEN_MINT, toPubKey)

    const tx = new Transaction()

    // Create destination token account if needed
    const toAccountInfo = await this.connection.getAccountInfo(toTokenAccount)
    if (!toAccountInfo) {
      tx.add(createAssociatedTokenAccountInstruction(fromPubKey, toTokenAccount, toPubKey, DREAM_TOKEN_MINT))
    }

    tx.add(createTransferInstruction(fromTokenAccount, toTokenAccount, fromPubKey, amount * 1e9)) // 9 decimals

    return this.wallet.signAndSend(tx)
  }

  // Earn $DREAM from gameplay (server-side mint, client requests)
  async claimReward(action: string, amount: number): Promise<boolean> {
    // In production: POST to backend which mints tokens
    // For now: track locally
    this.wallet.state.dreamBalance += amount
    return true
  }

  // Get marketplace price for item
  getPrice(itemId: string): TokenPrice | undefined {
    return MARKETPLACE_PRICES.find(p => p.item === itemId)
  }

  // Buy item from marketplace with $DREAM
  async buyItem(itemId: string): Promise<{ success: boolean; cost: number }> {
    const price = this.getPrice(itemId)
    if (!price) return { success: false, cost: 0 }

    if (this.wallet.state.dreamBalance < price.dreamPrice) {
      return { success: false, cost: price.dreamPrice }
    }

    // In production: send tx to marketplace program
    // For now: deduct locally
    this.wallet.state.dreamBalance -= price.dreamPrice
    return { success: true, cost: price.dreamPrice }
  }
}
