import { rpc, Address, scValToNative, xdr } from "@stellar/stellar-sdk";
import { SOROBAN_RPC_URL, USDC_ADDRESS } from "@tokenization/shared/lib/constants";

export async function getVaultUsdcBalance(vaultId: string): Promise<bigint> {
  const server = new rpc.Server(SOROBAN_RPC_URL);

  const ledgerKey = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: new Address(USDC_ADDRESS).toScAddress(),
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

  if (typeof native === "bigint") return native;

  if (native !== null && typeof native === "object" && "amount" in native) {
    return native.amount as bigint;
  }

  return BigInt(0);
}
