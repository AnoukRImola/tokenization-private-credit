export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  issuerAddress: string;
  escrowId: string;
  tokenFactoryId: string | null;
  tokenSaleId: string | null;
  vaultId: string | null;
}

export interface VaultInfo {
  enabled: boolean;
  usdcBalance: string;
  roiPercentage: string;
}
