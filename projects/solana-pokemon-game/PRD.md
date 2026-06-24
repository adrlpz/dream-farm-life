# 🎮 PRD: SolanaMon — Web3 Monster Battle Game on Solana

> **Version:** 1.0  
> **Date:** 2026-06-24  
> **Author:** SUPERAGENT for Fizz  
> **Status:** Draft  
> **Network:** Solana Mainnet (devnet for testing)

---

## 1. Executive Summary

**SolanaMon** adalah game Web3 berkonsep monster collection & battle (terinspirasi Pokemon) yang dibangun di atas blockchain Solana. Setiap monster adalah NFT dengan atribut on-chain, bisa di-trade, di-breed, di-battle, dan di-upgrade. Game menggabungkan model **Play-to-Earn (P2E)** dengan **Free-to-Play (F2P)** untuk onboarding massal.

**Value Proposition:**
- True ownership monster via NFT (Metaplex Standard)
- Battle system berbasis strategy + RNG yang fair
- Breeding & evolution mechanic → deflationary token economy
- Low transaction cost (Solana = $0.00025/tx)
- Mobile-first, fast finality

---

## 2. Problem & Market Opportunity

### Problem
- Game blockchain existing (Axie, StepN) → onboarding sulit, gas fee tinggi, gameplay dangkal
- Pokemon-style game di Web3 → belum ada yang polished di Solana
- Gamer tradisional skeptical terhadap Web3 → perlu seamless UX

### Market
- Global gaming market: $187B (2025)
- Blockchain gaming: $65B projected by 2027
- Solana daily active wallets: 2M+ (growing)
- Target: gamer + crypto degen yang cari gameplay loop solid

### Competitive Landscape

| Game | Chain | Strength | Weakness |
|------|-------|----------|----------|
| Axie Infinity | Ronin/Ethereum | First mover, huge community | High gas, complex onboarding, gameplay repetitif |
| Illuvium | Ethereum | AAA graphics | Expensive NFTs, slow tx |
| Star Atlas | Solana | Ambitious scope | Still in development, complex |
| StepN | Solana | Simple mechanic | Not real game, unsustainable tokenomics |
| Pirate Nation | Base | Good gameplay | Not monster-battle genre |

**SolanaMon Gap:** Belum ada Pokemon-like game yang polished, mobile-first, dan sustainable di Solana.

---

## 3. Target Audience

| Segment | Description | Priority |
|---------|-------------|----------|
| **Crypto Native** | Sudah punya wallet Solana, cari game baru | P0 |
| **Casual Gamer** | Suka Pokemon, open untuk Web3 | P1 |
| **NFT Collector** | Koleksi monster NFT langka | P1 |
| **Competitive Player** | Suka PvP ranked, esports potential | P2 |

---

## 4. Core Game Mechanics

### 4.1 Monster System (Creatures)

**Monster NFT Attributes (on-chain):**
```
CreatureAccount {
    id: u64,
    species_id: u16,          // 256 species di launch
    name: String,             // Player-given name (max 20 chars)
    element: Element,         // Fire, Water, Earth, Electric, Shadow, Light
    rarity: Rarity,           // Common, Uncommon, Rare, Epic, Legendary, Mythic
    level: u16,               // 1-100
    experience: u64,
    stats: CreatureStats,     // HP, Attack, Defense, Speed, Special
    abilities: [u8; 4],       // Max 4 active abilities
    passive_trait: u8,        // 1 passive trait
    breeding_count: u8,       // Max 3 breeding attempts
    evolution_stage: u8,      // 1-3 (base → evolved → mega)
    parent_ids: [Option<Pubkey>; 2],  // Breeding lineage
    minted_at: i64,
    owner: Pubkey,
}
```

**Element System (6 elements, rock-paper-scissors style):**
```
Fire > Earth > Electric > Water > Fire
Shadow <> Light (neutral)
Each element has 1.5x damage advantage, 0.67x disadvantage
```

