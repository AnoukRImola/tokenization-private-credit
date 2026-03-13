import { Injectable } from '@nestjs/common';
import {
  Asset,
  Operation,
  TransactionBuilder,
  Networks,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import { Horizon } from '@stellar/stellar-sdk';

const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';
const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

@Injectable()
export class TrustlineService {
  private readonly horizonUrl: string;

  constructor() {
    this.horizonUrl = process.env.HORIZON_URL ?? HORIZON_TESTNET;
  }

  async buildAddTrustlineTransaction(address: string): Promise<string> {
    const server = new Horizon.Server(this.horizonUrl);
    const sourceAccount = await server.loadAccount(address);

    const asset = new Asset('USDC', USDC_ISSUER);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({ asset }))
      .setTimeout(300)
      .build();

    return transaction.toXDR();
  }
}
