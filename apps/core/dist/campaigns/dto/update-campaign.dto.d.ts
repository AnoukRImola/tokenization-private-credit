import { CampaignStatus } from '@prisma/client';
export declare class UpdateCampaignDto {
    name?: string;
    description?: string;
    status?: CampaignStatus;
    poolSize?: number;
    loanDuration?: number;
    expectedReturn?: number;
    loanSize?: number;
    vaultId?: string;
    tokenSaleId?: string;
    tokenFactoryId?: string;
}
