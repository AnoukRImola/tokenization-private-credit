import { Injectable } from '@nestjs/common';
import { SorobanService } from '../soroban/soroban.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';
import { DeployTokenFactoryDto } from './dto/deploy-token-factory.dto';

const TOKEN_DECIMAL = 7;

@Injectable()
export class DeployService {
  private readonly participationTokenWasmHash: string;
  private readonly tokenFactoryWasmHash: string;

  constructor(private readonly soroban: SorobanService) {
    this.participationTokenWasmHash =
      process.env.PARTICIPATION_TOKEN_WASM_HASH!;
    this.tokenFactoryWasmHash = process.env.TOKEN_FACTORY_WASM_HASH!;
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

  deployTokenFactory(dto: DeployTokenFactoryDto): Promise<string> {
    return this.soroban.buildDeployTransaction(
      this.tokenFactoryWasmHash,
      {
        name: dto.name,
        symbol: dto.symbol,
        escrow_id: dto.escrowContractId,
        decimal: TOKEN_DECIMAL,
        mint_authority: dto.mintAuthority,
      },
      dto.callerPublicKey,
    );
  }
}