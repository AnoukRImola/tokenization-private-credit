import { DeployService } from './deploy.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';
import { DeployTokenFactoryDto } from './dto/deploy-token-factory.dto';
import { DeployVaultDto } from './dto/deploy-vault.dto';
export declare class DeployController {
    private readonly deployService;
    constructor(deployService: DeployService);
    deployParticipationToken(dto: DeployParticipationTokenDto): Promise<{
        unsignedXdr: string;
    }>;
    deployTokenFactory(dto: DeployTokenFactoryDto): Promise<{
        unsignedXdr: string;
    }>;
    deployVault(dto: DeployVaultDto): Promise<{
        unsignedXdr: string;
    }>;
}
