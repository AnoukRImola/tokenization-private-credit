import { httpClient } from "@/lib/httpClient";
import type { Campaign } from "@/features/campaigns/types/campaign.types";

export async function getCampaigns(): Promise<Campaign[]> {
  const { data } = await httpClient.get<Campaign[]>("/campaigns");
  return data;
}

export async function getCampaignById(id: string): Promise<Campaign> {
  const { data } = await httpClient.get<Campaign>(`/campaigns/${id}`);
  return data;
}

export async function deployAll(params: {
  tokenName: string;
  tokenSymbol: string;
  escrowId: string;
  escrowContract: string;
  roiPercentage: number;
  hardCap: number;
  maxPerInvestor: number;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  const { data } = await httpClient.post<{ unsignedXdr: string }>(
    "/deploy/all",
    params,
  );
  return data;
}

export async function updateCampaignStatus(
  id: string,
  status: string,
): Promise<unknown> {
  const { data } = await httpClient.patch(`/campaigns/${id}/status`, {
    status,
  });
  return data;
}

export async function updateCampaignStatusByVaultId(
  vaultId: string,
  status: string,
): Promise<unknown> {
  const { data } = await httpClient.patch(
    `/campaigns/by-vault/${vaultId}/status`,
    { status },
  );
  return data;
}

export async function createCampaign(params: {
  name: string;
  description: string;
  issuerAddress: string;
  escrowId: string;
  poolSize: number;
  loanDuration: number;
  expectedReturn: number;
  loanSize: number;
  tokenFactoryId: string;
  tokenSaleId: string;
  vaultId?: string;
}): Promise<{ id: string }> {
  const { data } = await httpClient.post<{ id: string }>(
    "/campaigns",
    params,
  );
  return data;
}

export async function enableVault(params: {
  contractId: string;
  admin: string;
  enabled: boolean;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  const { data } = await httpClient.post<{ unsignedXdr: string }>(
    "/vault/availability-for-exchange",
    params,
  );
  return data;
}

export async function getVaultIsEnabled(
  contractId: string,
  callerPublicKey: string,
): Promise<{ enabled: boolean }> {
  const { data } = await httpClient.get<{ enabled: boolean }>(
    `/vault/is-enabled?contractId=${contractId}&callerPublicKey=${callerPublicKey}`,
  );
  return data;
}

export async function updateCampaignVaultId(
  campaignId: string,
  vaultId: string,
): Promise<unknown> {
  const { data } = await httpClient.patch(`/campaigns/${campaignId}`, {
    vaultId,
  });
  return data;
}

export async function getRoiPercentage(
  contractId: string,
  callerPublicKey: string,
): Promise<{ roiPercentage: string }> {
  const { data } = await httpClient.get<{ roiPercentage: string }>(
    `/vault/roi-percentage?contractId=${contractId}&callerPublicKey=${callerPublicKey}`,
  );
  return data;
}

export async function updateRoiPorcentage(params: {
  contractId: string;
  newRoiPorcentage: number;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  const { data } = await httpClient.post<{ unsignedXdr: string }>(
    "/vault/update-roi-porcentage",
    params,
  );
  return data;
}
