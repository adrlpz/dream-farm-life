# PRD — Dream Farm Life: Open World 🌾🌍

## Overview

Dream Farm Life: Open World mengubah game dari farming grid statis menjadi dunia terbuka yang bisa dieksplorasi bebas. Pemain bergerak sebagai karakter, menemukan biome baru, quest dari NPC, resource gathering di alam liar, dan membangun pertanian di lokasi yang dipilih sendiri.

**Tagline:** Dunia luas menunggu — tanam, jelajahi, bangun, dan hidup!

**Target:** Casual gamers, exploration fans, farming sim lovers. Mobile-first web.

**Blockchain:** Solana — in-game economy on-chain, NFT assets, land ownership, token rewards.

---

## Vision Shift

| Aspect | Current (Grid) | Open World |
|--------|----------------|------------|
| Movement | Click grid tile | Free-roam character (WASD/touch joystick) |
| World | Fixed 4x4 → 8x8 grid | Infinite procedural world with biomes |
| Camera | Top-down grid view | Isometric / top-down scrolling camera |
| Farming | Any unlocked plot | Player-placed farm plots anywhere |
| Exploration | None | Full map exploration, fog of war |
| NPCs | None | Villagers, merchants, quest givers |
| Resources | Farm-only | Farm + wild gathering (wood, stone, ore, herbs) |
| Social | None | Visit other players' farms |

---

## Core Gameplay Loop

```
Explore World → Discover Biomes → Gather Resources → Build Farm
     ↕                                              ↓
  Talk to NPCs ← Accept Quests ← Unlock Areas ← Earn $DREAM
     ↓                                              ↓
  Complete Quests → Unlock Recipes → Craft Items → Expand Empire
```

---

## World Design

### 🗺️ World Map Structure

World terdiri dari **chunk-based procedural map** yang bisa dieksplorasi. Setiap chunk 64x64 tiles. Pemain mulai di **Home Chunk** dan bisa berjalan ke segala arah.

```
                    [Snow Mountain]
                         │
    [Deep Forest] ── [Home Village] ── [Beach Coast]
                         │                    │
                   [Farmland]           [Coral Reef]
                         │
                    [Dark Cave]
```

### 🌍 Biomes

| Biome | Terrain | Resources | Unlocked |
|-------|---------|-----------|----------|
| 🌾 Farmland | Grass, soil, water | Crops, fertile soil | Start |
| 🌲 Forest | Trees, bushes | Wood, berries, mushrooms, herbs | Lv 3 |
| 🏖️ Beach | Sand, tide pools | Shells, fish, coconuts, seaweed | Lv 5 |
| ⛰️ Mountain | Rock, ore veins | Stone, iron, gold, gems | Lv 8 |
| 🌑 Dark Cave | Underground tunnels | Crystals, rare ores, bats | Lv 12 |
| ❄️ Snow Mountain | Ice, snow | Ice crystals, rare herbs, yeti | Lv 15 |
| 🌺 Tropical Island | Palm trees, jungle | Exotic fruits, parrots, treasure | Lv 20 |
| 🏜️ Desert | Sand dunes, oasis | Cactus, ancient artifacts, sandworm | Lv 25 |

### 🏘️ Home Village (Hub)

Central area NPC yang bisa dikunjungi:
- **Merchant** — beli seeds, tools, supplies
- **Blacksmith** — upgrade tools, craft equipment
- **Elder** — main quest line, lore
- **Fisherman** — fishing quests, fish trading
- **Botanist** — crop research, hybrid seeds
- **Archaeologist** — artifact quests, ancient mysteries

---

## Character System

### 🧑 Player Character

```
Character {
  name: string
  level: number
  xp: number
  stamina: number          // regenerated over time, used for actions
  inventory: Inventory     // backpack with weight limit
  equipment: Equipment     // tool slots
  skills: Skills           // farming, mining, foraging, fishing, crafting
  position: { x, y, chunk }
  farmPlots: Plot[]        // placed farm locations
}
```

