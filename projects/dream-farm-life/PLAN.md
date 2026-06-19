# Plan — Dream Farm Life 🌾

## Phase 1: Foundation (Week 1-2)

### 1.1 Project Setup
- [ ] Init React + Vite + TailwindCSS project
- [ ] Setup folder structure (components, hooks, store, assets, utils)
- [ ] Install deps: zustand, react-router-dom
- [ ] Setup local save/load utility (localStorage wrapper)
- [ ] Setup Solana deps (pre-install for Phase 2): @solana/web3.js, @solana/wallet-adapter

### 1.2 Core Game State
- [ ] Define GameState TypeScript interfaces
- [ ] Zustand store: player, farm, inventory
- [ ] Offline progress calculator (time diff → yield)
- [ ] Save/load middleware (auto-save every 30s + on unload)
- [ ] Tx queue placeholder (for future on-chain batching)

### 1.3 Farm Grid UI
- [ ] Canvas-based farm grid renderer (OR CSS grid fallback)
- [ ] Plot component: locked / empty / planted / harvestable
- [ ] Click interaction: select plot → action menu
- [ ] Responsive layout (mobile-first)

---

## Phase 2: Gameplay (Week 3-4)

### 2.1 Crop System
- [ ] Crop data: growth time, yield, sprite per stage
- [ ] Plant flow: select seed → place on plot
- [ ] Growth timer: seed → sprout → mature (visual update)
- [ ] Harvest flow: click mature crop → add to inventory + XP
- [ ] 6 starter crops with varied timers

### 2.2 Animal System
- [ ] Animal data: type, feed item, product, timer
- [ ] Place animal in pen
- [ ] Feed → production timer starts
- [ ] Collect product → add to inventory
- [ ] Happiness mechanic (feed on time = bonus)

### 2.3 Economy & Market
- [ ] Market UI: sell crops + animal products
- [ ] Price table per item
- [ ] Coin counter with animation
- [ ] XP bar + level display

---

## Phase 3: Progression (Week 5-6)

### 3.1 Buildings & Upgrades
- [ ] Barn: increase storage capacity
- [ ] Silo: crop-specific storage
- [ ] Animal housing: unlock more pens
- [ ] Upgrade UI: cost → confirm → level up
- [ ] Visual change per level

### 3.2 Land Expansion
- [ ] Grid starts 4x4, expand to 6x6, 8x8 etc.
- [ ] Expansion cost (coins)
- [ ] Unlock animation

### 3.3 Level & Unlock System
- [ ] XP thresholds per level
- [ ] Unlock new crops/animals at milestones
- [ ] Achievement badges (first harvest, 100 coins, etc.)

---

## Phase 4: Solana Integration (Week 7-10) ⛓️

### 4.1 Wallet Connection
- [ ] Install & configure @solana/wallet-adapter
- [ ] Wallet modal: Phantom, Solflare, Backpack
- [ ] Guest mode → connect wallet → bind farm to address
- [ ] SIWS (Sign-In With Solana) auth flow
- [ ] Display wallet address + SOL balance in HUD

### 4.2 Anchor Program (Smart Contract)
- [ ] Init Anchor project (Rust)
- [ ] `initialize_farm` — create farm PDA per wallet
- [ ] `plant_crop` / `harvest_crop` — record crop state on-chain
- [ ] `upgrade_building` — building level in PDA
- [ ] `expand_land` — land plot count in PDA
- [ ] Unit tests (Anchor test framework)
- [ ] Deploy to Solana devnet → testnet → mainnet

### 4.3 $DREAM Token (SPL)
- [ ] Create SPL token mint (decimals: 6)
- [ ] Treasury PDA as mint authority
- [ ] `mint_reward` instruction — mint $DREAM to player ATA
- [ ] Earn triggers: harvest, sell, achievements, daily login
- [ ] Spend flow: unlock land, buy seeds (burn or transfer to treasury)
- [ ] Token metadata (Metaplex standard)

### 4.4 NFT System (Metaplex Core)
- [ ] Setup Metaplex Core (compressed NFTs)
- [ ] Farm Land NFTs — mint on land purchase
- [ ] Animal NFTs — mint rare/bred animals
- [ ] Building NFTs — mint special edition buildings
- [ ] NFT metadata: image, attributes, rarity
- [ ] NFT gallery UI in game

### 4.5 Batch Settlement
- [ ] Tx queue in Zustand (collect off-chain actions)
- [ ] `settle_batch` instruction — settle N actions in 1 tx
- [ ] Auto-settle on: logout, every 10 actions, manual trigger
- [ ] Retry logic for failed txs
- [ ] Tx status UI (pending / confirmed / failed)

### 4.6 Marketplace
- [ ] `list_nft` — list for sale (price in $DREAM or SOL)
- [ ] `buy_nft` — purchase listed NFT
- [ ] `delist_nft` — remove listing
- [ ] Integrate Tensor / Magic Eden SDK
- [ ] In-game marketplace UI
- [ ] Royalty: 2.5% to treasury

