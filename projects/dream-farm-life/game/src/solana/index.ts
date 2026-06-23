// index.ts — Solana integration barrel export
export { SolanaWallet, DREAM_TOKEN_MINT, FARM_PROGRAM_ID, NFT_PROGRAM_ID } from './wallet'
export type { WalletState, WalletAdapter } from './wallet'

export { DreamToken, MARKETPLACE_PRICES } from './token'
export type { TokenPrice } from './token'

export { NftManager } from './nfts'
export type { NftMetadata, LandNft } from './nfts'