### 🎒 Inventory System

- **Backpack slots:** 20 → upgrade to 60 (via crafting/purchase)
- **Weight limit:** affects movement speed if over limit
- **Item categories:** Seeds, Crops, Tools, Resources, Fish, Artifacts, Quest Items
- **Quick bar:** 5 slots for frequently used items
- **Storage chests:** craftable, placed on farm (unlimited storage at base)

### 🛠️ Tools

| Tool | Use | Upgrade Path |
|------|-----|--------------|
| Hoe | Till soil for farming | Wood → Iron → Gold → Diamond |
| Axe | Chop trees, gather wood | Wood → Iron → Gold → Diamond |
| Pickaxe | Mine rocks, ore | Wood → Iron → Gold → Diamond |
| Fishing Rod | Catch fish | Bamboo → Fiberglass → Master |
| Watering Can | Water crops | Copper → Iron → Gold → Diamond |
| Bug Net | Catch insects | Basic → Fine → Master |

Higher tier = faster gathering, access to rarer resources.

### 📊 Skill System

| Skill | Level Cap | Activities |
|-------|-----------|------------|
| 🌱 Farming | 50 | Planting, harvesting, breeding crops |
| ⛏️ Mining | 50 | Mining rocks, ores, crystals |
| 🌿 Foraging | 50 | Gathering wild plants, herbs, mushrooms |
| 🎣 Fishing | 50 | Fishing in rivers, lakes, ocean |
| 🔨 Crafting | 50 | Building items, tools, machines |
| 🐄 Animal Care | 50 | Raising, breeding, milking, shearing |

Each skill XP is separate. Leveling unlocks recipes, abilities, efficiency.

---

## Farming System (Enhanced)

### 🌱 Crop System

Expanded from 6 to **30+ crops** across biomes:

| Tier | Crops | Growth Time | Biome |
|------|-------|-------------|-------|
| Starter | Wheat, Corn, Tomato, Carrot | 1-5 min | Farmland |
| Mid | Potato, Pumpkin, Strawberry, Lettuce | 5-15 min | Farmland |
| Advanced | Rice, Sugarcane, Cotton, Sunflower | 15-30 min | Farmland |
| Forest | Blueberry, Mushroom, Herb, Wild Garlic | 10-20 min | Forest |
| Tropical | Coconut, Banana, Mango, Pineapple | 20-45 min | Tropical |
| Exotic | Starfruit, Dragon Fruit, Golden Apple | 45-90 min | Any (rare seeds) |
| Special | Crystal Berry, Moonflower, Sunbloom | 60-120 min | Special (quest unlock) |

### 🌳 Tree System (NEW)

Plantable trees that grow over time:
- **Fruit Trees:** Apple, Orange, Cherry (drop fruit periodically)
- **Wood Trees:** Oak, Pine, Maple (harvest wood, replant)
- **Special Trees:** Rainbow Tree (cosmetic, NFT)

### 🐄 Animal System (Expanded)

| Animal | Product | Feed | Biome | Unlock |
|--------|---------|------|-------|--------|
| Chicken | Eggs | Wheat | Farmland | Start |
| Cow | Milk | Corn | Farmland | Lv 3 |
| Sheep | Wool | Wheat | Farmland | Lv 5 |
| Pig | Truffle | Mushroom | Forest | Lv 8 |
| Bee | Honey | Flower | Forest | Lv 10 |
| Goat | Cheese | Grass | Mountain | Lv 12 |
| Ostrich | Feather | Fruit | Desert | Lv 18 |
| Penguin | Ice Egg | Fish | Snow | Lv 22 |

**Breeding:** Combine two animals → chance for rare variant (NFT-worthy)

---

## Exploration System

### 🗺️ Map & Fog of War

- Player starts with small revealed area around home
- Walking reveals tiles (fog of war lifts)
- Map auto-draws as player explores
- Minimap in corner, full map in menu

### 🏔️ Points of Interest

