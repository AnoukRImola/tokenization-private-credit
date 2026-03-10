import { SorobanService } from '../soroban/soroban.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';
export declare class DeployService {
    private readonly soroban;
    private readonly participationTokenWasmHash;
    constructor(soroban: SorobanService);
    deployParticipationToken(dto: DeployParticipationTokenDto): Promise<string>;
}
