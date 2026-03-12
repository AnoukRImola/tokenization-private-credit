import { ParticipationTokenService } from './participation-token.service';
import { BuyDto } from './dto/buy.dto';
export declare class ParticipationTokenController {
    private readonly participationTokenService;
    constructor(participationTokenService: ParticipationTokenService);
    buy(dto: BuyDto): Promise<{
        unsignedXdr: string;
    }>;
}
