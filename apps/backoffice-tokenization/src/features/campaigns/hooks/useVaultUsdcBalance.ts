"use client";

import { useQuery } from "@tanstack/react-query";
import { getVaultUsdcBalance } from "@/features/campaigns/services/vault-balance.service";

export function useVaultUsdcBalance(vaultId: string | null | undefined) {
  const { data: balance = BigInt(0), isLoading, error } = useQuery({
    queryKey: ["vault-usdc-balance", vaultId],
    queryFn: () => getVaultUsdcBalance(vaultId!),
    enabled: Boolean(vaultId),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  return {
    balance,
    isLoading,
    error: error as Error | null,
  };
}
