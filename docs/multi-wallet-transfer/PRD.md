# PRD: Multi-Wallet Cross-Chain Transfer App

**Project Name:** ChainBlast  
**Version:** 1.0  
**Date:** 2026-06-19  
**Author:** SUPERAGENT (for Fizz)  
**Status:** Draft

---

## 1. Executive Summary

ChainBlast adalah web3 app yang memungkinkan user mengirim 1 transaksi dari satu chain (misal ETH) ke banyak wallet di chain berbeda (SOL, ETH, BSC, BASE) secara otomatis. Tujuan: **percepat proses transfer massal antar wallet/chain**, hilangkan complexity manual bridge + distribute.

**Use case utama:**  
User punya 1 ETH → ingin split ke 10 wallet Solana dalam bentuk SOL → ChainBlast handle bridge + distribute dalam 1 klik.

---

## 2. Problem Statement

| Problem | Impact |
|---------|--------|
| Kirim crypto ke banyak wallet = transaksi manual per wallet | Wasted time, gas cost compounding |
| Cross-chain transfer = bridge manual + swap + distribute | 3-5 langkah per transfer, error-prone |
| Gas estimation beda tiap chain | User overpay atau tx gagal |
| Tidak ada tool untuk batch cross-chain transfer | Power user, DAOs, teams stuck doing it manually |

---

## 3. Target Users

| Segment | Description | Priority |
|---------|-------------|----------|
| **Crypto power users** | Individu yang sering distribute funds ke multiple wallets | P0 |
| **DAOs & Teams** | Payroll, bounty distribution cross-chain | P0 |
| **Airdrop farmers** | Distribute ke banyak wallet untuk farming | P1 |
| **On-ramp services** | Service yang perlu split deposit ke banyak tujuan | P1 |
| **Traders** | Distribute funds ke CEX/DEX di berbagai chain | P2 |

---

## 4. Supported Chains

| Chain | Chain ID | Native Token | RPC Standard |
|-------|----------|--------------|--------------|
| Ethereum | 1 | ETH | JSON-RPC |
| BSC | 56 | BNB | JSON-RPC |
| Base | 8453 | ETH | JSON-RPC |
| Solana | mainnet-beta | SOL | Solana JSON-RPC |

### Token Support (MVP)

| Chain | Native | USDC | USDT | Wrapped Native |
|-------|--------|------|------|----------------|
| ETH | ETH | USDC | USDT | WETH |
| BSC | BNB | USDC | USDT | WBNB |
| Base | ETH | USDC | USDT | WETH |
| SOL | SOL | USDC (native) | USDT | - |

---

## 5. Core Features

### 5.1 Single-TX Multi-Wallet Transfer

User input:
- **Source chain + token** (misal: ETH → ETH)
- **List destination wallets** (CSV / manual input / address book)
- **Amount per wallet** (fixed amount atau split equally)
- **Destination chain + token** (misal: SOL → SOL)

System output:
- 1 transaksi di source chain
- Automatic bridge + distribute di destination chain
- Semua wallet tujuan terima token yang benar

### 5.2 Multi-Chain Routing Engine

```
User: "Kirim 1 ETH dari Ethereum → split ke 5 wallet Solana (masing-masing dapat SOL)"

Engine:
1. Calculate: 1 ETH / 5 = 0.2 ETH per wallet
2. Estimate bridge fee (LI.FI / deBridge / Wormhole)
3. Estimate Solana distribute gas
4. Show preview: "Total received per wallet: ~X SOL (after fees)"
5. User confirms → execute
```

Routing modes:
- **Direct bridge + distribute** (1:N): Source → Bridge → Distribute on dest
- **Multi-bridge** (N:N): Split across multiple bridges for best rate
- **Sequential chain** (A→B→C): Intermediate chain routing (rare, for optimization)

### 5.3 Wallet Management

- **Address Book**: Save & label frequently used wallets
- **CSV Import**: Bulk import addresses (format: `address,amount,chain`)
- **ENS/SNS Resolution**: Support `.eth` and `.sol` domain resolution
- **Validation**: Pre-flight check for valid addresses per chain

### 5.4 Fee Management

- **Gas Estimation**: Real-time gas cost per chain before execution
- **Fee Token Selection**: Pay fees in source token (auto-deduct)
- **Slippage Control**: User-configurable slippage tolerance (0.1% - 5%)
- **Fee Summary**: Transparent breakdown before confirm

