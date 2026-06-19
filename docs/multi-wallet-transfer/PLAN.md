# PLAN: Multi-Wallet Cross-Chain Transfer App (ChainBlast)

**Version:** 1.0  
**Date:** 2026-06-19  
**Status:** Ready for Execution  
**Estimated Duration:** 11 weeks (solo) / 6 weeks (team of 2-3)

---

## 1. Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Bridge aggregator | **LI.FI** | Covers ETH/BSC/Base/SOL, 15+ bridges, best rate routing |
| EVM library | **viem v2** | Modern, tree-shakeable, TypeScript-first |
| Solana SDK | **@solana/kit** | Official, future-proof (replaces legacy @solana/web3.js) |
| Frontend | **Next.js 15 (App Router)** | SSR, React Server Components, Edge API routes |
| Backend | **Fastify** | Fast, TypeScript native, good plugin ecosystem |
| Smart contracts | **Solidity 0.8.24 + Anchor** | Industry standard |
| Database | **PostgreSQL** | Relational data, JSONB for flexible metadata |
| Cache | **Redis** | Quote caching (TTL 30s), rate limiting |
| Auth | **Sign-In with Ethereum (SIWE)** | No password, wallet-based auth |
| Deployment | **Vercel (frontend) + Railway (backend)** | Fast deploy, good DX |
| Contract deployment | **Foundry (EVM) + Anchor CLI (Solana)** | Best tooling |

---

## 2. Project Structure

```
chainblast/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── transfer/
│   │   │   │   ├── page.tsx          # Transfer builder
│   │   │   │   └── [id]/page.tsx     # Transfer status
│   │   │   ├── address-book/
│   │   │   │   └── page.tsx          # Manage addresses
│   │   │   └── history/
│   │   │       └── page.tsx          # Transfer history
│   │   ├── components/
│   │   │   ├── WalletProvider.tsx    # Wagmi + Solana wallet adapter
│   │   │   ├── TransferForm.tsx      # Main transfer form
│   │   │   ├── RecipientList.tsx     # Add/edit recipients
│   │   │   ├── FeeBreakdown.tsx      # Fee preview
│   │   │   ├── TxStatus.tsx          # Real-time TX tracker
│   │   │   └── AddressBook.tsx       # Address book UI
│   │   ├── hooks/
│   │   │   ├── useTransfer.ts        # Transfer logic
│   │   │   ├── useQuote.ts           # Bridge quote hook
│   │   │   └── useAddressBook.ts     # Address book CRUD
│   │   └── lib/
│   │       ├── chains.ts             # Chain config
│   │       ├── lifi.ts               # LI.FI client wrapper
│   │       └── api.ts                # Backend API client
│   │
│   └── api/                          # Fastify backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── transfer.ts       # Transfer endpoints
│       │   │   ├── addressBook.ts    # Address book endpoints
│       │   │   └── chains.ts         # Chain/token info
│       │   ├── services/
│       │   │   ├── quoteService.ts   # Quote aggregation
│       │   │   ├── routeService.ts   # Route optimization
│       │   │   ├── txService.ts      # TX building & tracking
│       │   │   └── relayerService.ts # Auto-distribution on dest
│       │   ├── bridges/
│       │   │   ├── lifi.ts           # LI.FI integration
│       │   │   └── types.ts          # Bridge type definitions
│       │   ├── chains/
│       │   │   ├── evm.ts            # EVM chain utilities
│       │   │   └── solana.ts         # Solana chain utilities
│       │   └── db/
│       │       ├── schema.ts         # Drizzle schema
│       │       └── migrations/       # DB migrations
│       └── package.json
│
├── contracts/
│   ├── evm/
│   │   ├── src/
│   │   │   └── MultiSend.sol         # Batch transfer contract
│   │   ├── test/
│   │   │   └── MultiSend.t.sol       # Foundry tests
│   │   ├── script/
│   │   │   └── Deploy.s.sol          # Deploy script
│   │   └── foundry.toml
│   │
│   └── solana/
│       ├── programs/
│       │   └── batch_transfer/
│       │       └── src/lib.rs        # Anchor program
│       ├── tests/
│       │   └── batch_transfer.ts     # Anchor tests
│       └── Anchor.toml
│
├── packages/
│   ├── shared/                       # Shared types & utils
│   │   ├── types.ts                  # Common types
│   │   ├── constants.ts              # Chain IDs, addresses
│   │   └── validation.ts             # Zod schemas
│   └── config/                       # Shared configs
│       ├── eslint/
│       └── typescript/
│
├── docker-compose.yml                # Local dev (Postgres + Redis)
├── turbo.json                        # Turborepo config
├── package.json
└── README.md
```

