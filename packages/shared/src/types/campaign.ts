export type SharedCampaignStatus =
  | "DRAFT"
  | "FUNDRAISING"
  | "ACTIVE"
  | "REPAYMENT"
  | "CLAIMABLE"
  | "CLOSED"
  | "PAUSED";

export interface SharedCampaign {
  id: string;
  title: string;
  description: string;
  status: SharedCampaignStatus;
  loansCompleted: number;
  investedAmount: number;
  currency: string;
  vaultId: string | null;
  escrowId: string;
  poolSize: number;
}

