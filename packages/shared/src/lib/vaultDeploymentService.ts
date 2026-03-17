import * as StellarSDK from "@stellar/stellar-sdk";
import fs from "fs";
import path from "path";
import { SorobanClient } from "./sorobanClient";

const DEFAULT_VAULT_WASM_PATH = path.join(
  process.cwd(),
  "services/wasm/vault_contract.wasm",
);

export type VaultDeploymentParams = {
  admin: string;
  enabled: boolean;
  price: number | string;
  token: string;
  usdc: string;
};

export type VaultDeploymentResult = {
  vaultContractAddress: string;
};

export type DeployVaultOptions = {
  /** Path to vault_contract.wasm. Defaults to services/wasm/vault_contract.wasm relative to cwd. */
  wasmPath?: string;
};

export const deployVaultContract = async (
  client: SorobanClient,
  { admin, enabled, price, token, usdc }: VaultDeploymentParams,
  options: DeployVaultOptions = {},
): Promise<VaultDeploymentResult> => {
  const vaultContractPath = options.wasmPath ?? DEFAULT_VAULT_WASM_PATH;
  const vaultWasm = fs.readFileSync(vaultContractPath);

  const vaultWasmHash = await client.uploadContractWasm(
    vaultWasm,
    "Vault WASM upload",
  );

  const vaultContractAddress = await client.createContract(
    vaultWasmHash,
    [
      client.nativeAddress(admin),
      StellarSDK.nativeToScVal(enabled, { type: "bool" }),
      StellarSDK.nativeToScVal(price, { type: "i128" }),
      client.nativeAddress(token),
      client.nativeAddress(usdc),
    ],
    "Vault contract creation",
  );

  return { vaultContractAddress };
};