---

## 3. Phase Breakdown

### Phase 1: Foundation (Week 1-3)

**Goal:** Single-chain batch transfer working on EVM testnet.

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 1.1 | Monorepo setup (Turborepo + workspaces) | Dev | 2h | Working monorepo |
| 1.2 | MultiSend.sol: ETH + ERC-20 batch transfer | Dev | 1d | Contract + tests |
| 1.3 | Foundry test suite (fuzz + invariant) | Dev | 0.5d | 100% test coverage |
| 1.4 | Deploy to Sepolia + verify on Etherscan | Dev | 0.5d | Verified contract |
| 1.5 | Next.js app scaffold + wallet connect (Wagmi) | Dev | 1d | Connect MetaMask/Rabby |
| 1.6 | Transfer form UI (source chain, amount, recipients) | Dev | 1d | Working form |
| 1.7 | Quote service: gas estimation for batch TX | Dev | 1d | Accurate gas quotes |
| 1.8 | TX builder: encode batch transfer calldata | Dev | 0.5d | Build TX from form data |
| 1.9 | Execute transfer on Sepolia | Dev | 0.5d | End-to-end testnet transfer |
| 1.10 | PostgreSQL schema + Drizzle ORM setup | Dev | 0.5d | DB migrations |
| 1.11 | Transfer history API + UI | Dev | 1d | View past transfers |
| 1.12 | Error handling + TX status tracking | Dev | 1d | Robust error states |

**Phase 1 Exit Criteria:**
- ✅ Send ETH to 10 wallets on Sepolia in 1 TX
- ✅ Send ERC-20 (USDC) to 10 wallets on Sepolia in 1 TX
- ✅ Gas estimation within ±10% of actual
- ✅ Transfer history saved and viewable

---

### Phase 2: Cross-Chain EVM (Week 4-6)

**Goal:** Cross-chain transfers between ETH/BSC/Base using LI.FI.

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 2.1 | LI.FI SDK integration + API key setup | Dev | 0.5d | Working SDK client |
| 2.2 | Quote service: cross-chain quote from LI.FI | Dev | 1d | Multi-bridge quotes |
| 2.3 | Route optimizer: select best bridge by fee/speed | Dev | 1d | Auto-select optimal route |
| 2.4 | TX builder: LI.FI route → executable calldata | Dev | 1d | Build bridge TX |
| 2.5 | Relayer service: monitor bridge completion | Dev | 2d | Detect when bridge completes |
| 2.6 | Auto-distribute on destination chain | Dev | 1d | Batch transfer on dest |
| 2.7 | Cross-chain transfer form UI | Dev | 1d | Source → Dest chain selector |
| 2.8 | Fee breakdown: bridge fee + gas (src) + gas (dest) | Dev | 1d | Transparent fee UI |
| 2.9 | Transfer status: pending → bridging → distributing → done | Dev | 1d | Real-time status |
| 2.10 | End-to-end test: ETH → Base (multi-wallet) | Dev | 0.5d | Working cross-chain |
| 2.11 | End-to-end test: BSC → ETH (multi-wallet) | Dev | 0.5d | Working cross-chain |

**Phase 2 Exit Criteria:**
- ✅ Send 0.1 ETH from Ethereum → 5 wallets on Base (receive ETH)
- ✅ Send 0.1 BNB from BSC → 5 wallets on Ethereum (receive ETH)
- ✅ Best route auto-selected by LI.FI
- ✅ Fee breakdown shown before confirm
- ✅ Status tracking works end-to-end

---

### Phase 3: Solana Support (Week 7-8)