**Species Categories (256 total):**
- 12 Starter species (3 per region × 4 regions)
- 64 Common wild species
- 64 Uncommon species
- 48 Rare species
- 32 Epic species
- 24 Legendary species
- 12 Mythic (event-only, max supply)

### 4.2 Battle System

**Turn-based, 3v3 format:**

```rust
// Battle flow
enum BattleState {
    WaitingForPlayers,
    SelectionPhase,      // Each player picks 3 creatures + lead
    ActionPhase,         // Turn-by-turn action selection
    ResolutionPhase,     // Server resolves actions
    Completed { winner: Pubkey },
}

// Action types
enum BattleAction {
    Attack { ability_index: u8 },
    Switch { creature_index: u8 },
    UseItem { item_id: u16 },
    Flee,  // PvE only
}
```

**Battle Resolution:**
1. Speed determines turn order
2. Ability accuracy check (RNG with on-chain VRF or commit-reveal)
3. Damage formula: `base_power × (attack/defense) × element_modifier × critical_hit × level_modifier`
4. Status effects applied (poison, burn, freeze, paralyze)
5. Winner gets EXP + token rewards

**Matchmaking:**
- ELO rating system (on-chain)
- Tiers: Bronze (0-999), Silver (1000-1499), Gold (1500-1999), Platinum (2000-2499), Diamond (2500+)
- Season resets every 30 days

### 4.3 Breeding System

```
Parent A (any) + Parent B (any) → Offspring (species inherits from parents)

Rules:
- Both parents must be level 20+
- Each creature max 3 breeding attempts
- Offspring species: 70% same as higher-rarity parent, 30% random related species
- Stats: weighted average of parents ± random variance (±15%)
- Breeding costs SOLTOKEN tokens + cooldown (24h)
- Legendary/Mythic breeding requires special items
```

### 4.4 Evolution System

```
Stage 1 (Base) → Level 30 + Evolution Stone → Stage 2 (Evolved)
Stage 2 (Evolved) → Level 60 + Rare Evolution Stone → Stage 3 (Mega)

- Evolution increases base stats by 40%
- Visual change (new art metadata URI)
- Some species have branching evolutions based on element affinity
- Evolution stones: craftable (PvE drops) or purchasable (marketplace)
```

### 4.5 PvE Campaign

**4 Regions, each with gyms + wild encounters:**

| Region | Theme | Levels | Boss |
|--------|-------|--------|------|
| Ignis Peak | Fire/Mountain | 1-25 | Flame Emperor |
| Aqua Depths | Water/Ocean | 26-50 | Tidal Leviathan |
| Terra Wilds | Earth/Forest | 51-75 | Ancient Golem |
| Void Rift | Shadow/Dimension | 76-100 | Void Sovereign |

**Each region:**
- 8 gym leaders (progressive difficulty)
- Wild encounter zones (catch new creatures)
- Boss dungeon (weekly reset, rare drops)
- Exploration quests (lore + rewards)

---

## 5. Tokenomics

### 5.1 Dual Token Model

**$SOLMON (Governance Token)**
- Total Supply: 1,000,000,000
- Utility: Governance voting, breeding fees, marketplace fees, staking rewards
- Distribution:
  - Play-to-Earn Rewards: 40% (vested over 4 years)
  - Team & Advisors: 15% (1-year cliff, 3-year vest)
  - Treasury: 15% (DAO controlled)
  - Ecosystem Fund: 10% (partnerships, grants)
  - Initial Liquidity: 10%
  - Public Sale: 10%

**$SOLTREAT (Utility Token)**
- Infinite supply (inflation controlled by sinks)
- Earned from: battles (PvP/PvE), quests, daily login
- Spent on: healing items, evolution stones, cosmetics, breeding fee component
- Sinks designed to balance faucets

### 5.2 NFT Economics

| Asset | Supply | Mint Price | Royalty |
|-------|--------|------------|---------|
| Starter Pack (3 creatures) | Unlimited (F2P) | Free | - |
| Premium Starter | 100,000 | 0.5 SOL | 5% |
| Wild Catch (via gameplay) | Dynamic | Earned | - |
| Legendary Egg | 10,000 | 5 SOL | 5% |
| Mythic (event) | Per event | Auction | 5% |
| Land (future) | 50,000 | 2 SOL | 5% |
| Cosmetic Skins | Seasonal | 0.1-2 SOL | 5% |

