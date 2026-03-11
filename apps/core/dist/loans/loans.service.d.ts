import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
export declare class LoansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    findByCampaign(campaignId: string): any;
    create(dto: CreateLoanDto): Promise<any>;
    update(id: string, dto: UpdateLoanDto): Promise<any>;
    remove(id: string): Promise<any>;
    getCampaignLoanStats(campaignId: string): any;
    private validateStatusTransition;
}
