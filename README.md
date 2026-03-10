# Tokenized Micro Credit Pool

**Open-source template** to build a tokenization stack with **Stellar/Soroban**, **Trustless Work** (escrows), participation tokens, token sales, ROI vaults, and **Next.js** apps for issuers and investors.

Inspired by the [Tokenized Micro Credit Pool](https://www.notion.so/Tokenized-Micro-Credit-Pool-31982fc5f71e80ef8d1dfd4fb24610c4?source=copy_link) concept.

---

## Monorepo structure

| App | Description |
|-----|-------------|
| `apps/backoffice-tokenization` | Issuer console: escrows, tokenization, milestones, disputes |
| `apps/investor-tokenization` | Investor portal: buy tokens, holdings, claim ROI |
| `apps/smart-contracts` | Soroban contracts: escrow, Token Factory, Token Sale, Vault |

---

## What this template demonstrates

1. **Escrow** — Multi-release, milestones, approvals, disputes, and fund release (Trustless Work + Soroban).
2. **Tokenization** — Token deploy → primary sale → funds to escrow → milestones → returns to vault → investors claim ROI by balance.
3. **Frontends** — Backoffice (manage), Investor (invest & claim).

---

## Contracts (in `apps/smart-contracts`)

- **Escrow** — Multi-release, roles, disputes, approvals.
- **Token Factory** — Mint/burn participation tokens.
- **Token Sale** — Sell tokens for USDC and route to escrow.
- **Vault** — Returns and ROI claim by token holdings.

Includes tests and JSON snapshots.

---

## How to run

From the repo root (all apps):

```bash
npm install
npm run dev
```

Or a single app:

```bash
cd apps/<backoffice-tokenization|investor-tokenization|evidence-service>
npm install
npm run dev
```

---

## Environment variables (.env)

Each app has a `.env.example`. Copy it to `.env` or `.env.local` in that app’s directory and fill in the values. **Never commit `.env` or `.env.local`** (they are gitignored).

### Backoffice (`apps/backoffice-tokenization`)

| Variable | Description | Required |
|----------|-------------|----------|
| `SOURCE_SECRET` | Stellar secret key of the account that deploys contracts and signs transactions (issuer/backoffice). Used by deploy API routes. | Yes (for deploy) |
| `NEXT_PUBLIC_API_URL` | Base URL of the backoffice API when called from another origin. If unset, relative `/api` is used. | No |
| `NEXT_PUBLIC_API_KEY` | Trustless Work API key for Wallet Kit / Blocks. | Yes (for Trustless Work) |

### Investor (`apps/investor-tokenization`)

| Variable | Description | Required |
|----------|-------------|----------|
| `SOURCE_SECRET` | Stellar secret key for server-side deploy/signing (if using deploy from this app). | Only if using deploy |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Soroban RPC endpoint (e.g. `https://soroban-testnet.stellar.org`). | Yes |
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | Network passphrase (e.g. Test Net: `Test SDF Network ; September 2015`). | Yes |
| `NEXT_PUBLIC_DEFAULT_USDC_ADDRESS` | Contract ID of USDC on the chosen network (for token sale / payments). | Yes |
| `NEXT_PUBLIC_API_URL` | Base URL of the investor app API when called from another origin. | No |
| `NEXT_PUBLIC_API_KEY` | Trustless Work API key. | Yes (for Trustless Work) |

### Shared / packages

- `NEXT_PUBLIC_*` variables are exposed to the browser; use them only for non-secret config (RPC URL, network, contract IDs).
- Keep **secrets** (e.g. `SOURCE_SECRET`) only in server-side env; they are read in API routes (e.g. `route.ts`), not in client code.

---

## Tech stack

- **Next.js** (App Router), **Tailwind**, **ShadCN**
- **Trustless Work**: Wallet Kit, Blocks (escrow UI), API
- **Soroban** for contract calls

---

## Contributing

1. **Fork** the repository.
2. **Clone** your fork locally.
3. **Pick an issue** from the [project board](https://contribute.grantfox.xyz/issues?projectId=3be5edef-7cf3-4924-bfe7-2e56d57d9977) and coordinate with your **group lead** (assignee or maintainer).
4. Create a branch, implement the change, and run tests.
5. Open a **Pull Request** from your branch to the **`develop`** branch of the upstream repo.
6. In the PR description, **link the issue** (e.g. `Closes #123` or `Fixes #123`) so it is tracked and closed when the PR is merged.

We recommend discussing scope with your group lead before starting work to avoid duplicate effort.

---

## Intended use

For teams experimenting with tokenization, hackathons, RWA, or integrating Trustless Work. Fork, modify, and build your product.

**License:** MIT.
