# Plan — Dream Farm Life Landing Page 🌾

## Phase 1: Setup & Structure (Day 1)

### 1.1 Project Init
- [ ] Create `landing-page/` directory
- [ ] Init React + Vite + TailwindCSS
- [ ] Install deps: framer-motion, lucide-react
- [ ] Setup folder structure (components, sections, assets, styles)

### 1.2 Base Layout
- [ ] Create App.tsx with section layout
- [ ] Setup Tailwind config (colors, fonts, breakpoints)
- [ ] Global styles: bg, typography, spacing
- [ ] Responsive navbar (logo + nav links + CTA button)

---

## Phase 2: Sections Build (Day 2-3)

### 2.1 Hero Section
- [ ] Full-width hero with gradient bg
- [ ] Headline + subheadline text
- [ ] CTA button ("Play Now" / "Join Waitlist")
- [ ] Floating farm elements (CSS animation)
- [ ] Responsive: stack on mobile

### 2.2 Features Section
- [ ] 6 feature cards (icon + title + desc)
- [ ] Grid layout: 3x2 (desktop), 2x3 (tablet), 1x6 (mobile)
- [ ] Hover animation on cards
- [ ] Section title + subtitle

### 2.3 How It Works
- [ ] 3-step flow with numbers/icons
- [ ] Vertical connector line between steps
- [ ] Illustration or icon per step
- [ ] CTA: "Start Farming"

### 2.4 $DREAM Token Section
- [ ] Token info card (name, symbol, utility)
- [ ] 3 earn methods (icons + desc)
- [ ] 3 spend methods (icons + desc)
- [ ] "Learn More" link placeholder
- [ ] Gradient bg accent

### 2.5 NFT Showcase
- [ ] 3-4 NFT preview cards (image + name + rarity)
- [ ] Rarity badge (common/rare/legendary)
- [ ] "Coming Soon" overlay or collection link
- [ ] Horizontal scroll on mobile

### 2.6 Roadmap
- [ ] Timeline layout (vertical on mobile, horizontal on desktop)
- [ ] 4 quarters with milestones
- [ ] Current quarter highlighted
- [ ] Connector line / dots

### 2.7 Community Section
- [ ] Social links (Twitter, Discord, Telegram)
- [ ] Icon buttons with hover effects
- [ ] Email signup form (UI only, no backend)
- [ ] Community stats placeholder

### 2.8 Footer
- [ ] Logo + copyright
- [ ] Footer links (Docs, Whitepaper, Terms, Privacy)
- [ ] Social icons
- [ ] Back to top button

---

## Phase 3: Polish & Animation (Day 4)

### 3.1 Animations
- [ ] Scroll-triggered fade-in (framer-motion)
- [ ] Hero parallax (subtle)
- [ ] Card hover lift + shadow
- [ ] Button press animation
- [ ] Floating elements continuous animation

### 3.2 Visual Polish
- [ ] Custom cursor (optional)
- [ ] Section dividers (wave, curve SVG)
- [ ] Background patterns (subtle farm icons)
- [ ] Gradient overlays
- [ ] Image optimization (WebP, lazy load)

### 3.3 Responsive QA
- [ ] Test 320px → 1440px
- [ ] Touch targets min 44px
- [ ] No horizontal overflow
- [ ] Font size readability
- [ ] CTA buttons accessible

---

## Phase 4: Deploy (Day 5)

### 4.1 Final QA
- [ ] Lighthouse audit (target: 95+)
- [ ] Cross-browser: Chrome, Firefox, Safari
- [ ] Link check (all CTAs work)
- [ ] Meta tags: title, description, OG image
- [ ] Favicon + app icons

### 4.2 SEO & Meta
- [ ] Page title: "Dream Farm Life — Farming Game on Solana"
- [ ] Meta description
- [ ] OG image (1200x630)
- [ ] Twitter card
- [ ] Structured data (optional)

### 4.3 Deploy
- [ ] Push to GitHub (same repo or new)
- [ ] Deploy to Vercel / Cloudflare Pages
- [ ] Custom domain: dreamfarmlife.com
- [ ] SSL certificate
- [ ] Redirect www → non-www (or vice versa)

---

## File Structure

```
landing-page/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── SectionTitle.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Token.tsx
│   │   ├── NFTShowcase.tsx
│   │   ├── Roadmap.tsx
│   │   └── Community.tsx
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Asset Needed

| Type | Count | Notes |
|------|-------|-------|
| Hero illustration | 1 | Farm scene, sunrise vibe |
| Feature icons | 6 | crop, animal, building, token, NFT, mobile |
| NFT preview images | 3-4 | land, cow, barn, rare crop |
| Step illustrations | 3 | connect wallet, farm, earn |
| Logo | 1 | Dream Farm Life logo |
| OG image | 1 | 1200x630 social preview |
| Favicon | 1 | 32x32 / 16x16 |
| Background patterns | 1-2 | subtle farm icons / texture |

---

## Timeline

| Day | Focus |
|-----|-------|
| 1 | Setup, layout, navbar |
| 2 | Hero, Features, How It Works |
| 3 | Token, NFT, Roadmap, Community, Footer |
| 4 | Animations, polish, responsive |
| 5 | QA, SEO, deploy |

**Total: ~5 days**

---

## Decisions (Locked)

- **React + Vite + Tailwind** — fast, familiar
- **Framer Motion** — scroll animations, hover effects
- **No backend** — static site, email form is UI-only
- **Mobile-first** — responsive from 320px up
- **Illustration-heavy** — warm, cozy farm aesthetic