**Goal:** SOL transfers + cross-chain to/from Solana.

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 3.1 | Anchor program: batch SOL transfer | Dev | 1d | On-chain program |
| 3.2 | Anchor program: batch SPL token transfer | Dev | 1d | USDC/USDT support |
| 3.3 | Deploy to Solana mainnet | Dev | 0.5d | Live program |
| 3.4 | Solana wallet integration (Phantom, Solflare) | Dev | 1d | Connect Solana wallets |
| 3.5 | Solana TX builder: build batch transfer IXs | Dev | 1d | Build Solana TXs |
| 3.6 | LI.FI Solana bridge integration | Dev | 1d | Cross-chain SOL quotes |
| 3.7 | Cross-chain: EVM → Solana (ETH → SOL wallets) | Dev | 1.5d | Working EVM→SOL |
| 3.8 | Cross-chain: Solana → EVM (SOL → ETH wallets) | Dev | 1d | Working SOL→EVM |
| 3.9 | Multi-chain transfer form update | Dev | 0.5d | SOL in chain selector |
| 3.10 | End-to-end test: ETH → multi SOL wallets | Dev | 0.5d | Full flow working |

**Phase 3 Exit Criteria:**
- ✅ Send SOL to 10 wallets in 1 TX
- ✅ Send USDC (SPL) to 10 wallets in 1 TX
- ✅ ETH → SOL cross-chain batch transfer works
- ✅ SOL → ETH cross-chain batch transfer works

---

### Phase 4: Polish & Features (Week 9-10)

**Goal:** Production-ready UX, address book, CSV import.

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 4.1 | Address book: save, edit, delete, label addresses | Dev | 1d | Full CRUD |
| 4.2 | ENS resolution (address book + manual input) | Dev | 0.5d | .eth names work |
| 4.3 | SNS resolution (.sol domains) | Dev | 0.5d | .sol names work |
| 4.4 | CSV import: upload, validate, preview | Dev | 1d | Bulk import recipients |
| 4.5 | CSV export: download transfer history | Dev | 0.5d | Accounting-ready export |
| 4.6 | Recipient validation: checksum, format, known scam | Dev | 0.5d | Prevent bad sends |
| 4.7 | Gas optimization: multicall pattern for EVM | Dev | 1d | Lower gas costs |
| 4.8 | Slippage settings UI | Dev | 0.5d | User-configurable |
| 4.9 | Dark mode + responsive design | Dev | 1d | Mobile-friendly |
| 4.10 | Loading states, skeleton screens, animations | Dev | 0.5d | Polish UX |
| 4.11 | Error recovery: retry failed distributions | Dev | 1d | Handle failures |
| 4.12 | SIWE authentication | Dev | 0.5d | Wallet-based auth |

**Phase 4 Exit Criteria:**
- ✅ Address book saves and loads correctly
- ✅ CSV import with 100+ addresses works
- ✅ All inputs validated before TX
- ✅ Mobile responsive
- ✅ Failed transfers recoverable

---

### Phase 5: Launch (Week 11)

**Goal:** Audit, testnet beta, mainnet launch.

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 5.1 | Smart contract audit (EVM) | Auditor | 3d | Audit report |
| 5.2 | Smart contract audit (Solana) | Auditor | 2d | Audit report |
| 5.3 | Fix audit findings | Dev | 1d | Patches applied |
| 5.4 | Testnet beta: invite-only testing | Dev + testers | 3d | Bug reports |
| 5.5 | Fix critical bugs from beta | Dev | 1d | Patches |
| 5.6 | Production deploy (Vercel + Railway) | Dev | 0.5d | Live app |
| 5.7 | Domain setup + SSL | Dev | 0.5d | chainblast.app live |
| 5.8 | Monitoring: Sentry + Grafana + PagerDuty | Dev | 0.5d | Alerting |
| 5.9 | Documentation: user guide + API docs | Dev | 1d | Docs site |
| 5.10 | Launch announcement (Twitter, Discord) | Marketing | 0.5d | 🚀 Live! |

**Phase 5 Exit Criteria:**
- ✅ Smart contracts audited
- ✅ No P0 bugs in beta
- ✅ Monitoring active
- ✅ Public launch

---

