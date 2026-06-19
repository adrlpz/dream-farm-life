# PRD — Dream Farm Life 🌾

## Overview

Dream Farm Life adalah web-based farming simulation game yang relaxing dan casual. Pemain membangun pertanian impian — tanam tanaman, ternak hewan, upgrade bangunan, expand lahan.

**Tagline:** Bangun pertanian impianmu, tanam tanaman, beternak hewan, dan bersantai!

**Target:** Casual gamers, idle game lovers, farming sim fans. Mobile-first web.

**Blockchain:** BSC (BNB Chain) — in-game economy on-chain, NFT assets, token rewards.

---

## Core Gameplay Loop

```
Plant → Wait (growth timer) → Harvest → Sell → Earn Coins → Unlock/Expand → Repeat
         ↕                                        ↓
    Feed Animals → Collect Products → Sell Products
                                              ↓
                          $DREAM token + NFT rewards (on-chain)
```

---

## Features (MVP — Phase 1)

### 🌱 Crop System
- Tanaman: wheat, corn, tomato, carrot, potato, pumpkin
- Growth stages: seed → sprout → mature → harvestable
- Growth timer: 1min (wheat) → 30min (pumpkin)
- Plant, water (optional speed boost), harvest
- Yield: in-game coins per crop

### 🐄 Animal System
- Animals: cow, chicken, sheep
- Each produces items on timer (milk, eggs, wool)
- Feed system: crops → animal feed
- Happiness meter affects yield

### 🏡 Building & Upgrades
- Barn (storage capacity)
- Silo (crop storage)
- Coop / Cowshed (animal housing)
- Market (sell products)
- Upgrade tiers: Lv1 → Lv5 (cosmetic + capacity)

### 💰 Economy
- Coins: primary in-game currency (earn from selling)
- Gems: premium in-game currency (earn from achievements)
- Unlock new land plots with coins
- Unlock new crops/animals at level thresholds

### 📈 Progression
- Player XP → Level up
- Level unlocks: new crops, animals, buildings, land areas
- Achievement system (milestones)

### 🎮 Game Mechanics
- Idle/offline progress: accumulate while away
- No energy system (relaxing = no gating)
- Daily login bonus
- Simple tutorial on first play

---

## BSC Integration (Phase 2 — On-Chain)

### 🔗 Wallet Connection
- BSC wallet: MetaMask, Rabby, Trust Wallet (via Wagmi + WalletConnect)
- Guest mode: play without wallet (local save only)
- Connect wallet → bind farm to wallet address
- Sign-In with Ethereum (SIWE) for auth (BSC-compatible)

### 🪙 $DREAM Token (BEP-20)
- In-game currency backed by BEP-20 token on BSC
- Earn $DREAM: harvest, sell, complete achievements, daily login
- Spend $DREAM: unlock land, buy seeds/animals, upgrade buildings
- Off-chain ledger for fast gameplay → batch settle on-chain
- Token mint authority: game treasury (controlled supply)

### 🖼️ NFT Assets
- **Farm Land NFTs**: each land plot is an NFT (tradeable)
- **Animal NFTs**: rare/bred animals as NFTs
- **Building NFTs**: special/limited edition buildings
- **Crop NFTs**: rare crop variants (cosmetic)
- Minting: earned through gameplay milestones
- Standard: ERC-721 / ERC-1155 (low gas on BSC)

### 🏪 Marketplace (On-Chain)
- Trade NFTs with other players (P2P)
- List farm land, animals, buildings for $DREAM or SOL
- On-chain orderbook (Tensor / Magic Eden integration)
- Royalty: 2.5% to game treasury

### 💎 Play-to-Earn Mechanics
- Daily quests → $DREAM rewards
- Achievement milestones → NFT mint
- Leaderboard → seasonal $DREAM pool
- Staking: lock $DREAM → earn rare seeds/cosmetics

### ⚙️ Technical Architecture (BSC)

