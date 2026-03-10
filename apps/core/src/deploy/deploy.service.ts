import { Injectable } from '@nestjs/common';
import { SorobanService } from '../soroban/soroban.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';

@Injectable()
export class DeployService {
  private readonly participationTokenWasmHash: string;

  constructor(private readonly soroban: SorobanService) {
    this.participationTokenWasmHash =
      process.env.PARTICIPATION_TOKEN_WASM_HASH!;
  }

  deployParticipationToken(dto: DeployParticipationTokenDto): Promise<string> {
    return this.soroban.buildDeployTransaction(
      this.participationTokenWasmHash,
      {
        escrow_contract: dto.escrowContractId,
        participation_token: dto.callerPublicKey,
        admin: dto.callerPublicKey,
      },
      dto.callerPublicKey,
    );
  }
}