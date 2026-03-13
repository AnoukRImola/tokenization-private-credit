"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { submitAndExtractAddress } from "@/features/campaigns/services/soroban.service";
import {
  enableVault,
  updateCampaignStatusByVaultId,
} from "@/features/campaigns/services/campaigns.api";

interface UseToggleVaultParams {
  onSuccess?: () => void;
}

export function useToggleVault({ onSuccess }: UseToggleVaultParams = {}) {
  const { walletAddress } = useWalletContext();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (vaultContractId: string, enabled: boolean) => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { unsignedXdr } = await enableVault({
        contractId: vaultContractId,
        admin: walletAddress,
        enabled,
        callerPublicKey: walletAddress,
      });

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address: walletAddress,
      });

      await submitAndExtractAddress(signedXdr);

      try {
        await updateCampaignStatusByVaultId(
          vaultContractId,
          enabled ? "CLAIMABLE" : "FUNDRAISING",
        );
        await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      } catch {
        // Campaign may not exist or vaultId not linked; status update is best-effort
      }

      onSuccess?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { execute, isSubmitting, error };
}
