# Token Balance System Documentation

This document explains how the token balance reading system works in the investor tokenization application. The system reads Soroban token balances directly from contract storage, similar to how Stellar Expert displays token balances.

## Overview

The token balance system allows users to view their token holdings across different investment projects. It reads balances directly from Soroban contract storage using the Stellar RPC, without requiring contract function calls.

## Architecture

### Components

All paths below are relative to `apps/investor-tokenization/`.

1. **API Endpoints** (`src/app/api/`)
   - `src/app/api/token-balance/route.ts` — Reads token balance (simulation first, then storage fallback)
   - `src/app/api/token-metadata/route.ts` — Fetches token metadata (name, symbol, decimals) via simulation

2. **Services** (`src/features/investments/services/`)
   - `InvestmentService` — Client-side service for API communication (`investment.service.ts`)

3. **Hooks** (`src/features/investments/hooks/`)
   - `useUserInvestments` — Fetches user's investments with balance > 0

4. **Components**
   - `src/features/investments/components/` — `InvestmentCard`
   - `src/features/transparency/` — `ProjectList` (no dedicated carousel component)

## How Token Balance Reading Works

The API uses a **two-step strategy**:

1. **Preferred: contract function call** — Simulate the standard `balance(address)` call (TokenInterface). If the contract exposes `balance()` and the simulation succeeds, the result is returned.
2. **Fallback: direct storage read** — If the function call fails (e.g. non-existent function or simulation error), the handler reads the balance from the contract’s persistent storage using the same key structure as Stellar Expert.

This way the system works with both Stellar Asset Contracts (SAC) and custom Token Factory contracts that store balances under `DataKey::Balance(address)`.

### Storage Structure

Soroban tokens store balances in **persistent storage** using a key-value structure:

```rust
// Storage key structure
enum DataKey {
    Allowance(AllowanceDataKey),  // Variant index: 0
    Balance(Address),              // Variant index: 1
    State(Address),                // Variant index: 2
    Admin,                         // Variant index: 3
}
```

The balance for a user is stored with:
- **Key**: `DataKey::Balance(userAddress)` 
- **Value**: `i128` (the raw balance amount)
- **Durability**: Persistent storage

### Storage Key Encoding

In Soroban, enum variants are encoded as vectors: `[variant_index, ...data]`

For `DataKey::Balance(address)`, the encoding is:
```javascript
[
  1,              // Variant index for Balance
  userAddress     // The address as ScVal
]
```

### Reading Process (fallback when balance() is not used)

1. **Construct Storage Key**
   ```typescript
   const vecElements: ScVal[] = [
     ScVal.scvU32(1),           // Balance variant index
     userAddress.toScVal(),      // User's address
   ];
   const balanceKey = ScVal.scvVec(vecElements);
   ```

2. **Create Ledger Key**
   ```typescript
   const ledgerKey = LedgerKey.contractData(
     new LedgerKeyContractData({
       contract: contractAddress.toScAddress(),
       key: balanceKey,
       durability: ContractDataDurability.persistent(),
     })
   );
   ```

3. **Read from Storage**
   ```typescript
   const ledgerEntries = await server.getLedgerEntries(ledgerKey);
   ```

4. **Parse Balance**
   ```typescript
   const storageValue = entry.val.contractData().val();
   const balance = scValToNative(storageValue); // Returns i128
   ```

## API Endpoints

### POST `/api/token-balance`

Reads token balance from contract storage.

**Request:**
```json
{
  "tokenFactoryAddress": "CDARBSD3OVSVUJWZV4W5HA66QDHY6A3YEH5EQGZPYFGS4DPDYW2UXWX3",
  "address": "GBLYIKXAYKMUO2Q32Z7CX6QG367TBJS4SUT4H3XC75AKW4ID4YYP5F24"
}
```

**Response:**
```json
{
  "success": true,
  "balance": "948"
}
```

**Error Response:**
```json
{
  "success": false,
  "balance": "0",
  "error": "Error message"
}
```

**Implementation Details:**
- Tries **simulation** of `balance(address)` first (works for SAC and contracts that expose `balance()`).
- If simulation fails, **fallback**: reads from persistent storage (key `DataKey::Balance(address)`).
- Uses Soroban RPC: `https://soroban-testnet.stellar.org` (hardcoded in route; can be switched to env for production).
- Returns `"0"` when no entry exists or on error (graceful degradation).
- File: `apps/investor-tokenization/src/app/api/token-balance/route.ts`

