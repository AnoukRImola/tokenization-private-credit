# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for a tokenization platform built on Stellar/Soroban with Trustless Work escrow integration. Two Next.js frontends (issuer backoffice + investor portal), a NestJS backend, and Soroban smart contracts.

## Commands

### Root (Turborepo)
```bash
npm run dev          # Start all apps (backoffice:3000, investor:3001, core:4000)
npm run build        # Build all apps
npm run lint         # Lint all apps
npm run test         # Run all tests
```

### Core API (`apps/core`)
```bash
cd apps/core
npm run start:dev          # NestJS watch mode
npm run test               # Unit tests (Jest)
npm run test:e2e           # E2E tests
npm run prisma:generate    # Generate Prisma client after schema changes
npm run prisma:migrate     # Create/run migrations
npm run prisma:push        # Push schema directly (dev only)
npm run prisma:studio      # Visual DB browser
```

### Smart Contracts (`apps/smart-contracts`)
```bash
cd apps/smart-contracts
cargo build --release      # Build all contracts
cargo test                 # Run contract tests
```

### Single app dev
```bash
npx turbo run dev --filter=backoffice-tokenization   # Just backoffice
npx turbo run dev --filter=investor-tokenization      # Just investor
npx turbo run dev --filter=core                       # Just backend
```

## Architecture

### Monorepo Layout
- **`apps/backoffice-tokenization`** — Next.js 16 (App Router, port 3000). Issuer console: campaign management, token factory deployment, vault creation, escrow lifecycle.
- **`apps/investor-tokenization`** — Next.js 16 (App Router, port 3001). Investor portal: token purchase, portfolio view, ROI claiming.
- **`apps/core`** — NestJS 11 backend (port 4000). REST API with Prisma + PostgreSQL. Modules: Campaigns, Investments, Deploy, Soroban.
- **`apps/smart-contracts`** — Soroban Rust contracts (Cargo workspace): token-factory, participation-token, vault-contract, escrow.
- **`packages/ui`** — Shared ShadCN/Radix component library. Import via `@repo/ui/button`, `@repo/ui/card`, etc.
- **`packages/shared`** — Shared utilities and transaction service.
- **`packages/tw-blocks-shared`** — Trustless Work integration, wallet provider, escrow context/dialogs.
- **`packages/config`** — Shared TypeScript/ESLint configuration.

### Backend Pattern (NestJS)
Clean Architecture: Controllers → Services → PrismaService → PostgreSQL. Business logic lives in Services only. Controllers handle HTTP concerns (params, delegation, response). Use NestJS exceptions (`NotFoundException`, `ForbiddenException`, etc.) for errors.

### Frontend Pattern (Next.js)
Feature-based folder structure (`src/features/`). Providers wrap the app: ReactQuery, TrustlessWork, Wallet, Escrow. Soroban interactions go through API routes that build transactions server-side (`src/lib/sorobanClient.ts`).

### Database
Prisma schema at `apps/core/prisma/schema.prisma`. Models: Campaign (with status enum: DRAFT, ACTIVE, FUNDED, PAUSED, CLOSED) and Investment. UUIDs for PKs, timestamps on all models.

### Smart Contracts
Four Soroban contracts sharing `soroban-sdk 23.1.1`. Build with `cargo build --release` (LTO enabled). Tests in each contract's `src/test.rs`.

## Conventions

- **TypeScript strict mode** — never use `any`, use `unknown` + type narrowing
- **DTOs** use `class-validator` + `class-transformer` decorators
- **Tests** live next to source files (`*.spec.ts`). Mock all dependencies, never use real DB.
- Path alias `@/*` maps to `./src/*` in both Next.js apps
- Package manager: **npm** (v10.2.3). Do not use yarn or pnpm.
- React 19 with React Compiler enabled

## Environment Variables

Each app has a `.env.example`. Key vars:
- **Frontend apps**: `NEXT_PUBLIC_API_KEY`, `NEXT_PUBLIC_API_URL`, `SOURCE_SECRET`, `NEXT_PUBLIC_SOROBAN_RPC_URL`, `NEXT_PUBLIC_DEFAULT_USDC_ADDRESS`
- **Core**: `DATABASE_URL`, `PORT`, `SOURCE_SECRET`, `SOROBAN_RPC_URL`, `USDC_CONTRACT_ID`, `*_WASM_HASH` (contract hashes)