### 5.3 Sustainability Model

```
Revenue Sources:
├── NFT Mint Revenue (primary launch)
├── Marketplace Fees (2.5% per trade)
├── Breeding Fees ($SOLMON burn)
├── Premium Battle Pass ($SOL or $SOLMON)
├── Cosmetic Sales
└── Partnership/Sponsorship

Token Sinks:
├── Breeding costs (SOLMON burn)
├── Evolution stone crafting (TREAT burn)
├── Healing items (TREAT burn)
├── Battle entry fees for tournaments (SOLMON)
├── Marketplace listing fees
└── Staking lock-ups
```

---

## 6. Technical Architecture

### 6.1 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Web App  │  │Mobile App│  │ Admin Dashboard  │  │
│  │ (Next.js)│  │ (React   │  │  (Internal)      │  │
│  │          │  │  Native) │  │                  │  │
│  └────┬─────┘  └────┬─────┘  └───────┬──────────┘  │
│       └──────────────┼────────────────┘              │
└──────────────────────┼──────────────────────────────┘
                       │ REST API + WebSocket
┌──────────────────────┼──────────────────────────────┐
│                 Backend Layer                         │
│  ┌───────────────────┼───────────────────────────┐  │
│  │         Game Server (Rust/Go)                  │  │
│  │  ┌─────────┐ ┌─────────┐ ┌───────────────┐  │  │
│  │  │ Battle  │ │ Match   │ │  PvE Engine   │  │  │
│  │  │ Engine  │ │ Maker   │ │  (Quest/Exp)  │  │  │
│  │  └─────────┘ └─────────┘ └───────────────┘  │  │
│  │  ┌─────────┐ ┌─────────┐ ┌───────────────┐  │  │
│  │  │Inventory│ │ Social  │ │  Analytics    │  │  │
│  │  │ Manager │ │ System  │ │  Service      │  │  │
│  │  └─────────┘ └─────────┘ └───────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ PostgreSQL  │  │    Redis     │  │   S3/IPFS │ │
│  │ (Game State)│  │  (Cache/RT)  │  │  (Assets) │ │
│  └─────────────┘  └──────────────┘  └───────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │ Solana RPC + WebSocket
┌──────────────────────┼──────────────────────────────┐
│              On-Chain Layer (Solana)                  │
│  ┌───────────────────┼───────────────────────────┐  │
│  │         Anchor Programs                        │  │
│  │  ┌─────────────┐ ┌─────────────┐             │  │
│  │  │  Creature   │ │   Battle    │             │  │
│  │  │  Program    │ │   Program   │             │  │
│  │  └─────────────┘ └─────────────┘             │  │
│  │  ┌─────────────┐ ┌─────────────┐             │  │
│  │  │  Token      │ │ Marketplace │             │  │
│  │  │  Program    │ │   Program   │             │  │
│  │  └─────────────┘ └─────────────┘             │  │
│  │  ┌─────────────────────────────┐             │  │
│  │  │   Metaplex NFT Standard     │             │  │
│  │  │   (Token Metadata Program)  │             │  │
│  │  └─────────────────────────────┘             │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 6.2 On-Chain Programs (Anchor)

**Program 1: Creature Program**
```rust
// Core creature management
#[program]
pub mod creature_program {
    // Mint new creature (starter or hatched)
    pub fn mint_creature(ctx: Context<MintCreature>, params: MintParams) -> Result<()>
    
    // Level up creature after earning enough EXP
    pub fn level_up(ctx: Context<LevelUp>) -> Result<()>
    
    // Evolve creature (burns evolution stone)
    pub fn evolve(ctx: Context<Evolve>) -> Result<()>
    
    // Breed two creatures
    pub fn breed(ctx: Context<Breed>) -> Result<()>
    
    // Transfer creature to another player
    pub fn transfer_creature(ctx: Context<TransferCreature>) -> Result<()>
    
    // Update creature name
    pub fn rename(ctx: Context<Rename>, new_name: String) -> Result<()>
}
```