### POST `/api/token-metadata`

Fetches token metadata (name, symbol, decimals) by simulating contract calls.

**Request:**
```json
{
  "tokenFactoryAddress": "CDARBSD3OVSVUJWZV4W5HA66QDHY6A3YEH5EQGZPYFGS4DPDYW2UXWX3"
}
```

**Response:**
```json
{
  "success": true,
  "name": "Project Token",
  "symbol": "PROJ",
  "decimals": 7
}
```

**Implementation Details:**
- Simulates calls to `name()`, `symbol()`, and `decimals()` in parallel (no on-chain transaction).
- Uses a dummy account for simulation; RPC: `https://soroban-testnet.stellar.org`.
- Returns defaults (`name: "Unknown Token"`, `symbol: "TOKEN"`, `decimals: 7`) on failure.
- File: `apps/investor-tokenization/src/app/api/token-metadata/route.ts`

## Services

### InvestmentService

Client-side service for interacting with token balance APIs.

```typescript
class InvestmentService {
  // Get token balance for an address
  async getTokenBalance(payload: TokenBalancePayload): Promise<TokenBalanceResponse>
  
  // Get token metadata
  async getTokenMetadata(payload: TokenMetadataPayload): Promise<TokenMetadataResponse>
}
```

**Usage:**
```typescript
const service = new InvestmentService();
const balance = await service.getTokenBalance({
  tokenFactoryAddress: "CDARBSD3OVSVUJWZV4W5HA66QDHY6A3YEH5EQGZPYFGS4DPDYW2UXWX3",
  address: "GBLYIKXAYKMUO2Q32Z7CX6QG367TBJS4SUT4H3XC75AKW4ID4YYP5F24"
});
```

## React Hooks

### useUserInvestments

Fetches all investments where the user has a token balance > 0.

**Returns:**
```typescript
{
  data: UserInvestment[],
  isLoading: boolean,
  isError: boolean,
  error: Error | null
}
```

**UserInvestment Type:**
```typescript
{
  escrow: GetEscrowsFromIndexerResponse,
  tokenBalance: string,
  tokenFactory: string,
  tokenSale: string,
  tokenName?: string,
  tokenSymbol?: string,
  tokenDecimals?: number
}
```

**Features:**
- Fetches escrow details for all known projects
- Checks token balances in parallel
- Filters to only investments with balance > 0
- Includes token metadata
- Caches results for 2 minutes

## Balance Formatting

### Raw vs Formatted Balance

Token balances are stored as raw `i128` integers. To display them correctly:

```typescript
const rawBalance = parseFloat(balanceResponse.balance); // e.g., 948
const decimals = tokenDecimals || 7; // Usually 7 for Stellar tokens
const formattedBalance = rawBalance / Math.pow(10, decimals); // e.g., 0.0000948
```

### Display Format

```typescript
formattedBalance.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: decimals, // Usually 7
});
```

**Example:**
- Raw: `948`
- Decimals: `7`
- Formatted: `0.0000948`
- Display: `0.0000948 PROJ`

## Project Data Structure

The list of projects used for **balance checks** is defined in the hooks:

- `useUserInvestments.hook.ts` — `PROJECT_DATA`

**Example PROJECT_DATA (in hooks):**

```typescript
const PROJECT_DATA = [
  {
    escrowId: "CCZHTYVLK6R2QMIFBTEN65ZVCSFBD3L5TXYCZJT5WTXE63ABYXBBCSEB",
    tokenSale: "CC2AGB3AW5IITDIPEZGVX6XT5RTDIVINRZL7F6KZPIHEWN2GRXL5CRCT",
    tokenFactory: "CDJTII2GR2FY6Q4NDJGZI7NW2SHQ7GR5Y2H7B7Q253PTZZAZZ25TFYYU",
  },
  // ... more projects
];
```

**Fields:**
- `escrowId`: Escrow contract address
- `tokenSale`: Token sale contract address
- `tokenFactory`: Token factory contract address (used for balance and metadata API calls)

## Balance Reading Strategy

### Current Behavior

1. **Try contract call first** — The handler simulates `balance(address)`. Our Token Factory implements the standard Soroban TokenInterface and exposes `balance()`, so this works for deployed token contracts. It also works for Stellar Asset Contracts (SAC).
2. **Fallback: direct storage** — If the simulation fails (e.g. different contract type or RPC issue), the code reads the balance from persistent storage using `DataKey::Balance(address)`, matching Stellar Expert’s approach.

