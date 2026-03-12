import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    create(dto: CreateLoanDto): Promise<{
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
            previousStatus: import("@prisma/client").$Enums.CampaignStatus | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        description: string;
        status: import("@prisma/client").$Enums.LoanStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiver: string;
        milestoneIndex: number | null;
        disbursedAt: Date | null;
        repaidAt: Date | null;
    }>;
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
            previousStatus: import("@prisma/client").$Enums.CampaignStatus | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        description: string;
        status: import("@prisma/client").$Enums.LoanStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiver: string;
        milestoneIndex: number | null;
        disbursedAt: Date | null;
        repaidAt: Date | null;
    })[]>;
    getCampaignLoanStats(campaignId: string): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.GetLoanAggregateType<{
        where: {
            campaignId: string;
        };
        _sum: {
            amount: true;
        };
        _count: true;
    }>>;
    findByCampaign(campaignId: string): import("@prisma/client").Prisma.PrismaPromise<{
        description: string;
        status: import("@prisma/client").$Enums.LoanStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiver: string;
        milestoneIndex: number | null;
        disbursedAt: Date | null;
        repaidAt: Date | null;
    }[]>;
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
            previousStatus: import("@prisma/client").$Enums.CampaignStatus | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        description: string;
        status: import("@prisma/client").$Enums.LoanStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiver: string;
        milestoneIndex: number | null;
        disbursedAt: Date | null;
        repaidAt: Date | null;
    }>;
    update(id: string, dto: UpdateLoanDto): Promise<{
        description: string;
        status: import("@prisma/client").$Enums.LoanStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiver: string;
        milestoneIndex: number | null;
        disbursedAt: Date | null;
        repaidAt: Date | null;
    }>;
    remove(id: string): Promise<{
        description: string;
        status: import("@prisma/client").$Enums.LoanStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        campaignId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiver: string;
        milestoneIndex: number | null;
        disbursedAt: Date | null;
        repaidAt: Date | null;
    }>;
}
