import { CORE_API } from "@/features/flow-testing/constants";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${CORE_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `Error ${res.status} on ${path}`,
    );
  }
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${CORE_API}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `Error ${res.status} on ${path}`,
    );
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${CORE_API}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `Error ${res.status} on ${path}`,
    );
  }
  return res.json() as Promise<T>;
}

export async function deployVault(params: {
  admin: string;
  enabled: boolean;
  roiPercentage: number;
  token: string;
  usdc: string;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  return post("/deploy/vault", params);
}

export async function enableVault(params: {
  contractId: string;
  admin: string;
  enabled: boolean;
  callerPublicKey: string;
  campaignId?: string;
}): Promise<{ unsignedXdr: string }> {
  return post("/vault/availability-for-exchange", params);
}

export async function updateCampaignVaultId(
  campaignId: string,
  vaultId: string,
): Promise<unknown> {
  return patch(`/campaigns/${campaignId}`, { vaultId });
}

export async function getVaultUsdcBalance(
  contractId: string,
  callerPublicKey: string,
): Promise<{ balance: string }> {
  return get(
    `/vault/usdc-balance?contractId=${contractId}&callerPublicKey=${callerPublicKey}`,
  );
}

export async function getVaultIsEnabled(
  contractId: string,
  callerPublicKey: string,
): Promise<{ enabled: boolean }> {
  return get(
    `/vault/is-enabled?contractId=${contractId}&callerPublicKey=${callerPublicKey}`,
  );
}

export async function getVaultRoiPercentage(
  contractId: string,
  callerPublicKey: string,
): Promise<{ roiPercentage: string }> {
  return get(
    `/vault/roi-percentage?contractId=${contractId}&callerPublicKey=${callerPublicKey}`,
  );
}

export async function getVaultOverview(
  contractId: string,
  callerPublicKey: string,
): Promise<unknown> {
  return get(
    `/vault/overview?contractId=${contractId}&callerPublicKey=${callerPublicKey}`,
  );
}
