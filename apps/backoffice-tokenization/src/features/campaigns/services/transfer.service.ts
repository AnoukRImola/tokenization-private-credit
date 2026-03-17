import {
  rpc,
  TransactionBuilder,
  Networks,
  Address,
  nativeToScVal,
  Operation,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import { SOROBAN_RPC_URL, USDC_ADDRESS } from "@tokenization/shared/lib/constants";

export async function buildUsdcTransferXdr(params: {
  from: string;
  to: string;
  amount: number;
}): Promise<string> {
  const server = new rpc.Server(SOROBAN_RPC_URL);
  const account = await server.getAccount(params.from);

  const stroops = BigInt(Math.round(params.amount * 10_000_000));

  const transferOp = Operation.invokeContractFunction({
    contract: USDC_ADDRESS,
    function: "transfer",
    args: [
      new Address(params.from).toScVal(),
      new Address(params.to).toScVal(),
      nativeToScVal(stroops, { type: "i128" }),
    ],
  });

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(transferOp)
    .setTimeout(300)
    .build();

  const simulated = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  const prepared = rpc.assembleTransaction(tx, simulated).build();

  return prepared.toXDR();
}
