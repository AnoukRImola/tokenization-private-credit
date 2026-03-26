import { rpc, TransactionBuilder, Networks } from "@stellar/stellar-sdk";

const DEFAULT_POLL_ATTEMPTS = 30;
const DEFAULT_POLL_DELAY_MS = 2000;

export type SubmitSignedTransactionAndWaitOptions = {
  rpcUrl: string;
  networkPassphrase?: string;
  pollAttempts?: number;
  pollDelayMs?: number;
};

/**
 * Submits a signed transaction XDR to the Soroban RPC and polls until the
 * transaction is finalized (SUCCESS or FAILED). Throws on send error or timeout.
 */
export async function submitSignedTransactionAndWait(
  signedXdr: string,
  options: SubmitSignedTransactionAndWaitOptions,
): Promise<rpc.Api.GetTransactionResponse> {
  const {
    rpcUrl,
    networkPassphrase = Networks.TESTNET,
    pollAttempts = DEFAULT_POLL_ATTEMPTS,
    pollDelayMs = DEFAULT_POLL_DELAY_MS,
  } = options;

  const server = new rpc.Server(rpcUrl);
  const tx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);

  const send = await server.sendTransaction(tx);
  if (send.status === "ERROR") {
    throw new Error(`Soroban error: ${JSON.stringify(send.errorResult)}`);
  }

  let result: rpc.Api.GetTransactionResponse | undefined;
  for (let i = 0; i < pollAttempts; i++) {
    await new Promise((r) => setTimeout(r, pollDelayMs));
    result = await server.getTransaction(send.hash);
    if (result.status !== rpc.Api.GetTransactionStatus.NOT_FOUND) break;
  }

  if (!result || result.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
    throw new Error(`Transaction TIMEOUT`);
  }

  return result;
}