### 5.5 Transaction Management

- **Batch History**: Track all batch transfers
- **Status Tracking**: Real-time TX status per destination wallet
- **Retry Failed**: Re-execute failed distributions
- **Export**: CSV export for accounting/record

---

## 6. Technical Architecture

### 6.1 System Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Wallet   │  │ Transfer │  │ Address Book /    │  │
│  │ Connect  │  │ Builder  │  │ History           │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ API
┌──────────────────────▼──────────────────────────────┐
│                   BACKEND (Node.js/Fastify)          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Route Engine │  │ TX Manager   │  │ Quote     │  │
│  │ (bridge      │  │ (build,sign, │  │ Aggregator│  │
│  │  selection)  │  │  broadcast)  │  │           │  │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘  │
└─────────┼─────────────────┼───────────────┼────────┘
          │                 │               │
┌─────────▼─────────────────▼───────────────▼────────┐
│              BRIDGE / PROTOCOL LAYER                │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────────┐  │
│  │ LI.FI  │  │deBridge│  │Wormhole│  │ 1inch    │  │
│  │  SDK   │  │  SDK   │  │Connect │  │ Fusion+  │  │
│  └────────┘  └────────┘  └────────┘  └──────────┘  │
└────────────────────────────────────────────────────┘
          │                              │
┌─────────▼──────────┐    ┌──────────────▼──────────┐
│  EVM CHAINS        │    │  SOLANA                  │
│  ETH, BSC, BASE    │    │  mainnet-beta            │
│  (viem/ethers v6)  │    │  (@solana/kit)           │
└────────────────────┘    └─────────────────────────┘
```

### 6.2 Smart Contracts

#### EVM: MultiSend Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MultiSend is ReentrancyGuard {
    
    event BatchSent(
        address indexed sender,
        address indexed token,
        address[] recipients,
        uint256[] amounts,
        uint256 totalAmount
    );

    /// @notice Send ETH to multiple recipients in one tx
    function sendETH(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        payable 
        nonReentrant 
    {
        require(recipients.length == amounts.length, "Length mismatch");
        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");
        }
        require(msg.value == total, "Value mismatch");
        emit BatchSent(msg.sender, address(0), recipients, amounts, total);
    }

    /// @notice Send ERC-20 to multiple recipients in one tx
    function sendToken(
        address token,
        address[] calldata recipients, 
        uint256[] calldata amounts
    ) external nonReentrant {
        require(recipients.length == amounts.length, "Length mismatch");
        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
            // transfer via safeTransfer pattern
            (bool success, ) = token.call(
                abi.encodeWithSignature(
                    "transfer(address,uint256)", 
                    recipients[i], 
                    amounts[i]
                )
            );
            require(success, "Token transfer failed");
        }
        emit BatchSent(msg.sender, token, recipients, amounts, total);
    }

    /// @notice Bridge + distribute: call bridge, then distribute on dest
    /// @dev This is a template — actual bridge calldata varies per protocol
    function bridgeAndDistribute(
        address bridgeAdapter,
        bytes calldata bridgeCalldata,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable nonReentrant {
        // 1. Execute bridge call
        (bool bridgeSuccess, ) = bridgeAdapter.call{value: msg.value}(bridgeCalldata);
        require(bridgeSuccess, "Bridge failed");
        
        // Note: Distribution on destination chain happens via
        // bridge callback / relayer / separate tx
        // See Section 6.2.2 for cross-chain distribution pattern
    }
}
```

#### Solana: Batch Transfer Program (Anchor)