**Program 2: Battle Program**
```rust
#[program]
pub mod battle_program {
    // Create a new battle room
    pub fn create_battle(ctx: Context<CreateBattle>, params: BattleParams) -> Result<()>
    
    // Join existing battle
    pub fn join_battle(ctx: Context<JoinBattle>) -> Result<()>
    
    // Submit action (encrypted commit-reveal for fairness)
    pub fn submit_action(ctx: Context<SubmitAction>, commitment: [u8; 32]) -> Result<()>
    
    // Reveal action (after both committed)
    pub fn reveal_action(ctx: Context<RevealAction>, action: BattleAction, nonce: [u8; 32]) -> Result<()>
    
    // Resolve turn (permissionless, after reveal phase)
    pub fn resolve_turn(ctx: Context<ResolveTurn>) -> Result<()>
    
    // Claim battle rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()>
}
```

**Program 3: Marketplace Program**
```rust
#[program]
pub mod marketplace_program {
    // List creature for sale
    pub fn list_creature(ctx: Context<ListCreature>, price: u64) -> Result<>()
    
    // Buy listed creature
    pub fn buy_creature(ctx: Context<BuyCreature>) -> Result<>()
    
    // Cancel listing
    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<>()
    
    // Create auction for rare creature
    pub fn create_auction(ctx: Context<CreateAuction>, params: AuctionParams) -> Result<>()
    
    // Place bid
    pub fn place_bid(ctx: Context<PlaceBid>, amount: u64) -> Result<>()
    
    // Settle auction
    pub fn settle_auction(ctx: Context<SettleAuction>) -> Result<>()
}
```

**Program 4: Token Program (SPL Token-2022)**
```rust
// $SOLMON governance token
// $SOLTREAT utility token
// Both using Token-2022 for transfer hooks and metadata

#[program]
pub mod token_program {
    // Initialize $SOLMON mint
    pub fn init_solmon(ctx: Context<InitSolmon>) -> Result<>()
    
    // Initialize $SOLTREAT mint  
    pub fn init_soltreat(ctx: Context<InitSoltreat>) -> Result<>()
    
    // Distribute P2E rewards
    pub fn distribute_rewards(ctx: Context<DistributeRewards>, amount: u64) -> Result<>()
    
    // Burn tokens (sinks)
    pub fn burn_tokens(ctx: Context<BurnTokens>, amount: u64) -> Result<>()
}
```

### 6.3 Account Structure

```rust
// Creature NFT Account (PDA)
#[account]
pub struct CreatureAccount {
    pub owner: Pubkey,              // 32 bytes
    pub species_id: u16,            // 2 bytes
    pub name: String,               // 4 + 20 bytes
    pub element: Element,           // 1 byte
    pub rarity: Rarity,             // 1 byte
    pub level: u16,                 // 2 bytes
    pub experience: u64,            // 8 bytes
    pub stats: CreatureStats,       // 10 bytes (2 per stat × 5 stats)
    pub abilities: [u8; 4],         // 4 bytes
    pub passive_trait: u8,          // 1 byte
    pub breeding_count: u8,         // 1 byte
    pub evolution_stage: u8,        // 1 byte
    pub parent_ids: [Option<Pubkey>; 2], // 66 bytes
    pub minted_at: i64,             // 8 bytes
    pub bump: u8,                   // 1 byte
}
// Total: ~158 bytes → rent exempt ≈ 0.002 SOL

// Battle Room Account
#[account]
pub struct BattleRoom {
    pub player_a: Pubkey,           // 32
    pub player_b: Option<Pubkey>,   // 33
    pub creatures_a: [Pubkey; 3],   // 96
    pub creatures_b: [Pubkey; 3],   // 96
    pub state: BattleState,         // 1
    pub current_turn: u16,          // 2
    pub commitment_a: Option<[u8; 32]>, // 33
    pub commitment_b: Option<[u8; 32]>, // 33
    pub bet_amount: u64,            // 8
    pub created_at: i64,            // 8
    pub bump: u8,                   // 1
}
// Total: ~343 bytes

// Player Profile Account
#[account]
pub struct PlayerProfile {
    pub wallet: Pubkey,             // 32
    pub username: String,           // 4 + 16
    pub elo_rating: u32,            // 4
    pub tier: Tier,                 // 1
    pub wins: u32,                  // 4
    pub losses: u32,                // 4
    pub current_season: u16,        // 2
    pub battle_pass_active: bool,   // 1
    pub last_active: i64,           // 8
    pub creatures_owned: u32,       // 4
    pub total_earnings: u64,        // 8
    pub bump: u8,                   // 1
}
// Total: ~79 bytes
```

