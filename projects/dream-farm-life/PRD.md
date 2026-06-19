# PRD — Dream Farm Life 🌾

## Overview

Dream Farm Life adalah web-based farming simulation game yang relaxing dan casual. Pemain membangun pertanian impian — tanam tanaman, ternak hewan, upgrade bangunan, expand lahan.

**Tagline:** Bangun pertanian impianmu, tanam tanaman, beternak hewan, dan bersantai!

**Target:** Casual gamers, idle game lovers, farming sim fans. Mobile-first web.

**Blockchain:** Solana — in-game economy on-chain, NFT assets, token rewards.

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

## Solana Integration (Phase 2 — On-Chain)

### 🔗 Wallet Connection
- Solana wallet adapter (Phantom, Solflare, Backpack)
- Guest mode: play without wallet (local save only)
- Connect wallet → bind farm to wallet address
- Sign-in with Solana (SIWS) for auth

### 🪙 $DREAM Token (SPL Token)
- In-game currency backed by SPL token on Solana
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
- Standard: Metaplex Core (compressed NFTs for low cost)

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

### ⚙️ Technical Architecture (Solana)

```
┌─────────────────────────────────────────────┐
│                 Frontend (React)             │
│  ┌──────────┐  ┌───────────┐  ┌───────────┐ │
│  │ Game UI  │  │ Wallet    │  │ NFT       │ │
│  │ (Canvas) │  │ Adapter   │  │ Gallery   │ │
│  └────┬─────┘  └─────┬─────┘  └─────┬─────┘ │
│       │              │              │        │
│  ┌────┴──────────────┴──────────────┴─────┐  │
│  │           Zustand Store                │  │
│  │   (off-chain game state + tx queue)    │  │
│  └────────────────┬───────────────────────┘  │
└───────────────────┼─────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │  Solana RPC (Helius) │
         │  ┌────────────────┐ │
         │  │ Anchor Program │ │
         │  │ (game logic)   │ │
         │  └────────────────┘ │
         │  ┌────────────────┐ │
         │  │ SPL Token      │ │
         │  │ ($DREAM)       │ │
         │  └────────────────┘ │
         │  ┌────────────────┐ │
         │  │ Metaplex Core  │ │
         │  │ (NFTs)         │ │
         │  └────────────────┘ │
         └─────────────────────┘
```

**Anchor Program (On-Chain):**
- `initialize_farm` — create farm PDA per wallet
- `plant_crop` / `harvest_crop` — record crop state
- `mint_reward` — mint $DREAM token
- `mint_nft` — mint farm/animal/building NFT
- `list_nft` / `buy_nft` — marketplace ops
- `settle_batch` — batch settle off-chain actions

**Off-Chain (Fast Gameplay):**
- All game actions processed client-side first
- Batch settle to Solana every N actions or on logout
- Reduces tx fees, smooth UX

---

## Features (Phase 3 — Post-MVP)

- Social: visit friends' farms (on-chain verification)
- Seasons/weather system
- Craft items (jam, cheese, bread) → craft NFTs
- Quest board (daily/weekly tasks) → $DREAM rewards
- Farm decoration / cosmetics (NFT-based)
- Sound & music toggle
- Mobile wallet (Solana Mobile Stack)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TailwindCSS |
| Game Engine | HTML5 Canvas (custom lightweight) OR PixiJS |
| State | Zustand (game state) + localStorage (save) |
| Blockchain | Solana (mainnet) |
| Smart Contract | Anchor Framework (Rust) |
| Wallet | @solana/wallet-adapter (Phantom, Solflare, Backpack) |
| Token | SPL Token ($DREAM) |
| NFT | Metaplex Core (compressed NFTs) |
| RPC | Helius / QuickNode |
| Hosting | Vercel / Cloudflare Pages |
| Indexing | Helius Webhooks / Custom indexer |

**MVP Decision:** Phase 1 tanpa backend, fully client-side. Solana integration di Phase 2.

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

### On-Chain (Solana PDAs)
```
Farm PDA {
  owner: Pubkey
  level: u16
  total_harvest: u64
  land_plots: u8
  created_at: i64
}

Crop PDA {
  farm: Pubkey
  crop_type: u8
  planted_at: i64
  stage: u8
}

$DREAM Token {
  mint: SPL Token
  treasury: PDA (mint authority)
  player_ata: Associated Token Account
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