Each biome has discoverable POIs:
- **Treasure Chests** — random loot (coins, rare items, seeds)
- **Resource Nodes** — respawnable gathering points
- **Hidden Caves** — mini-dungeon with puzzles
- **Ancient Ruins** — lore fragments, artifact pieces
- **NPC Camps** — side quests, trading
- **Boss Areas** — rare encounters (PvE)

### 🎒 Resource Gathering

Wild resources spawn on map:
- Trees → chop → Wood, Sap, Fruit
- Rocks → mine → Stone, Ore, Gems
- Bushes → forage → Berries, Herbs, Seeds
- Water → fish → Fish, Shells, Treasure
- Bugs → net → Insects (for bait, quests)

Resources respawn on timer. Higher-level areas have rarer resources.

---

## Quest System

### 📜 Quest Types

| Type | Source | Reward | Example |
|------|--------|--------|---------|
| Main Story | Elder | XP, unlock biome, $DREAM | "Clear the forest path" |
| Daily | Quest Board | Coins, XP, seeds | "Harvest 10 wheat" |
| Side | NPCs | Items, recipes, $DREAM | "Find the lost fishing rod" |
| Exploration | Discovery | XP, rare items | "Find all cave entrances" |
| Achievement | System | Badges, NFTs, $DREAM | "Reach Farming Lv 25" |
| Seasonal | Events | Limited items, NFTs | "Harvest pumpkins in October" |

### 📖 Main Story Arc

```
Chapter 1: "New Beginnings" (Farmland)
  → Meet Elder, learn farming basics, build first barn
  
Chapter 2: "Into the Wild" (Forest)
  → Clear forest path, meet Botanist, learn foraging
  
Chapter 3: "Tides of Change" (Beach)
  → Fix boat, meet Fisherman, explore coast
  
Chapter 4: "Mountain's Call" (Mountain)
  → Climb mountain, meet Blacksmith, discover ore
  
Chapter 5: "Deep Dark" (Cave)
  → Enter cave, fight creatures, find crystals
  
Chapter 6: "Frozen Heights" (Snow)
  → Survive blizzard, discover ancient temple
  
Chapter 7: "Island Paradise" (Tropical)
  → Sail to island, find treasure, meet islanders
  
Chapter 8: "Desert Mystery" (Desert)
  → Cross desert, excavate ruins, final boss
```

---

## Crafting System

### 🔨 Workstations

| Station | Craftable | Unlock |
|---------|-----------|--------|
| Workbench | Basic tools, fences, signs | Start |
| Kitchen | Food, drinks, preserves | Lv 5 |
| Forge | Metal tools, weapons, armor | Lv 10 |
| Loom | Clothing, fabric items | Lv 12 |
| Alchemy Lab | Potions, fertilizers, bombs | Lv 15 |
| Enchanter | Magical items, NFT cosmetics | Lv 20 |

### 🧪 Recipe Categories

- **Food:** Cooked meals (stamina restore, buffs)
- **Tools:** Upgraded tools, special equipment
- **Building:** Fences, paths, decorations, machines
- **Farming:** Fertilizers, hybrid seeds, scarecrows
- **Alchemy:** Growth potions, stamina potions, luck potions
- **Special:** Quest items, NFT craft materials

---

## Building System (Enhanced)

### 🏠 Player Farm

Players can place farm plots **anywhere** in the world (within their claimed land):

| Building | Function | Upgrade |
|----------|----------|---------|
| Farm House | Spawn point, save game, sleep | 3 tiers |
| Barn | Storage (items, resources) | 5 tiers |
| Silo | Crop storage (bulk) | 5 tiers |
| Animal Pen | House animals | 3 tiers per animal |
| Greenhouse | Grow any crop regardless of biome | 2 tiers |
| Windmill | Auto-process wheat → flour | 2 tiers |
| Well | Auto-water nearby crops | 2 tiers |
| Market Stall | Sell items to NPCs | 3 tiers |
| Dock | Fishing, boat access | 2 tiers |