### 6.4 NFT Metadata (Metaplex Standard)

```json
{
  "name": "Flametail #0001",
  "symbol": "SMON",
  "description": "A fiery fox creature from the Ignis Peak region. Evolution Stage: 2/3.",
  "image": "https://arweave.net/{tx-id}/flametail-0001-stage2.png",
  "animation_url": "https://arweave.net/{tx-id}/flametail-0001-stage2.mp4",
  "external_url": "https://solanamon.gg/creature/0001",
  "attributes": [
    { "trait_type": "Species", "value": "Flametail" },
    { "trait_type": "Element", "value": "Fire" },
    { "trait_type": "Rarity", "value": "Rare" },
    { "trait_type": "Level", "value": 45 },
    { "trait_type": "Evolution Stage", "value": 2 },
    { "trait_type": "Generation", "value": 1 },
    { "display_type": "number", "trait_type": "Attack", "value": 78 },
    { "display_type": "number", "trait_type": "Defense", "value": 52 },
    { "display_type": "number", "trait_type": "Speed", "value": 91 },
    { "display_type": "number", "trait_type": "HP", "value": 65 },
    { "display_type": "number", "trait_type": "Special", "value": 70 },
    { "trait_type": "Passive Trait", "value": "Blaze Rush" },
    { "trait_type": "Breeds Remaining", "value": 2 }
  ],
  "properties": {
    "files": [
      { "uri": "https://arweave.net/{tx-id}/flametail-0001-stage2.png", "type": "image/png" },
      { "uri": "https://arweave.net/{tx-id}/flametail-0001-stage2.mp4", "type": "video/mp4" }
    ],
    "category": "creature",
    "creators": [
      { "address": "...", "share": 80, "verified": true },
      { "address": "...", "share": 20, "verified": true }
    ]
  }
}
```

### 6.5 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Smart Contracts** | Anchor 0.30+ / Rust | IDL generation, mature tooling |
| **NFT Standard** | Metaplex Token Metadata | Industry standard Solana NFT |
| **Token Standard** | SPL Token-2022 | Transfer hooks, metadata extensions |
| **Frontend Web** | Next.js 14 + React | SSR, fast routing, SEO |
| **Frontend Mobile** | React Native / Expo | Cross-platform, shared logic |
| **UI Library** | Tailwind + shadcn/ui | Rapid UI development |
| **Wallet** | Wallet Standard + @solana/react-hooks | Multi-wallet support |
| **Backend** | Rust (Axum) or Go | High performance game server |
| **Database** | PostgreSQL | Game state, matchmaking, analytics |
| **Cache** | Redis | Real-time battle state, rate limiting |
| **Asset Storage** | Arweave (via Irys/bundlr) | Permanent decentralized storage |
| **Art Pipeline** | AI generation + manual curation | Scalable creature art |
| **RNG** | Switchboard VRF / commit-reveal | On-chain verifiable randomness |
| **Indexing** | Helius / Shyft APIs | Fast account data queries |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Monitoring** | Grafana + Prometheus | Server health + game metrics |

---

## 7. UX Flow

### 7.1 New Player Onboarding

