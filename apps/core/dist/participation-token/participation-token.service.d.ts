import { SorobanService } from '../soroban/soroban.service';
import { BuyDto } from './dto/buy.dto';
export declare class ParticipationTokenService {
    private readonly soroban;
    constructor(soroban: SorobanService);
    buy(dto: BuyDto): Promise<string>;
}
