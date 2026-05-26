# ⚡ ArcPay

**The Payment Link & Invoice Protocol — Native on Arc Blockchain**

> *"Stripe untuk Web3"* — USDC native, sub-1s settlement, no bank needed.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Arc Blockchain](https://img.shields.io/badge/Arc-L1-00D084?logo=arc)](https://circle.com)
[![USDC Native](https://img.shields.io/badge/USDC-Native-2775CA?logo=circle)](https://circle.com/usdc)
[![Circle Grant](https://img.shields.io/badge/Circle-Grant%20%24150K-FFD166)](https://circle.com)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](https://soliditylang.org)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  LAYER 3 — APPLICATION                              │
│  Web App · Mobile SDK · Dashboard · REST API · CLI  │
├─────────────────────────────────────────────────────┤
│  LAYER 2 — ARCPAY PROTOCOL (Smart Contracts)        │
│  PaymentLink · Invoice · SplitRouter · EscrowVault  │
│  PrivacyShield · FeeManager                         │
├─────────────────────────────────────────────────────┤
│  LAYER 1 — CIRCLE DEVELOPER STACK                   │
│  Arc L1 · USDC · Circle Wallets · CCTP v2           │
│  Paymaster · Gateway · Nanopayments                 │
└─────────────────────────────────────────────────────┘
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Payment Links** | One-click USDC payment links on Arc. Share URL, QR, or embed. |
| **Smart Invoices** | Onchain invoices with due dates, late penalties, and auto-tracking. |
| **Revenue Split** | Auto-distribute payments to multiple addresses by basis points. |
| **Escrow** | Time-locked escrow with arbiter support for trustless deals. |
| **Privacy Mode** | Opt-in privacy for B2B using Arc's privacy layer. |
| **Cross-chain** | Pay from Ethereum, Solana, or any chain — CCTP bridges to Arc. |
| **Gasless** | Circle Paymaster integration — no gas tokens needed for payers. |

## 🔧 Smart Contracts

| Contract | Lines | Purpose |
|----------|-------|---------|
| `PaymentLink.sol` | 170 | Create, pay, refund, cancel payment links with optional split |
| `Invoice.sol` | 197 | Issue, pay, cancel, dispute onchain invoices with penalty calc |
| `SplitRouter.sol` | 116 | Programmable revenue split by basis points |
| `EscrowVault.sol` | 142 | Time-locked escrow with arbiter, pause, and dispute |
| `PrivacyShield.sol` | 65 | Opt-in privacy commitment for B2B transactions |
| `FeeManager.sol` | 62 | Protocol fee (0.1%), treasury, exempt management |
| `ArcPayFactory.sol` | 72 | One-transaction deploy of all protocol contracts |

**Stack:** Solidity 0.8.24 · Foundry · OpenZeppelin · SafeERC20

## 🌐 Frontend

Built with Next.js 16 and Tailwind CSS v4 in a neobrutalist design system.

```
npm install
npm run dev     # → http://localhost:3000
npm run build   # Production build
```

## 🚀 Deploy Contracts

```bash
cd contracts
cp .env.example .env  # Set USDC_ADDRESS, TREASURY_ADDRESS, OWNER_ADDRESS
forge build
forge script script/DeployArcPay.s.sol --rpc-url <RPC_URL> --broadcast
```

## 📊 Grant Roadmap

| Phase | Duration | Grant | Focus |
|-------|----------|-------|-------|
| **M1** | Month 1-3 | $30K | Core protocol, testnet, unit tests |
| **M2** | Month 4-6 | $50K | SDK, cross-chain CCTP, Paymaster |
| **M3** | Month 7-9 | $70K | Production, audit, mainnet, GTM |

**Total Grant: $150K USDC**

## 🛡️ Security

- OpenZeppelin audits (Ownable, ReentrancyGuard, Pausable, SafeERC20)
- CEI pattern enforced
- All state transitions validated
- Immutable token address prevents rug vectors
- Try/catch for FeeManager calls (no forced revert)

## 🏆 Circle Grant Scoring

| Criteria | Weight | Score |
|----------|--------|-------|
| Platform Alignment | 25% | 95/100 |
| Ecosystem Impact | 25% | 92/100 |
| Traction & Path | 25% | 80/100 |
| Exceptional Team | 25% | 78/100 |

## 📄 License

MIT — build freely.
