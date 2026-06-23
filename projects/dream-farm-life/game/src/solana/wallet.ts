// wallet.ts — Solana wallet integration for Dream Farm Life
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

// $DREAM token mint (deployed separately)
export const DREAM_TOKEN_MINT = new PublicKey('DREAM1111111111111111111111111111111111111111')

// Program IDs (deployed programs)
export const FARM_PROGRAM_ID = new PublicKey('FARM2222222222222222222222222222222222222222')
export const NFT_PROGRAM_ID = new PublicKey('NFT333333333333333333333333333333333333333333')

export interface WalletState {
  connected: boolean
  publicKey: string | null
  balance: number  // SOL balance
  dreamBalance: number  // $DREAM token balance
}

export interface WalletAdapter {
  publicKey: PublicKey | null
  connected: boolean
  connect(): Promise<void>
  disconnect(): Promise<void>
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
}

// RPC endpoints
const RPC_ENDPOINTS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  localnet: 'http://127.0.0.1:8899',
}

export class SolanaWallet {
  private connection: Connection
  private adapter: WalletAdapter | null = null
  state: WalletState = {
    connected: false,
    publicKey: null,
    balance: 0,
    dreamBalance: 0,
  }

  private notifications: string[] = []

  constructor(network: keyof typeof RPC_ENDPOINTS = 'devnet') {
    this.connection = new Connection(RPC_ENDPOINTS[network], 'confirmed')
  }

  // Connect to wallet (Phantom, Solflare, etc.)
  async connect(): Promise<boolean> {
    try {
      // Check for Phantom
      const provider = (window as any).phantom?.solana ?? (window as any).solana
      if (!provider) {
        this.notifications.push('❌ No Solana wallet found. Install Phantom.')
        return false
      }

      this.adapter = provider
      await this.adapter!.connect()
      this.state.connected = true
      this.state.publicKey = this.adapter!.publicKey?.toBase58() ?? null

      if (this.state.publicKey) {
        await this.updateBalances()
        this.notifications.push(`🔗 Wallet connected: ${this.state.publicKey.slice(0, 4)}...${this.state.publicKey.slice(-4)}`)
      }

      return true
    } catch (err) {
      this.notifications.push('❌ Wallet connection failed')
      return false
    }
  }

  async disconnect() {
    if (this.adapter) {
      await this.adapter.disconnect()
    }
    this.state = { connected: false, publicKey: null, balance: 0, dreamBalance: 0 }
    this.notifications.push('🔌 Wallet disconnected')
  }

  async updateBalances() {
    if (!this.state.publicKey) return

    try {
      const pubKey = new PublicKey(this.state.publicKey)

      // SOL balance
      const lamports = await this.connection.getBalance(pubKey)
      this.state.balance = lamports / LAMPORTS_PER_SOL

      // $DREAM token balance (SPL token)
      try {
        const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(pubKey, {
          mint: DREAM_TOKEN_MINT,
        })
        if (tokenAccounts.value.length > 0) {
          this.state.dreamBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount ?? 0
        }
      } catch {
        // Token account might not exist yet
        this.state.dreamBalance = 0
      }
    } catch {
      // RPC error
    }
  }

  // Get wallet address as PublicKey
  getPublicKey(): PublicKey | null {
    if (!this.state.publicKey) return null
    return new PublicKey(this.state.publicKey)
  }

  // Sign and send transaction
  async signAndSend(tx: Transaction): Promise<string | null> {
    if (!this.adapter || !this.state.connected) {
      this.notifications.push('❌ Wallet not connected')
      return null
    }

    try {
      const signed = await this.adapter.signTransaction(tx)
      const sig = await this.connection.sendRawTransaction(signed.serialize())
      await this.connection.confirmTransaction(sig)
      return sig
    } catch (err: any) {
      this.notifications.push(`❌ Transaction failed: ${err.message?.slice(0, 50)}`)
      return null
    }
  }

  // Request airdrop (devnet only)
  async requestAirdrop(sol: number = 1): Promise<boolean> {
    if (!this.state.publicKey) return false
    try {
      const pubKey = new PublicKey(this.state.publicKey)
      const sig = await this.connection.requestAirdrop(pubKey, sol * LAMPORTS_PER_SOL)
      await this.connection.confirmTransaction(sig)
      await this.updateBalances()
      this.notifications.push(`💰 Airdrop ${sol} SOL received`)
      return true
    } catch {
      this.notifications.push('❌ Airdrop failed (devnet only)')
      return false
    }
  }

  consumeNotifications(): string[] {
    const n = [...this.notifications]
    this.notifications = []
    return n
  }
}
