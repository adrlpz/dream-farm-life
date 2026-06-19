# PRD — Dream Farm Life 🌾

## Overview

Dream Farm Life adalah web-based farming simulation game yang relaxing dan casual. Pemain membangun pertanian impian — tanam tanaman, ternak hewan, upgrade bangunan, expand lahan.

**Tagline:** Bangun pertanian impianmu, tanam tanaman, beternak hewan, dan bersantai!

**Target:** Casual gamers, idle game lovers, farming sim fans. Mobile-first web.

---

## Core Gameplay Loop

```
Plant → Wait (growth timer) → Harvest → Sell → Earn Coins → Unlock/Expand → Repeat
         ↕                                        ↓
    Feed Animals → Collect Products → Sell Products
```

---

## Features (MVP — Phase 1)

### 🌱 Crop System
- Tanaman: wheat, corn, tomato, carrot, potato, pumpkin
- Growth stages: seed → sprout → mature → harvestable
- Growth timer: 1min (wheat) → 30min (pumpkin)
- Plant, water (optional speed boost), harvest
- Yield: coins per crop

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
- Coins: primary currency (earn from selling)
- Gems: premium currency (earn from achievements, optional IAP later)
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

## Features (Phase 2 — Post-MVP)

- Social: visit friends' farms
- Seasons/weather system
- Craft items (jam, cheese, bread)
- Quest board (daily/weekly tasks)
- Farm decoration / cosmetics
- Sound & music toggle

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TailwindCSS |
| Game Engine | HTML5 Canvas (custom lightweight) OR PixiJS |
| State | Zustand (game state) + localStorage (save) |
| Backend | None for MVP (fully client-side) |
| Hosting | Static deploy (Vercel / Cloudflare Pages) |
| Auth | Optional Phase 2 (Firebase / Supabase) |

**Decision:** Tanpa backend di MVP. Semua state di localStorage. Offline-first.

---

## Data Model (Simplified)

```
GameState {
  player: { level, xp, coins, gems }
  farm: {
    plots: Plot[]          // grid of land tiles
    buildings: Building[]
    animals: Animal[]
  }
  inventory: { [itemId]: count }
  lastOnline: timestamp    // for offline progress calc
  achievements: string[]
}

Plot { id, x, y, cropId?, plantedAt?, stage, unlocked }
Animal { id, type, fedAt?, happyLevel }
Building { id, type, level }
```

---

## Non-Goals (MVP)

- ❌ Multiplayer / real-time
- ❌ Backend / database
- ❌ Payment / IAP integration
- ❌ Mobile native (web only)
- ❌ Complex crafting chains

---

## Success Metrics

- Playable in browser (mobile + desktop)
- < 3s initial load
- Save/load works across sessions
- Core loop fun in 5-minute session
- Zero backend cost for MVP