```
1. Connect Wallet (Phantom/Solflare/Backpack)
2. Choose Starter Region (4 options)
3. Free Starter Pack (3 Common creatures) — no cost, no NFT mint yet
4. Tutorial Battle (vs AI) — learn mechanics
5. First PvP Match — earn first $SOLTREAT
6. Mint First Creature as NFT (optional, free mint for first)
7. Explore Campaign Mode
```

### 7.2 Core Game Loop

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Catch/  │────▶│  Train/  │────▶│  Battle  │────▶│  Earn    │
│  Breed   │     │  Level   │     │  PvP/PvE │     │  Rewards │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     ▲                                                  │
     └──────────── Market/Trade ◀────────────────────────┘
```

### 7.3 Screen Map

```
Home
├── Campaign (PvE)
│   ├── Region Select
│   ├── Gym Battle
│   ├── Wild Encounter
│   └── Boss Dungeon
├── Arena (PvP)
│   ├── Quick Match
│   ├── Ranked Match
│   └── Tournament
├── Collection
│   ├── My Creatures
│   ├── Breeding Lab
│   ├── Evolution Chamber
│   └── Pokedex (species catalog)
├── Marketplace
│   ├── Browse Listings
│   ├── My Listings
│   ├── Auctions
│   └── Trade History
├── Inventory
│   ├── Items
│   ├── Evolution Stones
│   └── Cosmetics
├── Social
│   ├── Friends List
│   ├── Guild (future)
│   └── Leaderboard
└── Profile
    ├── Stats
    ├── Achievements
    └── Settings
