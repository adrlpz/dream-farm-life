import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor'
import { useWalletStore, PendingTx } from '../store/walletStore'

// Types matching on-chain BatchAction
interface OnChainBatchAction {
  actionType: {
    plantCrop?: { plotId: number; cropType: number }
    harvestCrop?: { plotId: number }
    upgradeBuilding?: { buildingType: number }
    mintReward?: { amount: number }
  }
  timestamp: number
}

export interface OffChainAction {
  type: 'plant' | 'harvest' | 'upgrade' | 'reward'
  plotId?: number
  cropType?: number
  buildingType?: number
  amount?: number
  timestamp: number
}

const MAX_BATCH_SIZE = 10

/**
 * Queue an off-chain action for later batch settlement
 */
export function queueAction(action: OffChainAction): void {
  const store = useWalletStore.getState()
  store.addPendingTx({
    signature: null,
    type: action.type === 'plant' ? 'plant'
      : action.type === 'harvest' ? 'harvest'
      : action.type === 'upgrade' ? 'settle_batch'
      : 'mint_reward',
    description: formatAction(action),
    status: 'pending',
    createdAt: Date.now(),
  })
}

/**
 * Format action for display
 */
function formatAction(action: OffChainAction): string {
  switch (action.type) {
    case 'plant':
      return `Plant crop ${action.cropType} on plot ${action.plotId}`
    case 'harvest':
      return `Harvest plot ${action.plotId}`
    case 'upgrade':
      return `Upgrade building ${action.buildingType}`
    case 'reward':
      return `Mint ${action.amount} $DREAM`
    default:
      return 'Unknown action'
  }
}

/**
 * Check if we should auto-settle
 * Triggers: every 10 actions, or on logout
 */
export function shouldAutoSettle(): boolean {
  const store = useWalletStore.getState()
  const pendingCount = store.pendingTxs.filter((tx) => tx.status === 'pending').length
  return pendingCount >= MAX_BATCH_SIZE
}

/**
 * Build settle_batch instruction data
 * This creates the Anchor-compatible instruction
 */
export function buildSettleBatchInstruction(
  actions: OffChainAction[],
  programId: PublicKey,
  farmPda: PublicKey,
  playerTokenPda: PublicKey,
  owner: PublicKey
): Transaction {
  // TODO: Build actual Anchor instruction using program.coder
  // For now, return placeholder transaction
  const tx = new Transaction()

  // The actual instruction will be built by Anchor:
  // await program.methods
  //   .settleBatch(actions.map(a => ({
  //     actionType: mapToActionType(a),
  //     timestamp: a.timestamp,
  //   })))
  //   .accounts({
  //     farm: farmPda,
  //     playerToken: playerTokenPda,
  //     owner: owner,
  //   })
  //   .rpc()

  return tx
}

/**
 * Map off-chain action to on-chain ActionType enum
 */
function mapToActionType(action: OffChainAction) {
  switch (action.type) {
    case 'plant':
      return { plantCrop: { plotId: action.plotId!, cropType: action.cropType! } }
    case 'harvest':
      return { harvestCrop: { plotId: action.plotId! } }
    case 'upgrade':
      return { upgradeBuilding: { buildingType: action.buildingType! } }
    case 'reward':
      return { mintReward: { amount: action.amount! } }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

/**
 * Retry logic for failed txs
 */
export async function retryTx(
  fn: () => Promise<string>,
  maxRetries = 3,
  delayMs = 1000
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (err: any) {
      if (i === maxRetries - 1) throw err
      // Only retry on transient errors
      if (err?.message?.includes('timeout') || err?.message?.includes('rate')) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw new Error('Max retries exceeded')
}
