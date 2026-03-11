import { SorobanService } from '../soroban/soroban.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';
import { DeployTokenFactoryDto } from './dto/deploy-token-factory.dto';
export declare class DeployService {
    private readonly soroban;
    private readonly participationTokenWasmHash;
    private readonly tokenFactoryWasmHash;
    constructor(soroban: SorobanService);
    deployParticipationToken(dto: DeployParticipationTokenDto): Promise<string>;
    deployTokenFactory(dto: DeployTokenFactoryDto): Promise<string>;
}