```

---

## 8. Art & Audio Direction

### 8.1 Visual Style
- **Style:** Anime-inspired pixel art (16×16 overworld, detailed battle sprites)
- **Palette:** Vibrant, element-coded (fire = warm red/orange, water = cool blue)
- **Animations:** 8-frame idle, 12-frame attack, 6-frame hit reaction
- **UI:** Clean, modern with subtle glow effects, dark mode default

### 8.2 Art Pipeline
1. AI-assisted concept generation (Midjourney/DALL-E for species concepts)
2. Pixel artist refinement (consistent style guide)
3. Animation rigging (Spine or Aseprite)
4. On-chain metadata URI update per evolution stage

### 8.3 Audio
- BGM: Lo-fi / chiptune hybrid
- SFX: Retro-inspired, satisfying battle sounds
- Voice: Optional creature call sounds (short samples)

---

## 9. Security & Fairness

### 9.1 Anti-Cheat
- Battle actions use **commit-reveal scheme** (prevents front-running)
- Critical RNG via **Switchboard VRF** (verifiable on-chain)
- Server-side validation of all battle calculations
- Rate limiting on all actions
- Wallet signature required for all state changes

### 9.2 Smart Contract Security
- Anchor framework built-in checks
- Re-entrancy protection (Solana native)
- Authority checks on all instructions
- PDA-based account ownership
- Formal verification for critical paths (token minting, rewards)
- External audit before mainnet (recommend: OtterSec, Neodyme, or Halborn)

### 9.3 Economic Security
- Token emission schedule on-chain (vesting contracts)
- Circuit breakers for abnormal token flow
- Multi-sig treasury management
- Gradual rollout (devnet → limited mainnet → full launch)

---

## 10. Milestones & Roadmap

### Phase 0: Foundation (Weeks 1-4)
- [ ] Finalize game design document
- [ ] Set up Anchor project structure
- [ ] Implement Creature Program (mint, level, evolve)
- [ ] Basic unit tests (LiteSVM)
- [ ] Art style guide + 20 species concepts

### Phase 1: Core Build (Weeks 5-12)
- [ ] Battle Program (commit-reveal, resolution)
- [ ] Token Program ($SOLMON + $SOLTREAT)
- [ ] Marketplace Program (list, buy, cancel)
- [ ] Player Profile system
- [ ] 50 species art assets
- [ ] Next.js frontend scaffolding
- [ ] Wallet integration

### Phase 2: Game Loop (Weeks 13-20)
- [ ] PvE campaign (Region 1 complete)
- [ ] Matchmaking system (ELO)
- [ ] Breeding system
- [ ] Inventory system
- [ ] 128 species art assets
- [ ] Mobile app MVP (React Native)
- [ ] Closed alpha testing (50 testers)

### Phase 3: Polish & Launch (Weeks 21-28)
- [ ] All 4 PvE regions
- [ ] Tournament system
- [ ] Cosmetics system
- [ ] 256 species complete
- [ ] Security audit (external firm)
- [ ] Open beta on devnet
- [ ] Marketing campaign start

### Phase 4: Mainnet & Growth (Weeks 29-36)
- [ ] Mainnet deployment
- [ ] NFT mint events
- [ ] $SOLMON TGE (Token Generation Event)
- [ ] CEX/DEX listings
- [ ] Season 1 competitive mode
- [ ] Partnership integrations
- [ ] Guild system

### Phase 5: Expansion (Months 9-12)
- [ ] Land system (territory control)
- [ ] Cross-chain bridge (Ethereum ↔ Solana)
- [ ] Esports tournaments
- [ ] Storyline expansion (new regions)
- [ ] Mobile app full release (App Store / Play Store)

---

## 11. Team Requirements

| Role | Count | Priority |
|------|-------|----------|
| Lead Game Designer | 1 | P0 |
| Rust/Anchor Developer | 2 | P0 |
| Frontend Developer (Next.js) | 2 | P0 |
| Game Server Developer (Rust/Go) | 1 | P0 |
| Pixel Artist / Illustrator | 2 | P0 |
| Animator | 1 | P1 |
| UI/UX Designer | 1 | P1 |
| Sound Designer | 1 | P2 |
| Community Manager | 1 | P1 |
| Marketing Lead | 1 | P1 |
| DevOps / Infrastructure | 1 | P2 |

**Minimum viable team: 5 people** (1 designer, 2 devs, 1 artist, 1 community)

---

## 12. Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Smart contract exploit | Medium | Critical | External audit + bug bounty + gradual rollout |
| Unsustainable tokenomics | Medium | High | Dynamic emission + strong sinks + monitoring |
| Low player retention | Medium | High | Fun gameplay first, crypto second. Regular content updates |
| Solana network congestion | Low | Medium | Graceful degradation + offline mode for PvE |
| Art production bottleneck | Medium | Medium | AI-assisted pipeline + modular art system |
| Regulatory risk | Low | Medium | Utility token structure, no promise of returns |
| Competition from AAA Web3 games | Low | Medium | Speed + community focus + niche positioning |
| Botting / Sybil attacks | High | Medium | Proof of humanity + activity checks + captcha |

---

## 13. Success Metrics

| Metric | Target (6 months) | Target (12 months) |
|--------|-------------------|---------------------|
| DAU | 5,000 | 50,000 |
| MAU | 20,000 | 200,000 |
| NFT Holders | 10,000 | 100,000 |
| Daily Battles | 25,000 | 250,000 |
| Marketplace Volume | $500K/month | $5M/month |
| Retention (D7) | 40% | 50% |
| Retention (D30) | 20% | 30% |
| Avg Session Time | 25 min | 35 min |

---

## 14. Appendix

### A. Glossary
- **Creature:** Monster NFT dalam game
- **Species:** Jenis creature (seperti Pokemon species)
- **Element:** Tipe elemental creature
- **Breeding:** Proses mengawinkan 2 creature untuk mendapat offspring
- **Evolution:** Transformasi creature ke bentuk lebih kuat
- **VRF:** Verifiable Random Function (fair RNG on-chain)

### B. Reference Projects
- Axie Infinity (economy model reference)
- Pokemon (gameplay inspiration)
- Star Atlas (Solana game reference)
- StepN (mobile-first Solana app reference)
- Parallel (trading card game + NFT)

### C. Links
- Solana Docs: https://docs.solana.com
- Anchor Book: https://book.anchor-lang.com
- Metaplex: https://docs.metaplex.com
- Token-2022: https://spl.solana.com/token-2022
