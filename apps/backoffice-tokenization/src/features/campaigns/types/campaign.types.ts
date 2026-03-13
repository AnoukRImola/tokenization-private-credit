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
  name: string;
  description: string;
  poolSize: number;
  loanDuration: number;
  expectedReturn: number;
  loanSize: number;
  tokenName: string;
}

export type PhaseStatus = "idle" | "loading" | "success" | "error";

export interface PhaseState {
  status: PhaseStatus;
  error: string;
}