```rust
use anchor_lang::prelude::*;

declare_id!("BatchTransferProgram1111111111111111111111");

#[program]
pub mod batch_transfer {
    use super::*;

    /// Transfer SOL to multiple recipients in one tx
    pub fn batch_sol_transfer(
        ctx: Context<BatchSolTransfer>,
        amounts: Vec<u64>,
    ) -> Result<()> {
        let recipients = &ctx.remaining_accounts;
        require!(
            recipients.len() == amounts.len(), 
            BatchError::LengthMismatch
        );

        let total: u64 = amounts.iter().sum();
        require!(
            ctx.accounts.sender.lamports() >= total,
            BatchError::InsufficientFunds
        );

        for (i, recipient) in recipients.iter().enumerate() {
            let ix = anchor_lang::solana_program::system_instruction::transfer(
                ctx.accounts.sender.key,
                recipient.key,
                amounts[i],
            );
            anchor_lang::solana_program::program::invoke(
                &ix,
                &[
                    ctx.accounts.sender.to_account_info(),
                    recipient.to_account_info(),
                ],
            )?;
        }

        emit!(BatchSolSent {
            sender: ctx.accounts.sender.key(),
            total,
            count: recipients.len() as u64,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct BatchSolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>,
    system_program: Program<'info, System>,
}

#[event]
pub struct BatchSolSent {
    pub sender: Pubkey,
    pub total: u64,
    pub count: u64,
}

#[error_code]
pub enum BatchError {
    #[msg("Recipients and amounts length mismatch")]
    LengthMismatch,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}
```

### 6.3 Cross-Chain Distribution Patterns

| Pattern | Description | Trust Model | Latency |
|---------|-------------|-------------|---------|
| **Bridge + Relayer** | Bridge to single dest address, relayer distributes | Semi-trusted (relayer) | 2-10 min |
| **Bridge + Direct** | Bridge N times to N addresses directly | Trustless | 2-10 min × N |
| **Bridge + Smart Contract** | Bridge to contract on dest, contract auto-distributes | Trustless | 2-15 min |
| **Solver Network** | deBridge DLN / 1inch Fusion+ — solver fills on dest | Semi-trusted (solver) | 30s-5 min |

**Recommended MVP: Bridge + Relayer pattern**  
- User sends source tx with recipient list encoded in memo/calldata
- Backend relayer monitors bridge completion on dest chain
- Relayer executes batch transfer on dest chain
- Gas cost deducted from bridge amount

### 6.4 Bridge Protocol Comparison

| Protocol | Chains | Speed | Fee | SDK | Best For |
|----------|--------|-------|-----|-----|----------|
| **LI.FI** | 25+ EVM + SOL | 2-10 min | Variable | JS/TS SDK | Best aggregator, routes across 15+ bridges |
| **deBridge DLN** | ETH/BSC/SOL/ARB + more | 30s-3 min | 0.3-0.5% | JS SDK | Fastest, solver-based |
| **Wormhole** | ETH/SOL/BSC + 20+ | 5-15 min | Low | Connect SDK | Most battle-tested |
| **1inch Fusion+** | EVM chains | 30s-2 min | Gas only | API | Best rates for EVM↔EVM |
| **Across** | EVM (no SOL) | 1-5 min | 0.06-0.12% | SDK | Cheapest EVM↔EVM |

**Recommended: LI.FI as primary aggregator** (covers all 4 target chains + auto-selects best bridge)

---

## 7. User Flow

### 7.1 Simple Flow: ETH → Multiple SOL Wallets

```
Step 1: Connect wallet (MetaMask / Phantom / WalletConnect)
Step 2: Select source chain (Ethereum) + token (ETH)
Step 3: Enter amount (1 ETH)
Step 4: Select destination chain (Solana) + token (SOL)
Step 5: Add recipients
  ├── Manual: paste addresses (one per line)
  ├── CSV: upload .csv file
  └── Address book: select from saved
Step 6: Choose split mode
  ├── Equal split: 1 ETH / 5 wallets = 0.2 ETH each
  └── Custom: set amount per wallet
Step 7: Preview
  ├── Bridge fee: ~$X
  ├── Gas (source): ~$X
  ├── Gas (dest): ~$X (deducted from amount)
  ├── Slippage: X%
  └── Total received per wallet: ~Y SOL
Step 8: Confirm → sign TX in wallet
Step 9: Track progress
  ├── TX submitted ✓
  ├── Bridge processing... ⏳
  ├── Bridged to Solana ✓
  ├── Distributing to wallets... ⏳
  └── All wallets received ✓
```

### 7.2 Advanced Flow: Multi-Source Multi-Dest

```
Input:
  Source 1: 0.5 ETH on Ethereum
  Source 2: 2 BNB on BSC
  Destination: 
    - Wallet A: 0.3 ETH on Base
    - Wallet B: 1 BNB on BSC
    - Wallet C: 5 SOL on Solana
    - Wallet D: 0.2 ETH on Ethereum

Engine:
  Route 1: ETH→Base (Across) → Wallet A
  Route 2: BNB stays on BSC → Wallet B (direct)
  Route 3: ETH→SOL (LI.FI→deBridge) → Wallet C
  Route 4: ETH stays on ETH → Wallet D (direct)
```