### 🏗️ Land Claiming

- Player starts with 9x9 claim at home
- Expand claim with coins/$DREAM (up to 31x31)
- Claim boundaries visible on map
- Cannot build in NPC villages or special areas

---

## Economy (Enhanced)

### 💰 Currencies

| Currency | Earn | Spend |
|----------|------|-------|
| Coins | Sell items, quests | Seeds, tools, basic buildings |
| $DREAM Token | Achievements, rare harvests, quests | Premium items, land, NFTs |
| Gems | Rare finds, achievements | Speed-ups, cosmetics |

### 📊 Market Prices (Dynamic)

- Prices fluctuate based on supply/demand (simulated economy)
- NPC merchants have limited stock (refreshes daily)
- Player-to-player trading via marketplace (on-chain)

---

## Solana Integration (Open World Specifics)

### 🗺️ Land NFTs

Each claimed land parcel is an NFT:
- **Compressed NFTs** (Bubblegum) for low cost
- Metadata: coordinates, biome, size, buildings, improvements
- Tradeable: sell/buy land on marketplace
- Rentable: lease land to other players

### 🎭 Character NFTs

- Character appearance as NFT (cosmetic)
- Rare outfits, accessories (quest rewards, crafting)
- Animated character skins

### 🐾 Pet/Mount NFTs

- Rare animals as rideable mounts
- Pets follow player, provide buffs
- Bred animals with genetic traits (on-chain)

### 🏆 Achievement NFTs

- First to discover biome
- Farming competition winners
- Seasonal event completions
- Speedrun milestones

### 🌐 Multiplayer (Phase 3)

- Visit friends' farms (on-chain verification)
- Co-op farming (shared plots)
- Trading post (P2P)
- Leaderboards (global + friends)

---

## Technical Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (React + Canvas)          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Game     │ │ UI       │ │ Wallet   │ │ Map     │ │
│  │ Canvas   │ │ (React)  │ │ (Solana) │ │ System  │ │
│  │ (PixiJS) │ │          │ │          │ │         │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       │            │            │             │      │
│  ┌────┴────────────┴────────────┴─────────────┴───┐  │
│  │              Game Engine (Custom)               │  │
│  │  ECS-like: Entity, Component, System           │  │
│  │  Tilemap, Collision, Pathfinding, Camera       │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                              │
│  ┌────────────────────┴───────────────────────────┐  │
│  │              State Manager (Zustand)            │  │
│  │  Player, World, Inventory, Quests, Economy     │  │
│  │  + localStorage persist + Tx queue              │  │
│  └────────────────────┬───────────────────────────┘  │
└───────────────────────┼──────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │       Solana (Helius RPC)    │
         │  ┌────────────────────────┐ │
         │  │ Anchor Program (Rust)  │ │
         │  │ - farm_land            │ │
         │  │ - crop_ops             │ │
         │  │ - animal_ops           │ │
         │  │ - marketplace          │ │
         │  │ - quest_rewards        │ │
         │  └────────────────────────┘ │
         │  ┌────────────────────────┐ │
         │  │ SPL Token ($DREAM)     │ │
         │  └────────────────────────┘ │
         │  ┌────────────────────────┐ │
         │  │ Metaplex (NFTs)        │ │
         │  │ - Land, Animals, Items │ │
         │  └────────────────────────┘ │
         └─────────────────────────────┘
