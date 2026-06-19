# Plan — Dream Farm Life 🌾

## Phase 1: Foundation (Week 1)

### 1.1 Project Setup
- [ ] Init React + Vite + TailwindCSS project
- [ ] Setup folder structure (components, hooks, store, assets, utils)
- [ ] Install deps: zustand, react-router-dom
- [ ] Setup local save/load utility (localStorage wrapper)

### 1.2 Core Game State
- [ ] Define GameState TypeScript interfaces
- [ ] Zustand store: player, farm, inventory
- [ ] Offline progress calculator (time diff → yield)
- [ ] Save/load middleware (auto-save every 30s + on unload)

### 1.3 Farm Grid UI
- [ ] Canvas-based farm grid renderer (OR CSS grid fallback)
- [ ] Plot component: locked / empty / planted / harvestable
- [ ] Click interaction: select plot → action menu
- [ ] Responsive layout (mobile-first)

---

## Phase 2: Gameplay (Week 2)

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

## Phase 3: Progression (Week 3)

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

## Phase 4: Polish (Week 4)

### 4.1 UI/UX
- [ ] Tutorial overlay (first-time player)
- [ ] Sound effects (plant, harvest, coin, level up)
- [ ] Music toggle
- [ ] Settings panel
- [ ] Loading screen with farm art

### 4.2 Daily & Idle
- [ ] Daily login reward (streak system)
- [ ] Offline earnings popup on return
- [ ] Idle notification (optional browser push)

### 4.3 Deploy
- [ ] Optimize assets (compress sprites)
- [ ] Lighthouse audit (target: 90+ perf)
- [ ] Deploy to Vercel / Cloudflare Pages
- [ ] Custom domain setup

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

**Source options:** free asset packs (itch.io, OpenGameArt) OR AI-generated OR commissioned

---

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Canvas perf on low-end devices | CSS grid fallback, requestAnimationFrame throttling |
| localStorage size limit (~5MB) | Compress state, limit history |
| Scope creep | Strict MVP scope, Phase 2 backlog |
| Asset bottleneck | Use placeholder sprites first, swap later |

---

## Decisions (Locked)

- **No backend** for MVP — fully client-side
- **React + Vite** — fast dev, familiar stack
- **Zustand** — lightweight, built-in persist middleware
- **Mobile-first** — responsive grid, touch-friendly
- **No energy/gating** — relaxing = no artificial limits

---

## File Structure

```
dream-farm-life/
├── public/
│   └── assets/
│       ├── sprites/
│       ├── sounds/
│       └── ui/
├── src/
│   ├── components/
│   │   ├── Farm/
│   │   ├── Market/
│   │   ├── Inventory/
│   │   ├── HUD/
│   │   └── UI/
│   ├── hooks/
│   ├── store/
│   │   └── gameStore.ts
│   ├── data/
│   │   ├── crops.ts
│   │   ├── animals.ts
│   │   └── buildings.ts
│   ├── utils/
│   │   ├── saveLoad.ts
│   │   └── offlineProgress.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Next Step

Fizz confirm scope → gue scaffold project + build core game state + farm grid.
