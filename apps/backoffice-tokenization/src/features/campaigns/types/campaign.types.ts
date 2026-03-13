export type CampaignStatus =
  | "DRAFT"
  | "FUNDRAISING"
  | "ACTIVE"
  | "REPAYMENT"
  | "CLAIMABLE"
  | "CLOSED"
  | "PAUSED";

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  issuerAddress: string;
  escrowId: string;
  poolSize: number;
  loanDuration: number;
  expectedReturn: number;
  loanSize: number;
  vaultId: string | null;
  tokenSaleId: string | null;
  tokenFactoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignFormValues {
  // Step 1 – Campaign Basics
  name: string;
  description: string;
  durationDays: number;
  expectedRoi: number;
  // Step 2 – Escrow Configuration
  targetAmount: number;
  // Step 3 – Create Token
  tokenName: string;
  tokenAsset: string;
  investmentAmount: number;
}