## 4. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| LI.FI API downtime | Low | High | Fallback to direct bridge APIs (Wormhole, Across) |
| Bridge exploit mid-transfer | Low | Critical | LI.FI auto-routes away; circuit breaker in backend |
| Solana congestion | Medium | Medium | Priority fee estimation; retry logic |
| High gas on Ethereum | High | Medium | Recommend Base/BSC for small amounts; gas warnings |
| Smart contract bug | Low | Critical | Audit + formal verification + bug bounty |
| Regulatory (bridge compliance) | Low | Medium | No custody; non-custodial by design |
| Relayer downtime | Medium | High | Multi-relayer; fallback to manual claim |

---

## 5. Cost Estimate

### Development (11 weeks solo)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Vercel Pro | $20 | Frontend hosting |
| Railway | $10-50 | Backend + DB + Redis |
| Domain | $12/year | chainblast.app |
| LI.FI API | Free tier → $199/mo | 10K quotes/month free |
| Alchemy/Infura | Free tier → $49/mo | RPC access |
| Sentry | Free tier | Error monitoring |
| **Total** | **~$50-300/mo** | Scales with usage |

### Per-Transfer Cost (passed to user)

| Component | Cost | Paid By |
|-----------|------|---------|
| Source chain gas | Variable (ETH: ~$2-10, BSC: ~$0.10) | User |
| Bridge fee | 0.05-0.5% of amount | User (deducted) |
| Dest chain gas | Variable (SOL: ~$0.001, Base: ~$0.01) | User (deducted) |
| Protocol fee | 0.1-0.3% | User (optional, for revenue) |

---

## 6. Testing Strategy

### Unit Tests
- Smart contract: Foundry fuzz + invariant tests
- Backend: Vitest for services
- Frontend: React Testing Library for components

### Integration Tests
- LI.FI API: mock responses + real testnet quotes
- EVM chains: Hardhat fork for local testing
- Solana: solana-test-validator for local testing

### E2E Tests
- Playwright: full user flow on testnet
- Manual: real cross-chain transfers with small amounts

### Load Testing
- k6: 100 concurrent quote requests
- Artillery: API endpoint stress test

---

## 7. Deployment Architecture

```
┌─────────────────────────────────────────────┐
│                  CDN (Vercel)                │
│         Frontend + Edge API Routes          │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Railway (Backend)               │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Fastify  │  │ Relayer  │  │ Cron Jobs │  │
│  │ API      │  │ Workers  │  │ (cleanup) │  │
│  └──────────┘  └──────────┘  └───────────┘  │
│  ┌──────────┐  ┌──────────┐                  │
│  │ Postgres │  │  Redis   │                  │
│  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Blockchain RPCs                 │
│  Alchemy (ETH)  QuickNode (BSC/SOL)  Base   │
└─────────────────────────────────────────────┘
```

---

## 8. Go-To-Market

| Channel | Action | Timeline |
|---------|--------|----------|
| Twitter/X | Thread: "How we built ChainBlast" | Launch day |
| Crypto Discord servers | Share in dev/trading channels | Week 1 |
| Mirror/Medium | Technical blog post | Week 2 |
| Product Hunt | Launch listing | Week 3 |
| DeFi Llama | List under bridge aggregators | Ongoing |
| Word of mouth | DAO communities, airdrop groups | Ongoing |

---

## 9. Future Roadmap (Post v1.0)

| Feature | Priority | Complexity |
|---------|----------|------------|
| Mobile app (React Native) | P1 | High |
| NFT batch transfer | P1 | Medium |
| Limit orders (swap at target price) | P2 | High |
| Cross-chain swaps (not just transfers) | P1 | High |
| API for developers (embed in other apps) | P1 | Medium |
| Multisig support (Safe) | P2 | Medium |
| Additional chains (Polygon, Avalanche, Arbitrum, Optimism) | P1 | Low |
| Fiat on-ramp (MoonPay/Transak) | P2 | Medium |
| Telegram bot interface | P1 | Medium |
| Batch scheduling (recurring transfers) | P2 | High |

---

## 10. Definition of Done

A feature is DONE when:
- [ ] Code written + reviewed
- [ ] Tests passing (unit + integration)
- [ ] Deployed to staging
- [ ] Manual QA on testnet
- [ ] Documentation updated
- [ ] No P0/P1 bugs

Project is DONE when:
- [ ] All 5 phases complete
- [ ] Smart contracts audited
- [ ] Production deployment stable for 1 week
- [ ] 100+ successful transfers processed
- [ ] Monitoring + alerting active
- [ ] User documentation complete
