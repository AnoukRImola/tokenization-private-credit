# Tokenization – Private Credit (Product vision)

**Product-level** document for private credit tokenization in the Trustless Work ecosystem. It is based on the official documentation and the capabilities implemented in this repository.

**Official reference:** [Tokenization - Private Credit \| Trustless Work Docs](https://docs.trustlesswork.com/trustless-work/oss-dapps/tokenization-private-credit)  
**Product video:** [Loom – Tokenization Private Credit](https://www.loom.com/share/08e5ef97f94f42d1b80bebac733a6383)

---

## 1. Vision and context

### What it is

**Tokenization - Private Credit** is the product flow that enables:

- Representing **participation in an escrow** (private credit / funded project) via on-chain **tokens**.
- **Investors** buying those tokens with USDC, with funds going to the project **escrow**.
- **Token holders** receiving **returns (ROI)** proportionally to their participation, through a **vault**.

All of this on **Stellar/Soroban**, using **Trustless Work escrows** as the source of truth for the project (milestones, releases, disputes).

### Problems it addresses

- **Opacity:** hard to know where capital is invested and how the project is executed.
- **Liquidity and traceability:** private credit participation is often not portable or auditable in a standard way.
- **Return distribution:** distributing benefits by participation manually is costly and error-prone.

### Value proposition

- **Transparency:** the escrow and milestones are visible; tokenization reflects one escrow per project.
- **Automation:** token purchase → funds to escrow; project execution → returns to vault → claim by token balance.
- **Standards alignment:** tokens compatible with the Stellar ecosystem (T-REX-aligned), Trustless Work escrows, reusable contracts.

---

## 2. Users and roles

| Role | Description | Main need |
|------|-------------|------------|
| **Issuer (Backoffice)** | Creates and manages the project, the escrow, and tokenization. | Manage escrows, tokenize an escrow, deploy token sale and vault, track milestones and releases. |
| **Investor** | Buys tokens with USDC and claims ROI; can browse projects and transparency in the same app. | View offerings, buy tokens, view balances, claim returns by participation, and check project status (milestones, escrow). |

---

## 3. Main journeys (product level)

### 3.1 Issuer: from escrow to token ready to sell

1. **Create and configure the escrow** (multi-release, milestones, roles) in Trustless Work.
2. **Tokenize the escrow:** specify which escrow to tokenize and define the token name and symbol. The system deploys:
   - A **token** (Token Factory) immutably linked to that escrow.
   - A **Token Sale** that receives USDC and sends funds to the escrow; only this contract can mint tokens.
3. **Optional:** deploy a **vault** to pool returns and let investors claim ROI.
4. From then on, investors can **buy tokens** (USDC → escrow) and, when a vault and returns exist, **claim ROI** according to their balance.

**Technical flow documentation:** [TOKENIZE-ESCROW.md](./TOKENIZE-ESCROW.md)

### 3.2 Investor: participate and earn returns

1. **Discover projects** (e.g. list of tokens/sales tied to escrows).
2. **Buy tokens:** send USDC to the Token Sale; receive tokens and USDC goes to the project escrow.
3. **View participation:** check **token balances** per project (read from Soroban storage, without calling the contract on every view).
4. **Claim ROI:** when the vault has returns, claim the share proportional to token balance.

**Technical balance documentation:** [TOKEN_BALANCE_SYSTEM.md](./TOKEN_BALANCE_SYSTEM.md)

### 3.3 Transparency: following the project

Project visibility is available from the **investor app** (project list, carousel with milestones and balances) and from Trustless Work/indexers:

1. View **escrow and milestone status** (Trustless Work and blocks integrated in the app).
2. View **project progress and updates** in the carousel and transparency views of the investor portal.
3. Understand the **lifecycle:** funding → execution → releases → returns (vault) → claims.

---

## 4. Product capabilities (summary)

- **Escrow tokenization:** one escrow → one token (configurable name and symbol), with exclusive mint via Token Sale.
- **Primary sale:** token purchase with USDC; funds routed to the project escrow.
- **Token balances:** balance reads from storage to show participation per project.
- **Token metadata:** name, symbol, decimals (and on-chain `escrow_id`) for identification and compliance.
- **Vault and ROI:** contract that accumulates returns and allows claim proportional to token balance.
- **Two main interfaces:** Backoffice (issuer) and Investor (investor and transparency).

---

## 5. Product constraints and rules

- **One token per escrow:** each token is immutably tied to an `escrow_id`; it is not reassigned.
- **Only Token Sale mints:** mint capability is fixed in the sale contract; the issuer cannot mint after deployment.
- **USDC as payment** for token purchase (defined in the Token Sale contract).
- **Network:** the template is currently aimed at **Soroban Testnet** (configurable via environment).

---

## 6. Additional resources

| Resource | Description |
|----------|-------------|
| [Trustless Work – Tokenization Private Credit](https://docs.trustlesswork.com/trustless-work/oss-dapps/tokenization-private-credit) | Official product documentation. |
| [Loom video – Tokenization Private Credit](https://www.loom.com/share/08e5ef97f94f42d1b80bebac733a6383) | Video walkthrough of the flow. |
| [TOKENIZE-ESCROW.md](./TOKENIZE-ESCROW.md) | Technical architecture of the tokenization flow (components, sequence, contracts). |
| [TOKEN_BALANCE_SYSTEM.md](./TOKEN_BALANCE_SYSTEM.md) | How token balances are read and displayed. |
| [Repository README](../README.md) | Monorepo structure, contracts, and apps. |

---

## 7. Short glossary

- **Escrow (Trustless Work):** custody contract with milestones, approvals, and releases; base of the funded project.
- **Token Factory:** participation token contract; metadata and mint authority are immutable.
- **Token Sale:** contract that sells tokens for USDC and sends USDC to the escrow; sole minter.
- **Vault:** contract that receives project returns and lets token holders claim ROI by balance.
- **Tokenization (of an escrow):** creating the Token + Token Sale pair for an escrow to enable participation purchase and fund routing.

---

*Product document. For implementation details and code paths, see the linked technical docs.*