```
┌─────────────────────────────────────────────┐
│                 Frontend (React)             │
│  ┌──────────┐  ┌───────────┐  ┌───────────┐ │
│  │ Game UI  │  │ Wallet    │  │ NFT       │ │
│  │ (Canvas) │  │ (Wagmi)   │  │ Gallery   │ │
│  └────┬─────┘  └─────┬─────┘  └─────┬─────┘ │
│       │              │              │        │
│  ┌────┴──────────────┴──────────────┴─────┐  │
│  │           Zustand Store                │  │
│  │   (off-chain game state + tx queue)    │  │
│  └────────────────┬───────────────────────┘  │
└───────────────────┼─────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │  BSC RPC (BscScan)   │
         │  ┌────────────────┐ │
         │  │ Solidity       │ │
         │  │ Contract       │ │
         │  └────────────────┘ │
         │  ┌────────────────┐ │
         │  │ BEP-20 Token   │ │
         │  │ ($DREAM)       │ │
         │  └────────────────┘ │
         │  ┌────────────────┐ │
         │  │ ERC-721/1155   │ │
         │  │ (NFTs)         │ │
         │  └────────────────┘ │
         └─────────────────────┘
```

**Solidity Contract (On-Chain):**
- `initializeFarm` — create farm per wallet
- `plantCrop` / `harvestCrop` — record crop state
- `mintReward` — mint $DREAM token
- `mintNft` — mint farm/animal/building NFT
- `listNft` / `buyNft` — marketplace ops
- `settleBatch` — batch settle off-chain actions

**Off-Chain (Fast Gameplay):**
- All game actions processed client-side first
- Batch settle to BSC every N actions or on logout
- Reduces tx fees, smooth UX

---

## Features (Phase 3 — Post-MVP)

- Social: visit friends' farms (on-chain verification)
- Seasons/weather system
- Craft items (jam, cheese, bread) → craft NFTs
- Quest board (daily/weekly tasks) → $DREAM rewards
- Farm decoration / cosmetics (NFT-based)
- Sound & music toggle
- Mobile wallet (WalletConnect v2)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TailwindCSS |
| Game Engine | HTML5 Canvas (custom lightweight) OR PixiJS |
| State | Zustand (game state) + localStorage (save) |
| Blockchain | BSC (BNB Chain, chainId 56) |
| Smart Contract | Solidity 0.8.x (Foundry / Hardhat) |
| Wallet | Wagmi + WalletConnect (MetaMask, Rabby, Trust) |
| Token | BEP-20 ($DREAM) |
| NFT | ERC-721 / ERC-1155 (OpenSea compatible) |
| RPC | BscScan / QuickNode / Ankr |
| Hosting | Vercel / Cloudflare Pages |
| Indexing | BscScan API / Custom indexer |

**MVP Decision:** Phase 1 tanpa backend, fully client-side. BSC integration di Phase 2.

---

## Data Model (Simplified)

### Off-Chain (Game State)
```typescript
GameState {
  player: { level, xp, coins, gems, walletAddress? }
  farm: {
    plots: Plot[]
    buildings: Building[]
    animals: Animal[]
  }
  inventory: { [itemId]: count }
  lastOnline: timestamp
  achievements: string[]
  txQueue: TxAction[]      // pending on-chain actions
}
```

### On-Chain (BSC Contract State)
```
Farm {
  owner: address
  level: uint16
  totalHarvest: uint256
  landPlots: uint8
  createdAt: uint256
}

Crop {
  farm: address
  cropType: uint8
  plantedAt: uint256
  stage: uint8
}

$DREAM Token {
  mint: BEP-20 contract
  treasury: address (minter role)
  playerBalance: mapping(address => uint256)
}
```

---

## Non-Goals (MVP Phase 1)

- ❌ Multiplayer / real-time
- ❌ Backend / database
- ❌ On-chain transactions (Phase 2)
- ❌ Mobile native (web only)
- ❌ Complex crafting chains

---

## Success Metrics

- Playable in browser (mobile + desktop)
- < 3s initial load
- Save/load works across sessions
- Core loop fun in 5-minute session
- Zero backend cost for MVP Phase 1
- Wallet connection < 2 clicks (Phase 2)
- Tx cost < $0.01 per action (compressed NFTs)
- Player retention: 30% D7 (Phase 2 with token)