```

### Game Engine Components

```
Engine {
  renderer: Canvas2D / PixiJS
  camera: IsometricCamera (follow player, zoom, pan)
  tilemap: ChunkManager (load/unload chunks around player)
  collision: TileCollision (walls, water, objects)
  pathfinding: A* (for NPCs, auto-walk)
  entity: EntitySystem (player, NPCs, animals, objects)
  animation: SpriteAnimator (frame-based)
  input: InputManager (keyboard, touch joystick, mouse)
  audio: AudioManager (SFX, music)
  ui: React overlay (inventory, HUD, dialogs)
}
```

### Chunk System

```typescript
interface Chunk {
  x: number
  y: number
  tiles: Tile[][]        // 64x64
  entities: Entity[]     // NPCs, animals, resources
  objects: WorldObject[] // trees, rocks, buildings
  biome: BiomeType
  discovered: boolean
}
```

Chunks loaded dynamically around player (render distance: 3 chunks). Unloaded chunks save to localStorage.

---

## Data Model

```typescript
// Player State
interface PlayerState {
  id: string
  name: string
  level: number
  xp: number
  stamina: number
  maxStamina: number
  position: { x: number; y: number; chunkX: number; chunkY: number }
  skills: Record<SkillType, { level: number; xp: number }>
  equipment: Record<EquipSlot, Item | null>
  inventory: Inventory
  quests: QuestProgress[]
  achievements: string[]
  walletAddress?: string
}

// World State
interface WorldState {
  chunks: Map<string, Chunk>
  discoveredChunks: Set<string>
  farmPlots: FarmPlot[]
  buildings: Building[]
  animals: Animal[]
  placedObjects: WorldObject[]
  time: GameTime          // day/night, seasons
  weather: WeatherType
}

// Game Time
interface GameTime {
  day: number
  hour: number           // 0-23 (1 real min = 1 game hour)
  season: 'spring' | 'summer' | 'fall' | 'winter'
  year: number
}
```

---

## Visual Style

### 🎨 Art Direction

- **Perspective:** Top-down / slight isometric (like Stardew Valley meets Pokémon)
- **Tile size:** 32x32 px (scalable)
- **Color palette:** Warm, vibrant, hand-painted feel
- **Animations:** Subtle idle animations (swaying grass, flowing water, blinking characters)
- **Day/Night:** Gradual lighting change, different activities per time
- **Weather:** Rain, snow, fog, sunny (affects farming)

### 📱 Mobile Controls

- **Virtual joystick** (bottom-left) for movement
- **Action button** (bottom-right) for interact/harvest/mine
- **Quick bar** (bottom-center) for item switching
- **Tap to interact** with objects/NPCs
- **Pinch to zoom** map

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial load | < 5s |
| FPS (mid-range) | 60 fps |
| FPS (low-end) | 30 fps |
| Chunk load time | < 100ms |
| Memory usage | < 200MB |
| Save size | < 2MB (localStorage) |
| Battery drain | Minimal (requestAnimationFrame throttle) |

---

## Non-Goals (MVP Open World)

- ❌ Real-time multiplayer (Phase 3)
- ❌ Backend server (Phase 2+)
- ❌ PvP combat
- ❌ Complex physics
- ❌ Voice chat
- ❌ Mobile native app

---

## Success Metrics

- Player walks 100+ tiles in first session
- Discovers 3+ biomes in first week
- Completes Chapter 1 story in first session
- Returns next day (D1 retention > 40%)
- Connects wallet within 3 sessions
- Average session > 10 minutes
- Lighthouse performance > 85

---

## Migration from Grid

Existing grid farm → becomes **Home Farm** in open world:
- Current plots convert to farm claim at Home Village
- Existing crops/animals/buildings preserved
- Coins, XP, inventory carried over
- New systems layered on top

---

## Phased Rollout

| Phase | Content | Timeline |
|-------|---------|----------|
| **Open World Core** | Character movement, chunk system, camera, tilemap | Week 1-3 |
| **Biomes & Resources** | 4 biomes, gathering, resource nodes | Week 4-6 |
| **NPCs & Quests** | Village, NPCs, main quest Ch1-3, daily quests | Week 7-9 |
| **Crafting & Building** | Workstations, recipes, enhanced building | Week 10-12 |
| **Farming Expansion** | 30+ crops, trees, enhanced animals | Week 13-14 |
| **Solana On-Chain** | Land NFTs, $DREAM, marketplace | Week 15-18 |
| **Polish & Launch** | Art, SFX, optimization, testing | Week 19-20 |