### Why Support Both?

- **Function call:** Uses the public API; works for any contract that implements `balance()` (including SAC).
- **Storage read:** Covers contracts that don’t expose `balance()` or when simulation is unavailable; same key layout as Stellar Expert.

## Comparison with Stellar Expert

Stellar Expert uses a similar approach:
1. Reads contract storage entries directly
2. Encodes storage keys correctly (enum variants as vectors)
3. Indexes and caches data for performance
4. Displays balances with proper decimal formatting

Our implementation:
- Uses the same storage reading method
- Properly encodes enum variants
- Formats balances using token decimals
- Provides real-time balance updates

## Error Handling

### Common Errors

1. **No Storage Entry**
   - **Cause**: User has no balance (balance = 0)
   - **Response**: Returns `{ success: true, balance: "0" }`
   - **Handling**: Display "No tokens owned" in UI

2. **Invalid Contract Address**
   - **Cause**: Wrong token factory address
   - **Response**: Returns error with details
   - **Handling**: Log error, skip that project

3. **Storage Read Failure**
   - **Cause**: Network issues or contract not deployed
   - **Response**: Returns error
   - **Handling**: Show error message, allow retry

### Graceful Degradation

- If balance check fails, returns `balance: "0"` instead of throwing
- If metadata fetch fails, uses defaults (name: "Unknown Token", decimals: 7)
- Continues processing other projects even if one fails

## Performance Considerations

### Caching

- TanStack Query caches results for 2 minutes (`staleTime: 1000 * 60 * 2`)
- Reduces unnecessary API calls
- Improves user experience

### Parallel Processing

- All balance checks run in parallel using `Promise.allSettled`
- Faster than sequential checks
- Handles failures gracefully

### Rate Limiting

- Stellar RPC may rate limit requests
- Consider implementing request throttling for production
- Cache aggressively to reduce RPC calls

## Testing

### Manual Testing

1. **Test with existing balance:**
   ```bash
   curl -X POST http://localhost:3000/api/token-balance \
     -H "Content-Type: application/json" \
     -d '{
       "tokenFactoryAddress": "CDARBSD3OVSVUJWZV4W5HA66QDHY6A3YEH5EQGZPYFGS4DPDYW2UXWX3",
       "address": "GBLYIKXAYKMUO2Q32Z7CX6QG367TBJS4SUT4H3XC75AKW4ID4YYP5F24"
     }'
   ```

2. **Test with zero balance:**
   - Use an address that hasn't invested
   - Should return `{ success: true, balance: "0" }`

3. **Test metadata:**
   ```bash
   curl -X POST http://localhost:3000/api/token-metadata \
     -H "Content-Type: application/json" \
     -d '{
       "tokenFactoryAddress": "CDARBSD3OVSVUJWZV4W5HA66QDHY6A3YEH5EQGZPYFGS4DPDYW2UXWX3"
     }'
   ```

## Future Improvements

1. **Batch Balance Reading**
   - Read multiple balances in a single RPC call
   - Reduce network overhead

2. **Indexing Service**
   - Create a backend service that indexes balances
   - Faster queries, less RPC load

3. **Real-time Updates**
   - Subscribe to ledger updates
   - Update balances automatically

4. **Balance History**
   - Track balance changes over time
   - Show investment growth

## References

- [Stellar Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Stellar Expert API](https://stellar.expert/openapi.html)
- [Soroban Token Standard](https://soroban.stellar.org/docs/learn/interfaces/token-interface)

## Troubleshooting

### Balance shows as 0 but user has tokens

1. Check token factory address is correct (must match the contract that holds the balance).
2. Verify user address is correct (wallet that holds the tokens).
3. The API tries `balance(address)` simulation first; if it fails, it falls back to storage. Check network/RPC and that the contract implements `balance()` (TokenInterface).
4. For storage fallback: verify enum variant encoding (should be `[1, address]`) and that the entry exists on Stellar Expert.

### Metadata shows "Unknown Token"

1. Check if contract has `name()`, `symbol()`, `decimals()` functions
2. Verify contract is deployed and initialized
3. Check simulation errors in console

### Slow balance loading

1. Reduce number of parallel requests
2. Increase cache time
3. Consider implementing a backend cache
4. Use batch reading if available

