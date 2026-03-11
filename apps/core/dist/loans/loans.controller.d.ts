import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    create(dto: CreateLoanDto): Promise<any>;
    findAll(): any;
    getCampaignLoanStats(campaignId: string): any;
    findByCampaign(campaignId: string): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateLoanDto): Promise<any>;
    remove(id: string): Promise<any>;
}
