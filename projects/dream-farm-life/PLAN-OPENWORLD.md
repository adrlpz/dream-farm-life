# Plan — Dream Farm Life: Open World 🌍🌾

## Phase 0: Engine Foundation (Week 1-2)

### 0.1 Refactor to Game Engine Architecture
- [ ] Create engine core: `src/engine/` directory
- [ ] `Engine.ts` — main game loop (requestAnimationFrame, delta time)
- [ ] `Camera.ts` — isometric/top-down camera (follow player, zoom, pan, bounds)
- [ ] `InputManager.ts` — keyboard (WASD), touch joystick, mouse/tap
- [ ] `Renderer.ts` — Canvas2D renderer with layer system (ground, objects, entities, UI)
- [ ] `AudioManager.ts` — SFX + music (Howler.js or Web Audio)
- [ ] `AssetLoader.ts` — sprite/tileset loader with progress bar
- [ ] Migrate existing grid farm logic into engine entity system

### 0.2 Tilemap & Chunk System
- [ ] `Tilemap.ts` — tile-based world renderer
- [ ] `ChunkManager.ts` — load/unload 64x64 chunks around player (render distance: 3)
- [ ] `TileRegistry.ts` — tile type definitions (grass, soil, water, sand, rock, ice, etc.)
- [ ] `BiomeGenerator.ts` — procedural biome placement (seeded noise)
- [ ] Chunk save/load to localStorage (compressed)
- [ ] Fog of war: undiscovered chunks hidden, reveal on approach

### 0.3 Entity System
- [ ] `Entity.ts` — base entity (position, sprite, animation, collision)
- [ ] `Player.ts` — character with movement, stamina, tools, animation states
- [ ] `NPC.ts` — AI state machine (idle, walk, interact, quest)
- [ ] `ResourceNode.ts` — gatherable objects (trees, rocks, bushes, ore)
- [ ] `WorldObject.ts` — static objects (buildings, signs, decorations)
- [ ] Entity spatial partitioning (quadtree for collision checks)

### 0.4 Collision & Pathfinding
- [ ] `CollisionSystem.ts` — tile-based collision (walls, water, objects)
- [ ] `Pathfinding.ts` — A* for NPC auto-walk
- [ ] Player collision with terrain + objects
- [ ] Push-back resolution (prevent stuck in walls)

---

## Phase 1: Open World Core (Week 3-4)

### 1.1 Character Movement & Animation
- [ ] 8-directional movement (up, down, left, right + diagonals)
- [ ] Walk animation per direction (4 frames each)
- [ ] Idle animation (breathing, blinking)
- [ ] Run (hold shift / double-tap joystick) — 1.5x speed, drains stamina
- [ ] Character sprite sheet (base + equipment overlay)
- [ ] Smooth movement (lerp, not snap to grid)

