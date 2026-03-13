import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { contract, Networks } from '@stellar/stellar-sdk';
import { Ok } from '@stellar/stellar-sdk/contract';

const TOKEN_SALE_ERRORS: Record<number, string> = {
  1: 'Escrow contract not found',
  2: 'Participation token not found',
  3: 'Admin not found',
  4: 'Only admin can set token',
  5: 'Hard cap exceeded – the campaign is fully funded',
  6: 'Investor cap exceeded – you have reached the maximum investment',
  7: 'Amount must be positive',
};

const VAULT_ERRORS: Record<number, string> = {
  1: 'Admin not found',
  2: 'Only admin can change availability',
  3: 'Exchange is currently disabled – vault is not open for claims',
  4: 'Beneficiary has no tokens to claim',
  5: 'Vault does not have enough USDC to fulfill the claim',
  6: 'Token and USDC cannot be the same address',
  7: 'Invalid address configuration',
  8: 'Vault already initialized',
  9: 'Invalid ROI percentage',
  10: 'Enabled flag not found',
  11: 'ROI percentage not found',
  12: 'Token address not found',
  13: 'USDC address not found',
  14: 'Arithmetic overflow',
};

const CONTRACT_ERRORS_BY_CONTEXT: Record<string, Record<number, string>> = {
  'token-sale': TOKEN_SALE_ERRORS,
  vault: VAULT_ERRORS,
};

@Injectable()
export class SorobanService {
  private readonly rpcUrl: string;
  private readonly networkPassphrase: string;
  private readonly logger = new Logger(SorobanService.name);

  constructor() {
    this.rpcUrl = process.env.SOROBAN_RPC_URL!;
    this.networkPassphrase = Networks.TESTNET;
  }

  private parseContractError(error: unknown, context?: string): never {
    const message = error instanceof Error ? error.message : String(error);

    // Soroban contract errors include the error code in the format "Error(Contract, #N)"
    const contractErrorMatch = message.match(
      /Error\(Contract,\s*#?(\d+)\)/i,
    );
    if (contractErrorMatch) {
      const code = parseInt(contractErrorMatch[1], 10);
      const errorMap = context
        ? CONTRACT_ERRORS_BY_CONTEXT[context]
        : undefined;
      const humanMessage =
        errorMap?.[code] ?? `Contract error code ${code}`;
      this.logger.warn(`Contract error #${code} [${context ?? 'unknown'}]: ${humanMessage}`);
      throw new BadRequestException({
        error: 'ContractError',
        code,
        message: humanMessage,
      });
    }

    // Check for simulation errors
    if (
      message.includes('simulation') ||
      message.includes('Simulation')
    ) {
      this.logger.warn(`Soroban simulation failed: ${message}`);
      throw new BadRequestException({
        error: 'SimulationError',
        message: `Transaction simulation failed: ${message}`,
      });
    }

    // Check for common Stellar/Soroban errors
    if (message.includes('HostError')) {
      this.logger.warn(`Soroban host error: ${message}`);
      throw new BadRequestException({
        error: 'HostError',
        message: `Soroban execution error: ${message}`,
      });
    }

    throw error;
  }

  async buildDeployTransaction(
    wasmHash: string,
    args: Record<string, unknown>,
    callerPublicKey: string,
  ): Promise<string> {
    try {
      const tx = await contract.Client.deploy(args, {
        wasmHash,
        format: 'hex',
        rpcUrl: this.rpcUrl,
        networkPassphrase: this.networkPassphrase,
        publicKey: callerPublicKey,
      });

      return tx.toXDR();
    } catch (error) {
      this.parseContractError(error);
    }
  }

  async buildContractCallTransaction(
    contractId: string,
    method: string,
    args: Record<string, unknown>,
    callerPublicKey: string,
    errorContext?: string,
  ): Promise<string> {
    try {
      const client = await contract.Client.from({
        contractId,
        rpcUrl: this.rpcUrl,
        networkPassphrase: this.networkPassphrase,
        publicKey: callerPublicKey,
      });

      const tx = await client[method](args);

      return tx.toXDR();
    } catch (error) {
      this.parseContractError(error, errorContext);
    }
  }

  async readContractState(
    contractId: string,
    method: string,
    args: Record<string, unknown>,
    callerPublicKey: string,
    errorContext?: string,
  ): Promise<unknown> {
    try {
      const client = await contract.Client.from({
        contractId,
        rpcUrl: this.rpcUrl,
        networkPassphrase: this.networkPassphrase,
        publicKey: callerPublicKey,
      });

      const result = await client[method](args);
      const raw = result.result;

      return raw instanceof Ok ? raw.unwrap() : raw;
    } catch (error) {
      this.parseContractError(error, errorContext);
    }
  }
}