---

## 8. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Transfer latency (same-chain) | < 30 seconds |
| Transfer latency (cross-chain) | < 15 minutes |
| Max recipients per TX | 200 (EVM), 20 (Solana) |
| Uptime | 99.5% |
| Error rate | < 1% of transfers |
| Frontend load time | < 3 seconds |
| Gas estimation accuracy | ±5% |

---

## 9. Security Considerations

| Risk | Mitigation |
|------|------------|
| Smart contract vulnerability | Audit before mainnet, use battle-tested patterns |
| Private key exposure | Never handle keys server-side, wallet-only signing |
| Bridge exploit | Use aggregator (LI.FI) — auto-routes away from compromised bridges |
| Frontend attack (DNS/CDN) | CSP headers, SRI, domain lock |
| Relayer centralization | Multi-relayer setup, fallback to manual |
| MEV / sandwich | Use private mempool (Flashbots Protect) for EVM TXs |
| Phishing | ENS/domain verification, no seed phrase collection |

---

## 10. Success Metrics

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Total transfers processed | 10,000+ |
| Total volume | $5M+ |
| Unique wallets | 1,000+ |
| Avg transfer time | < 5 min |
| Failed transfer rate | < 2% |
| User retention (monthly) | 30%+ |

---

## 11. Out of Scope (v1.0)

- ❌ Fiat on/off ramp
- ❌ Limit orders / DCA
- ❌ NFT batch transfer
- ❌ Cross-chain smart contract calls (only transfers)
- ❌ Mobile app (web-only for MVP)
- ❌ Non-EVM non-Solana chains (Tron, TON, etc.)

---

## 12. Dependencies

| Dependency | Purpose | License |
|------------|---------|---------|
| LI.FI SDK | Bridge aggregation | MIT |
| viem | EVM interactions | MIT |
| @solana/kit | Solana interactions | Apache 2.0 |
| Next.js 15 | Frontend | MIT |
| Fastify | Backend API | MIT |
| PostgreSQL | Order/history storage | PostgreSQL |
| Redis | Quote caching, rate limiting | BSD |

---

## 13. Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Foundation** | 3 weeks | Smart contracts, basic frontend, single-chain batch |
| **Phase 2: Cross-Chain** | 3 weeks | LI.FI integration, bridge + distribute, EVM↔EVM |
| **Phase 3: Solana** | 2 weeks | Solana support, SOL/USDC transfers |
| **Phase 4: Polish** | 2 weeks | Address book, history, CSV import, error handling |
| **Phase 5: Launch** | 1 week | Audit, testnet beta, mainnet launch |

**Total: ~11 weeks**

---

## Appendix A: API Endpoints

```
POST   /api/v1/transfer/quote        — Get transfer quote
POST   /api/v1/transfer/build        — Build TX calldata
POST   /api/v1/transfer/execute      — Execute via relayer (optional)
GET    /api/v1/transfer/:id/status   — Check transfer status
GET    /api/v1/transfer/history      — User transfer history

POST   /api/v1/address-book          — Save address
GET    /api/v1/address-book          — List addresses
DELETE /api/v1/address-book/:id      — Delete address

GET    /api/v1/chains                — List supported chains
GET    /api/v1/tokens?chain=eth      — List tokens per chain
GET    /api/v1/gas/estimate          — Estimate gas cost
```

## Appendix B: CSV Format

```csv
address,amount,chain
0x1234...abcd,0.2,ethereum
5FHwk...9jBk,0.5,solana
0xABCD...5678,0.1,base
```

## Appendix C: Environment Variables

```env
# RPC
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
BSC_RPC_URL=https://bsc-dataseed.binance.org
BASE_RPC_URL=https://mainnet.base.org
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Bridge
LIFI_API_KEY=your_lifi_api_key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/chainblast
REDIS_URL=redis://localhost:6379

# Relayer
RELAYER_PRIVATE_KEY=0x...  # For automated distribution on dest chain
RELAYER_SOLANA_KEYPAIR=[...]  # Solana keypair for distribution

# App
NEXT_PUBLIC_APP_URL=https://chainblast.app
API_SECRET_KEY=your_random_secret
```