### 1.2 Camera System
- [ ] Camera follows player with smooth lerp
- [ ] Camera bounds (don't show beyond world edges)
- [ ] Zoom in/out (pinch on mobile, scroll on desktop)
- [ ] Mini-map overlay (top-right, shows fog of war)
- [ ] Full map screen (tap mini-map to open)

### 1.3 Touch Controls (Mobile)
- [ ] Virtual joystick (bottom-left, analog movement)
- [ ] Action button (bottom-right, context-sensitive: interact/harvest/mine)
- [ ] Quick bar (bottom-center, 5 item slots)
- [ ] Tap to interact with objects/NPCs
- [ ] Swipe to pan camera (when zoomed out)
- [ ] Pinch to zoom

### 1.4 World Generation (Initial Biomes)
- [ ] **Farmland** (spawn area): grass tiles, soil patches, river, paths
- [ ] **Forest**: dense trees, clearings, bushes, mushrooms
- [ ] **Beach**: sand, tide pools, pier, lighthouse
- [ ] **Mountain**: rocky terrain, cliff edges, cave entrance
- [ ] Place biome-specific resources (trees, rocks, herbs, fish spots)
- [ ] Biome transition tiles (smooth blending between biomes)
- [ ] Spawn 4 biomes around Home Village in fixed layout (procedural later)

---

## Phase 2: Gathering & Resources (Week 5-6)

### 2.1 Resource Node System
- [ ] Tree entities: chop → wood + sap + chance for fruit (3 hits, respawn 5min)
- [ ] Rock entities: mine → stone + ore + chance for gem (3 hits, respawn 5min)
- [ ] Bush entities: forage → berries + herbs + seeds (1 interact, respawn 3min)
- [ ] Fishing spots: cast rod → mini-game → fish (unlimited, timer-based)
- [ ] Bug spawn points: net catch → insects (random spawn)
- [ ] Resource node respawn timer (per-chunk tracking)
- [ ] Visual feedback: shake on hit, particles on harvest, disappear on depleted

### 2.2 Tool System
- [ ] Tool data: type, tier, durability, speed, yield multiplier
- [ ] Tool equip/unequip (quick bar slot)
- [ ] Tool animation (swing axe, swing pickaxe, cast rod, hoe ground)
- [ ] Tool durability: decreases per use, repair at blacksmith
- [ ] Tool upgrade at blacksmith: wood → iron → gold → diamond
- [ ] Higher tier = access to rarer resources + faster gathering

### 2.3 Inventory System (Enhanced)
- [ ] 20-slot backpack (expandable to 60 via crafting/upgrade)
- [ ] Item stack (same items stack to 99)
- [ ] Item categories: Seeds, Crops, Resources, Tools, Fish, Quest, Special
- [ ] Quick bar: 5 slots, switch with 1-5 keys or tap
- [ ] Drag & drop reorganization
- [ ] Sort button (auto-sort by category)
- [ ] Storage chests: craftable, place on farm, unlimited storage
- [ ] Item tooltips: name, description, rarity, sell price

### 2.4 Fishing Mini-Game
- [ ] Cast line at water tiles / fishing spots
- [ ] Timing mini-game: press when indicator hits zone
- [ ] Different fish by biome, time of day, season
- [ ] Fish rarity: common → uncommon → rare → legendary
- [ ] Fish collection log (Pokédex-style)

---

## Phase 3: Farming Expansion (Week 7-8)

### 3.1 Farm Plot Placement
- [ ] Player can place farm plots on claimed land (any flat tile)
- [ ] Till soil with hoe → becomes plantable plot
- [ ] Plot states: tilled → planted → watered → growing → harvestable
- [ ] Watering: manual (watering can) or automated (well + sprinklers)
- [ ] Visual: different soil colors per state, crop sprites per growth stage

### 3.2 Expanded Crop System (30+ Crops)
- [ ] Crop data: biome, growth time, stages, yield, sell price, XP
- [ ] Tier 1 (Farmland): Wheat, Corn, Tomato, Carrot, Potato, Pumpkin
- [ ] Tier 2 (Farmland): Strawberry, Lettuce, Rice, Sugarcane, Cotton, Sunflower
- [ ] Tier 3 (Forest): Blueberry, Mushroom, Herb, Wild Garlic, Fern
- [ ] Tier 4 (Tropical): Coconut, Banana, Mango, Pineapple, Papaya
- [ ] Tier 5 (Mountain): Alpine Berry, Mountain Herb, Crystal Mushroom
- [ ] Tier 6 (Exotic/Quest): Starfruit, Dragon Fruit, Golden Apple, Moonflower
- [ ] Seed shop at Merchant (unlocks by level)
- [ ] Wild seeds found while foraging

### 3.3 Tree Planting
- [ ] Plantable tree saplings on any outdoor tile
- [ ] Growth: sapling → young → mature (real-time, 10-30 min)
- [ ] Fruit trees: drop fruit every few minutes when mature
- [ ] Wood trees: chop when mature → wood + chance for sapling
- [ ] Special trees: Rainbow Tree (cosmetic, NFT-worthy)

### 3.4 Enhanced Animal System
- [ ] 8 animal types (chicken, cow, sheep, pig, bee, goat, ostrich, penguin)
- [ ] Animal pen: build on farm, assign animals
- [ ] Feed system: specific crop/resource per animal
- [ ] Production timer: animal produces item periodically
- [ ] Collect products from pen
- [ ] Happiness meter: feed on time + clean pen = bonus yield
- [ ] Animal sprites: idle, eating, sleeping, producing
- [ ] Breeding: 2 same type → baby (chance for rare variant)

### 3.5 Greenhouse & Automation
- [ ] Greenhouse building: grow any crop regardless of biome
- [ ] Sprinkler: auto-water adjacent plots (crafted)
- [ ] Scarecrow: prevent crow crop theft (crafted)
- [ ] Auto-feeder: fills animal feed trough (crafted)
- [ ] Processing: Windmill (wheat→flour), Kitchen (crops→food)

---

## Phase 4: NPCs & Quests (Week 9-10)

### 4.1 NPC System
- [ ] NPC data: name, role, schedule, dialog tree, quests
- [ ] NPC daily schedule: wake → walk to station → work → walk home → sleep
- [ ] NPC dialog: branching conversation system
- [ ] NPC portraits: 64x64 character art for dialog UI
- [ ] NPC locations:
  - **Elder** — Home Village, main quest giver
  - **Merchant** — Market stall, sells seeds/tools
  - **Blacksmith** — Forge, upgrades tools
  - **Botanist** — Forest edge, crop research quests
  - **Fisherman** — Beach pier, fishing quests
  - **Archaeologist** — Mountain base, artifact quests
  - **Mysterious Trader** — Wanders between biomes, rare items

### 4.2 Dialog System
- [ ] Dialog UI: portrait + text + choices
- [ ] Typewriter text effect
- [ ] Choice branches (affect quest outcomes)
- [ ] Quest hint integration (NPC tells where to go)
- [ ] Gift system: give items to NPCs → friendship level

### 4.3 Quest System
- [ ] Quest data: type, objectives, rewards, dialog, completion
- [ ] Quest tracker UI: active quest display (top-left)
- [ ] Quest types:
  - **Main Story** (8 chapters, unlock biomes)
  - **Daily** (auto-generated: harvest X, gather Y, catch Z)
  - **Side** (NPC-specific, one-time)
  - **Exploration** (discover POIs, find hidden items)
  - **Achievement** (milestone-based)
- [ ] Quest objectives: gather, deliver, talk, discover, craft, reach level
- [ ] Quest rewards: XP, coins, $DREAM, items, recipes, unlocks
- [ ] Quest log UI: all quests (active, completed, available)
- [ ] Quest Board: in village, shows daily quests

### 4.4 Main Story Content
- [ ] **Ch1 "New Beginnings"** — Elder teaches farming, build first barn (Farmland)
- [ ] **Ch2 "Into the Wild"** — Clear forest path, meet Botanist (Forest)
- [ ] **Ch3 "Tides of Change"** — Fix pier, meet Fisherman (Beach)
- [ ] **Ch4 "Mountain's Call"** — Climb path, meet Blacksmith (Mountain)
- [ ] **Ch5-Ch8** — Placeholder quest markers, full content post-MVP

---

## Phase 5: Crafting & Building (Week 11-12)

### 5.1 Crafting System
- [ ] Recipe data: ingredients, output, workstation, skill requirement
- [ ] Workstation UI: grid of recipes, show requirements, craft button
- [ ] Workstations:
  - Workbench (basic tools, fences, signs) — start
  - Kitchen (food, preserves) — unlock at Lv 5
  - Forge (metal tools, equipment) — unlock at Lv 10
  - Loom (clothing, fabric) — unlock at Lv 12
  - Alchemy Lab (potions, fertilizers) — unlock at Lv 15
- [ ] 50+ recipes across categories
- [ ] Crafting animation + sound
- [ ] Recipe discovery: learn from NPCs, quests, books, experimentation

### 5.2 Building System (Enhanced)
- [ ] Building placement on claimed land (ghost preview before place)
- [ ] Building snap-to-grid (32px tiles)
- [ ] Buildings:
  - Farm House (spawn, save, sleep) — 3 tiers
  - Barn (storage) — 5 tiers
  - Silo (crop storage) — 5 tiers
  - Animal Pen (per type) — 3 tiers
  - Greenhouse (any biome crops) — 2 tiers
  - Windmill (auto-process) — 2 tiers
  - Well (auto-water) — 2 tiers
  - Market Stall (sell to NPCs) — 3 tiers
  - Dock (fishing access) — 2 tiers
  - Decorations: fences, paths, lamps, signs, statues
- [ ] Upgrade flow: select building → show cost → confirm → animate upgrade
- [ ] Visual change per tier (sprite swap)

### 5.3 Land Claiming
- [ ] Start with 9x9 claim at Home Village
- [ ] Expand claim: coins/$DREAM → add tiles to border
- [ ] Max claim: 31x31
- [ ] Claim border visualization (subtle glow/fence)
- [ ] Cannot build in NPC villages, roads, special areas

---

## Phase 6: Game Time & Weather (Week 13)

### 6.1 Day/Night Cycle
- [ ] Game clock: 1 real minute = 1 game hour
- [ ] Full day = 24 real minutes
- [ ] Lighting overlay: gradual brightness change
- [ ] Night: darker overlay, fireflies, different NPC schedule
- [ ] Dawn/Dusk: orange/pink tint transitions

### 6.2 Seasons
- [ ] 4 seasons: Spring, Summer, Fall, Winter (7 days each = 28 day year)
- [ ] Seasonal effects:
  - Spring: bonus crop growth, flowers bloom
  - Summer: normal, best fishing
  - Fall: harvest bonus, leaves change color
  - Winter: no outdoor farming, snow, ice fishing
- [ ] Seasonal crops (some only grow in specific seasons)
- [ ] Visual: color palette shifts per season

### 6.3 Weather System
- [ ] Weather types: Sunny, Cloudy, Rainy, Stormy, Snowy, Foggy
- [ ] Weather changes every few hours (random with biome bias)
- [ ] Rain: auto-waters crops, boosts growth
- [ ] Storm: chance to damage crops (build scarecrow to protect)
- [ ] Snow: only in winter/mountain, visual overlay
- [ ] Weather affects NPC behavior (stay inside during storms)
- [ ] Weather particles: rain drops, snow flakes, fog layer

---

## Phase 7: Skill System (Week 14)

### 7.1 Skill Implementation
- [ ] 6 skills: Farming, Mining, Foraging, Fishing, Crafting, Animal Care
- [ ] Each skill: level 1-50, separate XP bar
- [ ] XP earned from relevant actions (plant = farming XP, mine = mining XP)
- [ ] Level up: unlock recipes, abilities, efficiency bonuses
- [ ] Skill UI: tabbed view with level, XP bar, unlocks list

### 7.2 Skill Unlocks
| Skill | Key Unlocks |
|-------|-------------|
| Farming | Crop tiers, sprinkler, greenhouse, hybrid seeds |
| Mining | Ore tiers, bomb (clear rocks), gem chance up |
| Foraging | Herb tiers, mushroom cultivation, rare seed finder |
| Fishing | Rod tiers, fish radar, legendary bait |
| Crafting | Workstation tiers, recipe unlocks, efficiency |
| Animal Care | Animal types, breeding, happiness boost |

### 7.3 Skill Perks
- [ ] Every 10 levels: choose a perk (2 options)
- [ ] Example Farming Lv 10: "Green Thumb" (+20% growth speed) OR "Bountiful Harvest" (+1 yield)
- [ ] Perks affect gameplay meaningfully, encourage specialization

---

## Phase 8: Solana On-Chain (Week 15-18)

### 8.1 Wallet Integration
- [ ] @solana/wallet-adapter (Phantom, Solflare, Backpack)
- [ ] WalletConnect v2 for mobile
- [ ] Guest mode → connect wallet → bind farm
- [ ] Wallet HUD: address, SOL balance, $DREAM balance

### 8.2 Anchor Program (Enhanced)
- [ ] `initialize_farm` — create farm PDA (coordinates, biome, size)
- [ ] `claim_land` — expand land claim on-chain
- [ ] `plant_crop` / `harvest_crop` — batch crop operations
- [ ] `mint_reward` — CPI mint $DREAM for quest/achievement
- [ ] `list_land` / `buy_land` — land marketplace
- [ ] `list_item` / `buy_item` — item/NFT marketplace
- [ ] `settle_batch` — batch settle off-chain actions
- [ ] Program audit before mainnet

### 8.3 $DREAM Token
- [ ] Deploy SPL Token (9 decimals)
- [ ] Metaplex Token Metadata (name, symbol, image)
- [ ] Mint authority: game treasury PDA
- [ ] Earn: harvest, sell, quests, daily login, achievements
- [ ] Spend: land expansion, premium seeds, cosmetics
- [ ] Off-chain ledger → batch settle on-chain

### 8.4 NFT System (Metaplex)
- [ ] Land NFTs (compressed via Bubblegum) — each parcel
- [ ] Animal NFTs — rare/bred variants
- [ ] Building NFTs — special edition, seasonal
- [ ] Achievement NFTs — milestone badges
- [ ] Character cosmetics — outfits, accessories
- [ ] NFT gallery in-game UI
- [ ] Metadata: image, attributes, rarity, history

### 8.5 Marketplace
- [ ] In-game marketplace UI (browse, search, filter)
- [ ] List NFTs for $DREAM or SOL
- [ ] Buy/delist functionality
- [ ] Price history chart
- [ ] Royalty: 2.5% to treasury
- [ ] Tensor / Magic Eden integration (optional)

---

## Phase 9: Polish & Launch (Week 19-20)

### 9.1 Visual Polish
- [ ] Final sprite art pass (all entities, tiles, UI)
- [ ] Particle effects (harvest sparkle, mining dust, water splash)
- [ ] Screen transitions (biome entry, cave entrance)
- [ ] UI animations (panel slide-in, button press, notification pop)
- [ ] Loading screen with tips + farm art

### 9.2 Audio
- [ ] Background music per biome (8 tracks)
- [ ] SFX: footsteps, tool swings, harvest, mining, fishing, animals
- [ ] UI SFX: button click, notification, level up fanfare
- [ ] Volume controls (music + SFX separate)
- [ ] Mute toggle

### 9.3 Tutorial
- [ ] Guided first 5 minutes: Elder teaches movement, farming, gathering
- [ ] Contextual tooltips for new mechanics
- [ ] Quest log as implicit tutorial
- [ ] Skip option for returning players

### 9.4 Performance Optimization
- [ ] Sprite atlas packing (reduce draw calls)
- [ ] Chunk culling (only render visible chunks)
- [ ] Entity pooling (reuse objects, reduce GC)
- [ ] requestAnimationFrame throttle on background tab
- [ ] Lighthouse audit: target 85+ performance
- [ ] Test on low-end devices (2GB RAM, old phones)

### 9.5 Deployment
- [ ] Vite production build optimization
- [ ] Asset compression (images, audio)
- [ ] Deploy to VPS (Docker + nginx, existing setup)
- [ ] SSL + CDN (Cloudflare)
- [ ] Custom domain: `dreamfarm.adrlpz.site/game/`
- [ ] Programs verified on Solana Explorer
- [ ] $DREAM token metadata verified

---

## Asset Requirements

| Type | Count | Priority |
|------|-------|----------|
| Tile sprites (biomes) | ~100 | P0 |
| Character sprites (walk, idle, tools) | ~50 frames | P0 |
| NPC sprites (6 NPCs × walk/idle) | ~30 frames | P0 |
| Crop sprites (30 crops × 4 stages) | ~120 | P0 |
| Animal sprites (8 types × states) | ~40 | P1 |
| Building sprites (10 types × tiers) | ~30 | P1 |
| Resource node sprites (tree, rock, bush) | ~20 | P0 |
| UI elements (icons, panels, buttons) | ~60 | P0 |
| Particle effects | ~15 | P1 |
| Music tracks (8 biomes + menu) | 9 | P1 |
| Sound effects | ~40 | P1 |
| NPC portraits | 7 | P1 |
| NFT artwork | ~20 | P2 |

**Source:** AI-generated sprites + free asset packs (itch.io, OpenGameArt) + custom polish

---

## Tech Stack (Updated)

| Layer | Tech | Notes |
|-------|------|-------|
| Framework | React 18 + Vite | UI overlay, routing |
| Game Engine | Custom (Canvas2D) | Tilemap, entities, camera |
| State | Zustand + localStorage | Game state persist |
| Styling | TailwindCSS | UI components |
| Blockchain | Solana (Anchor + Rust) | Smart contracts |
| Wallet | @solana/wallet-adapter | Phantom, Solflare |
| Token | SPL Token ($DREAM) | In-game currency |
| NFT | Metaplex Core / Bubblegum | Compressed NFTs |
| Audio | Howler.js | Cross-browser audio |
| Math | Custom (noise, A*, collision) | No heavy deps |
| Hosting | Docker + nginx on VPS | Existing infra |

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Canvas perf on low-end | High | Chunk culling, entity pooling, throttle |
| localStorage size limit (5MB) | High | Compress chunks, limit history, IndexedDB fallback |
| Scope creep open world | High | Strict phase gates, MVP per phase |
| Art asset bottleneck | Medium | AI-gen + free packs, placeholder first |
| Procedural gen complexity | Medium | Fixed biome layout first, procedural later |
| NPC pathfinding bugs | Medium | Simple A*, fallback to teleport |
| Mobile touch UX | Medium | Playtest early, iterate controls |
| Solana tx complexity | Low | Anchor simplifies, near-zero gas |
| Weather/perf overhead | Low | Simple overlay, no physics |

---

## Decisions (Locked)

- **Canvas2D over PixiJS** — lighter, fewer deps, sufficient for 2D tile game
- **Fixed biome layout** — procedural gen deferred to Phase 3+ (MVP = 8 fixed biomes)
- **Chunk-based world** — 64x64 tiles per chunk, load/unload dynamically
- **No real-time multiplayer** — visit friends' farms async (on-chain state)
- **Off-chain first** — batch settle to Solana (smooth UX)
- **Compressed NFTs** — Bubblegum for land/items (ultra-low cost)
- **Mobile-first** — virtual joystick, touch-friendly UI
- **Existing VPS deploy** — Docker + nginx, no new infra

---

## File Structure (New)

```
dream-farm-life/game/src/
├── engine/
│   ├── Engine.ts              # Main game loop
│   ├── Camera.ts              # Camera follow, zoom, pan
│   ├── InputManager.ts        # Keyboard, touch, mouse
│   ├── Renderer.ts            # Canvas2D layer renderer
│   ├── AudioManager.ts        # SFX + music
│   ├── AssetLoader.ts         # Sprite/tileset loader
│   ├── Tilemap.ts             # Tile rendering
│   ├── ChunkManager.ts        # Chunk load/unload/save
│   ├── CollisionSystem.ts     # Tile collision
│   ├── Pathfinding.ts         # A* algorithm
│   └── ParticleSystem.ts      # Visual effects
├── entities/
│   ├── Entity.ts              # Base entity
│   ├── Player.ts              # Player character
│   ├── NPC.ts                 # NPC with AI
│   ├── Animal.ts              # Farm animal
│   ├── ResourceNode.ts        # Gatherable object
│   ├── WorldObject.ts         # Static objects
│   └── Projectile.ts          # Fishing line, etc.
├── systems/
│   ├── MovementSystem.ts      # Handle entity movement
│   ├── InteractionSystem.ts   # Player ↔ entity interaction
│   ├── GrowthSystem.ts        # Crop/tree growth timers
│   ├── ProductionSystem.ts    # Animal production timers
│   ├── QuestSystem.ts         # Quest progress tracking
│   ├── WeatherSystem.ts       # Weather state machine
│   ├── TimeSystem.ts          # Day/night, seasons
│   └── SpawnSystem.ts         # Resource/bug respawn
├── ui/
│   ├── HUD.tsx                # Health, stamina, clock, mini-map
│   ├── Inventory.tsx          # Backpack UI
│   ├── Dialog.tsx             # NPC dialog box
│   ├── QuestLog.tsx           # Quest tracker
│   ├── CraftingMenu.tsx       # Crafting UI
│   ├── MapScreen.tsx          # Full map
│   ├── Settings.tsx           # Audio, controls
│   ├── ShopUI.tsx             # Merchant buy/sell
│   └── WalletUI.tsx           # Connect, balance
├── data/
│   ├── tiles.ts               # Tile definitions
│   ├── biomes.ts              # Biome configs
│   ├── crops.ts               # 30+ crop data
│   ├── animals.ts             # 8 animal data
│   ├── buildings.ts           # Building data
│   ├── recipes.ts             # Crafting recipes
│   ├── quests.ts              # Quest definitions
│   ├── npcs.ts                # NPC data
│   ├── items.ts               # All item definitions
│   └── skills.ts              # Skill tree data
├── store/
│   ├── gameStore.ts           # Main game state (Zustand)
│   ├── playerStore.ts         # Player state
│   ├── worldStore.ts          # World/chunk state
│   ├── questStore.ts          # Quest progress
│   └── walletStore.ts         # Solana wallet state
├── utils/
│   ├── noise.ts               # Perlin/Simplex noise
│   ├── helpers.ts             # Math, distance, lerp
│   ├── saveLoad.ts            # localStorage save/load
│   ├── compression.ts         # Chunk compression
│   └── batchSettle.ts         # Solana tx batching
├── assets/
│   ├── sprites/
│   ├── tilesets/
│   ├── audio/
│   └── ui/
├── App.tsx
└── main.tsx
```

---

## Timeline Summary

| Phase | Weeks | Focus | Deliverable |
|-------|-------|-------|-------------|
| 0 | 1-2 | Engine foundation | Game loop, camera, input, tilemap |
| 1 | 3-4 | Open world core | Character movement, biomes, chunks |
| 2 | 5-6 | Gathering & resources | Tools, inventory, fishing, resources |
| 3 | 7-8 | Farming expansion | 30+ crops, trees, animals, automation |
| 4 | 9-10 | NPCs & quests | Dialog, quest system, main story |
| 5 | 11-12 | Crafting & building | Recipes, workstations, land claiming |
| 6 | 13 | Time & weather | Day/night, seasons, weather |
| 7 | 14 | Skill system | 6 skills, perks, unlocks |
| 8 | 15-18 | Solana on-chain | Wallet, $DREAM, NFTs, marketplace |
| 9 | 19-20 | Polish & launch | Art, audio, optimization, deploy |

**Total: ~20 weeks (5 months) to full open world launch**

---

## Next Step

Fizz confirm scope → gue mulai Phase 0: engine foundation + character movement.
