import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
export declare class InvestmentsController {
    private readonly investmentsService;
    constructor(investmentsService: InvestmentsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        campaign: {
            name: string;
            description: string | null;
            issuerAddress: string;
            escrowId: string;
            poolSize: import("@prisma/client/runtime/library").Decimal;
            loanDuration: number;
            expectedReturn: import("@prisma/client/runtime/library").Decimal;
            loanSize: import("@prisma/client/runtime/library").Decimal;
            vaultId: string | null;
            tokenSaleId: string | null;
            tokenFactoryId: string | null;
            status: import("@prisma/client").$Enums.CampaignStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        campaignId: string;
        investorAddress: string;
        usdcAmount: import("@prisma/client/runtime/library").Decimal;
        tokenAmount: import("@prisma/client/runtime/library").Decimal;
        txHash: string;
    })[]>;
    findOne(id: string): Promise<{
        campaign: {
            name: string;
            description: string | null;
            issuerAddress: string;
            escrowId: string;
            poolSize: import("@prisma/client/runtime/library").Decimal;
            loanDuration: number;
            expectedReturn: import("@prisma/client/runtime/library").Decimal;
            loanSize: import("@prisma/client/runtime/library").Decimal;
            vaultId: string | null;
            tokenSaleId: string | null;
            tokenFactoryId: string | null;
            status: import("@prisma/client").$Enums.CampaignStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        campaignId: string;
        investorAddress: string;
        usdcAmount: import("@prisma/client/runtime/library").Decimal;
        tokenAmount: import("@prisma/client/runtime/library").Decimal;
        txHash: string;
    }>;
    findByCampaign(campaignId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        campaignId: string;
        investorAddress: string;
        usdcAmount: import("@prisma/client/runtime/library").Decimal;
        tokenAmount: import("@prisma/client/runtime/library").Decimal;
        txHash: string;
    }[]>;
    create(dto: CreateInvestmentDto): import("@prisma/client").Prisma.Prisma__InvestmentClient<{
        campaign: {
            name: string;
            description: string | null;
            issuerAddress: string;
            escrowId: string;
            poolSize: import("@prisma/client/runtime/library").Decimal;
            loanDuration: number;
            expectedReturn: import("@prisma/client/runtime/library").Decimal;
            loanSize: import("@prisma/client/runtime/library").Decimal;
            vaultId: string | null;
            tokenSaleId: string | null;
            tokenFactoryId: string | null;
            status: import("@prisma/client").$Enums.CampaignStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        campaignId: string;
        investorAddress: string;
        usdcAmount: import("@prisma/client/runtime/library").Decimal;
        tokenAmount: import("@prisma/client/runtime/library").Decimal;
        txHash: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