---

## Phase 5: Polish & Launch (Week 11-12)

### 5.1 UI/UX
- [ ] Tutorial overlay (first-time player)
- [ ] Sound effects (plant, harvest, coin, level up)
- [ ] Music toggle
- [ ] Settings panel
- [ ] Loading screen with farm art
- [ ] Wallet connection onboarding flow

### 5.2 Daily & Idle
- [ ] Daily login bonus → $DREAM reward
- [ ] Offline earnings popup on return
- [ ] Idle notification (optional browser push)
- [ ] Weekly leaderboard (top farmers)

### 5.3 Deploy
- [ ] Optimize assets (compress sprites)
- [ ] Lighthouse audit (target: 90+ perf)
- [ ] Deploy frontend to Vercel / Cloudflare Pages
- [ ] Anchor program verified on mainnet
- [ ] Custom domain setup
- [ ] $DREAM token listed (Jupiter, Birdeye)

---

## Asset Requirements

| Type | Count | Notes |
|------|-------|-------|
| Crop sprites (4 stages each) | 24 | wheat, corn, tomato, carrot, potato, pumpkin |
| Animal sprites | 3-6 | cow, chicken, sheep + idle/produce states |
| Building sprites | 4-8 | barn, silo, coop, market + upgrade variants |
| UI icons | ~20 | coins, gems, XP, tools, buttons |
| Background/tileset | 1-2 | grass, soil, water |
| Sound effects | ~10 | plant, harvest, coin, level up, click, animal |
| NFT artwork | ~15-20 | land, animals, buildings, rare variants |
| Token logo | 1 | $DREAM token icon |

**Source options:** free asset packs (itch.io, OpenGameArt) OR AI-generated OR commissioned

---

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Canvas perf on low-end devices | CSS grid fallback, requestAnimationFrame throttling |
| localStorage size limit (~5MB) | Compress state, limit history |
| Scope creep | Strict MVP scope, Phase 2 backlog |
| Asset bottleneck | Use placeholder sprites first, swap later |
| Solana tx cost | Compressed NFTs (Metaplex Core), batch settle |
| Wallet UX friction | Guest mode first, wallet optional |
| RPC rate limits | Helius/QuickNode paid tier, fallback RPC |
| Smart contract bugs | Anchor test suite, audit before mainnet |

---

## Decisions (Locked)

- **No backend** for MVP Phase 1 — fully client-side
- **React + Vite** — fast dev, familiar stack
- **Zustand** — lightweight, built-in persist middleware
- **Mobile-first** — responsive grid, touch-friendly
- **No energy/gating** — relaxing = no artificial limits
- **Solana mainnet** — blockchain for token + NFTs
- **Anchor Framework** — Solana smart contract standard
- **Metaplex Core** — compressed NFTs (low mint cost)
- **Off-chain first** — batch settle to chain (smooth UX)
- **$DREAM SPL token** — in-game currency on-chain

---

## File Structure

```
dream-farm-life/
├── public/
│   └── assets/
│       ├── sprites/
│       ├── sounds/
│       ├── nft/
│       └── ui/
├── src/
│   ├── components/
│   │   ├── Farm/
│   │   ├── Market/
│   │   ├── Inventory/
│   │   ├── HUD/
│   │   ├── Wallet/
│   │   ├── NFT/
│   │   └── UI/
│   ├── hooks/
│   │   ├── useWallet.ts
│   │   ├── useGameState.ts
│   │   └── useTxQueue.ts
│   ├── store/
│   │   ├── gameStore.ts
│   │   └── walletStore.ts
│   ├── data/
│   │   ├── crops.ts
│   │   ├── animals.ts
│   │   └── buildings.ts
│   ├── solana/
│   │   ├── connection.ts
│   │   ├── program.ts
│   │   ├── token.ts
│   │   ├── nft.ts
│   │   └── marketplace.ts
│   ├── utils/
│   │   ├── saveLoad.ts
│   │   ├── offlineProgress.ts
│   │   └── batchSettle.ts
│   ├── App.tsx
│   └── main.tsx
├── programs/                     # Anchor program (Rust)
│   └── dream-farm/
│       ├── src/
│       │   ├── lib.rs
│       │   ├── state.rs
│       │   ├── instructions/
│       │   └── errors.rs
│       └── Cargo.toml
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── Anchor.toml
└── Cargo.toml
```

---

## Timeline Summary

| Phase | Weeks | Focus |
|-------|-------|-------|
| 1 | 1-2 | Project setup, core state, grid UI |
| 2 | 3-4 | Crops, animals, economy |
| 3 | 5-6 | Buildings, expansion, progression |
| 4 | 7-10 | **Solana: wallet, Anchor, $DREAM, NFTs, marketplace** |
| 5 | 11-12 | Polish, deploy, launch |

---

## Next Step

Fizz confirm scope → gue scaffold project + build core game state + farm grid.
