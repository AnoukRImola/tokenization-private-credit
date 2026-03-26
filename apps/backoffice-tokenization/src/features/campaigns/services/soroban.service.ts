import {
  rpc,
  scValToNative,
  Address,
} from "@stellar/stellar-sdk";
import { SOROBAN_RPC_URL } from "@tokenization/shared/lib/constants";
import { submitSignedTransactionAndWait } from "@tokenization/shared/lib/sorobanSubmitAndWait";

export interface DeployedContracts {
  participation_token: string;
  token_sale: string;
  vault_contract: string;
}

export async function submitAndExtractDeployedContracts(
  signedXdr: string,
): Promise<DeployedContracts> {

  const result = await submitSignedTransactionAndWait(signedXdr, {
    rpcUrl: SOROBAN_RPC_URL,
    pollAttempts: 30,
    pollDelayMs: 2000,
  });

  if (result.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`Transaction ${result.status}`);
  }

  const success = result as rpc.Api.GetSuccessfulTransactionResponse;

  if (!success.returnValue) {
    throw new Error("La transacción no retornó un valor");
  }

  const native = scValToNative(success.returnValue) as DeployedContracts;
  return native;
}

export async function submitAndExtractAddress(
  signedXdr: string,
): Promise<string | null> {

  const result = await submitSignedTransactionAndWait(signedXdr, {
    rpcUrl: SOROBAN_RPC_URL,
    pollAttempts: 30,
    pollDelayMs: 2000,
  });

  if (result.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`Transaction ${result.status}`);
  }

  const success = result as rpc.Api.GetSuccessfulTransactionResponse;
  try {
    return success.returnValue
      ? Address.fromScVal(success.returnValue).toString()
      : null;
  } catch {
    return null;
  }
}
