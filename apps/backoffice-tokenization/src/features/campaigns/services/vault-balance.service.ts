import { rpc, Address, scValToNative, xdr } from "@stellar/stellar-sdk";

const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
const USDC_CONTRACT = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

/**
 * Fetches the USDC balance held by a vault contract on Stellar Testnet.
 * Reads the persistent ledger entry for DataKey::Balance(vaultId) directly —
 * no transaction building or simulation required.
 *
 * @returns Balance in stroops (7 decimal places). Divide by 10_000_000 for display.
 */
export async function getVaultUsdcBalance(vaultId: string): Promise<bigint> {
  const server = new rpc.Server(SOROBAN_RPC_URL);

  // Standard Soroban token DataKey::Balance(Address) encodes as Vec[Symbol("Balance"), Address]
  const ledgerKey = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: new Address(USDC_CONTRACT).toScAddress(),
      key: xdr.ScVal.scvVec([
        xdr.ScVal.scvSymbol("Balance"),
        new Address(vaultId).toScVal(),
      ]),
      durability: xdr.ContractDataDurability.persistent(),
    }),
  );

  const result = await server.getLedgerEntries(ledgerKey);

  if (result.entries.length === 0) return BigInt(0);

  const val = result.entries[0].val.contractData().val();
  const native = scValToNative(val);

  // SAC (Stellar Asset Contract) stores balance as { amount: bigint, authorized: bool, clawback: bool }
  // Custom Soroban tokens store it as a plain bigint
  if (typeof native === "bigint") return native;
  if (native !== null && typeof native === "object" && "amount" in native) {
    return native.amount as bigint;
  }
  return BigInt(0);
}
