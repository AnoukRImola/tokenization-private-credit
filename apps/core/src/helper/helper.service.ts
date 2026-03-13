import { Injectable } from '@nestjs/common';
import {
  TransactionBuilder,
  Networks,
  Horizon,
  rpc,
} from '@stellar/stellar-sdk';

const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';

@Injectable()
export class HelperService {
  private readonly horizonUrl: string;

  constructor() {
    this.horizonUrl = process.env.HORIZON_URL ?? HORIZON_TESTNET;
  }

  async submitTransaction(signedXdr: string): Promise<{
    status: string;
    message: string;
    hash?: string;
  }> {
    const server = new Horizon.Server(this.horizonUrl, { allowHttp: true });

    const transaction = TransactionBuilder.fromXDR(
      signedXdr,
      Networks.TESTNET,
    );

    const response = await server.submitTransaction(transaction);

    if (!response.successful) {
      return {
        status: rpc.Api.GetTransactionStatus.FAILED,
        message:
          'The transaction could not be sent to the Stellar network for some unknown reason. Please try again.',
      };
    }

    return {
      status: rpc.Api.GetTransactionStatus.SUCCESS,
      message:
        'The transaction has been successfully sent to the Stellar network.',
      hash: response.hash,
    };
  }
}
