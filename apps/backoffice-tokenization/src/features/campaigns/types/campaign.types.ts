export type CampaignStatus = "active" | "completed" | "pending" | "draft" | "cancelled";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
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
