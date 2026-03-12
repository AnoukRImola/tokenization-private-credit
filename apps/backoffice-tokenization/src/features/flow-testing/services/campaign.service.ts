import { CORE_API } from "../constants";
import type { CampaignFormData } from "../types";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${CORE_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ??
        `Error ${res.status} en ${path}`,
    );
  }
  return res.json() as Promise<T>;
}

export async function fetchCampaigns(): Promise<unknown[]> {
  const res = await fetch(`${CORE_API}/campaigns`);
  if (!res.ok) throw new Error("No se pudieron cargar las campañas.");
  return res.json();
}

export async function deployTokenFactory(params: {
  name: string;
  symbol: string;
  escrowContractId: string;
  mintAuthority: string;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  return post("/deploy/token-factory", params);
}

export async function deployParticipationToken(params: {
  escrowContractId: string;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  return post("/deploy/participation-token", params);
}

export async function setAdmin(params: {
  tokenFactoryContractId: string;
  newAdmin: string;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  return post("/deploy/set-admin", params);
}

export async function createCampaign(params: {
  campaign: CampaignFormData;
  issuerAddress: string;
  escrowId: string;
  tokenFactoryId: string;
  tokenSaleId: string;
}): Promise<{ id: string }> {
  return post("/campaigns", {
    name: params.campaign.name,
    description: params.campaign.description,
    issuerAddress: params.issuerAddress,
    escrowId: params.escrowId,
    poolSize: params.campaign.poolSize,
    loanDuration: params.campaign.loanDuration,
    expectedReturn: params.campaign.expectedReturn,
    loanSize: params.campaign.loanSize,
    tokenFactoryId: params.tokenFactoryId,
    tokenSaleId: params.tokenSaleId,
  });
}
