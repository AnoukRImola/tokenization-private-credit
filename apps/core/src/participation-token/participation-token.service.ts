import { Injectable } from '@nestjs/common';
import { SorobanService } from '../soroban/soroban.service';
import { BuyDto } from './dto/buy.dto';

@Injectable()
export class ParticipationTokenService {
  constructor(private readonly soroban: SorobanService) {}

  buy(dto: BuyDto): Promise<string> {
    return this.soroban.buildContractCallTransaction(
      dto.contractId,
      'buy',
      {
        usdc: dto.usdcAddress,
        payer: dto.payer,
        beneficiary: dto.beneficiary,
        amount: dto.amount,
      },
      dto.callerPublicKey,
    );
  }
}
