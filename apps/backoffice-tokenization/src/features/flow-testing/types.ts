export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  issuerAddress: string;
  escrowId: string;
  tokenFactoryId: string | null;
  tokenSaleId: string | null;
}

export interface CampaignFormData {
  name: string;
  description: string;
  poolSize: number;
  loanDuration: number;
  expectedReturn: number;
  loanSize: number;
}

export type PhaseStatus = "idle" | "loading" | "success" | "error";

export interface PhaseState {
  status: PhaseStatus;
  error: string;
}
