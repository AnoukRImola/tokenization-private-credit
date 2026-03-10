import { DeployService } from './deploy.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';
export declare class DeployController {
    private readonly deployService;
    constructor(deployService: DeployService);
    deployParticipationToken(dto: DeployParticipationTokenDto): Promise<{
        unsignedXdr: string;
    }>;
}
